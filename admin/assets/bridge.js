/* 中兵康养商城后台 · 与小程序的数据桥接（同一域名下共享 localStorage） */
window.ZBBridge = (function () {
  const ORDER_KEY = 'zb-shop-orders'; // 小程序写入的订单快照
  const SHIP_KEY = 'zb-shop-shipping'; // 后台写入的物流信息
  const PRODUCT_KEY = 'zb-shop-products'; // 后台写入的商品与库存
  const AFTERSALE_KEY = 'zb-shop-aftersales'; // 小程序写入的售后申请
  const AFTERSALE_STATUS_KEY = 'zb-shop-aftersales-status'; // 后台写入的售后状态
  const ARTICLE_KEY = 'zb-shop-articles'; // 后台写入的文章（健康资讯）
  const SERVICE_KEY = 'zb-shop-services'; // 后台写入的到店服务项目
  const STORE_KEY = 'zb-shop-stores'; // 后台写入的门店数据
  const EXPERT_KEY = 'zb-shop-experts'; // 后台写入的专家数据
  const SERVICE_ORDER_KEY = 'zb-shop-service-orders'; // 小程序写入的专家服务订单
  const STORE_ORDER_KEY = 'zb-shop-store-orders'; // 小程序写入的到店预约单
  const SERVICE_ORDER_STATUS_KEY = 'zb-shop-service-orders-status'; // 后台写回的服务订单状态
  const STORE_ORDER_STATUS_KEY = 'zb-shop-store-orders-status'; // 后台写回的预约状态

  const read = (k, f) => {
    try {
      const raw = localStorage.getItem(k);
      return raw ? JSON.parse(raw) : f;
    } catch (e) {
      return f;
    }
  };
  const write = (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {
      /* ignore */
    }
  };

  /* 把后台商品与库存同步给小程序 */
  function publishProducts() {
    const rows = ZB.db.products.map((p) => ({
      id: p.id,
      name: p.name,
      spec: p.spec,
      price: p.price,
      originalPrice: p.originalPrice,
      stock: p.stock,
      sold: p.sold,
      category: p.category,
      tag: p.tag || '',
      status: p.status,
      desc: p.desc || ''
    }));
    write(PRODUCT_KEY, rows);
  }

  /* 拉取小程序下单的订单，返回新增数量 */
  function pullOrders() {
    const list = read(ORDER_KEY, []);
    if (!Array.isArray(list) || !list.length) return 0;
    let added = 0;
    list.forEach((o) => {
      if (!o || !o.no) return;
      if (ZB.db.orders.some((x) => x.no === o.no)) return;
      const parts = String(o.address || '').trim().split(/\s+/);
      const isPhone = /^1\d{10}$|^\d{3}\*{4}\d{4}$/.test(parts[1] || '');
      ZB.db.orders.unshift({
        id: 'm-' + o.id,
        miniId: o.id,
        no: o.no,
        user: parts[0] || '微信用户',
        phone: isPhone ? parts[1] : '',
        address: o.address || '',
        items: (o.items || []).map((it) => ({
          productId: it.id,
          name: it.name,
          spec: it.spec,
          price: it.price,
          qty: it.qty,
          color: '#2ec4b6'
        })),
        total: o.total || 0,
        status: o.status || 'pending',
        payMethod: '微信支付',
        createdAt: o.createdAt || Date.now(),
        source: 'mini',
        logistics: o.logistics || null,
        outboundNo: ''
      });
      added++;
    });
    if (added) ZB.save();
    return added;
  }

  /* 发货：生成销售出库单 + 扣减库存 + 回写物流给小程序 */
  function ship(order, info) {
    const items = order.items.map((it) => ({
      productId: it.productId,
      name: it.name,
      spec: it.spec,
      price: it.price,
      qty: it.qty
    }));

    let totalQty = 0;
    items.forEach((it) => {
      totalQty += it.qty;
      const p = ZB.db.products.find(
        (x) => (it.productId && x.id === it.productId) || x.name === it.name
      );
      if (p) {
        p.stock = Math.max(0, (p.stock || 0) - it.qty);
        p.sold = (p.sold || 0) + it.qty;
      }
    });

    const no = 'CK' + String(Date.now()).slice(-10);
    const record = {
      id: 'b' + Date.now(),
      no: no,
      orderNo: order.no,
      orderId: order.id,
      items: items,
      qty: totalQty,
      amount: order.total,
      company: info.company,
      trackingNo: info.trackingNo,
      remark: info.remark || '',
      operator: '管理员',
      createdAt: Date.now()
    };
    ZB.db.outbounds = ZB.db.outbounds || [];
    ZB.db.outbounds.unshift(record);

    order.status = 'shipped';
    order.logistics = { company: info.company, no: info.trackingNo, time: record.createdAt };
    order.outboundNo = no;

    const map = read(SHIP_KEY, {});
    map[order.no] = { company: info.company, no: info.trackingNo, time: record.createdAt };
    write(SHIP_KEY, map);
    publishProducts();
    ZB.save();
    return record;
  }

  function paidCount() {
    return ZB.db.orders.filter((o) => o.status === 'paid').length;
  }

  function findOutbound(orderId) {
    return (ZB.db.outbounds || []).find((b) => b.orderId === orderId);
  }

  /* ---------------- 售后流程 ---------------- */

  function pullAftersales() {
    const list = read(AFTERSALE_KEY, []);
    if (!Array.isArray(list) || !list.length) return 0;
    let added = 0;
    list.forEach((a) => {
      if (!a || !a.no) return;
      if (ZB.db.aftersales.some((x) => x.no === a.no)) return;
      ZB.db.aftersales.unshift({
        id: a.id,
        no: a.no,
        orderNo: a.orderNo,
        orderId: a.orderId,
        member: a.member,
        phone: a.phone,
        type: a.type,
        status: a.status,
        reason: a.reason,
        description: a.description,
        amount: a.amount,
        items: (a.items || []).map((it) => ({
          productId: it.id,
          name: it.name,
          spec: it.spec,
          price: it.price,
          qty: it.qty,
          color: '#2ec4b6'
        })),
        returnLogistics: a.returnLogistics || null,
        exchangeLogistics: a.exchangeLogistics || null,
        auditReply: a.auditReply || '',
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
        source: 'mini'
      });
      added++;
    });
    if (added) ZB.save();
    return added;
  }

  function publishAftersaleStatus(a) {
    const map = read(AFTERSALE_STATUS_KEY, {});
    map[a.no] = {
      status: a.status,
      auditReply: a.auditReply,
      returnLogistics: a.returnLogistics,
      exchangeLogistics: a.exchangeLogistics,
      updatedAt: a.updatedAt
    };
    write(AFTERSALE_STATUS_KEY, map);
  }

  /* 同意售后：仅退款直接完成；退货退款/换货进入待买家寄回 */
  function approveAftersale(a, reply) {
    a.auditReply = reply || '';
    a.updatedAt = Date.now();
    a.status = a.type === 'refund_only' ? 'done' : 'approved';
    ZB.save();
    publishAftersaleStatus(a);
  }

  function rejectAftersale(a, reply) {
    a.status = 'rejected';
    a.auditReply = reply || '';
    a.updatedAt = Date.now();
    ZB.save();
    publishAftersaleStatus(a);
  }

  /* 确认收货（买家已寄出 → 商家已收货） */
  function receiveAftersale(a) {
    if (a.status !== 'buyer_shipped') return;
    a.status = 'received';
    a.updatedAt = Date.now();
    ZB.save();
    publishAftersaleStatus(a);
  }

  /* 退货退款：确认退款并回补库存 */
  function refundAftersale(a) {
    if (a.type !== 'return_refund' || a.status !== 'received') return;
    a.items.forEach((it) => {
      const p = ZB.db.products.find((x) => (it.productId && x.id === it.productId) || x.name === it.name);
      if (p) {
        p.stock += it.qty;
        p.sold = Math.max(0, (p.sold || 0) - it.qty);
      }
    });
    a.status = 'done';
    a.updatedAt = Date.now();
    ZB.save();
    publishProducts();
    publishAftersaleStatus(a);
  }

  /* 换货：商家发出换货商品并回补库存 */
  function exchangeAftersale(a, company, no) {
    if (a.type !== 'exchange' || a.status !== 'received') return;
    a.items.forEach((it) => {
      const p = ZB.db.products.find((x) => (it.productId && x.id === it.productId) || x.name === it.name);
      if (p) p.stock += it.qty;
    });
    a.exchangeLogistics = { company: company, no: no, time: Date.now() };
    a.status = 'done';
    a.updatedAt = Date.now();
    ZB.save();
    publishProducts();
    publishAftersaleStatus(a);
  }

  function pendingAftersaleCount() {
    return (ZB.db.aftersales || []).filter((a) => a.status === 'pending').length;
  }

  /* ---------------- 内容与专家系统 ---------------- */

  /* 后台文章 → 小程序健康资讯 */
  function publishArticles() {
    const rows = (ZB.db.articles || [])
      .filter((a) => a.status === 'published')
      .map((a) => ({
        id: a.id,
        title: a.title,
        category: a.category,
        summary: a.summary,
        content: a.content,
        cover: a.cover || '',
        source: a.source || '',
        author: a.author || '',
        views: a.views || 0,
        createdAt: a.createdAt
      }));
    write(ARTICLE_KEY, rows);
  }

  /* 后台服务项目 → 小程序门店服务 */
  function publishServices() {
    const rows = (ZB.db.services || [])
      .filter((s) => s.status === 'on')
      .map((s) => ({
        id: s.id,
        name: s.name,
        price: s.price,
        duration: s.duration,
        desc: s.desc || '',
        icon: s.icon || 'sparkles',
        storeIds: s.storeIds || []
      }));
    write(SERVICE_KEY, rows);
  }

  /* 后台门店 → 小程序门店列表 */
  function publishStores() {
    const rows = (ZB.db.stores || []).map((s) => ({
      id: s.id,
      name: s.name,
      tag: s.tag || '',
      rating: s.rating,
      address: s.address,
      tel: s.tel,
      hours: s.hours,
      status: s.status,
      services: (s.services || []).map((it, i) => ({
        id: i + 1,
        name: it[0],
        price: it[1],
        duration: it[2]
      }))
    }));
    write(STORE_KEY, rows);
  }

  /* 后台专家 → 小程序专家列表 */
  function publishExperts() {
    const rows = (ZB.db.experts || [])
      .filter((e) => e.status === 'on')
      .map((e) => ({
        id: e.id,
        name: e.name,
        role: e.title,
        title: e.org,
        tags: String(e.good || '')
          .split(/[、,，]/)
          .filter(Boolean),
        price: e.price,
        types: e.types,
        rating: e.rating,
        orders: e.orders
      }));
    write(EXPERT_KEY, rows);
  }

  /* 拉取小程序提交的专家服务订单 */
  function pullServiceOrders() {
    const list = read(SERVICE_ORDER_KEY, []);
    if (!Array.isArray(list) || !list.length) return 0;
    ZB.db.serviceOrders = ZB.db.serviceOrders || [];
    let added = 0;
    list.forEach((o) => {
      if (!o || !o.no) return;
      if (ZB.db.serviceOrders.some((x) => x.no === o.no)) return;
      ZB.db.serviceOrders.unshift({
        id: o.id || 'so-' + Date.now(),
        no: o.no,
        member: o.member || '微信用户',
        phone: o.phone || '',
        expertName: o.expertName || '',
        typeName: o.typeName || '',
        price: o.price || 0,
        dateLabel: o.dateLabel || '',
        time: o.time || '',
        status: o.status === 'paid' ? 'upcoming' : o.status || 'pending',
        createdAt: o.createdAt || Date.now(),
        source: 'mini'
      });
      added++;
    });
    if (added) ZB.save();
    return added;
  }

  /* 拉取小程序提交的到店预约 */
  function pullAppointments() {
    const list = read(STORE_ORDER_KEY, []);
    if (!Array.isArray(list) || !list.length) return 0;
    ZB.db.appointments = ZB.db.appointments || [];
    let added = 0;
    list.forEach((a) => {
      if (!a || !a.no) return;
      if (ZB.db.appointments.some((x) => x.no === a.no)) return;
      ZB.db.appointments.unshift({
        id: a.id || 'ap-' + Date.now(),
        no: a.no,
        member: a.member || '微信用户',
        phone: a.phone || '',
        storeName: a.storeName || '',
        serviceName: a.serviceName || '',
        price: a.price || 0,
        date: a.date || '',
        time: a.time || '',
        status: a.status || 'pending',
        createdAt: a.createdAt || Date.now(),
        source: 'mini'
      });
      added++;
    });
    if (added) ZB.save();
    return added;
  }

  function publishServiceOrderStatus(o) {
    const map = read(SERVICE_ORDER_STATUS_KEY, {});
    map[o.no] = { status: o.status, updatedAt: o.updatedAt || Date.now() };
    write(SERVICE_ORDER_STATUS_KEY, map);
  }

  function publishAppointmentStatus(a) {
    const map = read(STORE_ORDER_STATUS_KEY, {});
    map[a.no] = { status: a.status, updatedAt: a.updatedAt || Date.now() };
    write(STORE_ORDER_STATUS_KEY, map);
  }

  return {
    ORDER_KEY: ORDER_KEY,
    SHIP_KEY: SHIP_KEY,
    PRODUCT_KEY: PRODUCT_KEY,
    AFTERSALE_KEY: AFTERSALE_KEY,
    AFTERSALE_STATUS_KEY: AFTERSALE_STATUS_KEY,
    ARTICLE_KEY: ARTICLE_KEY,
    SERVICE_KEY: SERVICE_KEY,
    STORE_KEY: STORE_KEY,
    EXPERT_KEY: EXPERT_KEY,
    SERVICE_ORDER_KEY: SERVICE_ORDER_KEY,
    STORE_ORDER_KEY: STORE_ORDER_KEY,
    SERVICE_ORDER_STATUS_KEY: SERVICE_ORDER_STATUS_KEY,
    STORE_ORDER_STATUS_KEY: STORE_ORDER_STATUS_KEY,
    publishProducts: publishProducts,
    publishArticles: publishArticles,
    publishServices: publishServices,
    publishStores: publishStores,
    publishExperts: publishExperts,
    pullOrders: pullOrders,
    ship: ship,
    paidCount: paidCount,
    findOutbound: findOutbound,
    pullAftersales: pullAftersales,
    publishAftersaleStatus: publishAftersaleStatus,
    approveAftersale: approveAftersale,
    rejectAftersale: rejectAftersale,
    receiveAftersale: receiveAftersale,
    refundAftersale: refundAftersale,
    exchangeAftersale: exchangeAftersale,
    pendingAftersaleCount: pendingAftersaleCount,
    pullServiceOrders: pullServiceOrders,
    pullAppointments: pullAppointments,
    publishServiceOrderStatus: publishServiceOrderStatus,
    publishAppointmentStatus: publishAppointmentStatus
  };
})();
