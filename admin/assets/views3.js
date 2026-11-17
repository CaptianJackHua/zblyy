/* 中兵康养后台 · 页面：文章管理 / 服务管理 / 服务订单 / 预约系统 */
(function () {
  const ZB = window.ZB;
  const esc = ZB.escapeHtml;
  const money = ZB.money;
  const num = ZB.num;
  const table = ZB.table;
  const pill = ZB.pill;
  const refresh = () => ZB.refresh();
  const db = () => ZB.db;

  /* ================= 文章管理 ================= */
  const ARTICLE_CATS = ['健康科普', '养生知识', '疾病预防', '行业动态'];
  const CAT_CLS = { 健康科普: 'pill-blue', 养生知识: 'pill-teal', 疾病预防: 'pill-orange', 行业动态: 'pill-purple' };

  ZB.state.articles = { q: '', cat: 'all' };

  const articleFields = [
    { key: 'title', label: '文章标题', required: true, full: true },
    { key: 'category', label: '所属分类', type: 'select', options: ARTICLE_CATS.map((c) => ({ value: c, label: c })) },
    { key: 'source', label: '来源', placeholder: '如：中兵康养' },
    { key: 'author', label: '作者', placeholder: '如：健康编辑部' },
    { key: 'cover', label: '封面图地址', full: true, placeholder: 'https://...' },
    { key: 'summary', label: '文章摘要', type: 'textarea', required: true, full: true },
    { key: 'content', label: '正文内容', type: 'textarea', required: true, full: true },
    { key: 'status', label: '发布状态', type: 'select', options: [{ value: 'published', label: '已发布' }, { value: 'draft', label: '草稿' }] }
  ];

  function editArticle(id) {
    const isNew = !id;
    const item = isNew
      ? { title: '', category: '健康科普', source: '中兵康养', author: '健康编辑部', cover: '', summary: '', content: '', status: 'draft', views: 0 }
      : db().articles.find((a) => a.id === id);
    ZB.formModal(isNew ? '新建文章' : '编辑文章', articleFields, item, (v) => {
      if (isNew) db().articles.unshift(Object.assign({ id: Date.now(), views: 0, createdAt: Date.now() }, v));
      else Object.assign(item, v);
      ZB.save();
      ZB.closeModal();
      if (window.ZBBridge) window.ZBBridge.publishArticles();
      ZB.toast(isNew ? '文章已创建' : '文章已保存');
      refresh();
    });
  }

  function viewArticle(id) {
    const a = db().articles.find((x) => x.id === id);
    ZB.modal({
      title: '文章预览',
      wide: true,
      body:
        (a.cover ? '<div style="height:160px;border-radius:12px;background:url(' + esc(a.cover) + ') center/cover no-repeat;margin-bottom:16px"></div>' : '') +
        '<h2 style="font-size:18px;margin-bottom:10px">' + esc(a.title) + '</h2>' +
        '<div style="font-size:12.5px;color:#93a1b0;margin-bottom:14px">' +
        pill(a.category, CAT_CLS[a.category]) + '　' + esc(a.source) + '　' + esc(a.author) + '　' + ZB.fmtDate(a.createdAt) +
        '　阅读 ' + num(a.views) + '</div>' +
        '<p style="font-size:13.5px;line-height:1.9;color:#5a6b7c">' + esc(a.content) + '</p>',
      foot: '<button class="btn btn-ghost" data-close>关闭</button>'
    });
  }

  ZB.pages.articles = {
    group: '基础信息维护',
    title: '文章管理',
    render() {
      const st = ZB.state.articles;
      const kw = st.q.trim().toLowerCase();
      let rows = db().articles.slice();
      if (st.cat !== 'all') rows = rows.filter((a) => a.category === st.cat);
      if (kw) rows = rows.filter((a) => (a.title + a.summary).toLowerCase().indexOf(kw) >= 0);
      rows.sort((a, b) => b.createdAt - a.createdAt);

      const tabs = [{ key: 'all', label: '全部', count: db().articles.length }].concat(
        ARTICLE_CATS.map((c) => ({ key: c, label: c, count: db().articles.filter((a) => a.category === c).length }))
      );

      const cols = [
        {
          title: '文章',
          render: (a) =>
            '<div class="cell-flex">' + ZB.thumb('#2ec4b6', '文') +
            '<div><div class="cell-name">' + esc(a.title) + '</div>' +
            '<div class="cell-sub">' + esc(a.summary.slice(0, 30)) + (a.summary.length > 30 ? '…' : '') + '</div></div></div>'
        },
        { title: '分类', render: (a) => pill(a.category, CAT_CLS[a.category] || 'pill-gray') },
        { title: '来源', cls: 'td-muted', render: (a) => esc(a.source) },
        { title: '阅读量', cls: 'td-muted', render: (a) => num(a.views) },
        { title: '状态', render: (a) => (a.status === 'published' ? pill('已发布', 'pill-green') : pill('草稿', 'pill-gray')) },
        { title: '更新时间', cls: 'td-muted td-nowrap', render: (a) => ZB.fmtDate(a.createdAt) },
        {
          title: '操作',
          cls: 'td-nowrap',
          render: (a) => {
            let acts = '<span class="link-btn" data-act="aview" data-id="' + a.id + '">预览</span>';
            acts += '<span class="link-btn" data-act="aedit" data-id="' + a.id + '">编辑</span>';
            acts += '<span class="link-btn" data-act="apub" data-id="' + a.id + '">' + (a.status === 'published' ? '转草稿' : '发布') + '</span>';
            acts += '<span class="link-btn danger" data-act="adel" data-id="' + a.id + '">删除</span>';
            return acts;
          }
        }
      ];

      return (
        '<div class="card"><div class="table-toolbar">' + ZB.tabs(tabs, st.cat) +
        '<div class="toolbar-right">' + ZB.searchBox(st.q, '搜索文章标题') +
        '<button class="btn btn-primary" data-act="anew">+ 新建文章</button></div></div>' +
        table(cols, rows, '暂无文章') +
        '<div class="table-foot"><span>共 ' + rows.length + ' 篇</span><span>草稿 ' + db().articles.filter((a) => a.status === 'draft').length + ' 篇</span></div></div>'
      );
    },
    after() {
      const st = ZB.state.articles;
      document.querySelectorAll('[data-tab]').forEach((el) => {
        el.onclick = () => {
          st.cat = el.dataset.tab;
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
      document.querySelector('[data-act="anew"]').onclick = () => editArticle();
      document.querySelectorAll('[data-act="aview"]').forEach((el) => (el.onclick = () => viewArticle(Number(el.dataset.id))));
      document.querySelectorAll('[data-act="aedit"]').forEach((el) => (el.onclick = () => editArticle(Number(el.dataset.id))));
      document.querySelectorAll('[data-act="apub"]').forEach((el) => {
        el.onclick = () => {
          const a = db().articles.find((x) => x.id === Number(el.dataset.id));
          a.status = a.status === 'published' ? 'draft' : 'published';
          ZB.save();
          if (window.ZBBridge) window.ZBBridge.publishArticles();
          ZB.toast(a.status === 'published' ? '文章已发布' : '文章已转为草稿');
          refresh();
        };
      });
      document.querySelectorAll('[data-act="adel"]').forEach((el) => {
        el.onclick = () => {
          const a = db().articles.find((x) => x.id === Number(el.dataset.id));
          ZB.confirm('删除文章', '确定删除「' + a.title + '」？', () => {
            db().articles = db().articles.filter((x) => x.id !== a.id);
            ZB.save();
            if (window.ZBBridge) window.ZBBridge.publishArticles();
            ZB.toast('已删除');
            refresh();
          });
        };
      });
    }
  };

  /* ================= 服务管理 ================= */
  const serviceFields = [
    { key: 'name', label: '服务名称', required: true },
    { key: 'price', label: '价格（元）', type: 'number', required: true, min: 0 },
    { key: 'duration', label: '服务时长', placeholder: '如：约 40 分钟' },
    { key: 'icon', label: '图标标识', placeholder: '如：sparkles' },
    { key: 'desc', label: '服务说明', type: 'textarea', full: true },
    { key: 'status', label: '上架状态', type: 'select', options: [{ value: 'on', label: '已上架' }, { value: 'off', label: '已下架' }] }
  ];

  function editService(id) {
    const isNew = !id;
    const item = isNew
      ? { name: '', price: 0, duration: '约 40 分钟', icon: 'sparkles', desc: '', status: 'on', orders: 0, storeIds: [] }
      : db().services.find((s) => s.id === id);
    ZB.formModal(isNew ? '新增服务项目' : '编辑服务项目', serviceFields, item, (v) => {
      if (isNew) db().services.push(Object.assign({ id: Date.now(), orders: 0, storeIds: [] }, v));
      else Object.assign(item, v);
      ZB.save();
      ZB.closeModal();
      if (window.ZBBridge) window.ZBBridge.publishServices();
      ZB.toast(isNew ? '服务项目已新增' : '服务项目已保存');
      refresh();
    });
  }

  ZB.state.services = { q: '' };

  ZB.pages.services = {
    group: '专家系统',
    title: '服务管理',
    render() {
      const st = ZB.state.services;
      const kw = st.q.trim().toLowerCase();
      let rows = db().services.slice();
      if (kw) rows = rows.filter((s) => (s.name + s.desc + s.duration).toLowerCase().indexOf(kw) >= 0);

      const cols = [
        {
          title: '服务项目',
          render: (s) =>
            '<div class="cell-flex">' + ZB.thumb('#0f9b8e', '服') +
            '<div><div class="cell-name">' + esc(s.name) + '</div><div class="cell-sub">' + esc(s.desc) + '</div></div></div>'
        },
        { title: '价格', cls: 'td-money', render: (s) => money(s.price) },
        { title: '时长', cls: 'td-muted', render: (s) => esc(s.duration) },
        { title: '适用门店', cls: 'td-muted', render: (s) => (s.storeIds && s.storeIds.length ? s.storeIds.length + ' 家' : '全部门店') },
        { title: '预约次数', cls: 'td-muted', render: (s) => num(s.orders) },
        { title: '状态', render: (s) => ZB.onOffPill(s.status) },
        {
          title: '操作',
          cls: 'td-nowrap',
          render: (s) =>
            '<span class="link-btn" data-act="svcedit" data-id="' + s.id + '">编辑</span>' +
            '<span class="link-btn" data-act="svctoggle" data-id="' + s.id + '">' + (s.status === 'on' ? '下架' : '上架') + '</span>' +
            '<span class="link-btn danger" data-act="svcdel" data-id="' + s.id + '">删除</span>'
        }
      ];
      return (
        '<div class="card"><div class="table-toolbar">' +
        '<div class="card-title">到店服务项目<small>共 ' + db().services.length + ' 项，小程序门店服务同步展示</small></div>' +
        '<div class="toolbar-right">' + ZB.searchBox(st.q, '搜索服务名称 / 说明') +
        '<button class="btn btn-primary" data-act="svcnew">+ 新增服务</button></div></div>' +
        table(cols, rows, '没有匹配的服务') + '</div>'
      );
    },
    after() {
      const st = ZB.state.services;
      const s = document.querySelector('#page-search');
      if (s) s.oninput = () => {
        st.q = s.value;
        const pos = s.selectionStart;
        refresh();
        const ns = document.querySelector('#page-search');
        if (ns) { ns.focus(); ns.setSelectionRange(pos, pos); }
      };
      document.querySelector('[data-act="svcnew"]').onclick = () => editService();
      document.querySelectorAll('[data-act="svcedit"]').forEach((el) => (el.onclick = () => editService(Number(el.dataset.id))));
      document.querySelectorAll('[data-act="svctoggle"]').forEach((el) => {
        el.onclick = () => {
          const s = db().services.find((x) => x.id === Number(el.dataset.id));
          s.status = s.status === 'on' ? 'off' : 'on';
          ZB.save();
          if (window.ZBBridge) window.ZBBridge.publishServices();
          ZB.toast(s.status === 'on' ? '服务已上架' : '服务已下架');
          refresh();
        };
      });
      document.querySelectorAll('[data-act="svcdel"]').forEach((el) => {
        el.onclick = () => {
          const s = db().services.find((x) => x.id === Number(el.dataset.id));
          ZB.confirm('删除服务', '确定删除「' + s.name + '」？', () => {
            db().services = db().services.filter((x) => x.id !== s.id);
            ZB.save();
            if (window.ZBBridge) window.ZBBridge.publishServices();
            ZB.toast('已删除');
            refresh();
          });
        };
      });
    }
  };

  /* ================= 服务订单 ================= */
  const SO_STATUS = {
    pending: { text: '待支付', cls: 'pill-orange' },
    upcoming: { text: '待开始', cls: 'pill-blue' },
    done: { text: '已完成', cls: 'pill-green' },
    cancelled: { text: '已取消', cls: 'pill-gray' }
  };
  const soPill = (s) => {
    const m = SO_STATUS[s] || { text: s, cls: 'pill-gray' };
    return pill(m.text, m.cls);
  };

  ZB.state.serviceOrders = { tab: 'all', q: '' };

  function setServiceOrderStatus(o, status) {
    o.status = status;
    o.updatedAt = Date.now();
    ZB.save();
    if (window.ZBBridge) window.ZBBridge.publishServiceOrderStatus(o);
    refresh();
  }

  ZB.pages['service-orders'] = {
    group: '专家系统',
    title: '服务订单',
    render() {
      const st = ZB.state.serviceOrders;
      const kw = st.q.trim().toLowerCase();
      const all = db().serviceOrders || [];
      const tabs = [
        { key: 'all', label: '全部', count: all.length },
        { key: 'pending', label: '待支付', count: all.filter((o) => o.status === 'pending').length },
        { key: 'upcoming', label: '待开始', count: all.filter((o) => o.status === 'upcoming').length },
        { key: 'done', label: '已完成', count: all.filter((o) => o.status === 'done').length },
        { key: 'cancelled', label: '已取消', count: all.filter((o) => o.status === 'cancelled').length }
      ];
      let rows = all.filter((o) => st.tab === 'all' || o.status === st.tab).slice().sort((a, b) => b.createdAt - a.createdAt);
      if (kw) rows = rows.filter((o) => (o.no + o.member + o.phone + o.expertName).toLowerCase().indexOf(kw) >= 0);

      const cols = [
        {
          title: '服务订单',
          render: (o) => '<div class="td-strong">' + esc(o.no) + '</div><div class="cell-sub">' + esc(o.member) + '　' + esc(o.phone) + '</div>'
        },
        { title: '专家', render: (o) => '<div>' + esc(o.expertName) + '</div><div class="cell-sub">' + esc(o.typeName) + '</div>' },
        { title: '金额', cls: 'td-money', render: (o) => money(o.price) },
        { title: '预约时间', cls: 'td-muted td-nowrap', render: (o) => esc(o.dateLabel) + ' ' + esc(o.time) },
        { title: '状态', render: (o) => soPill(o.status) },
        { title: '创建时间', cls: 'td-muted td-nowrap', render: (o) => ZB.fmtTime(o.createdAt) },
        {
          title: '操作',
          cls: 'td-nowrap',
          render: (o) => {
            let acts = '';
            if (o.status === 'pending') acts += '<span class="link-btn" data-act="sook" data-id="' + o.id + '">确认支付</span>';
            if (o.status === 'upcoming') acts += '<span class="link-btn" data-act="sodone" data-id="' + o.id + '">标记完成</span>';
            if (o.status === 'pending' || o.status === 'upcoming') acts += '<span class="link-btn danger" data-act="socancel" data-id="' + o.id + '">取消</span>';
            if (!acts) acts = '<span class="td-muted">—</span>';
            return acts;
          }
        }
      ];

      return (
        '<div class="card"><div class="table-toolbar">' + ZB.tabs(tabs, st.tab) +
        '<div class="toolbar-right">' + ZB.searchBox(st.q, '搜索订单号 / 会员 / 手机号 / 专家') + '</div></div>' +
        table(cols, rows, '没有匹配的服务订单') +
        '<div class="table-foot"><span>共 ' + all.length + ' 单</span><span>待支付 ' + all.filter((o) => o.status === 'pending').length + ' 单</span></div></div>'
      );
    },
    after() {
      const st = ZB.state.serviceOrders;
      document.querySelectorAll('[data-tab]').forEach((el) => {
        el.onclick = () => { st.tab = el.dataset.tab; refresh(); };
      });
      const s = document.querySelector('#page-search');
      if (s) s.oninput = () => {
        st.q = s.value;
        const pos = s.selectionStart;
        refresh();
        const ns = document.querySelector('#page-search');
        if (ns) { ns.focus(); ns.setSelectionRange(pos, pos); }
      };
      const find = (id) => db().serviceOrders.find((x) => x.id === id);
      document.querySelectorAll('[data-act="sook"]').forEach((el) => {
        el.onclick = () => {
          setServiceOrderStatus(find(el.dataset.id), 'upcoming');
          ZB.toast('已确认支付');
        };
      });
      document.querySelectorAll('[data-act="sodone"]').forEach((el) => {
        el.onclick = () => {
          setServiceOrderStatus(find(el.dataset.id), 'done');
          ZB.toast('订单已完成');
        };
      });
      document.querySelectorAll('[data-act="socancel"]').forEach((el) => {
        el.onclick = () => {
          const o = find(el.dataset.id);
          ZB.confirm('取消订单', '确定取消服务订单「' + o.no + '」？', () => {
            setServiceOrderStatus(o, 'cancelled');
            ZB.toast('订单已取消');
          });
        };
      });
    }
  };

  /* ================= 预约系统 ================= */
  const AP_STATUS = {
    pending: { text: '待确认', cls: 'pill-orange' },
    confirmed: { text: '已确认', cls: 'pill-blue' },
    done: { text: '已完成', cls: 'pill-green' },
    cancelled: { text: '已取消', cls: 'pill-gray' }
  };
  const apPill = (s) => {
    const m = AP_STATUS[s] || { text: s, cls: 'pill-gray' };
    return pill(m.text, m.cls);
  };

  ZB.state.appointments = { tab: 'all', q: '' };

  function setAppointmentStatus(a, status) {
    a.status = status;
    a.updatedAt = Date.now();
    ZB.save();
    if (window.ZBBridge) window.ZBBridge.publishAppointmentStatus(a);
    refresh();
  }

  ZB.pages.appointments = {
    group: '专家系统',
    title: '预约系统',
    render() {
      const st = ZB.state.appointments;
      const kw = st.q.trim().toLowerCase();
      const all = db().appointments || [];
      const tabs = [
        { key: 'all', label: '全部', count: all.length },
        { key: 'pending', label: '待确认', count: all.filter((a) => a.status === 'pending').length },
        { key: 'confirmed', label: '已确认', count: all.filter((a) => a.status === 'confirmed').length },
        { key: 'done', label: '已完成', count: all.filter((a) => a.status === 'done').length },
        { key: 'cancelled', label: '已取消', count: all.filter((a) => a.status === 'cancelled').length }
      ];
      let rows = all.filter((a) => st.tab === 'all' || a.status === st.tab).slice().sort((a, b) => b.createdAt - a.createdAt);
      if (kw) rows = rows.filter((a) => (a.no + a.member + a.phone + a.storeName + a.serviceName).toLowerCase().indexOf(kw) >= 0);

      const cols = [
        {
          title: '预约单',
          render: (a) => '<div class="td-strong">' + esc(a.no) + '</div><div class="cell-sub">' + esc(a.member) + '　' + esc(a.phone) + '</div>'
        },
        { title: '门店', cls: 'td-muted', render: (a) => esc(a.storeName) },
        { title: '服务项目', render: (a) => '<div>' + esc(a.serviceName) + '</div><div class="cell-sub">' + money(a.price) + '</div>' },
        { title: '到店时间', cls: 'td-muted td-nowrap', render: (a) => esc(a.date) + ' ' + esc(a.time) },
        { title: '状态', render: (a) => apPill(a.status) },
        { title: '提交时间', cls: 'td-muted td-nowrap', render: (a) => ZB.fmtTime(a.createdAt) },
        {
          title: '操作',
          cls: 'td-nowrap',
          render: (a) => {
            let acts = '';
            if (a.status === 'pending') acts += '<span class="link-btn" data-act="apok" data-id="' + a.id + '">确认</span>';
            if (a.status === 'confirmed') acts += '<span class="link-btn" data-act="apdone" data-id="' + a.id + '">完成</span>';
            if (a.status === 'pending' || a.status === 'confirmed') acts += '<span class="link-btn danger" data-act="apcancel" data-id="' + a.id + '">取消</span>';
            if (!acts) acts = '<span class="td-muted">—</span>';
            return acts;
          }
        }
      ];

      return (
        '<div class="card"><div class="table-toolbar">' + ZB.tabs(tabs, st.tab) +
        '<div class="toolbar-right">' + ZB.searchBox(st.q, '搜索预约号 / 会员 / 手机号 / 门店 / 服务') + '</div></div>' +
        table(cols, rows, '没有匹配的预约单') +
        '<div class="table-foot"><span>共 ' + all.length + ' 单</span><span>待确认 ' + all.filter((a) => a.status === 'pending').length + ' 单</span></div></div>'
      );
    },
    after() {
      const st = ZB.state.appointments;
      document.querySelectorAll('[data-tab]').forEach((el) => {
        el.onclick = () => { st.tab = el.dataset.tab; refresh(); };
      });
      const s = document.querySelector('#page-search');
      if (s) s.oninput = () => {
        st.q = s.value;
        const pos = s.selectionStart;
        refresh();
        const ns = document.querySelector('#page-search');
        if (ns) { ns.focus(); ns.setSelectionRange(pos, pos); }
      };
      const find = (id) => db().appointments.find((x) => x.id === id);
      document.querySelectorAll('[data-act="apok"]').forEach((el) => {
        el.onclick = () => {
          setAppointmentStatus(find(el.dataset.id), 'confirmed');
          ZB.toast('预约已确认');
        };
      });
      document.querySelectorAll('[data-act="apdone"]').forEach((el) => {
        el.onclick = () => {
          setAppointmentStatus(find(el.dataset.id), 'done');
          ZB.toast('预约已完成');
        };
      });
      document.querySelectorAll('[data-act="apcancel"]').forEach((el) => {
        el.onclick = () => {
          const a = find(el.dataset.id);
          ZB.confirm('取消预约', '确定取消预约「' + a.no + '」？', () => {
            setAppointmentStatus(a, 'cancelled');
            ZB.toast('预约已取消');
          });
        };
      });
    }
  };

  /* ================= 养生体验 / 康养旅居核销 ================= */
  ZB.state.experienceOrders = { tab: 'all', q: '' };

  ZB.pages['experience-orders'] = {
    group: '专家系统',
    title: '体验核销',
    render() {
      const st = ZB.state.experienceOrders;
      const kw = st.q.trim().toLowerCase();
      const all = db().experienceOrders || [];
      const tabs = [
        { key: 'all', label: '全部', count: all.length },
        { key: 'paid', label: '待核销', count: all.filter((o) => o.status === 'paid').length },
        { key: 'verified', label: '已核销', count: all.filter((o) => o.status === 'verified').length }
      ];
      let rows = all.filter((o) => st.tab === 'all' || o.status === st.tab).slice().sort((a, b) => b.createdAt - a.createdAt);
      if (kw) rows = rows.filter((o) => (o.no + o.title + o.contactName + o.contactPhone + o.verifyCode).toLowerCase().indexOf(kw) >= 0);
      const cols = [
        {
          title: '体验订单',
          render: (o) => '<div class="td-strong">' + esc(o.no) + '</div><div class="cell-sub">' + esc(o.contactName) + '　' + esc(o.contactPhone) + '</div>'
        },
        {
          title: '项目',
          render: (o) => '<div>' + esc(o.title) + '</div><div class="cell-sub">' + (o.kind === 'travel' ? '康养旅居' : '养生体验') + ' · ' + num(o.qty) + ' 份</div>'
        },
        { title: '服务日期', cls: 'td-muted td-nowrap', render: (o) => esc(o.serviceDate || '到店核销') },
        { title: '实付金额', cls: 'td-money', render: (o) => money(o.total) },
        { title: '核销码', render: (o) => '<span class="td-strong">' + esc(o.verifyCode) + '</span>' },
        {
          title: '状态',
          render: (o) => o.status === 'verified' ? pill('已核销', 'pill-green') : pill('待核销', 'pill-orange')
        },
        {
          title: '下单 / 核销时间',
          cls: 'td-muted td-nowrap',
          render: (o) => '<div>' + ZB.fmtTime(o.createdAt) + '</div>' + (o.verifiedAt ? '<div class="cell-sub">核销 ' + ZB.fmtTime(o.verifiedAt) + '</div>' : '')
        },
        {
          title: '操作',
          cls: 'td-nowrap',
          render: (o) => o.status === 'paid'
            ? '<span class="link-btn" data-act="expverify" data-id="' + o.id + '">核销</span>'
            : '<span class="td-muted">已完成</span>'
        }
      ];
      return (
        '<div class="card"><div class="table-toolbar">' + ZB.tabs(tabs, st.tab) +
        '<div class="toolbar-right">' + ZB.searchBox(st.q, '搜索订单号 / 项目 / 联系人 / 核销码') + '</div></div>' +
        '<div class="cell-sub" style="margin-bottom:16px">顾客出示二维码后，点击对应订单的「核销」，扫描或输入核销码完成验证。</div>' +
        table(cols, rows, '暂无体验订单，请先在小程序购买养生体验或康养旅居服务') +
        '<div class="table-foot"><span>共 ' + all.length + ' 单</span><span>待核销 ' + all.filter((o) => o.status === 'paid').length + ' 单</span></div></div>'
      );
    },
    after() {
      const st = ZB.state.experienceOrders;
      document.querySelectorAll('[data-tab]').forEach((el) => {
        el.onclick = () => { st.tab = el.dataset.tab; refresh(); };
      });
      const s = document.querySelector('#page-search');
      if (s) s.oninput = () => {
        st.q = s.value;
        const pos = s.selectionStart;
        refresh();
        const ns = document.querySelector('#page-search');
        if (ns) { ns.focus(); ns.setSelectionRange(pos, pos); }
      };
      document.querySelectorAll('[data-act="expverify"]').forEach((el) => {
        el.onclick = () => {
          const order = (db().experienceOrders || []).find((o) => o.id === el.dataset.id);
          if (!order) return;
          ZB.formModal(
            '体验订单核销',
            [{ key: 'verifyCode', label: '核销码', required: true, full: true, placeholder: '扫描或输入顾客出示的核销码' }],
            { verifyCode: '' },
            (v) => {
              const error = window.ZBBridge ? window.ZBBridge.verifyExperienceOrder(order, v.verifyCode) : '数据桥接未加载';
              if (error) {
                ZB.toast(error);
                return;
              }
              ZB.closeModal();
              ZB.toast('核销成功，顾客端状态已同步');
              refresh();
            }
          );
        };
      });
    }
  };

  /* ================= 会员权益配置 ================= */
  const BENEFIT_LEVELS = { normal: '普通会员', silver: '银卡会员', gold: '金卡会员', diamond: '钻石会员' };
  const benefitLevelText = (level) => BENEFIT_LEVELS[level] || level;

  function editBenefit(id) {
    const isNew = !id;
    const source = isNew
      ? { level: 'silver', serviceId: 3, storeIds: [], totalTimes: 1, startDate: '2026-01-01', endDate: '2027-12-31', description: '', status: 'on' }
      : db().memberBenefits.find((b) => String(b.id) === String(id));
    if (!source) return;
    const item = JSON.parse(JSON.stringify(source));

    ZB.modal({
      title: isNew ? '新增会员权益' : '编辑会员权益',
      wide: true,
      body:
        '<form id="benefit-form" class="form-grid" autocomplete="off">' +
        '<label class="field"><span>会员等级 <em style="color:#ef4444;font-style:normal">*</em></span><select name="level">' +
        Object.keys(BENEFIT_LEVELS).map((key) => '<option value="' + key + '"' + (item.level === key ? ' selected' : '') + '>' + BENEFIT_LEVELS[key] + '</option>').join('') +
        '</select></label>' +
        '<label class="field"><span>对应服务 <em style="color:#ef4444;font-style:normal">*</em></span><select name="serviceId">' +
        db().services.map((s) => '<option value="' + s.id + '"' + (String(item.serviceId) === String(s.id) ? ' selected' : '') + '>' + esc(s.name) + (s.status === 'on' ? '' : '（已下架）') + '</option>').join('') +
        '</select></label>' +
        '<label class="field"><span>可用总次数 <em style="color:#ef4444;font-style:normal">*</em></span><input name="totalTimes" type="number" min="1" step="1" value="' + item.totalTimes + '"></label>' +
        '<label class="field"><span>启停状态</span><select name="status"><option value="on"' + (item.status === 'on' ? ' selected' : '') + '>启用</option><option value="off"' + (item.status === 'off' ? ' selected' : '') + '>停用</option></select></label>' +
        '<label class="field"><span>生效日期 <em style="color:#ef4444;font-style:normal">*</em></span><input name="startDate" type="date" value="' + esc(item.startDate) + '"></label>' +
        '<label class="field"><span>失效日期 <em style="color:#ef4444;font-style:normal">*</em></span><input name="endDate" type="date" value="' + esc(item.endDate) + '"></label>' +
        '<div class="field full"><span>适用门店 <em style="color:#ef4444;font-style:normal">*</em></span><div id="benefit-store-options" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px"></div></div>' +
        '<label class="field full"><span>权益说明</span><textarea name="description" placeholder="说明使用规则、服务内容等">' + esc(item.description) + '</textarea></label>' +
        '</form>',
      foot: '<button class="btn btn-ghost" data-cancel>取消</button><button class="btn btn-primary" id="benefit-save">保存</button>',
      onMount(root) {
        const form = root.querySelector('#benefit-form');
        const serviceSelect = form.elements.serviceId;
        const storeBox = root.querySelector('#benefit-store-options');

        function availableStores() {
          const service = db().services.find((s) => String(s.id) === String(serviceSelect.value));
          return db().stores.filter(
            (store) => store.status === 'on' && service && service.status === 'on' &&
              (!(service.storeIds || []).length || (service.storeIds || []).some((sid) => String(sid) === String(store.id)))
          );
        }

        function renderStores() {
          const stores = availableStores();
          storeBox.innerHTML = stores.length
            ? stores.map((store) =>
                '<label style="display:flex;align-items:flex-start;gap:8px;padding:10px;border:1px solid #e4ebf0;border-radius:8px;font-size:12.5px;cursor:pointer">' +
                '<input type="checkbox" name="storeIds" value="' + store.id + '"' + ((item.storeIds || []).some((sid) => String(sid) === String(store.id)) ? ' checked' : '') + '>' +
                '<span>' + esc(store.name) + '<small style="display:block;color:#93a1b0;margin-top:3px">' + esc(store.address) + '</small></span></label>'
              ).join('')
            : '<div class="cell-sub">该服务暂无可用门店，请先检查服务状态及门店关联。</div>';
        }

        serviceSelect.onchange = () => {
          item.storeIds = [];
          renderStores();
        };
        root.querySelector('[data-cancel]').onclick = ZB.closeModal;
        root.querySelector('#benefit-save').onclick = () => {
          const service = db().services.find((s) => String(s.id) === String(serviceSelect.value));
          const selected = Array.from(form.querySelectorAll('input[name="storeIds"]:checked')).map((el) => Number(el.value));
          const totalTimes = Number(form.elements.totalTimes.value);
          const startDate = form.elements.startDate.value;
          const endDate = form.elements.endDate.value;
          if (!service || service.status !== 'on') return ZB.toast('请选择已上架的服务');
          if (!Number.isInteger(totalTimes) || totalTimes < 1) return ZB.toast('可用总次数必须为正整数');
          if (!startDate || !endDate || startDate > endDate) return ZB.toast('请填写正确的有效期起止日期');
          if (!selected.length) return ZB.toast('请至少选择一家适用门店');
          const allowedIds = availableStores().map((s) => String(s.id));
          if (selected.some((sid) => allowedIds.indexOf(String(sid)) < 0)) return ZB.toast('所选门店当前不适用该服务');

          const usedByMember = {};
          (db().benefitVouchers || []).forEach((v) => {
            if (String(v.benefitId) === String(id) && v.status === 'verified') {
              const key = String(v.memberId);
              usedByMember[key] = (usedByMember[key] || 0) + 1;
            }
          });
          const maxUsed = Object.keys(usedByMember).reduce((max, key) => Math.max(max, usedByMember[key]), 0);
          if (totalTimes < maxUsed) return ZB.toast('总次数不能低于会员已核销的最高次数（' + maxUsed + ' 次）');

          Object.assign(item, {
            level: form.elements.level.value,
            serviceId: Number(serviceSelect.value),
            storeIds: selected,
            totalTimes: totalTimes,
            startDate: startDate,
            endDate: endDate,
            description: form.elements.description.value.trim(),
            status: form.elements.status.value
          });
          if (isNew) db().memberBenefits.unshift(Object.assign({ id: Date.now() }, item));
          else Object.assign(source, item);
          ZB.save();
          ZB.closeModal();
          if (window.ZBBridge) window.ZBBridge.publishBenefits();
          ZB.toast(isNew ? '会员权益已新增' : '会员权益已保存');
          refresh();
        };
        renderStores();
      }
    });
  }

  ZB.state.memberBenefits = { q: '' };
  ZB.pages['member-benefits'] = {
    group: '基础信息维护',
    title: '权益配置',
    render() {
      const st = ZB.state.memberBenefits;
      const kw = st.q.trim().toLowerCase();
      const all = db().memberBenefits || [];
      let rows = all.slice();
      if (kw) {
        rows = rows.filter((b) => {
          const service = db().services.find((s) => String(s.id) === String(b.serviceId));
          return (benefitLevelText(b.level) + (service ? service.name : '') + b.description).toLowerCase().indexOf(kw) >= 0;
        });
      }
      const cols = [
        {
          title: '会员权益',
          render: (b) => {
            const service = db().services.find((s) => String(s.id) === String(b.serviceId));
            return '<div class="cell-name">' + esc(service ? service.name : '服务已删除') + '</div><div class="cell-sub">' + esc(b.description || '暂无权益说明') + '</div>';
          }
        },
        { title: '会员等级', render: (b) => pill(benefitLevelText(b.level), b.level === 'diamond' ? 'pill-purple' : b.level === 'gold' ? 'pill-orange' : 'pill-blue') },
        {
          title: '适用门店',
          cls: 'td-muted',
          render: (b) => '<div>' + (b.storeIds || []).length + ' 家门店</div><div class="cell-sub">' + esc((b.storeIds || []).map((id) => {
            const store = db().stores.find((s) => String(s.id) === String(id));
            return store ? store.name.replace('中兵康养中心', '') : '门店已删除';
          }).join('、')) + '</div>'
        },
        { title: '可用次数', cls: 'td-strong', render: (b) => num(b.totalTimes) + ' 次' },
        { title: '有效期', cls: 'td-muted td-nowrap', render: (b) => esc(b.startDate) + '<div class="cell-sub">至 ' + esc(b.endDate) + '</div>' },
        { title: '状态', render: (b) => b.status === 'on' ? pill('已启用', 'pill-green') : pill('已停用', 'pill-gray') },
        {
          title: '操作',
          cls: 'td-nowrap',
          render: (b) =>
            '<span class="link-btn" data-act="bfedit" data-id="' + b.id + '">编辑</span>' +
            '<span class="link-btn" data-act="bftoggle" data-id="' + b.id + '">' + (b.status === 'on' ? '停用' : '启用') + '</span>' +
            '<span class="link-btn danger" data-act="bfdel" data-id="' + b.id + '">删除</span>'
        }
      ];
      return (
        '<div class="card"><div class="table-toolbar"><div class="card-title">会员服务权益<small>一项权益绑定一项服务，可配置多家适用门店</small></div>' +
        '<div class="toolbar-right">' + ZB.searchBox(st.q, '搜索等级 / 服务 / 权益说明') + '<button class="btn btn-primary" data-act="bfnew">+ 新增权益</button></div></div>' +
        table(cols, rows, '暂无权益配置') +
        '<div class="table-foot"><span>共 ' + all.length + ' 项权益</span><span>启用 ' + all.filter((b) => b.status === 'on').length + ' 项</span></div></div>'
      );
    },
    after() {
      const st = ZB.state.memberBenefits;
      const s = document.querySelector('#page-search');
      if (s) s.oninput = () => {
        st.q = s.value;
        const pos = s.selectionStart;
        refresh();
        const ns = document.querySelector('#page-search');
        if (ns) { ns.focus(); ns.setSelectionRange(pos, pos); }
      };
      document.querySelector('[data-act="bfnew"]').onclick = () => editBenefit();
      document.querySelectorAll('[data-act="bfedit"]').forEach((el) => (el.onclick = () => editBenefit(el.dataset.id)));
      document.querySelectorAll('[data-act="bftoggle"]').forEach((el) => {
        el.onclick = () => {
          const b = db().memberBenefits.find((x) => String(x.id) === String(el.dataset.id));
          b.status = b.status === 'on' ? 'off' : 'on';
          ZB.save();
          if (window.ZBBridge) window.ZBBridge.publishBenefits();
          ZB.toast(b.status === 'on' ? '权益已启用' : '权益已停用');
          refresh();
        };
      });
      document.querySelectorAll('[data-act="bfdel"]').forEach((el) => {
        el.onclick = () => {
          const b = db().memberBenefits.find((x) => String(x.id) === String(el.dataset.id));
          if ((db().benefitVouchers || []).some((v) => String(v.benefitId) === String(b.id))) {
            ZB.toast('该权益已产生凭证，请改用停用以保留核销记录');
            return;
          }
          ZB.confirm('删除权益', '确定删除该会员权益配置？', () => {
            db().memberBenefits = db().memberBenefits.filter((x) => String(x.id) !== String(b.id));
            ZB.save();
            if (window.ZBBridge) window.ZBBridge.publishBenefits();
            ZB.toast('权益已删除');
            refresh();
          });
        };
      });
    }
  };

  /* ================= 会员权益核销 ================= */
  ZB.state.benefitVouchers = { tab: 'all', q: '' };

  function openBenefitVerify(voucher) {
    ZB.formModal(
      '会员权益核销',
      [{ key: 'verifyCode', label: '核销码', required: true, full: true, placeholder: '扫描或输入会员出示的核销码' }],
      { verifyCode: '' },
      (value) => {
        const error = window.ZBBridge ? window.ZBBridge.verifyBenefitVoucher(voucher, value.verifyCode) : '数据桥接未加载';
        if (error) return ZB.toast(error);
        ZB.closeModal();
        ZB.toast('核销成功，已扣减 1 次权益');
        refresh();
      }
    );
  }

  ZB.pages['benefit-vouchers'] = {
    group: '基础信息维护',
    title: '权益核销',
    render() {
      const st = ZB.state.benefitVouchers;
      const kw = st.q.trim().toLowerCase();
      const all = db().benefitVouchers || [];
      const tabs = [
        { key: 'all', label: '全部', count: all.length },
        { key: 'pending', label: '待核销', count: all.filter((v) => v.status === 'pending').length },
        { key: 'verified', label: '已核销', count: all.filter((v) => v.status === 'verified').length }
      ];
      let rows = all.filter((v) => st.tab === 'all' || v.status === st.tab).slice().sort((a, b) => b.createdAt - a.createdAt);
      if (kw) rows = rows.filter((v) => (v.memberName + v.serviceName + v.storeName + v.verifyCode).toLowerCase().indexOf(kw) >= 0);
      const cols = [
        {
          title: '会员 / 核销码',
          render: (v) => '<div class="td-strong">' + esc(v.memberName) + ' · ' + esc(benefitLevelText(v.memberLevel)) + '</div><div class="cell-sub">' + esc(v.verifyCode) + '</div>'
        },
        { title: '权益服务', render: (v) => '<div>' + esc(v.serviceName) + '</div><div class="cell-sub">权益 #' + esc(v.benefitId) + '</div>' },
        { title: '核销门店', cls: 'td-muted', render: (v) => esc(v.storeName) },
        { title: '状态', render: (v) => v.status === 'verified' ? pill('已核销', 'pill-green') : pill('待核销', 'pill-orange') },
        {
          title: '生成 / 核销时间',
          cls: 'td-muted td-nowrap',
          render: (v) => '<div>' + ZB.fmtTime(v.createdAt) + '</div>' + (v.verifiedAt ? '<div class="cell-sub">核销 ' + ZB.fmtTime(v.verifiedAt) + '</div>' : '')
        },
        {
          title: '操作',
          cls: 'td-nowrap',
          render: (v) => v.status === 'pending'
            ? '<span class="link-btn" data-act="bvverify" data-id="' + v.id + '">核销</span>'
            : '<span class="td-muted">已完成</span>'
        }
      ];
      return (
        '<div class="card"><div class="table-toolbar">' + ZB.tabs(tabs, st.tab) +
        '<div class="toolbar-right">' + ZB.searchBox(st.q, '搜索会员 / 服务 / 门店 / 核销码') + '<button class="btn btn-primary" data-act="bvmanual">手动核销</button></div></div>' +
        '<div class="cell-sub" style="margin-bottom:16px">会员到店完成服务后核销凭证。核销成功扣减一次权益，生成凭证时不扣次数。</div>' +
        table(cols, rows, '暂无权益凭证，请先在小程序选择门店生成凭证') +
        '<div class="table-foot"><span>共 ' + all.length + ' 张凭证</span><span>待核销 ' + all.filter((v) => v.status === 'pending').length + ' 张</span></div></div>'
      );
    },
    after() {
      const st = ZB.state.benefitVouchers;
      document.querySelectorAll('[data-tab]').forEach((el) => {
        el.onclick = () => { st.tab = el.dataset.tab; refresh(); };
      });
      const s = document.querySelector('#page-search');
      if (s) s.oninput = () => {
        st.q = s.value;
        const pos = s.selectionStart;
        refresh();
        const ns = document.querySelector('#page-search');
        if (ns) { ns.focus(); ns.setSelectionRange(pos, pos); }
      };
      document.querySelectorAll('[data-act="bvverify"]').forEach((el) => {
        el.onclick = () => {
          const voucher = (db().benefitVouchers || []).find((v) => String(v.id) === String(el.dataset.id));
          if (voucher) openBenefitVerify(voucher);
        };
      });
      document.querySelector('[data-act="bvmanual"]').onclick = () => {
        ZB.formModal(
          '手动输入核销码',
          [{ key: 'verifyCode', label: '核销码', required: true, full: true, placeholder: '输入完整的会员权益核销码' }],
          { verifyCode: '' },
          (value) => {
            if (window.ZBBridge) window.ZBBridge.pullBenefitVouchers();
            const code = String(value.verifyCode || '').replace(/\s/g, '');
            const voucher = (db().benefitVouchers || []).find((v) => String(v.verifyCode) === code);
            if (!voucher) return ZB.toast('未找到该核销码对应的权益凭证');
            const error = window.ZBBridge ? window.ZBBridge.verifyBenefitVoucher(voucher, code) : '数据桥接未加载';
            if (error) return ZB.toast(error);
            ZB.closeModal();
            ZB.toast('核销成功，已扣减 1 次权益');
            refresh();
          }
        );
      };
    }
  };
})();
