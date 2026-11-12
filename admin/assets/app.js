/* 中兵康养商城后台 · 登录 / 导航 / 路由 */
(function () {
  const ZB = window.ZB;

  const MENU = [
    {
      group: '概览',
      items: [{ key: 'dashboard', label: '数据概览', icon: 'dashboard' }]
    },
    {
      group: '基础信息维护',
      items: [
        { key: 'articles', label: '文章管理', icon: 'article' },
        { key: 'messages', label: '消息中心', icon: 'message' },
        { key: 'members', label: '用户管理', icon: 'member' },
        { key: 'settings', label: '系统管理', icon: 'setting' }
      ]
    },
    {
      group: '商城管理',
      items: [
        { key: 'products', label: '商品管理', icon: 'product' },
        { key: 'points-shop', label: '积分商城', icon: 'gift' },
        { key: 'orders', label: '订单管理', icon: 'order' },
        { key: 'aftersales', label: '售后管理', icon: 'message' },
        { key: 'outbounds', label: '出库管理', icon: 'product' },
        { key: 'coupons', label: '优惠券', icon: 'coupon' }
      ]
    },
    {
      group: '专家系统',
      items: [
        { key: 'services', label: '服务管理', icon: 'service' },
        { key: 'experts', label: '专家管理', icon: 'expert' },
        { key: 'service-orders', label: '服务订单', icon: 'order' },
        { key: 'appointments', label: '预约系统', icon: 'calendar' },
        { key: 'stores', label: '门店管理', icon: 'store' },
        { key: 'travel', label: '康养旅居', icon: 'travel' }
      ]
    }
  ];

  let current = 'dashboard';
  let logged = false;

  function readHash() {
    const h = (location.hash || '').replace(/^#\/?/, '');
    return h || 'dashboard';
  }

  function renderNav() {
    const paid = window.ZBBridge ? window.ZBBridge.paidCount() : 0;
    document.getElementById('nav').innerHTML = MENU.map(
      (g) =>
        '<div class="nav-group">' + g.group + '</div>' +
        g.items
          .map(
            (it) =>
              '<div class="nav-item' + (it.key === current ? ' active' : '') + '" data-nav="' + it.key + '">' +
              ZB.icon(it.icon) + '<span>' + it.label + '</span>' +
              (it.key === 'orders' && paid ? '<span class="nav-badge">' + paid + '</span>' : '') +
              '</div>'
          )
          .join('')
    ).join('');

    document.querySelectorAll('[data-nav]').forEach((el) => {
      el.onclick = () => {
        if (readHash() === el.dataset.nav) renderPage(el.dataset.nav);
        else location.hash = '#/' + el.dataset.nav;
      };
    });
  }

  function findPage(key) {
    for (let i = 0; i < MENU.length; i++) {
      const it = MENU[i].items.filter((x) => x.key === key)[0];
      if (it) return { group: MENU[i].group, item: it };
    }
    return null;
  }

  function renderPage(key) {
    const page = ZB.pages[key];
    const meta = findPage(key);
    if (!page || !meta) {
      location.hash = '#/dashboard';
      return;
    }
    current = key;
    if (key === 'orders' && window.ZBBridge) window.ZBBridge.pullOrders();
    if (key === 'aftersales' && window.ZBBridge) window.ZBBridge.pullAftersales();
    if ((key === 'service-orders' || key === 'appointments') && window.ZBBridge) {
      window.ZBBridge.pullServiceOrders();
      window.ZBBridge.pullAppointments();
    }
    document.getElementById('crumb-group').textContent = page.group;
    document.getElementById('crumb-page').textContent = page.title;
    renderNav();

    const view = document.getElementById('view');
    view.innerHTML = page.render();
    if (page.after) page.after();

    /* 概览页内的快捷跳转 */
    document.querySelectorAll('[data-act="go"]').forEach((el) => {
      el.onclick = () => (location.hash = '#/' + el.dataset.page);
    });
  }

  function showApp() {
    document.getElementById('login').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    const added = window.ZBBridge ? window.ZBBridge.pullOrders() : 0;
    const asAdded = window.ZBBridge ? window.ZBBridge.pullAftersales() : 0;
    const svAdded = window.ZBBridge ? window.ZBBridge.pullServiceOrders() : 0;
    const apAdded = window.ZBBridge ? window.ZBBridge.pullAppointments() : 0;
    renderPage(readHash());
    if (added) ZB.toast('收到 ' + added + ' 笔小程序新订单');
    if (asAdded) setTimeout(() => ZB.toast('收到 ' + asAdded + ' 笔售后申请'), 1500);
    if (svAdded || apAdded) setTimeout(() => ZB.toast('收到 ' + (svAdded + apAdded) + ' 笔服务预约'), 2600);
  }

  function showLogin() {
    document.getElementById('app').classList.add('hidden');
    document.getElementById('login').classList.remove('hidden');
    document.getElementById('login-pass').value = '';
    document.getElementById('login-pass').focus();
  }

  /* ---------- 登录 ---------- */
  document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value;
    const err = document.getElementById('login-error');
    if (user === 'admin' && pass === '123456') {
      err.textContent = '';
      try {
        sessionStorage.setItem(ZB.SESSION_KEY, '1');
      } catch (e2) {
        /* ignore */
      }
      logged = true;
      ZB.load();
      showApp();
      ZB.toast('欢迎回来，管理员');
    } else {
      err.textContent = '账号或密码错误，请使用演示账号 admin / 123456';
    }
  });

  document.getElementById('btn-logout').onclick = () => {
    try {
      sessionStorage.removeItem(ZB.SESSION_KEY);
    } catch (e) {
      /* ignore */
    }
    showLogin();
  };

  /* ---------- 初始化 ---------- */
  ZB.load();
  if (window.ZBBridge) {
    window.ZBBridge.publishProducts();
    window.ZBBridge.publishArticles();
    window.ZBBridge.publishServices();
    window.ZBBridge.publishStores();
    window.ZBBridge.publishExperts();
  }
  ZB.setRefresh(() => renderPage(current));

  const week = ['日', '一', '二', '三', '四', '五', '六'];
  const d = new Date();
  document.getElementById('topbar-date').textContent =
    d.getFullYear() + ' 年 ' + (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日 · 星期' + week[d.getDay()];

  let sessionOn = false;
  try {
    sessionOn = sessionStorage.getItem(ZB.SESSION_KEY) === '1';
  } catch (e) {
    /* ignore */
  }
  logged = sessionOn;

  window.addEventListener('hashchange', () => {
    if (!logged) return;
    renderPage(readHash());
  });

  if (logged) showApp();
  else showLogin();
})();
