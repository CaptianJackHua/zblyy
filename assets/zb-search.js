/* 中兵康养演示版 · 小程序 H5 搜索增强
 * 注入到 zblyy/index.html，给文章/商品/专家/门店列表动态加搜索条
 */
(function () {
  'use strict';

  if (window.__zbSearchInjected) return;
  window.__zbSearchInjected = true;

  // 已知的"搜索目标"：根据 URL hash 和 DOM 特征匹配
  var SEARCH_TARGETS = [
    {
      // 资讯 / 文章列表
      match: function (url) { return url.indexOf('news') >= 0 || url.indexOf('article') >= 0; },
      placeholder: '搜索文章标题 / 摘要',
      // 文章列表项的选择器：uni-app 编译后通常是 uni-scroll-view 下的 uni-list-item 或 view
      itemSelector: '.uni-scroll-view-content > view, .uni-list-item'
    },
    {
      // 商品 / 商城列表
      match: function (url) { return url.indexOf('shop') >= 0 || url.indexOf('mall') >= 0 || url.indexOf('product') >= 0; },
      placeholder: '搜索商品名称',
      itemSelector: '.uni-scroll-view-content > view'
    },
    {
      // 专家列表
      match: function (url) { return url.indexOf('expert') >= 0; },
      placeholder: '搜索专家姓名 / 职称 / 擅长',
      itemSelector: '.uni-scroll-view-content > view'
    },
    {
      // 门店列表
      match: function (url) { return url.indexOf('store') >= 0; },
      placeholder: '搜索门店名称 / 地址',
      itemSelector: '.uni-scroll-view-content > view'
    },
    {
      // 首页（可能有多个列表，给商品区加一个）
      match: function (url) { return url === '/' || url.indexOf('pages/index') >= 0 || url === ''; },
      placeholder: '搜索全部内容',
      itemSelector: '.uni-scroll-view-content > view'
    }
  ];

  var currentTarget = null;
  var currentInput = null;

  function getCurrentTarget() {
    var hash = location.hash || location.pathname || '';
    for (var i = 0; i < SEARCH_TARGETS.length; i++) {
      if (SEARCH_TARGETS[i].match(hash)) return SEARCH_TARGETS[i];
    }
    return null;
  }

  function injectSearchBar() {
    // 搜索页可能不需要再加搜索框
    if (location.hash && location.hash.indexOf('search') >= 0) return;

    var target = getCurrentTarget();
    if (!target) return;

    // 找列表容器
    var lists = document.querySelectorAll('.uni-scroll-view-content');
    if (lists.length === 0) return;

    // 找第一个"长得像列表"的容器（有多个直接子元素）
    var listContainer = null;
    for (var i = 0; i < lists.length; i++) {
      if (lists[i].children && lists[i].children.length >= 2) {
        listContainer = lists[i];
        break;
      }
    }
    if (!listContainer) return;

    // 检查前面是否已经加过搜索框
    if (listContainer.parentNode && listContainer.parentNode.querySelector('.zb-search-bar')) return;

    // 创建搜索框
    var bar = document.createElement('div');
    bar.className = 'zb-search-bar';
    bar.style.cssText = 'padding:12px 16px;background:#fff;border-bottom:1px solid #eee;position:sticky;top:0;z-index:10;';
    bar.innerHTML =
      '<div style="display:flex;align-items:center;background:#f5f6f8;border-radius:20px;padding:0 12px;height:36px;">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2">' +
          '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.2-3.2"/>' +
        '</svg>' +
        '<input placeholder="' + target.placeholder + '" ' +
          'style="flex:1;border:none;outline:none;background:transparent;margin-left:8px;font-size:14px;color:#333;" />' +
      '</div>';

    // 插到列表容器前面
    listContainer.parentNode.insertBefore(bar, listContainer);

    var input = bar.querySelector('input');
    currentInput = input;
    currentTarget = target;

    // 过滤逻辑
    input.addEventListener('input', function () {
      var kw = (input.value || '').trim().toLowerCase();
      var items = listContainer.querySelectorAll(':scope > view, :scope > .uni-list-item');
      for (var j = 0; j < items.length; j++) {
        var text = (items[j].innerText || items[j].textContent || '').toLowerCase();
        if (!kw || text.indexOf(kw) >= 0) {
          items[j].style.display = '';
        } else {
          items[j].style.display = 'none';
        }
      }
    });
  }

  // 路由变化时重新注入（uni-app H5 的路由 hash 变化不会整页刷新）
  function onRouteChange() {
    currentTarget = null;
    currentInput = null;
    // 先清除旧搜索框
    var old = document.querySelectorAll('.zb-search-bar');
    for (var i = 0; i < old.length; i++) old[i].remove();
    // 等 DOM 更新
    setTimeout(injectSearchBar, 300);
  }

  // 监听 hashchange
  window.addEventListener('hashchange', onRouteChange);
  window.addEventListener('popstate', onRouteChange);

  // MutationObserver：持续监听 DOM，一旦检测到页面内容变化就尝试注入
  var mo = new MutationObserver(function () {
    injectSearchBar();
  });

  function start() {
    if (document.body) {
      mo.observe(document.body, { childList: true, subtree: true });
      setTimeout(injectSearchBar, 1000);
      setTimeout(injectSearchBar, 2500);
    } else {
      setTimeout(start, 100);
    }
  }

  start();
})();
