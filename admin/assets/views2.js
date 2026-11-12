/* 中兵康养商城后台 · 页面：会员 / 门店 / 专家 / 旅居 / 消息 / 设置 */
(function () {
  const ZB = window.ZB;
  const esc = ZB.escapeHtml;
  const money = ZB.money;
  const num = ZB.num;
  const table = ZB.table;
  const pill = ZB.pill;
  const refresh = () => ZB.refresh();
  const db = () => ZB.db;

  const LEVEL_CLS = { 普通: 'pill-gray', 银卡: 'pill-blue', 金卡: 'pill-orange', 钻石: 'pill-purple' };

  /* ================= 会员管理 ================= */
  ZB.state.members = { q: '' };

  function viewMember(id) {
    const m = db().members.find((x) => x.id === id);
    const myOrders = db().orders.filter((o) => o.user === m.name);
    const body =
      '<div class="detail-row"><span class="detail-label">会员</span><span class="detail-value">' + esc(m.name) + '　' + esc(m.phone) + '</span></div>' +
      '<div class="detail-row"><span class="detail-label">会员等级</span><span class="detail-value">' + pill(m.level, LEVEL_CLS[m.level]) + '</span></div>' +
      '<div class="detail-row"><span class="detail-label">积分 / 中兵币</span><span class="detail-value">' + num(m.points) + ' 分　/　' + num(m.coins) + ' 币</span></div>' +
      '<div class="detail-row"><span class="detail-label">订单数</span><span class="detail-value">' + m.orders + ' 单</span></div>' +
      '<div class="detail-row"><span class="detail-label">累计消费</span><span class="detail-value" style="color:#e2452f;font-weight:700">' + money(m.spent) + '</span></div>' +
      '<div class="detail-row"><span class="detail-label">注册时间</span><span class="detail-value">' + ZB.fmtDate(m.joinDate) + '</span></div>' +
      '<div class="detail-row"><span class="detail-label">账号状态</span><span class="detail-value">' + (m.status === 'on' ? pill('正常', 'pill-green') : pill('已禁用', 'pill-gray')) + '</span></div>' +
      '<div class="section-title">最近订单</div>' +
      (myOrders.length
        ? myOrders
            .slice()
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 4)
            .map(
              (o) =>
                '<div class="order-goods"><div class="order-goods-info"><div class="order-goods-name">' + o.no + '</div>' +
                '<div class="order-goods-spec">' + ZB.fmtDate(o.createdAt) + ' · ' + o.items.length + ' 件商品</div></div>' +
                '<div class="order-goods-price">' + money(o.total) + '</div></div>'
            )
            .join('')
        : '<div class="empty" style="padding:24px 0">暂无订单</div>');

    ZB.modal({
      title: '会员详情',
      wide: true,
      body: body,
      foot: '<button class="btn btn-ghost" data-close>关闭</button>'
    });
  }

  ZB.pages.members = {
    group: '基础信息维护',
    title: '会员管理',
    render() {
      const st = ZB.state.members;
      const kw = st.q.trim().toLowerCase();
      let rows = db().members.slice();
      if (kw) rows = rows.filter((m) => (m.name + m.phone).toLowerCase().indexOf(kw) >= 0);

      const cols = [
        {
          title: '会员',
          render: (m) =>
            '<div class="cell-flex"><div class="avatar" style="width:34px;height:34px;font-size:13px">' + esc(m.name.slice(0, 1)) + '</div>' +
            '<div><div class="cell-name">' + esc(m.name) + '</div><div class="cell-sub">' + esc(m.phone) + '</div></div></div>'
        },
        { title: '等级', render: (m) => pill(m.level, LEVEL_CLS[m.level] || 'pill-gray') },
        { title: '积分', render: (m) => '<span class="td-strong">' + num(m.points) + '</span>' },
        { title: '中兵币', cls: 'td-muted', render: (m) => num(m.coins) },
        { title: '订单数', cls: 'td-muted', render: (m) => m.orders },
        { title: '累计消费', cls: 'td-money', render: (m) => money(m.spent) },
        { title: '注册时间', cls: 'td-muted td-nowrap', render: (m) => ZB.fmtDate(m.joinDate) },
        { title: '状态', render: (m) => (m.status === 'on' ? pill('正常', 'pill-green') : pill('已禁用', 'pill-gray')) },
        {
          title: '操作',
          cls: 'td-nowrap',
          render: (m) =>
            '<span class="link-btn" data-act="mview" data-id="' + m.id + '">详情</span>' +
            '<span class="link-btn ' + (m.status === 'on' ? 'danger' : '') + '" data-act="mtoggle" data-id="' + m.id + '">' +
            (m.status === 'on' ? '禁用' : '启用') + '</span>'
        }
      ];

      return (
        '<div class="card"><div class="table-toolbar">' +
        '<div class="card-title">会员列表<small>共 ' + db().members.length + ' 人</small></div>' +
        '<div class="toolbar-right">' + ZB.searchBox(st.q, '会员姓名 / 手机号') + '</div></div>' +
        table(cols, rows, '没有匹配的会员') + '</div>'
      );
    },
    after() {
      const st = ZB.state.members;
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
      document.querySelectorAll('[data-act="mview"]').forEach((el) => (el.onclick = () => viewMember(Number(el.dataset.id))));
      document.querySelectorAll('[data-act="mtoggle"]').forEach((el) => {
        el.onclick = () => {
          const m = db().members.find((x) => x.id === Number(el.dataset.id));
          m.status = m.status === 'on' ? 'off' : 'on';
          ZB.save();
          ZB.toast(m.status === 'on' ? '会员已启用' : '会员已禁用');
          refresh();
        };
      });
    }
  };

  /* ================= 门店管理 ================= */
  const storeFields = [
    { key: 'name', label: '门店名称', required: true, full: true },
    { key: 'tag', label: '门店标签', placeholder: '如：旗舰店 / 新店' },
    { key: 'rating', label: '评分', type: 'number', step: '0.1', min: 0 },
    { key: 'address', label: '门店地址', required: true, full: true },
    { key: 'tel', label: '联系电话', required: true },
    { key: 'hours', label: '营业时间', placeholder: '09:00 - 21:00' },
    { key: 'status', label: '营业状态', type: 'select', options: [{ value: 'on', label: '营业中' }, { value: 'off', label: '休息中' }] }
  ];

  function editStore(id) {
    const isNew = !id;
    const item = isNew
      ? { name: '', tag: '', rating: 4.8, address: '', tel: '', hours: '09:00 - 21:00', status: 'on', services: [] }
      : db().stores.find((s) => s.id === id);
    ZB.formModal(isNew ? '新增门店' : '编辑门店', storeFields, item, (v) => {
      if (isNew) db().stores.push(Object.assign({ id: Date.now(), services: [] }, v));
      else Object.assign(item, v);
      ZB.save();
      ZB.closeModal();
      ZB.toast(isNew ? '门店已新增' : '门店已保存');
      refresh();
    });
  }

  function storeServices(id) {
    const s = db().stores.find((x) => x.id === id);
    const rows = s.services.map((it, i) => ({
      name: it[0],
      price: it[1],
      duration: it[2],
      idx: i
    }));
    const body =
      '<div style="font-size:12.5px;color:#93a1b0;margin-bottom:12px">' + esc(s.name) + '，共 ' + s.services.length + ' 个到店服务项目</div>' +
      ZB.table(
        [
          { title: '服务项目', render: (r) => '<span class="td-strong">' + esc(r.name) + '</span>' },
          { title: '价格', cls: 'td-money', render: (r) => money(r.price) },
          { title: '时长', cls: 'td-muted', render: (r) => esc(r.duration) },
          { title: '操作', render: (r) => '<span class="link-btn danger" data-del="' + r.idx + '">移除</span>' }
        ],
        rows
      );

    ZB.modal({
      title: '门店服务项目',
      wide: true,
      body: body,
      foot: '<button class="btn btn-ghost" data-close>关闭</button><button class="btn btn-primary" id="add-service">+ 新增服务</button>',
      onMount(root) {
        root.querySelector('#add-service').onclick = () => {
          ZB.formModal(
            '新增服务项目',
            [
              { key: 'name', label: '服务名称', required: true, full: true, placeholder: '如：针灸调理' },
              { key: 'price', label: '价格（元）', type: 'number', required: true, min: 0 },
              { key: 'duration', label: '服务时长', placeholder: '如：约 40 分钟' }
            ],
            { duration: '约 40 分钟' },
            (v) => {
              s.services.push([v.name, v.price, v.duration]);
              ZB.save();
              ZB.closeModal();
              ZB.toast('服务项目已新增');
              refresh();
            }
          );
        };
        root.querySelectorAll('[data-del]').forEach((el) => {
          el.onclick = () => {
            s.services.splice(Number(el.dataset.del), 1);
            ZB.save();
            ZB.closeModal();
            ZB.toast('服务项目已移除');
            refresh();
          };
        });
      }
    });
  }

  ZB.pages.stores = {
    group: '专家系统',
    title: '门店管理',
    render() {
      const cols = [
        {
          title: '门店',
          render: (s) =>
            '<div class="cell-flex">' + ZB.thumb('#0f9b8e', '店') +
            '<div><div class="cell-name">' + esc(s.name) + (s.tag ? ' ' + pill(s.tag, 'pill-teal') : '') +
            '</div><div class="cell-sub">' + esc(s.tel) + '</div></div></div>'
        },
        { title: '评分', render: (s) => '<span style="color:#f59e0b;font-weight:600">★ ' + s.rating + '</span>' },
        { title: '地址', cls: 'td-muted', render: (s) => esc(s.address) },
        { title: '营业时间', cls: 'td-muted td-nowrap', render: (s) => esc(s.hours) },
        { title: '服务项目', render: (s) => '<span class="link-btn" data-act="ssvc" data-id="' + s.id + '">' + s.services.length + ' 项</span>' },
        { title: '状态', render: (s) => (s.status === 'on' ? pill('营业中', 'pill-green') : pill('休息中', 'pill-gray')) },
        {
          title: '操作',
          cls: 'td-nowrap',
          render: (s) =>
            '<span class="link-btn" data-act="sedit" data-id="' + s.id + '">编辑</span>' +
            '<span class="link-btn" data-act="stoggle" data-id="' + s.id + '">' + (s.status === 'on' ? '停业' : '营业') + '</span>' +
            '<span class="link-btn danger" data-act="sdel" data-id="' + s.id + '">删除</span>'
        }
      ];
      return (
        '<div class="card"><div class="table-toolbar">' +
        '<div class="card-title">门店列表<small>共 ' + db().stores.length + ' 家</small></div>' +
        '<div class="toolbar-right"><button class="btn btn-primary" data-act="snew">+ 新增门店</button></div></div>' +
        table(cols, db().stores) + '</div>'
      );
    },
    after() {
      document.querySelector('[data-act="snew"]').onclick = () => editStore();
      document.querySelectorAll('[data-act="sedit"]').forEach((el) => (el.onclick = () => editStore(Number(el.dataset.id))));
      document.querySelectorAll('[data-act="ssvc"]').forEach((el) => (el.onclick = () => storeServices(Number(el.dataset.id))));
      document.querySelectorAll('[data-act="stoggle"]').forEach((el) => {
        el.onclick = () => {
          const s = db().stores.find((x) => x.id === Number(el.dataset.id));
          s.status = s.status === 'on' ? 'off' : 'on';
          ZB.save();
          ZB.toast(s.status === 'on' ? '门店已开始营业' : '门店已停止营业');
          refresh();
        };
      });
      document.querySelectorAll('[data-act="sdel"]').forEach((el) => {
        el.onclick = () => {
          const s = db().stores.find((x) => x.id === Number(el.dataset.id));
          ZB.confirm('删除门店', '确定删除「' + s.name + '」？', () => {
            db().stores = db().stores.filter((x) => x.id !== s.id);
            ZB.save();
            ZB.toast('已删除');
            refresh();
          });
        };
      });
    }
  };

  /* ================= 专家管理 ================= */
  const expertFields = [
    { key: 'name', label: '专家姓名', required: true },
    { key: 'title', label: '职称', required: true },
    { key: 'org', label: '所属机构', required: true, full: true },
    { key: 'good', label: '擅长领域', full: true, placeholder: '如：中医内科、失眠调理' },
    { key: 'price', label: '咨询价格（元）', type: 'number', required: true, min: 0 },
    { key: 'rating', label: '评分', type: 'number', step: '0.1', min: 0 },
    { key: 'types', label: '服务方式', placeholder: '图文/电话/视频' },
    { key: 'status', label: '状态', type: 'select', options: [{ value: 'on', label: '接诊中' }, { value: 'off', label: '暂停接诊' }] }
  ];

  function editExpert(id) {
    const isNew = !id;
    const item = isNew
      ? { name: '', title: '主治医师', org: '', good: '', price: 99, rating: 4.8, types: '图文/电话', status: 'on', orders: 0 }
      : db().experts.find((x) => x.id === id);
    ZB.formModal(isNew ? '新增专家' : '编辑专家', expertFields, item, (v) => {
      if (isNew) db().experts.push(Object.assign({ id: Date.now(), orders: 0 }, v));
      else Object.assign(item, v);
      ZB.save();
      ZB.closeModal();
      ZB.toast(isNew ? '专家已新增' : '专家信息已保存');
      refresh();
    });
  }

  ZB.pages.experts = {
    group: '专家系统',
    title: '专家管理',
    render() {
      const cols = [
        {
          title: '专家',
          render: (e) =>
            '<div class="cell-flex"><div class="avatar" style="width:34px;height:34px;font-size:13px">' + esc(e.name.slice(0, 1)) + '</div>' +
            '<div><div class="cell-name">' + esc(e.name) + '　<span style="font-weight:400;color:#93a1b0">' + esc(e.title) + '</span></div>' +
            '<div class="cell-sub">' + esc(e.org) + '</div></div></div>'
        },
        { title: '擅长', cls: 'td-muted', render: (e) => esc(e.good) },
        { title: '服务方式', cls: 'td-muted', render: (e) => esc(e.types) },
        { title: '咨询价', cls: 'td-money', render: (e) => money(e.price) },
        { title: '评分', render: (e) => '<span style="color:#f59e0b;font-weight:600">★ ' + e.rating + '</span>' },
        { title: '服务次数', cls: 'td-muted', render: (e) => num(e.orders) },
        { title: '状态', render: (e) => (e.status === 'on' ? pill('接诊中', 'pill-green') : pill('暂停接诊', 'pill-gray')) },
        {
          title: '操作',
          cls: 'td-nowrap',
          render: (e) =>
            '<span class="link-btn" data-act="eedit" data-id="' + e.id + '">编辑</span>' +
            '<span class="link-btn" data-act="etoggle" data-id="' + e.id + '">' + (e.status === 'on' ? '暂停' : '恢复') + '</span>' +
            '<span class="link-btn danger" data-act="edel" data-id="' + e.id + '">删除</span>'
        }
      ];
      return (
        '<div class="card"><div class="table-toolbar">' +
        '<div class="card-title">专家列表<small>共 ' + db().experts.length + ' 位</small></div>' +
        '<div class="toolbar-right"><button class="btn btn-primary" data-act="enew">+ 新增专家</button></div></div>' +
        table(cols, db().experts) + '</div>'
      );
    },
    after() {
      document.querySelector('[data-act="enew"]').onclick = () => editExpert();
      document.querySelectorAll('[data-act="eedit"]').forEach((el) => (el.onclick = () => editExpert(Number(el.dataset.id))));
      document.querySelectorAll('[data-act="etoggle"]').forEach((el) => {
        el.onclick = () => {
          const e = db().experts.find((x) => x.id === Number(el.dataset.id));
          e.status = e.status === 'on' ? 'off' : 'on';
          ZB.save();
          ZB.toast(e.status === 'on' ? '专家已恢复接诊' : '专家已暂停接诊');
          refresh();
        };
      });
      document.querySelectorAll('[data-act="edel"]').forEach((el) => {
        el.onclick = () => {
          const e = db().experts.find((x) => x.id === Number(el.dataset.id));
          ZB.confirm('删除专家', '确定删除「' + e.name + '」？', () => {
            db().experts = db().experts.filter((x) => x.id !== e.id);
            ZB.save();
            ZB.toast('已删除');
            refresh();
          });
        };
      });
    }
  };

  /* ================= 康养旅居 ================= */
  const travelFields = [
    { key: 'name', label: '产品名称', required: true, full: true },
    {
      key: 'type',
      label: '产品类型',
      type: 'select',
      options: ['旅居套餐', '特色住宿', '老年康养'].map((t) => ({ value: t, label: t }))
    },
    { key: 'price', label: '价格（元）', type: 'number', required: true, min: 0 },
    { key: 'unit', label: '计价单位', placeholder: '人 / 晚 / 月' },
    { key: 'stock', label: '库存', type: 'number', required: true, min: 0 },
    { key: 'status', label: '状态', type: 'select', options: [{ value: 'on', label: '上架' }, { value: 'off', label: '下架' }] },
    { key: 'desc', label: '产品说明', type: 'textarea', full: true }
  ];

  function editTravel(id) {
    const isNew = !id;
    const item = isNew
      ? { name: '', type: '旅居套餐', price: 0, unit: '人', stock: 0, sold: 0, status: 'on', desc: '' }
      : db().travel.find((x) => x.id === id);
    ZB.formModal(isNew ? '新增旅居产品' : '编辑旅居产品', travelFields, item, (v) => {
      if (isNew) db().travel.push(Object.assign({ id: Date.now(), sold: 0 }, v));
      else Object.assign(item, v);
      ZB.save();
      ZB.closeModal();
      ZB.toast(isNew ? '产品已新增' : '产品已保存');
      refresh();
    });
  }

  ZB.pages.travel = {
    group: '专家系统',
    title: '康养旅居',
    render() {
      const cols = [
        {
          title: '产品',
          render: (t) =>
            '<div class="cell-flex">' + ZB.thumb('#3b82f6', '旅') +
            '<div><div class="cell-name">' + esc(t.name) + '</div><div class="cell-sub">' + esc(t.desc) + '</div></div></div>'
        },
        { title: '类型', render: (t) => pill(t.type, t.type === '旅居套餐' ? 'pill-teal' : t.type === '特色住宿' ? 'pill-blue' : 'pill-purple') },
        { title: '价格', render: (t) => '<span class="td-money">' + money(t.price) + '</span><span class="td-muted"> /' + esc(t.unit) + '</span>' },
        { title: '库存', render: (t) => (t.stock === 0 ? pill('已售罄', 'pill-red') : String(t.stock)) },
        { title: '已售', cls: 'td-muted', render: (t) => num(t.sold) },
        { title: '状态', render: (t) => ZB.onOffPill(t.status) },
        {
          title: '操作',
          cls: 'td-nowrap',
          render: (t) =>
            '<span class="link-btn" data-act="tedit" data-id="' + t.id + '">编辑</span>' +
            '<span class="link-btn" data-act="ttoggle2" data-id="' + t.id + '">' + (t.status === 'on' ? '下架' : '上架') + '</span>' +
            '<span class="link-btn danger" data-act="tdel" data-id="' + t.id + '">删除</span>'
        }
      ];
      return (
        '<div class="card"><div class="table-toolbar">' +
        '<div class="card-title">旅居产品<small>共 ' + db().travel.length + ' 个</small></div>' +
        '<div class="toolbar-right"><button class="btn btn-primary" data-act="tnew">+ 新增产品</button></div></div>' +
        table(cols, db().travel) + '</div>'
      );
    },
    after() {
      document.querySelector('[data-act="tnew"]').onclick = () => editTravel();
      document.querySelectorAll('[data-act="tedit"]').forEach((el) => (el.onclick = () => editTravel(Number(el.dataset.id))));
      document.querySelectorAll('[data-act="ttoggle2"]').forEach((el) => {
        el.onclick = () => {
          const t = db().travel.find((x) => x.id === Number(el.dataset.id));
          t.status = t.status === 'on' ? 'off' : 'on';
          ZB.save();
          ZB.toast(t.status === 'on' ? '产品已上架' : '产品已下架');
          refresh();
        };
      });
      document.querySelectorAll('[data-act="tdel"]').forEach((el) => {
        el.onclick = () => {
          const t = db().travel.find((x) => x.id === Number(el.dataset.id));
          ZB.confirm('删除产品', '确定删除「' + t.name + '」？', () => {
            db().travel = db().travel.filter((x) => x.id !== t.id);
            ZB.save();
            ZB.toast('已删除');
            refresh();
          });
        };
      });
    }
  };

  /* ================= 消息中心 ================= */
  ZB.state.messages = { tab: 'all' };

  const messageFields = [
    { key: 'title', label: '消息标题', required: true, full: true },
    {
      key: 'type',
      label: '消息类型',
      type: 'select',
      options: ['活动通知', '健康资讯', '订单通知', '系统通知', '门店通知', '积分通知'].map((t) => ({ value: t, label: t }))
    },
    { key: 'target', label: '发送对象', placeholder: '如：全部会员' },
    { key: 'content', label: '消息内容', type: 'textarea', required: true, full: true }
  ];

  function editMessage(id) {
    const isNew = !id;
    const item = isNew ? { title: '', type: '活动通知', target: '全部会员', content: '', status: '草稿' } : db().messages.find((m) => m.id === id);
    ZB.formModal(isNew ? '新建消息' : '编辑消息', messageFields, item, (v) => {
      if (isNew) db().messages.unshift(Object.assign({ id: Date.now(), status: '草稿', createdAt: Date.now() }, v));
      else Object.assign(item, v);
      ZB.save();
      ZB.closeModal();
      ZB.toast(isNew ? '消息已保存为草稿' : '消息已保存');
      refresh();
    });
  }

  function previewMessage(id) {
    const m = db().messages.find((x) => x.id === id);
    ZB.modal({
      title: '消息预览',
      body:
        '<div class="detail-row"><span class="detail-label">标题</span><span class="detail-value" style="font-weight:600">' + esc(m.title) + '</span></div>' +
        '<div class="detail-row"><span class="detail-label">类型</span><span class="detail-value">' + esc(m.type) + '</span></div>' +
        '<div class="detail-row"><span class="detail-label">发送对象</span><span class="detail-value">' + esc(m.target) + '</span></div>' +
        '<div class="detail-row"><span class="detail-label">状态</span><span class="detail-value">' +
        (m.status === '已发送' ? pill('已发送', 'pill-green') : pill('草稿', 'pill-gray')) + '</span></div>' +
        '<div class="section-title">正文</div>' +
        '<p style="font-size:13.5px;line-height:1.9;color:#5a6b7c;padding:6px 0 12px">' + esc(m.content) + '</p>',
      foot: '<button class="btn btn-ghost" data-close>关闭</button>'
    });
  }

  ZB.pages.messages = {
    group: '基础信息维护',
    title: '消息中心',
    render() {
      const st = ZB.state.messages;
      const all = db().messages;
      const tabItems = [
        { key: 'all', label: '全部', count: all.length },
        { key: '已发送', label: '已发送', count: all.filter((m) => m.status === '已发送').length },
        { key: '草稿', label: '草稿箱', count: all.filter((m) => m.status === '草稿').length }
      ];
      const rows = all.filter((m) => st.tab === 'all' || m.status === st.tab).slice().sort((a, b) => b.createdAt - a.createdAt);

      const cols = [
        {
          title: '消息',
          render: (m) =>
            '<div><div class="cell-name">' + esc(m.title) + '</div><div class="cell-sub">' + esc(m.content.slice(0, 26)) + (m.content.length > 26 ? '…' : '') + '</div></div>'
        },
        { title: '类型', render: (m) => pill(m.type, 'pill-blue') },
        { title: '发送对象', cls: 'td-muted', render: (m) => esc(m.target) },
        { title: '状态', render: (m) => (m.status === '已发送' ? pill('已发送', 'pill-green') : pill('草稿', 'pill-gray')) },
        { title: '创建时间', cls: 'td-muted td-nowrap', render: (m) => ZB.fmtTime(m.createdAt) },
        {
          title: '操作',
          cls: 'td-nowrap',
          render: (m) => {
            let acts = '<span class="link-btn" data-act="mpreview" data-id="' + m.id + '">预览</span>';
            if (m.status === '草稿') acts += '<span class="link-btn" data-act="msend" data-id="' + m.id + '">发送</span>';
            acts += '<span class="link-btn" data-act="medit" data-id="' + m.id + '">编辑</span>';
            acts += '<span class="link-btn danger" data-act="mdel" data-id="' + m.id + '">删除</span>';
            return acts;
          }
        }
      ];

      return (
        '<div class="card"><div class="table-toolbar">' + ZB.tabs(tabItems, st.tab) +
        '<div class="toolbar-right"><button class="btn btn-primary" data-act="mnew">+ 新建消息</button></div></div>' +
        table(cols, rows, '暂无消息') + '</div>'
      );
    },
    after() {
      const st = ZB.state.messages;
      document.querySelectorAll('[data-tab]').forEach((el) => {
        el.onclick = () => {
          st.tab = el.dataset.tab;
          refresh();
        };
      });
      document.querySelector('[data-act="mnew"]').onclick = () => editMessage();
      document.querySelectorAll('[data-act="mpreview"]').forEach((el) => (el.onclick = () => previewMessage(Number(el.dataset.id))));
      document.querySelectorAll('[data-act="medit"]').forEach((el) => (el.onclick = () => editMessage(Number(el.dataset.id))));
      document.querySelectorAll('[data-act="msend"]').forEach((el) => {
        el.onclick = () => {
          const m = db().messages.find((x) => x.id === Number(el.dataset.id));
          ZB.confirm('发送消息', '确定向「' + m.target + '」发送「' + m.title + '」？', () => {
            m.status = '已发送';
            m.createdAt = Date.now();
            ZB.save();
            ZB.toast('消息已发送');
            refresh();
          });
        };
      });
      document.querySelectorAll('[data-act="mdel"]').forEach((el) => {
        el.onclick = () => {
          const m = db().messages.find((x) => x.id === Number(el.dataset.id));
          ZB.confirm('删除消息', '确定删除「' + m.title + '」？', () => {
            db().messages = db().messages.filter((x) => x.id !== m.id);
            ZB.save();
            ZB.toast('已删除');
            refresh();
          });
        };
      });
    }
  };

  /* ================= 系统设置 ================= */
  ZB.pages.settings = {
    group: '基础信息维护',
    title: '系统管理',
    render() {
      const s = db().settings;
      return (
        '<div class="grid-2 equal" style="margin-top:0">' +
        '<div class="card"><div class="card-head"><div class="card-title">基础信息</div></div>' +
        '<label class="field"><span>商城名称</span><input id="set-shopName" value="' + esc(s.shopName) + '" /></label>' +
        '<label class="field"><span>客服电话</span><input id="set-contact" value="' + esc(s.contact) + '" /></label>' +
        '<label class="field"><span>服务时间</span><input id="set-serviceTime" value="' + esc(s.serviceTime) + '" /></label>' +
        '</div>' +
        '<div class="card"><div class="card-head"><div class="card-title">交易规则</div></div>' +
        '<label class="field"><span>包邮门槛（元）</span><input id="set-freeShipping" type="number" value="' + s.freeShipping + '" /></label>' +
        '<label class="field"><span>自动确认收货（天）</span><input id="set-autoConfirmDays" type="number" value="' + s.autoConfirmDays + '" /></label>' +
        '<label class="field"><span>积分兑换比例（1 元 = ? 积分）</span><input id="set-pointsRate" type="number" value="' + s.pointsRate + '" /></label>' +
        '</div></div>' +
        '<div class="card"><div class="card-head"><div class="card-title">功能开关</div></div>' +
        '<div class="setting-row"><div><div class="setting-name">消息通知</div>' +
        '<div class="setting-desc">开启后向会员推送活动与订单消息</div></div>' +
        '<div class="switch' + (s.noticeEnabled ? ' on' : '') + '" data-switch="noticeEnabled"></div></div>' +
        '<div class="setting-row"><div><div class="setting-name">发票功能</div>' +
        '<div class="setting-desc">允许会员在下单时申请电子发票</div></div>' +
        '<div class="switch' + (s.invoiceEnabled ? ' on' : '') + '" data-switch="invoiceEnabled"></div></div>' +
        '</div>' +
        '<div class="card"><div class="card-head"><div class="card-title">数据管理</div></div>' +
        '<div class="setting-row"><div><div class="setting-name">本地演示数据</div>' +
        '<div class="setting-desc">后台数据保存在本浏览器 localStorage，可一键恢复初始数据</div></div>' +
        '<button class="btn btn-danger btn-sm" id="btn-reset">恢复初始数据</button></div>' +
        '<div class="setting-row"><div><div class="setting-name">保存设置</div>' +
        '<div class="setting-desc">修改基础信息与交易规则后请点击保存</div></div>' +
        '<button class="btn btn-primary" id="btn-save">保存设置</button></div></div>'
      );
    },
    after() {
      const s = db().settings;
      document.querySelectorAll('[data-switch]').forEach((el) => {
        el.onclick = () => {
          const key = el.dataset.switch;
          s[key] = !s[key];
          ZB.save();
          el.classList.toggle('on', s[key]);
          ZB.toast('设置已更新');
        };
      });
      document.querySelector('#btn-save').onclick = () => {
        s.shopName = document.querySelector('#set-shopName').value.trim();
        s.contact = document.querySelector('#set-contact').value.trim();
        s.serviceTime = document.querySelector('#set-serviceTime').value.trim();
        s.freeShipping = Number(document.querySelector('#set-freeShipping').value) || 0;
        s.autoConfirmDays = Number(document.querySelector('#set-autoConfirmDays').value) || 0;
        s.pointsRate = Number(document.querySelector('#set-pointsRate').value) || 1;
        ZB.save();
        ZB.toast('设置已保存');
      };
      document.querySelector('#btn-reset').onclick = () => {
        ZB.confirm('恢复初始数据', '将清空当前所有修改并恢复演示数据，确定继续？', () => {
          ZB.reset();
          ZB.toast('已恢复初始数据');
          refresh();
        });
      };
    }
  };
})();
