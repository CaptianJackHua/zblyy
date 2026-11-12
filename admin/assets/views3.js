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

  ZB.pages.services = {
    group: '专家系统',
    title: '服务管理',
    render() {
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
        '<div class="toolbar-right"><button class="btn btn-primary" data-act="svcnew">+ 新增服务</button></div></div>' +
        table(cols, db().services) + '</div>'
      );
    },
    after() {
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

  ZB.state.serviceOrders = { tab: 'all' };

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
      const all = db().serviceOrders || [];
      const tabs = [
        { key: 'all', label: '全部', count: all.length },
        { key: 'pending', label: '待支付', count: all.filter((o) => o.status === 'pending').length },
        { key: 'upcoming', label: '待开始', count: all.filter((o) => o.status === 'upcoming').length },
        { key: 'done', label: '已完成', count: all.filter((o) => o.status === 'done').length },
        { key: 'cancelled', label: '已取消', count: all.filter((o) => o.status === 'cancelled').length }
      ];
      const rows = all.filter((o) => st.tab === 'all' || o.status === st.tab).slice().sort((a, b) => b.createdAt - a.createdAt);

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
        '<div class="card"><div class="table-toolbar">' + ZB.tabs(tabs, st.tab) + '</div>' +
        table(cols, rows, '暂无服务订单') +
        '<div class="table-foot"><span>共 ' + all.length + ' 单</span><span>待支付 ' + all.filter((o) => o.status === 'pending').length + ' 单</span></div></div>'
      );
    },
    after() {
      const st = ZB.state.serviceOrders;
      document.querySelectorAll('[data-tab]').forEach((el) => {
        el.onclick = () => {
          st.tab = el.dataset.tab;
          refresh();
        };
      });
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

  ZB.state.appointments = { tab: 'all' };

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
      const all = db().appointments || [];
      const tabs = [
        { key: 'all', label: '全部', count: all.length },
        { key: 'pending', label: '待确认', count: all.filter((a) => a.status === 'pending').length },
        { key: 'confirmed', label: '已确认', count: all.filter((a) => a.status === 'confirmed').length },
        { key: 'done', label: '已完成', count: all.filter((a) => a.status === 'done').length },
        { key: 'cancelled', label: '已取消', count: all.filter((a) => a.status === 'cancelled').length }
      ];
      const rows = all.filter((a) => st.tab === 'all' || a.status === st.tab).slice().sort((a, b) => b.createdAt - a.createdAt);

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
        '<div class="card"><div class="table-toolbar">' + ZB.tabs(tabs, st.tab) + '</div>' +
        table(cols, rows, '暂无预约单') +
        '<div class="table-foot"><span>共 ' + all.length + ' 单</span><span>待确认 ' + all.filter((a) => a.status === 'pending').length + ' 单</span></div></div>'
      );
    },
    after() {
      const st = ZB.state.appointments;
      document.querySelectorAll('[data-tab]').forEach((el) => {
        el.onclick = () => {
          st.tab = el.dataset.tab;
          refresh();
        };
      });
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
})();
