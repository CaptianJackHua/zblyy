/* 中兵康养商城后台 · 基础层：数据存取 / 格式化 / 通用组件 / 图表 */
window.ZB = (function () {
  const DB_KEY = 'zb-admin-db-v1';
  const SESSION_KEY = 'zb-admin-session';

  const clone = (o) => JSON.parse(JSON.stringify(o));

  let db = null;

  function load() {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (raw) {
        db = JSON.parse(raw);
        // 数据迁移：补齐旧版本缺失的集合，避免新增模块无数据
        const seed = window.ZBSeed;
        Object.keys(seed).forEach((k) => {
          if (db[k] === undefined) {
            db[k] = clone(seed[k]);
          }
        });
        return db;
      }
    } catch (e) {
      /* ignore */
    }
    db = clone(window.ZBSeed);
    save();
    return db;
  }

  function save() {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch (e) {
      /* ignore */
    }
  }

  function reset() {
    db = clone(window.ZBSeed);
    save();
  }

  /* ---------- 格式化 ---------- */
  const pad = (n) => String(n).padStart(2, '0');

  function money(n) {
    const v = Number(n) || 0;
    return '¥' + v.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }

  function num(n) {
    return (Number(n) || 0).toLocaleString('en-US');
  }

  function fmtDate(ts) {
    const d = new Date(ts);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function fmtTime(ts) {
    const d = new Date(ts);
    return fmtDate(ts) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function fromNow(ts) {
    const diff = Date.now() - ts;
    const m = Math.floor(diff / 60000);
    if (m < 1) return '刚刚';
    if (m < 60) return m + ' 分钟前';
    const h = Math.floor(m / 60);
    if (h < 24) return h + ' 小时前';
    const d = Math.floor(h / 24);
    return d + ' 天前';
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ---------- 状态映射 ---------- */
  const ORDER_STATUS = {
    pending: { text: '待付款', cls: 'pill-orange' },
    paid: { text: '待发货', cls: 'pill-blue' },
    shipped: { text: '已发货', cls: 'pill-purple' },
    done: { text: '已完成', cls: 'pill-green' },
    cancelled: { text: '已取消', cls: 'pill-gray' }
  };

  const pill = (text, cls) => '<span class="pill ' + (cls || 'pill-gray') + '">' + text + '</span>';

  const orderPill = (s) => {
    const m = ORDER_STATUS[s] || { text: s, cls: 'pill-gray' };
    return pill(m.text, m.cls);
  };

  const onOffPill = (s) => (s === 'on' ? pill('已上架', 'pill-green') : pill('已下架', 'pill-gray'));

  /* ---------- 图标 ---------- */
  const ICONS = {
    dashboard:
      '<rect x="3" y="3" width="7" height="9" rx="1.6"/><rect x="14" y="3" width="7" height="5" rx="1.6"/><rect x="14" y="12" width="7" height="9" rx="1.6"/><rect x="3" y="16" width="7" height="5" rx="1.6"/>',
    order:
      '<path d="M6 2h9l4 4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/><path d="M14 2v5h5"/><path d="M8 13h8M8 17h5"/>',
    coupon:
      '<path d="M3 9a2 2 0 0 0 0 6v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3a2 2 0 0 1 0-6V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1z"/><path d="M13 5v14" stroke-dasharray="2 3"/>',
    product:
      '<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    gift:
      '<rect x="3" y="8" width="18" height="13" rx="1.5"/><path d="M3 12h18M12 8v13"/><path d="M12 8S9.5 3 7.2 4.2C4.8 5.5 6.8 8 12 8zM12 8s2.5-5 4.8-3.8C19.2 5.5 17.2 8 12 8z"/>',
    member:
      '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    store:
      '<path d="M3 9l1.5-5h15L21 9"/><path d="M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z"/><path d="M5 13v8h14v-8"/>',
    expert:
      '<path d="M9 3h6v4H9z"/><path d="M7 7h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"/><path d="M12 11v5M9.5 13.5h5"/>',
    travel:
      '<path d="M3 19l18-7-18-7 4 7z"/><path d="M7 12h14"/>',
    message:
      '<path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M8 10h8M8 13.5h5"/>',
    setting:
      '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.2-3.2"/>',
    article:
      '<path d="M5 3h10l4 4v14H5z"/><path d="M15 3v4h4"/><path d="M8 11h8M8 15h8M8 18h5"/>',
    service:
      '<circle cx="12" cy="7" r="3"/><path d="M6 21v-2a6 6 0 0 1 12 0v2"/><path d="M3 12h2M19 12h2"/>',
    calendar:
      '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M8 14h2M14 14h2M8 17h2"/>',
    empty: '<path d="M4 7h16v10H4z"/><path d="M4 7l3-3h10l3 3"/>'
  };

  const icon = (name) =>
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    (ICONS[name] || ICONS.dashboard) +
    '</svg>';

  /* ---------- Toast / Modal ---------- */
  let toastTimer = null;
  function toast(msg) {
    const box = document.getElementById('toast');
    if (!box) return;
    box.textContent = msg;
    box.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => box.classList.remove('show'), 1900);
  }

  function closeModal() {
    const root = document.getElementById('modal-root');
    if (root) root.innerHTML = '';
  }

  function modal(opts) {
    const root = document.getElementById('modal-root');
    root.innerHTML =
      '<div class="modal-mask" data-mask>' +
      '<div class="modal' + (opts.wide ? ' wide' : '') + '">' +
      '<div class="modal-head"><h3>' + escapeHtml(opts.title) + '</h3>' +
      '<button class="modal-close" data-close>&times;</button></div>' +
      '<div class="modal-body">' + (opts.body || '') + '</div>' +
      '<div class="modal-foot">' + (opts.foot || '') + '</div>' +
      '</div></div>';

    root.querySelectorAll('[data-close]').forEach((b) => (b.onclick = closeModal));
    root.querySelector('[data-mask]').addEventListener('mousedown', (e) => {
      if (e.target.hasAttribute('data-mask')) closeModal();
    });
    if (opts.onMount) opts.onMount(root);
  }

  /* 表单弹窗：fields = [{key,label,type,options,required,full,placeholder,step,min}] */
  function formModal(title, fields, values, onSubmit) {
    const val = values || {};
    const body = '<form id="modal-form" class="form-grid" autocomplete="off">' + fields
      .map((f) => {
        const v = val[f.key] == null ? '' : val[f.key];
        let input;
        if (f.type === 'select') {
          input =
            '<select name="' + f.key + '">' +
            f.options
              .map(
                (o) =>
                  '<option value="' + escapeHtml(o.value) + '"' +
                  (String(o.value) === String(v) ? ' selected' : '') +
                  '>' + escapeHtml(o.label) + '</option>'
              )
              .join('') +
            '</select>';
        } else if (f.type === 'textarea') {
          input = '<textarea name="' + f.key + '" placeholder="' + escapeHtml(f.placeholder || '') + '">' + escapeHtml(v) + '</textarea>';
        } else {
          input =
            '<input name="' + f.key + '" type="' + (f.type || 'text') + '" value="' + escapeHtml(v) + '"' +
            (f.step ? ' step="' + f.step + '"' : '') +
            (f.min != null ? ' min="' + f.min + '"' : '') +
            ' placeholder="' + escapeHtml(f.placeholder || '') + '" />';
        }
        return (
          '<label class="field' + (f.full ? ' full' : '') + '"><span>' + escapeHtml(f.label) +
          (f.required ? ' <em style="color:#ef4444;font-style:normal">*</em>' : '') +
          '</span>' + input + '</label>'
        );
      })
      .join('') + '</form>';

    modal({
      title: title,
      body: body,
      foot:
        '<button class="btn btn-ghost" data-cancel>取消</button>' +
        '<button class="btn btn-primary" id="modal-submit">确定</button>',
      onMount(root) {
        root.querySelector('[data-cancel]').onclick = closeModal;
        root.querySelector('#modal-submit').onclick = () => {
          const form = root.querySelector('#modal-form');
          const data = {};
          let ok = true;
          fields.forEach((f) => {
            if (!ok) return;
            const elx = form.elements[f.key];
            let v = elx.value;
            if (f.type === 'number') v = v === '' ? 0 : Number(v);
            data[f.key] = typeof v === 'string' ? v.trim() : v;
            if (f.required && (data[f.key] === '' || data[f.key] == null)) {
              toast('请填写「' + f.label + '」');
              ok = false;
            }
          });
          if (ok) onSubmit(data);
        };
      }
    });
  }

  function confirmModal(title, message, onOk) {
    modal({
      title: title,
      body: '<p style="font-size:13.5px;color:#5a6b7c;line-height:1.8;padding:6px 0 12px">' + escapeHtml(message) + '</p>',
      foot: '<button class="btn btn-ghost" data-cancel>取消</button><button class="btn btn-danger" id="modal-ok">确定</button>',
      onMount(root) {
        root.querySelector('[data-cancel]').onclick = closeModal;
        root.querySelector('#modal-ok').onclick = () => {
          closeModal();
          onOk();
        };
      }
    });
  }

  /* ---------- 表格 ---------- */
  /* cols: [{title, cls, render(row)}] */
  function table(cols, rows, emptyText) {
    if (!rows.length) {
      return '<div class="empty">' + icon('empty') + '<div>' + (emptyText || '暂无数据') + '</div></div>';
    }
    const head = '<thead><tr>' + cols.map((c) => '<th>' + c.title + '</th>').join('') + '</tr></thead>';
    const body =
      '<tbody>' +
      rows
        .map(
          (r) =>
            '<tr>' +
            cols
              .map((c) => '<td' + (c.cls ? ' class="' + c.cls + '"' : '') + '>' + c.render(r) + '</td>')
              .join('') +
            '</tr>'
        )
        .join('') +
      '</tbody>';
    return '<div class="table-wrap"><table>' + head + body + '</table></div>';
  }

  function searchBox(value, placeholder) {
    return (
      '<div class="search">' + icon('search') +
      '<input id="page-search" value="' + escapeHtml(value || '') + '" placeholder="' +
      escapeHtml(placeholder || '搜索') + '" /></div>'
    );
  }

  function tabs(items, active) {
    return (
      '<div class="tabs">' +
      items
        .map(
          (t) =>
            '<div class="tab' + (t.key === active ? ' active' : '') + '" data-tab="' + t.key + '">' +
            t.label + (t.count != null ? ' <span class="count">' + t.count + '</span>' : '') +
            '</div>'
        )
        .join('') +
      '</div>'
    );
  }

  function thumb(color, text) {
    return '<div class="thumb" style="background:' + color + '">' + escapeHtml(text) + '</div>';
  }

  /* ---------- 图表 ---------- */
  function lineChart(points, opts) {
    const o = opts || {};
    const w = 620;
    const h = 210;
    const pl = 48;
    const pr = 16;
    const pt = 16;
    const pb = 30;
    const max = Math.max.apply(null, points.map((p) => p.value).concat([1]));
    const stepX = (w - pl - pr) / Math.max(points.length - 1, 1);
    const y = (v) => pt + (h - pt - pb) * (1 - v / max);
    const coords = points.map((p, i) => [pl + i * stepX, y(p.value)]);
    const line = coords.map((c, i) => (i ? 'L' : 'M') + c[0].toFixed(1) + ' ' + c[1].toFixed(1)).join(' ');
    const area = line + ' L ' + coords[coords.length - 1][0].toFixed(1) + ' ' + (h - pb) + ' L ' + pl + ' ' + (h - pb) + ' Z';

    const grid = [0, 0.25, 0.5, 0.75, 1]
      .map((r) => {
        const gy = pt + (h - pt - pb) * r;
        const label = Math.round(max * (1 - r));
        return (
          '<line x1="' + pl + '" y1="' + gy + '" x2="' + (w - pr) + '" y2="' + gy + '" stroke="#f0f4f7"/>' +
          '<text x="' + (pl - 10) + '" y="' + (gy + 4) + '" text-anchor="end" font-size="11" fill="#93a1b0">' + label + '</text>'
        );
      })
      .join('');

    const dots = coords
      .map(
        (c, i) =>
          '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="3.5" fill="#fff" stroke="#2ec4b6" stroke-width="2">' +
          '<title>' + points[i].label + '：' + money(points[i].value) + '</title></circle>' +
          '<text x="' + c[0] + '" y="' + (h - 10) + '" text-anchor="middle" font-size="11" fill="#93a1b0">' + points[i].label + '</text>'
      )
      .join('');

    return (
      '<div class="chart-wrap"><svg viewBox="0 0 ' + w + ' ' + h + '" style="width:100%;height:auto">' +
      '<defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#2ec4b6" stop-opacity="0.28"/>' +
      '<stop offset="100%" stop-color="#2ec4b6" stop-opacity="0.01"/></linearGradient></defs>' +
      grid +
      '<path d="' + area + '" fill="url(#lg)"/>' +
      '<path d="' + line + '" fill="none" stroke="#2ec4b6" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      dots +
      '</svg></div>'
    );
  }

  function donutChart(items) {
    const total = items.reduce((s, i) => s + i.value, 0) || 1;
    const r = 54;
    const c = 2 * Math.PI * r;
    let offset = 0;
    const arcs = items
      .map((it) => {
        const len = (it.value / total) * c;
        const seg =
          '<circle cx="70" cy="70" r="' + r + '" fill="none" stroke="' + it.color + '" stroke-width="22" ' +
          'stroke-dasharray="' + len + ' ' + (c - len) + '" stroke-dashoffset="' + -offset + '" ' +
          'transform="rotate(-90 70 70)"><title>' + it.label + '：' + it.value + '</title></circle>';
        offset += len;
        return seg;
      })
      .join('');

    const legend = items
      .map(
        (it) =>
          '<div class="donut-legend-item"><i style="background:' + it.color + '"></i>' +
          '<span>' + it.label + '</span><span>' + Math.round((it.value / total) * 100) + '%</span></div>'
      )
      .join('');

    return (
      '<div class="donut-row"><svg viewBox="0 0 140 140" style="width:140px;height:140px;flex-shrink:0">' +
      '<circle cx="70" cy="70" r="' + r + '" fill="none" stroke="#f1f5f9" stroke-width="22"/>' +
      arcs +
      '<text x="70" y="66" text-anchor="middle" font-size="19" font-weight="700" fill="#1f2d3d">' + total + '</text>' +
      '<text x="70" y="84" text-anchor="middle" font-size="11" fill="#93a1b0">总销量</text>' +
      '</svg><div class="donut-legend">' + legend + '</div></div>'
    );
  }

  return {
    DB_KEY: DB_KEY,
    SESSION_KEY: SESSION_KEY,
    load: load,
    save: save,
    reset: reset,
    get db() {
      return db;
    },
    money: money,
    num: num,
    fmtDate: fmtDate,
    fmtTime: fmtTime,
    fromNow: fromNow,
    escapeHtml: escapeHtml,
    pill: pill,
    orderPill: orderPill,
    onOffPill: onOffPill,
    icon: icon,
    toast: toast,
    modal: modal,
    closeModal: closeModal,
    formModal: formModal,
    confirm: confirmModal,
    table: table,
    searchBox: searchBox,
    tabs: tabs,
    thumb: thumb,
    lineChart: lineChart,
    donutChart: donutChart,
    ORDER_STATUS: ORDER_STATUS,
    pages: {},
    state: {},
    refresh: function () {}
  };
})();
