/* 中兵康养商城后台 · 页面：概览 / 订单 / 优惠券 / 商品 / 积分商城 */
(function () {
  const ZB = window.ZB;
  const esc = ZB.escapeHtml;
  const money = ZB.money;
  const num = ZB.num;
  const table = ZB.table;
  const pill = ZB.pill;
  const icon = ZB.icon;

  const db = () => ZB.db;
  /* 便于页面内即时重绘 */
  let rerender = () => {};
  ZB.setRefresh = (fn) => (rerender = fn);
  const refresh = () => rerender();
  ZB.refresh = refresh;

  const validOrders = () => db().orders.filter((o) => o.status !== 'cancelled');

  /* ================= 数据概览 ================= */
  ZB.pages.dashboard = {
    group: '概览',
    title: '数据概览',
    render() {
      const orders = db().orders;
      const valid = validOrders();
      const sales = valid.reduce((s, o) => s + o.total, 0);
      const todayStart = new Date().setHours(0, 0, 0, 0);
      const todaySales = orders
        .filter((o) => o.createdAt >= todayStart && o.status !== 'cancelled')
        .reduce((s, o) => s + o.total, 0);
      const waitShip = orders.filter((o) => o.status === 'paid').length;
      const members = db().members;

      const kpis = [
        { label: '累计销售额', value: money(sales), foot: '今日 ' + money(todaySales), icon: 'coupon' },
        { label: '订单总数', value: num(orders.length), foot: '待发货 ' + waitShip + ' 单', icon: 'order' },
        { label: '会员总数', value: num(members.length), foot: '其中金卡及以上 ' + members.filter((m) => m.level === '金卡' || m.level === '钻石').length + ' 人', icon: 'member' },
        { label: '在售商品', value: num(db().products.filter((p) => p.status === 'on').length), foot: '积分礼品 ' + db().gifts.length + ' 件', icon: 'product' }
      ];
      const kpiHtml =
        '<div class="kpi-grid">' +
        kpis
          .map(
            (k) =>
              '<div class="kpi"><div class="kpi-icon">' + icon(k.icon) + '</div>' +
              '<div class="kpi-label">' + k.label + '</div>' +
              '<div class="kpi-value">' + k.value + '</div>' +
              '<div class="kpi-foot">' + k.foot + '</div></div>'
          )
          .join('') +
        '</div>';

      /* 近 7 日销售额 */
      const points = [];
      for (let i = 6; i >= 0; i--) {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        start.setDate(start.getDate() - i);
        const end = start.getTime() + 86400000;
        const val = orders
          .filter((o) => o.createdAt >= start.getTime() && o.createdAt < end && o.status !== 'cancelled')
          .reduce((s, o) => s + o.total, 0);
        points.push({ label: start.getMonth() + 1 + '/' + start.getDate(), value: val });
      }

      /* 品类占比 */
      const colors = ['#2ec4b6', '#3b82f6', '#f59e0b', '#8b5cf6', '#22c55e', '#ef4444'];
      const catMap = {};
      db().products.forEach((p) => (catMap[p.category] = (catMap[p.category] || 0) + p.sold));
      const donutItems = Object.keys(catMap)
        .map((k, i) => ({ label: k, value: catMap[k], color: colors[i % colors.length] }))
        .sort((a, b) => b.value - a.value);

      /* 热销 TOP5 */
      const top = db().products
        .slice()
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 5);
      const maxSold = top.length ? top[0].sold : 1;
      const rankHtml =
        '<div class="rank-list">' +
        top
          .map(
            (p, i) =>
              '<div class="rank-item"><div class="rank-no">' + (i + 1) + '</div>' +
              '<div class="rank-main"><div class="rank-name">' + esc(p.name) + '</div>' +
              '<div class="rank-bar"><i style="width:' + Math.max((p.sold / maxSold) * 100, 6) + '%"></i></div></div>' +
              '<div class="rank-val">' + num(p.sold) + ' 件</div></div>'
          )
          .join('') +
        '</div>';

      /* 最新订单 */
      const latest = orders.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
      const latestTable = table(
        [
          { title: '订单号', render: (o) => '<span class="td-strong">' + o.no + '</span>' },
          { title: '会员', render: (o) => esc(o.user) },
          { title: '金额', cls: 'td-money', render: (o) => money(o.total) },
          { title: '状态', render: (o) => ZB.orderPill(o.status) },
          { title: '下单时间', cls: 'td-muted td-nowrap', render: (o) => ZB.fromNow(o.createdAt) },
          { title: '操作', render: (o) => '<span class="link-btn" data-act="order-view" data-id="' + o.id + '">查看</span>' }
        ],
        latest
      );

      return (
        kpiHtml +
        '<div class="grid-2"><div class="card"><div class="card-head"><div class="card-title">近 7 日销售额<small>单位：元</small></div></div>' +
        ZB.lineChart(points) +
        '</div><div class="card"><div class="card-head"><div class="card-title">品类销量占比</div></div>' +
        ZB.donutChart(donutItems) +
        '</div></div>' +
        '<div class="grid-2"><div class="card"><div class="card-head"><div class="card-title">最新订单</div>' +
        '<span class="link-btn" data-act="go" data-page="orders">全部订单</span></div>' +
        latestTable +
        '</div><div class="card"><div class="card-head"><div class="card-title">热销商品 TOP5</div></div>' +
        rankHtml +
        '</div></div>'
      );
    },
    after() {
      document.querySelectorAll('[data-act="order-view"]').forEach((el) => {
        el.onclick = () => viewOrder(el.dataset.id);
      });
    }
  };

  /* ================= 订单管理 ================= */
  ZB.state.orders = { tab: 'all', q: '' };

  const ORDER_TABS = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待付款' },
    { key: 'paid', label: '待发货' },
    { key: 'shipped', label: '已发货' },
    { key: 'done', label: '已完成' },
    { key: 'cancelled', label: '已取消' }
  ];

  function viewOrder(id) {
    const o = db().orders.find((x) => x.id === id);
    if (!o) return;
    const goods = o.items
      .map(
        (it) =>
          '<div class="order-goods">' + ZB.thumb(it.color, it.name.slice(0, 1)) +
          '<div class="order-goods-info"><div class="order-goods-name">' + esc(it.name) + '</div>' +
          '<div class="order-goods-spec">' + esc(it.spec) + ' × ' + it.qty + '</div></div>' +
          '<div class="order-goods-price">' + money(it.price * it.qty) + '</div></div>'
      )
      .join('');

    const body =
      '<div class="detail-row"><span class="detail-label">订单号</span><span class="detail-value">' + o.no + '</span></div>' +
      '<div class="detail-row"><span class="detail-label">订单状态</span><span class="detail-value">' + ZB.orderPill(o.status) + '</span></div>' +
      '<div class="detail-row"><span class="detail-label">下单时间</span><span class="detail-value">' + ZB.fmtTime(o.createdAt) + '</span></div>' +
      '<div class="detail-row"><span class="detail-label">会员</span><span class="detail-value">' + esc(o.user) + '　' + esc(o.phone) + '</span></div>' +
      '<div class="detail-row"><span class="detail-label">收货地址</span><span class="detail-value">' + esc(o.address) + '</span></div>' +
      '<div class="detail-row"><span class="detail-label">支付方式</span><span class="detail-value">' + esc(o.payMethod) + '</span></div>' +
      '<div class="section-title">商品清单</div>' + goods +
      '<div class="detail-row" style="margin-top:10px"><span class="detail-label">合计金额</span>' +
      '<span class="detail-value" style="color:#e2452f;font-weight:700">' + money(o.total) + '</span></div>';

    let foot = '<button class="btn btn-ghost" data-close>关闭</button>';
    if (o.status === 'paid') foot += '<button class="btn btn-primary" id="op-ship">发货</button>';
    if (o.status === 'shipped') foot += '<button class="btn btn-primary" id="op-done">确认完成</button>';
    if (o.status === 'pending') foot += '<button class="btn btn-danger" id="op-cancel">关闭订单</button>';

    ZB.modal({
      title: '订单详情',
      wide: true,
      body: body,
      foot: foot,
      onMount(root) {
        const ship = root.querySelector('#op-ship');
        if (ship) ship.onclick = () => {
          o.status = 'shipped';
          ZB.save();
          ZB.closeModal();
          ZB.toast('订单 ' + o.no + ' 已发货');
          refresh();
        };
        const done = root.querySelector('#op-done');
        if (done) done.onclick = () => {
          o.status = 'done';
          ZB.save();
          ZB.closeModal();
          ZB.toast('订单已完成');
          refresh();
        };
        const cancel = root.querySelector('#op-cancel');
        if (cancel) cancel.onclick = () => {
          ZB.confirm('关闭订单', '确定关闭订单 ' + o.no + '？关闭后不可恢复。', () => {
            o.status = 'cancelled';
            ZB.save();
            ZB.toast('订单已关闭');
            refresh();
          });
        };
      }
    });
  }

  ZB.pages.orders = {
    group: '交易管理',
    title: '订单管理',
    render() {
      const st = ZB.state.orders;
      const all = db().orders;
      const counts = { all: all.length };
      Object.keys(ZB.ORDER_STATUS).forEach((k) => (counts[k] = all.filter((o) => o.status === k).length));

      const kw = st.q.trim().toLowerCase();
      let rows = all.filter((o) => st.tab === 'all' || o.status === st.tab);
      if (kw) rows = rows.filter((o) => (o.no + o.user + o.phone).toLowerCase().indexOf(kw) >= 0);
      rows = rows.slice().sort((a, b) => b.createdAt - a.createdAt);

      const tabItems = ORDER_TABS.map((t) => ({ key: t.key, label: t.label, count: counts[t.key] }));

      const cols = [
        {
          title: '订单号',
          render: (o) =>
            '<div><div class="td-strong">' + o.no + '</div><div class="cell-sub">' +
            o.items.length + ' 件商品</div></div>'
        },
        {
          title: '会员',
          render: (o) => '<div><div>' + esc(o.user) + '</div><div class="cell-sub">' + esc(o.phone) + '</div></div>'
        },
        { title: '金额', cls: 'td-money', render: (o) => money(o.total) },
        { title: '支付方式', cls: 'td-muted', render: (o) => esc(o.payMethod) },
        { title: '状态', render: (o) => ZB.orderPill(o.status) },
        { title: '下单时间', cls: 'td-muted td-nowrap', render: (o) => ZB.fmtTime(o.createdAt) },
        {
          title: '操作',
          cls: 'td-nowrap',
          render: (o) => {
            let acts = '<span class="link-btn" data-act="view" data-id="' + o.id + '">详情</span>';
            if (o.status === 'paid') acts += '<span class="link-btn" data-act="ship" data-id="' + o.id + '">发货</span>';
            if (o.status === 'shipped') acts += '<span class="link-btn" data-act="done" data-id="' + o.id + '">完成</span>';
            if (o.status === 'pending') acts += '<span class="link-btn danger" data-act="cancel" data-id="' + o.id + '">关闭</span>';
            return acts;
          }
        }
      ];

      return (
        '<div class="card"><div class="table-toolbar">' + ZB.tabs(tabItems, st.tab) +
        '<div class="toolbar-right">' + ZB.searchBox(st.q, '订单号 / 会员 / 手机号') + '</div></div>' +
        table(cols, rows, '没有匹配的订单') +
        '<div class="table-foot"><span>共 ' + rows.length + ' 条订单</span><span>数据保存在本地浏览器</span></div></div>'
      );
    },
    after() {
      const st = ZB.state.orders;
      document.querySelectorAll('[data-tab]').forEach((el) => {
        el.onclick = () => {
          st.tab = el.dataset.tab;
          refresh();
        };
      });
      const s = document.querySelector('#page-search');
      if (s) s.oninput = () => {
        st.q = s.value;
        const pos = s.selectionStart;
        refresh();
        const ns = document.querySelector('#page-search');
        if (ns) {
          ns.focus();
          ns.setSelectionRange(pos, pos);
        }
      };
      document.querySelectorAll('[data-act="view"]').forEach((el) => (el.onclick = () => viewOrder(el.dataset.id)));
      document.querySelectorAll('[data-act="ship"]').forEach((el) => {
        el.onclick = () => {
          const o = db().orders.find((x) => x.id === el.dataset.id);
          ZB.confirm('订单发货', '确认订单 ' + o.no + ' 已发货？', () => {
            o.status = 'shipped';
            ZB.save();
            ZB.toast('已标记发货');
            refresh();
          });
        };
      });
      document.querySelectorAll('[data-act="done"]').forEach((el) => {
        el.onclick = () => {
          const o = db().orders.find((x) => x.id === el.dataset.id);
          o.status = 'done';
          ZB.save();
          ZB.toast('订单已完成');
          refresh();
        };
      });
      document.querySelectorAll('[data-act="cancel"]').forEach((el) => {
        el.onclick = () => {
          const o = db().orders.find((x) => x.id === el.dataset.id);
          ZB.confirm('关闭订单', '确定关闭订单 ' + o.no + '？', () => {
            o.status = 'cancelled';
            ZB.save();
            ZB.toast('订单已关闭');
            refresh();
          });
        };
      });
    }
  };

  /* ================= 优惠券 ================= */
  const couponFields = [
    { key: 'title', label: '券名称', required: true, full: true, placeholder: '如：新客首单券' },
    { key: 'amount', label: '面额（元）', type: 'number', required: true, min: 1 },
    { key: 'threshold', label: '使用门槛（元）', type: 'number', required: true, min: 0 },
    { key: 'scope', label: '适用范围', full: true, placeholder: '如：商城通用 / 智能穿戴品类' },
    { key: 'total', label: '发放总量', type: 'number', required: true, min: 1 },
    { key: 'status', label: '状态', type: 'select', options: [{ value: 'on', label: '启用' }, { value: 'off', label: '停用' }] },
    { key: 'start', label: '开始日期', type: 'date', required: true },
    { key: 'end', label: '结束日期', type: 'date', required: true }
  ];

  function editCoupon(id) {
    const isNew = !id;
    const item = isNew
      ? { title: '', amount: 20, threshold: 199, scope: '商城通用', total: 1000, status: 'on', start: ZB.fmtDate(Date.now()), end: ZB.fmtDate(Date.now() + 30 * 86400000) }
      : db().coupons.find((c) => c.id === id);
    ZB.formModal(isNew ? '新建优惠券' : '编辑优惠券', couponFields, item, (v) => {
      if (isNew) {
        db().coupons.unshift(Object.assign({ id: Date.now(), claimed: 0, used: 0 }, v));
      } else {
        Object.assign(item, v);
      }
      ZB.save();
      ZB.closeModal();
      ZB.toast(isNew ? '优惠券已创建' : '优惠券已更新');
      refresh();
    });
  }

  ZB.pages.coupons = {
    group: '交易管理',
    title: '优惠券',
    render() {
      const rows = db().coupons;
      const cols = [
        {
          title: '优惠券',
          render: (c) =>
            '<div class="cell-flex">' + ZB.thumb('#2ec4b6', '券') +
            '<div><div class="cell-name">' + esc(c.title) + '</div><div class="cell-sub">' + esc(c.scope) + '</div></div></div>'
        },
        { title: '面额', cls: 'td-money', render: (c) => money(c.amount) },
        { title: '门槛', render: (c) => '满 ' + money(c.threshold) + ' 可用' },
        {
          title: '领取 / 使用',
          render: (c) => '<div>' + num(c.claimed) + ' / ' + num(c.used) + '</div><div class="cell-sub">总量 ' + num(c.total) + '</div>'
        },
        { title: '有效期', cls: 'td-muted td-nowrap', render: (c) => c.start + ' 至 ' + c.end },
        { title: '状态', render: (c) => ZB.onOffPill(c.status) },
        {
          title: '操作',
          cls: 'td-nowrap',
          render: (c) =>
            '<span class="link-btn" data-act="edit" data-id="' + c.id + '">编辑</span>' +
            '<span class="link-btn" data-act="toggle" data-id="' + c.id + '">' + (c.status === 'on' ? '停用' : '启用') + '</span>' +
            '<span class="link-btn danger" data-act="del" data-id="' + c.id + '">删除</span>'
        }
      ];

      return (
        '<div class="card"><div class="table-toolbar">' +
        '<div class="card-title">优惠券列表<small>共 ' + rows.length + ' 张</small></div>' +
        '<div class="toolbar-right"><button class="btn btn-primary" data-act="new">+ 新建优惠券</button></div></div>' +
        table(cols, rows) + '</div>'
      );
    },
    after() {
      document.querySelector('[data-act="new"]').onclick = () => editCoupon();
      document.querySelectorAll('[data-act="edit"]').forEach((el) => (el.onclick = () => editCoupon(Number(el.dataset.id))));
      document.querySelectorAll('[data-act="toggle"]').forEach((el) => {
        el.onclick = () => {
          const c = db().coupons.find((x) => x.id === Number(el.dataset.id));
          c.status = c.status === 'on' ? 'off' : 'on';
          ZB.save();
          ZB.toast(c.status === 'on' ? '优惠券已启用' : '优惠券已停用');
          refresh();
        };
      });
      document.querySelectorAll('[data-act="del"]').forEach((el) => {
        el.onclick = () => {
          const c = db().coupons.find((x) => x.id === Number(el.dataset.id));
          ZB.confirm('删除优惠券', '确定删除「' + c.title + '」？删除后无法恢复。', () => {
            db().coupons = db().coupons.filter((x) => x.id !== c.id);
            ZB.save();
            ZB.toast('已删除');
            refresh();
          });
        };
      });
    }
  };

  /* ================= 商品管理 ================= */
  ZB.state.products = { q: '', cat: '全部' };

  const productFields = [
    { key: 'name', label: '商品名称', required: true, full: true },
    { key: 'spec', label: '规格', full: true, placeholder: '如：尊享版 / 曜石黑' },
    {
      key: 'category',
      label: '分类',
      type: 'select',
      options: ['智能穿戴', '养生保健', '理疗仪器', '助眠产品', '营养补充'].map((c) => ({ value: c, label: c }))
    },
    { key: 'tag', label: '标签', placeholder: '如：热销 / 新品' },
    { key: 'price', label: '售价（元）', type: 'number', required: true, min: 0, step: '0.01' },
    { key: 'originalPrice', label: '原价（元）', type: 'number', required: true, min: 0, step: '0.01' },
    { key: 'stock', label: '库存', type: 'number', required: true, min: 0 },
    { key: 'status', label: '状态', type: 'select', options: [{ value: 'on', label: '上架' }, { value: 'off', label: '下架' }] },
    { key: 'desc', label: '商品描述', type: 'textarea', full: true }
  ];

  function editProduct(id) {
    const isNew = !id;
    const item = isNew
      ? { name: '', spec: '', category: '养生保健', tag: '', price: 0, originalPrice: 0, stock: 0, status: 'on', desc: '' }
      : db().products.find((p) => p.id === id);
    ZB.formModal(isNew ? '新增商品' : '编辑商品', productFields, item, (v) => {
      if (isNew) {
        const colors = ['#2ec4b6', '#3b82f6', '#f59e0b', '#8b5cf6', '#22c55e', '#ec4899'];
        db().products.unshift(Object.assign({ id: Date.now(), sold: 0, color: colors[db().products.length % colors.length], createdAt: Date.now() }, v));
      } else {
        Object.assign(item, v);
      }
      ZB.save();
      ZB.closeModal();
      ZB.toast(isNew ? '商品已新增' : '商品已保存');
      refresh();
    });
  }

  ZB.pages.products = {
    group: '商品管理',
    title: '商品管理',
    render() {
      const st = ZB.state.products;
      const cats = ['全部'].concat(Array.from(new Set(db().products.map((p) => p.category))));
      if (cats.indexOf(st.cat) < 0) st.cat = '全部';
      const kw = st.q.trim().toLowerCase();
      let rows = db().products.filter((p) => st.cat === '全部' || p.category === st.cat);
      if (kw) rows = rows.filter((p) => (p.name + p.spec).toLowerCase().indexOf(kw) >= 0);

      const cols = [
        {
          title: '商品',
          render: (p) =>
            '<div class="cell-flex">' + ZB.thumb(p.color, p.name.slice(0, 1)) +
            '<div><div class="cell-name">' + esc(p.name) + (p.tag ? ' ' + pill(p.tag, 'pill-teal') : '') +
            '</div><div class="cell-sub">' + esc(p.spec) + '</div></div></div>'
        },
        { title: '分类', cls: 'td-muted', render: (p) => esc(p.category) },
        {
          title: '价格',
          render: (p) => '<div class="td-money">' + money(p.price) + '</div><div class="cell-sub" style="text-decoration:line-through">' + money(p.originalPrice) + '</div>'
        },
        {
          title: '库存',
          render: (p) =>
            p.stock === 0
              ? pill('缺货', 'pill-red')
              : p.stock < 100
              ? '<span style="color:#ea580c;font-weight:600">' + p.stock + '</span>'
              : String(p.stock)
        },
        { title: '销量', cls: 'td-muted', render: (p) => num(p.sold) },
        { title: '状态', render: (p) => ZB.onOffPill(p.status) },
        {
          title: '操作',
          cls: 'td-nowrap',
          render: (p) =>
            '<span class="link-btn" data-act="edit" data-id="' + p.id + '">编辑</span>' +
            '<span class="link-btn" data-act="toggle" data-id="' + p.id + '">' + (p.status === 'on' ? '下架' : '上架') + '</span>' +
            '<span class="link-btn danger" data-act="del" data-id="' + p.id + '">删除</span>'
        }
      ];

      return (
        '<div class="card"><div class="table-toolbar">' + ZB.searchBox(st.q, '搜索商品名称 / 规格') +
        '<div class="tabs">' +
        cats
          .map((c) => '<div class="tab' + (c === st.cat ? ' active' : '') + '" data-cat="' + esc(c) + '">' + esc(c) + '</div>')
          .join('') +
        '</div>' +
        '<div class="toolbar-right"><button class="btn btn-primary" data-act="new">+ 新增商品</button></div></div>' +
        table(cols, rows, '没有匹配的商品') +
        '<div class="table-foot"><span>共 ' + rows.length + ' 件商品</span><span>在售 ' + rows.filter((p) => p.status === 'on').length + ' 件</span></div></div>'
      );
    },
    after() {
      const st = ZB.state.products;
      const s = document.querySelector('#page-search');
      if (s) s.oninput = () => {
        st.q = s.value;
        const pos = s.selectionStart;
        refresh();
        const ns = document.querySelector('#page-search');
        if (ns) {
          ns.focus();
          ns.setSelectionRange(pos, pos);
        }
      };
      document.querySelectorAll('[data-cat]').forEach((el) => {
        el.onclick = () => {
          st.cat = el.dataset.cat;
          refresh();
        };
      });
      document.querySelector('[data-act="new"]').onclick = () => editProduct();
      document.querySelectorAll('[data-act="edit"]').forEach((el) => (el.onclick = () => editProduct(Number(el.dataset.id))));
      document.querySelectorAll('[data-act="toggle"]').forEach((el) => {
        el.onclick = () => {
          const p = db().products.find((x) => x.id === Number(el.dataset.id));
          p.status = p.status === 'on' ? 'off' : 'on';
          ZB.save();
          ZB.toast(p.status === 'on' ? '商品已上架' : '商品已下架');
          refresh();
        };
      });
      document.querySelectorAll('[data-act="del"]').forEach((el) => {
        el.onclick = () => {
          const p = db().products.find((x) => x.id === Number(el.dataset.id));
          ZB.confirm('删除商品', '确定删除「' + p.name + '」？', () => {
            db().products = db().products.filter((x) => x.id !== p.id);
            ZB.save();
            ZB.toast('已删除');
            refresh();
          });
        };
      });
    }
  };

  /* ================= 积分商城 ================= */
  ZB.state.points = { tab: 'gifts' };

  const giftFields = [
    { key: 'name', label: '礼品名称', required: true, full: true },
    { key: 'points', label: '所需积分', type: 'number', required: true, min: 1 },
    { key: 'stock', label: '库存', type: 'number', required: true, min: 0 },
    { key: 'status', label: '状态', type: 'select', options: [{ value: 'on', label: '上架' }, { value: 'off', label: '下架' }] },
    { key: 'desc', label: '礼品说明', type: 'textarea', full: true }
  ];

  function editGift(id) {
    const isNew = !id;
    const item = isNew ? { name: '', points: 500, stock: 100, status: 'on', desc: '' } : db().gifts.find((g) => g.id === id);
    ZB.formModal(isNew ? '新增积分礼品' : '编辑积分礼品', giftFields, item, (v) => {
      if (isNew) {
        const colors = ['#2ec4b6', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];
        db().gifts.unshift(Object.assign({ id: Date.now(), exchanged: 0, color: colors[db().gifts.length % colors.length] }, v));
      } else {
        Object.assign(item, v);
      }
      ZB.save();
      ZB.closeModal();
      ZB.toast(isNew ? '积分礼品已新增' : '已保存');
      refresh();
    });
  }

  function pointsGifts() {
    const cols = [
      {
        title: '礼品',
        render: (g) =>
          '<div class="cell-flex">' + ZB.thumb(g.color, g.name.slice(0, 1)) +
          '<div><div class="cell-name">' + esc(g.name) + '</div><div class="cell-sub">' + esc(g.desc) + '</div></div></div>'
      },
      { title: '所需积分', render: (g) => '<span class="td-strong">' + num(g.points) + ' 分</span>' },
      { title: '库存', render: (g) => (g.stock === 0 ? pill('已兑完', 'pill-red') : String(g.stock)) },
      { title: '已兑换', cls: 'td-muted', render: (g) => num(g.exchanged) },
      { title: '状态', render: (g) => ZB.onOffPill(g.status) },
      {
        title: '操作',
        cls: 'td-nowrap',
        render: (g) =>
          '<span class="link-btn" data-act="gedit" data-id="' + g.id + '">编辑</span>' +
          '<span class="link-btn" data-act="gtoggle" data-id="' + g.id + '">' + (g.status === 'on' ? '下架' : '上架') + '</span>' +
          '<span class="link-btn danger" data-act="gdel" data-id="' + g.id + '">删除</span>'
      }
    ];
    return (
      '<div class="table-toolbar"><div class="card-title">积分礼品<small>共 ' + db().gifts.length + ' 件</small></div>' +
      '<div class="toolbar-right"><button class="btn btn-primary" data-act="gnew">+ 新增礼品</button></div></div>' +
      table(cols, db().gifts)
    );
  }

  function pointsRecords() {
    const rows = db().exchangeRecords.slice().sort((a, b) => b.createdAt - a.createdAt);
    const cols = [
      { title: '会员', render: (r) => '<div><div class="td-strong">' + esc(r.member) + '</div><div class="cell-sub">' + esc(r.phone) + '</div></div>' },
      { title: '兑换礼品', render: (r) => esc(r.gift) },
      { title: '消耗积分', render: (r) => '<span class="td-money">' + num(r.points) + ' 分</span>' },
      { title: '收货地址', cls: 'td-muted', render: (r) => esc(r.address) },
      { title: '状态', render: (r) => pill(r.status, r.status === '待发货' ? 'pill-orange' : r.status === '已发货' ? 'pill-blue' : 'pill-green') },
      { title: '兑换时间', cls: 'td-muted td-nowrap', render: (r) => ZB.fmtTime(r.createdAt) },
      {
        title: '操作',
        cls: 'td-nowrap',
        render: (r) => {
          if (r.status === '待发货') return '<span class="link-btn" data-act="rship" data-id="' + r.id + '">发货</span>';
          if (r.status === '已发货') return '<span class="link-btn" data-act="rfinish" data-id="' + r.id + '">完成</span>';
          return '<span class="link-btn muted">已完成</span>';
        }
      }
    ];
    return table(cols, rows, '暂无兑换记录');
  }

  function pointsTasks() {
    const cols = [
      { title: '任务', render: (t) => '<div class="td-strong">' + esc(t.name) + '</div>' },
      { title: '说明', cls: 'td-muted', render: (t) => esc(t.desc) },
      { title: '奖励积分', render: (t) => '<span class="td-money">+' + t.points + ' 分</span>' },
      { title: '完成人次', cls: 'td-muted', render: (t) => num(t.done) },
      {
        title: '启用状态',
        render: (t) => '<div class="switch' + (t.enabled ? ' on' : '') + '" data-act="ttoggle" data-id="' + t.id + '"></div>'
      }
    ];
    return (
      '<div class="table-toolbar"><div class="card-title">积分任务<small>用户完成任务后自动发放积分</small></div></div>' +
      table(cols, db().tasks)
    );
  }

  ZB.pages['points-shop'] = {
    group: '商品管理',
    title: '积分商城',
    render() {
      const st = ZB.state.points;
      const tabItems = [
        { key: 'gifts', label: '积分商品', count: db().gifts.length },
        { key: 'records', label: '兑换记录', count: db().exchangeRecords.filter((r) => r.status === '待发货').length },
        { key: 'tasks', label: '积分任务', count: db().tasks.length }
      ];
      let body = '';
      if (st.tab === 'gifts') body = pointsGifts();
      else if (st.tab === 'records') body = pointsRecords();
      else body = pointsTasks();
      return '<div class="card">' + ZB.tabs(tabItems, st.tab) + '<div style="height:16px"></div>' + body + '</div>';
    },
    after() {
      const st = ZB.state.points;
      document.querySelectorAll('[data-tab]').forEach((el) => {
        el.onclick = () => {
          st.tab = el.dataset.tab;
          refresh();
        };
      });
      const gnew = document.querySelector('[data-act="gnew"]');
      if (gnew) gnew.onclick = () => editGift();
      document.querySelectorAll('[data-act="gedit"]').forEach((el) => (el.onclick = () => editGift(Number(el.dataset.id))));
      document.querySelectorAll('[data-act="gtoggle"]').forEach((el) => {
        el.onclick = () => {
          const g = db().gifts.find((x) => x.id === Number(el.dataset.id));
          g.status = g.status === 'on' ? 'off' : 'on';
          ZB.save();
          ZB.toast(g.status === 'on' ? '礼品已上架' : '礼品已下架');
          refresh();
        };
      });
      document.querySelectorAll('[data-act="gdel"]').forEach((el) => {
        el.onclick = () => {
          const g = db().gifts.find((x) => x.id === Number(el.dataset.id));
          ZB.confirm('删除礼品', '确定删除「' + g.name + '」？', () => {
            db().gifts = db().gifts.filter((x) => x.id !== g.id);
            ZB.save();
            ZB.toast('已删除');
            refresh();
          });
        };
      });
      document.querySelectorAll('[data-act="rship"]').forEach((el) => {
        el.onclick = () => {
          const r = db().exchangeRecords.find((x) => x.id === el.dataset.id);
          ZB.confirm('兑换发货', '确认为「' + r.member + '」发货「' + r.gift + '」？', () => {
            r.status = '已发货';
            ZB.save();
            ZB.toast('已标记发货');
            refresh();
          });
        };
      });
      document.querySelectorAll('[data-act="rfinish"]').forEach((el) => {
        el.onclick = () => {
          const r = db().exchangeRecords.find((x) => x.id === el.dataset.id);
          r.status = '已完成';
          ZB.save();
          ZB.toast('兑换已完成');
          refresh();
        };
      });
      document.querySelectorAll('[data-act="ttoggle"]').forEach((el) => {
        el.onclick = () => {
          const t = db().tasks.find((x) => x.id === Number(el.dataset.id));
          t.enabled = !t.enabled;
          ZB.save();
          ZB.toast(t.enabled ? '任务已启用' : '任务已停用');
          refresh();
        };
      });
    }
  };

  /* 供概览页跳转调用 */
  ZB.viewOrder = viewOrder;
})();
