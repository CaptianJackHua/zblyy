/* 中兵康养商城后台 · 演示数据种子 */
(function () {
  const now = Date.now();
  const DAY = 86400000;
  const daysAgo = (n, h) => now - n * DAY + (h || 0) * 3600000;

  const products = [
    { id: 1, name: '智能健康手环 Pro', spec: '尊享版 / 曜石黑', price: 299, originalPrice: 399, stock: 320, sold: 1234, category: '智能穿戴', tag: '热销', status: 'on', color: '#2ec4b6', desc: '全天候心率、血氧、睡眠监测，数据自动同步健康档案。', createdAt: daysAgo(120) },
    { id: 2, name: '便携式血压计', spec: '上臂式 / 标准版', price: 188, originalPrice: 258, stock: 186, sold: 892, category: '智能穿戴', tag: '新品', status: 'on', color: '#3b82f6', desc: '医用级测量精度，一键测量并自动记录。', createdAt: daysAgo(96) },
    { id: 3, name: '艾灸养生套装', spec: '十盒装 / 温经散寒', price: 129, originalPrice: 198, stock: 540, sold: 2156, category: '养生保健', tag: '', status: 'on', color: '#f59e0b', desc: '精选陈年艾绒，温和渗透，居家温经散寒。', createdAt: daysAgo(88) },
    { id: 4, name: '助眠香薰礼盒', spec: '薰衣草 / 安神助眠', price: 159, originalPrice: 229, stock: 92, sold: 736, category: '助眠产品', tag: '', status: 'on', color: '#8b5cf6', desc: '天然植物精油，睡前扩香，改善入睡困难。', createdAt: daysAgo(75) },
    { id: 5, name: '颈椎按摩仪', spec: '家用 / 热敷款', price: 369, originalPrice: 499, stock: 148, sold: 968, category: '理疗仪器', tag: '热销', status: 'on', color: '#ef4444', desc: '脉冲 + 热敷双模式，缓解颈肩僵硬。', createdAt: daysAgo(64) },
    { id: 6, name: '灵芝孢子粉', spec: '60 袋 / 破壁', price: 465, originalPrice: 598, stock: 210, sold: 412, category: '营养补充', tag: '新品', status: 'on', color: '#0f9b8e', desc: '破壁灵芝孢子粉，增强免疫，日常调养。', createdAt: daysAgo(52) },
    { id: 7, name: '即食燕窝', spec: '6 瓶 / 冰糖', price: 399, originalPrice: 499, stock: 76, sold: 528, category: '营养补充', tag: '', status: 'on', color: '#ec4899', desc: '马来西亚溯源燕窝，开盖即食。', createdAt: daysAgo(45) },
    { id: 8, name: '复合益生菌', spec: '30 条 / 成人款', price: 198, originalPrice: 268, stock: 260, sold: 634, category: '营养补充', tag: '', status: 'on', color: '#22c55e', desc: '多菌株复合配方，调节肠道菌群平衡。', createdAt: daysAgo(38) },
    { id: 9, name: '益母草蜂蜜', spec: '500g / 天然原蜜', price: 88, originalPrice: 128, stock: 380, sold: 1520, category: '养生保健', tag: '', status: 'on', color: '#eab308', desc: '益母草蜜源，温润滋养，女性日常调理。', createdAt: daysAgo(30) },
    { id: 10, name: '恒温足浴盆', spec: '折叠 / 按摩款', price: 259, originalPrice: 359, stock: 0, sold: 288, category: '理疗仪器', tag: '', status: 'off', color: '#64748b', desc: '恒温加热 + 气泡按摩，折叠收纳不占地。', createdAt: daysAgo(22) }
  ];

  const pById = (id) => products.find((p) => p.id === id);
  const item = (id, qty) => {
    const p = pById(id);
    return { name: p.name, spec: p.spec, price: p.price, qty: qty, color: p.color };
  };

  const orderSeed = [
    ['张先生', '138****8888', '北京市朝阳区建国路 88 号中兵康养中心', [[1, 1], [3, 2]], 'pending', 0, 2, '微信支付'],
    ['李女士', '139****2233', '北京市海淀区中关村大街 1 号 3 单元 501', [[5, 1]], 'pending', 0, 5, '支付宝'],
    ['王阿姨', '137****6677', '北京市东城区东直门内大街 12 号', [[6, 1], [8, 2]], 'pending', 0, 9, '微信支付'],
    ['刘先生', '135****1122', '北京市西城区金融街 9 号院 2 号楼', [[2, 1]], 'paid', 1, 10, '微信支付'],
    ['陈女士', '136****8899', '北京市朝阳区望京 SOHO T1 1806', [[7, 2]], 'paid', 1, 14, '支付宝'],
    ['赵先生', '150****3344', '北京市丰台区南三环西路 16 号', [[3, 3], [9, 1]], 'paid', 1, 18, '微信支付'],
    ['孙女士', '188****5566', '北京市朝阳区三里屯太古里北区 8 号', [[4, 1], [9, 2]], 'shipped', 2, 11, '微信支付'],
    ['周先生', '133****9900', '北京市海淀区西二旗领秀新硅谷 5 号', [[1, 1], [8, 1]], 'shipped', 2, 15, '支付宝'],
    ['吴女士', '186****4433', '北京市昌平区回龙观龙泽苑 22 号', [[5, 1], [4, 1]], 'shipped', 3, 9, '微信支付'],
    ['郑先生', '159****7788', '北京市大兴区亦庄经济开发区科创五街', [[6, 1]], 'done', 3, 16, '微信支付'],
    ['冯女士', '138****1234', '北京市石景山区鲁谷路 45 号', [[3, 2]], 'done', 4, 10, '支付宝'],
    ['何先生', '137****5566', '北京市通州区梨园镇云景东路', [[9, 4]], 'done', 4, 13, '微信支付'],
    ['许女士', '135****7788', '北京市顺义区后沙峪裕祥花园 7 号', [[2, 1], [4, 1]], 'done', 5, 11, '微信支付'],
    ['邓先生', '188****2211', '北京市房山区长阳镇碧桂园 3 号', [[1, 1]], 'done', 5, 17, '支付宝'],
    ['曹女士', '133****6677', '北京市门头沟区永定镇冯村嘉园', [[7, 1], [3, 1]], 'done', 6, 10, '微信支付'],
    ['彭先生', '150****4433', '北京市怀柔区开放路 12 号', [[5, 1]], 'done', 6, 15, '支付宝'],
    ['苏女士', '186****9900', '北京市密云区鼓楼东大街 8 号', [[8, 3]], 'cancelled', 2, 12, '微信支付'],
    ['卢先生', '159****1122', '北京市平谷区府前街 21 号', [[9, 2]], 'cancelled', 5, 9, '支付宝']
  ];

  let seq = 1000;
  const orders = orderSeed.map((o) => {
    const items = o[3].map((it) => item(it[0], it[1]));
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    seq += 37;
    const ts = daysAgo(o[5], o[6]);
    return {
      id: 'o' + seq,
      no: 'ZB' + String(2026000000 + seq).slice(-10),
      user: o[0],
      phone: o[1],
      address: o[2],
      items: items,
      total: total,
      status: o[4],
      payMethod: o[7],
      createdAt: ts
    };
  });

  const members = [
    { id: 1, name: '张先生', phone: '138****8888', level: '金卡', points: 1355, coins: 700, orders: 12, spent: 4860, joinDate: daysAgo(320), status: 'on' },
    { id: 2, name: '李女士', phone: '139****2233', level: '银卡', points: 860, coins: 200, orders: 7, spent: 2180, joinDate: daysAgo(240), status: 'on' },
    { id: 3, name: '王阿姨', phone: '137****6677', level: '钻石', points: 4260, coins: 3200, orders: 31, spent: 15600, joinDate: daysAgo(680), status: 'on' },
    { id: 4, name: '刘先生', phone: '135****1122', level: '普通', points: 320, coins: 0, orders: 2, spent: 376, joinDate: daysAgo(60), status: 'on' },
    { id: 5, name: '陈女士', phone: '136****8899', level: '银卡', points: 1180, coins: 500, orders: 9, spent: 3120, joinDate: daysAgo(190), status: 'on' },
    { id: 6, name: '赵先生', phone: '150****3344', level: '普通', points: 150, coins: 0, orders: 1, spent: 476, joinDate: daysAgo(24), status: 'on' },
    { id: 7, name: '孙女士', phone: '188****5566', level: '金卡', points: 2450, coins: 1500, orders: 18, spent: 7980, joinDate: daysAgo(410), status: 'on' },
    { id: 8, name: '周先生', phone: '133****9900', level: '银卡', points: 640, coins: 300, orders: 5, spent: 1690, joinDate: daysAgo(130), status: 'off' }
  ];

  const coupons = [
    { id: 1, title: '新客首单券', amount: 20, threshold: 199, scope: '商城通用', total: 5000, claimed: 3280, used: 1960, start: '2026-10-01', end: '2026-11-30', status: 'on' },
    { id: 2, title: '智能穿戴专享券', amount: 30, threshold: 299, scope: '智能穿戴品类', total: 2000, claimed: 1420, used: 830, start: '2026-10-15', end: '2026-11-15', status: 'on' },
    { id: 3, title: '养生保健满减券', amount: 60, threshold: 599, scope: '养生保健品类', total: 1500, claimed: 960, used: 412, start: '2026-10-20', end: '2026-11-20', status: 'on' },
    { id: 4, title: '会员回馈券', amount: 15, threshold: 99, scope: '商城通用', total: 8000, claimed: 7310, used: 6890, start: '2026-08-01', end: '2026-09-30', status: 'off' },
    { id: 5, title: '双十一预热券', amount: 40, threshold: 399, scope: '商城通用', total: 10000, claimed: 8260, used: 4020, start: '2026-10-25', end: '2026-11-11', status: 'on' }
  ];

  const gifts = [
    { id: 1, name: '智能健康手环', points: 2000, stock: 50, exchanged: 18, color: '#2ec4b6', desc: '心率血氧监测，运动睡眠记录', status: 'on' },
    { id: 2, name: '艾灸养生套装', points: 800, stock: 120, exchanged: 64, color: '#f59e0b', desc: '传统艾灸疗法，温经通络', status: 'on' },
    { id: 3, name: '养生茶礼盒', points: 500, stock: 200, exchanged: 132, color: '#22c55e', desc: '精选草本茶饮，四季养生', status: 'on' },
    { id: 4, name: '电子血压计', points: 1500, stock: 60, exchanged: 21, color: '#3b82f6', desc: '家用精准测量，健康管理必备', status: 'on' },
    { id: 5, name: '按摩靠垫', points: 1200, stock: 0, exchanged: 40, color: '#8b5cf6', desc: '腰部热敷按摩，久坐放松', status: 'off' },
    { id: 6, name: '养生足浴包', points: 300, stock: 300, exchanged: 208, color: '#ec4899', desc: '艾草足浴，驱寒助眠', status: 'on' }
  ];

  const exchangeRecords = [
    { id: 'e1', member: '张先生', phone: '138****8888', gift: '养生茶礼盒', points: 500, address: '张先生 138****8888 北京市朝阳区建国路 88 号', status: '待发货', createdAt: daysAgo(0, 3) },
    { id: 'e2', member: '王阿姨', phone: '137****6677', gift: '智能健康手环', points: 2000, address: '王阿姨 137****6677 北京市东城区东直门内大街 12 号', status: '待发货', createdAt: daysAgo(1, 5) },
    { id: 'e3', member: '陈女士', phone: '136****8899', gift: '艾灸养生套装', points: 800, address: '陈女士 136****8899 北京市朝阳区望京 SOHO T1', status: '已发货', createdAt: daysAgo(3, 2) },
    { id: 'e4', member: '孙女士', phone: '188****5566', gift: '养生足浴包', points: 300, address: '孙女士 188****5566 北京市朝阳区三里屯太古里北区', status: '已完成', createdAt: daysAgo(6, 4) }
  ];

  const stores = [
    { id: 1, name: '中兵康养中心（朝阳旗舰店）', tag: '旗舰店', rating: 4.9, address: '北京市朝阳区建国路 88 号 SOHO 现代城 A 座 2 层', tel: '010-88888888', hours: '09:00 - 21:00', status: 'on', services: [['针灸调理', 168, '约 40 分钟'], ['推拿按摩', 198, '约 45 分钟'], ['艾灸温养', 128, '约 40 分钟'], ['拔罐祛湿', 88, '约 20 分钟'], ['中药熏蒸', 158, '约 30 分钟'], ['康复理疗', 268, '约 60 分钟']] },
    { id: 2, name: '中兵康养中心（海淀店）', tag: '', rating: 4.8, address: '北京市海淀区中关村大街 18 号科贸大厦 6 层', tel: '010-66668888', hours: '09:00 - 20:30', status: 'on', services: [['针灸调理', 158, '约 40 分钟'], ['推拿按摩', 188, '约 45 分钟'], ['艾灸温养', 118, '约 40 分钟'], ['拔罐祛湿', 78, '约 20 分钟']] },
    { id: 3, name: '中兵康养中心（东城店）', tag: '试营业', rating: 4.7, address: '北京市东城区东直门内大街 68 号', tel: '010-55556666', hours: '10:00 - 21:30', status: 'on', services: [['推拿按摩', 178, '约 45 分钟'], ['艾灸温养', 108, '约 40 分钟'], ['康复理疗', 248, '约 60 分钟']] },
    { id: 4, name: '中兵康养中心（西城店）', tag: '', rating: 4.6, address: '北京市西城区金融街 9 号院 B 座 3 层', tel: '010-44445555', hours: '09:30 - 20:00', status: 'off', services: [['针灸调理', 168, '约 40 分钟'], ['中药熏蒸', 148, '约 30 分钟']] }
  ];

  const experts = [
    { id: 1, name: '李明远', title: '主任医师', org: '北京中医药大学附属医院', rating: 4.9, price: 199, types: '图文/电话/视频', orders: 1286, status: 'on', good: '中医内科、失眠调理、脾胃' },
    { id: 2, name: '王秀华', title: '副主任医师', org: '中国中医科学院广安门医院', rating: 4.8, price: 159, types: '图文/电话', orders: 986, status: 'on', good: '妇科调理、内分泌、更年期' },
    { id: 3, name: '陈建国', title: '主任医师', org: '北京协和医院', rating: 4.9, price: 299, types: '图文/视频', orders: 2140, status: 'on', good: '心血管、高血压、慢病管理' },
    { id: 4, name: '刘雅静', title: '营养师', org: '中兵康养健康管理中心', rating: 4.7, price: 99, types: '图文', orders: 742, status: 'on', good: '膳食营养、体重管理、三高饮食' },
    { id: 5, name: '赵国强', title: '康复治疗师', org: '中兵康养康复中心', rating: 4.8, price: 129, types: '图文/电话', orders: 528, status: 'on', good: '术后康复、颈肩腰腿痛' },
    { id: 6, name: '孙梅', title: '心理咨询师', org: '中兵康养心理中心', rating: 4.6, price: 189, types: '电话/视频', orders: 316, status: 'off', good: '情绪管理、睡眠障碍、老年心理' }
  ];

  const travel = [
    { id: 1, name: '北戴河 7 日康养旅居', type: '旅居套餐', price: 3980, unit: '人', stock: 60, sold: 38, status: 'on', desc: '海景公寓 + 每日养生餐 + 中医理疗 3 次' },
    { id: 2, name: '巴马 15 日长寿之乡旅居', type: '旅居套餐', price: 6980, unit: '人', stock: 40, sold: 26, status: 'on', desc: '长寿村居住 + 山泉水 + 每周健康监测' },
    { id: 3, name: '三亚海棠湾温泉公寓', type: '特色住宿', price: 680, unit: '晚', stock: 120, sold: 96, status: 'on', desc: '海景温泉房，含双早与温泉票' },
    { id: 4, name: '安吉竹海康养民宿', type: '特色住宿', price: 480, unit: '晚', stock: 80, sold: 54, status: 'on', desc: '竹林独栋，含药膳晚餐与晨间太极' },
    { id: 5, name: '失能老人专业照护（月）', type: '老年康养', price: 8800, unit: '月', stock: 30, sold: 12, status: 'on', desc: '24 小时护理 + 康复训练 + 三甲医院绿色通道' },
    { id: 6, name: '认知症长者照护（月）', type: '老年康养', price: 12800, unit: '月', stock: 20, sold: 7, status: 'on', desc: '认知训练 + 营养膳食 + 专属护理师' }
  ];

  /* 文章管理：对应小程序「健康资讯」 */
  const articles = [
    { id: 1, title: '秋季养生：5 个小动作让你气血充盈', category: '养生知识', summary: '秋季是养生的黄金季节，中医推荐这几个简单的日常养生方法，帮助您调理身体，预防疾病。', content: '秋季阳气渐收、阴气渐长，养生重在「收」。每天坚持梳头、揉腹、搓腰、按足三里、踮脚 5 个小动作，每次 3-5 分钟，可促进气血运行，改善手脚冰凉与疲劳感。', cover: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400', source: '中兵康养', author: '健康编辑部', views: 1234, status: 'published', createdAt: daysAgo(1, 3) },
    { id: 2, title: '高血压患者的饮食注意事项', category: '疾病预防', summary: '科学饮食对于控制血压至关重要，这些食物建议多吃，那些食物尽量少吃，一起来看看。', content: '控盐是核心，每日食盐不超过 5 克；多吃富含钾的蔬菜水果，如菠菜、香蕉、土豆；限制动物内脏与油炸食品；戒烟限酒，规律作息。', cover: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400', source: '健康时报', author: '王医生', views: 2891, status: 'published', createdAt: daysAgo(2, 5) },
    { id: 3, title: '如何选择适合自己的运动方式', category: '健康科普', summary: '不同年龄、不同体质的人，运动方式的选择也大有讲究，快来看看怎么选。', content: '年轻人可选中高强度有氧与力量训练；中老年更适合快走、太极、八段锦；慢病人群运动前应咨询医生，遵循循序渐进、量力而行的原则。', cover: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400', source: '中兵康养', author: '运动康复中心', views: 1567, status: 'published', createdAt: daysAgo(3, 2) },
    { id: 4, title: '2026 中国康养产业发展报告发布', category: '行业动态', summary: '最新报告显示，中国康养产业市场规模已突破 10 万亿元，年增长率持续保持在 15% 以上。', content: '报告指出，康养产业正从单一养老服务向「医、养、旅、居」融合发展，智慧健康管理与社区康养成为新的增长点。', cover: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400', source: '新华网', author: '产业观察', views: 3456, status: 'published', createdAt: daysAgo(4, 6) },
    { id: 5, title: '冬季如何科学进补？中医给出 5 点建议', category: '养生知识', summary: '冬令进补是传统养生方法，但并非人人适合，科学进补才能事半功倍。', content: '进补前先辨体质：气虚者补气、血虚者补血、阳虚者温阳；忌盲目大补；搭配适量运动与充足睡眠；慢病人群需在医师指导下进补。', cover: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', source: '中医养生', author: '李明远', views: 2134, status: 'published', createdAt: daysAgo(5, 4) },
    { id: 6, title: '睡眠不好？试试这 7 个改善睡眠的方法', category: '健康科普', summary: '好的睡眠是健康的基础，长期失眠会带来多种健康问题，一起来学习改善方法。', content: '固定作息时间、睡前 1 小时远离手机、卧室保持黑暗与安静、晚餐不过饱、适度运动、温水泡脚、必要时寻求专业帮助。', cover: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400', source: '中兵康养', author: '睡眠管理中心', views: 4521, status: 'published', createdAt: daysAgo(6, 8) },
    { id: 7, title: '中兵康养「暖冬计划」上线', category: '行业动态', summary: '面向 60 岁以上长者推出冬季康养旅居补贴，名额有限。', content: '暖冬计划包含三亚、巴马、昆明三条线路，含住宿、营养餐与健康监测，报名即可享专属补贴。', cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', source: '中兵康养', author: '运营中心', views: 0, status: 'draft', createdAt: daysAgo(0, 2) }
  ];

  /* 到店服务项目：对应小程序「门店服务」 */
  const services = [
    { id: 1, name: '针灸调理', price: 168, duration: '约 40 分钟', desc: '疏通经络、缓解颈肩腰腿疼痛', icon: 'sparkles', orders: 186, status: 'on', storeIds: [1, 2, 3] },
    { id: 2, name: '推拿按摩', price: 198, duration: '约 45 分钟', desc: '全身经络推拿，放松肌肉与筋膜', icon: 'heart', orders: 254, status: 'on', storeIds: [1, 2, 3, 4] },
    { id: 3, name: '艾灸温养', price: 128, duration: '约 40 分钟', desc: '温经散寒、改善手脚冰凉与体虚', icon: 'leaf', orders: 302, status: 'on', storeIds: [1, 2, 3] },
    { id: 4, name: '拔罐祛湿', price: 88, duration: '约 20 分钟', desc: '祛湿排毒、缓解疲劳与肌肉酸痛', icon: 'shield', orders: 168, status: 'on', storeIds: [1, 2] },
    { id: 5, name: '中药熏蒸', price: 158, duration: '约 30 分钟', desc: '药浴熏蒸，改善睡眠与代谢', icon: 'timer', orders: 96, status: 'on', storeIds: [1, 3, 4] },
    { id: 6, name: '康复理疗', price: 268, duration: '约 60 分钟', desc: '仪器理疗 + 手法康复，术后调理', icon: 'stethoscope', orders: 74, status: 'off', storeIds: [1, 3, 4] }
  ];

  /* 服务订单：小程序专家咨询 / 预约产生的订单 */
  const serviceOrders = [
    { id: 'so-1001', no: 'SV2026010001', member: '张先生', phone: '138****8888', expertName: '周敏', typeName: '视频咨询', price: 299, dateLabel: '明天', time: '10:00', status: 'upcoming', createdAt: daysAgo(0, 4), source: 'mini' },
    { id: 'so-1002', no: 'SV2026010002', member: '李女士', phone: '139****2233', expertName: '陈立', typeName: '图文咨询', price: 89, dateLabel: '今天', time: '15:00', status: 'pending', createdAt: daysAgo(0, 6), source: 'mini' },
    { id: 'so-1003', no: 'SV2026010003', member: '王阿姨', phone: '137****6677', expertName: '刘婧', typeName: '电话咨询', price: 219, dateLabel: '今天', time: '09:00', status: 'done', createdAt: daysAgo(1, 2), source: 'mini' },
    { id: 'so-1004', no: 'SV2026010004', member: '刘先生', phone: '135****1122', expertName: '孙悦', typeName: '图文咨询', price: 109, dateLabel: '昨天', time: '20:00', status: 'cancelled', createdAt: daysAgo(2, 3), source: 'mini' },
    { id: 'so-1005', no: 'SV2026010005', member: '陈女士', phone: '136****8899', expertName: '赵鹏', typeName: '视频咨询', price: 279, dateLabel: '明天', time: '14:00', status: 'upcoming', createdAt: daysAgo(0, 2), source: 'mini' }
  ];

  /* 到店预约：小程序门店服务预约单 */
  const appointments = [
    { id: 'ap-1001', no: 'YY2026010001', member: '张先生', phone: '138****8888', storeName: '中兵康养中心（朝阳旗舰店）', serviceName: '针灸调理', price: 168, date: '今天', time: '10:00', status: 'pending', createdAt: daysAgo(0, 3), source: 'mini' },
    { id: 'ap-1002', no: 'YY2026010002', member: '李女士', phone: '139****2233', storeName: '中兵康养中心（海淀店）', serviceName: '推拿按摩', price: 198, date: '明天', time: '15:00', status: 'confirmed', createdAt: daysAgo(0, 5), source: 'mini' },
    { id: 'ap-1003', no: 'YY2026010003', member: '王阿姨', phone: '137****6677', storeName: '中兵康养中心（朝阳旗舰店）', serviceName: '艾灸温养', price: 128, date: '今天', time: '09:00', status: 'done', createdAt: daysAgo(1, 1), source: 'mini' },
    { id: 'ap-1004', no: 'YY2026010004', member: '孙女士', phone: '188****5566', storeName: '中兵康养中心（东城店）', serviceName: '中药熏蒸', price: 158, date: '昨天', time: '16:30', status: 'cancelled', createdAt: daysAgo(2, 4), source: 'mini' }
  ];

  const messages = [
    { id: 1, title: '双十一健康狂欢开启', type: '活动通知', content: '全场满 399 减 40，会员再享 95 折，活动截止 11 月 11 日。', target: '全部会员', status: '已发送', createdAt: daysAgo(1, 2) },
    { id: 2, title: '秋季养生指南已更新', type: '健康资讯', content: '秋季润燥、护肺、早睡晚起，点击查看完整养生建议。', target: '全部会员', status: '已发送', createdAt: daysAgo(2, 6) },
    { id: 3, title: '您的订单已发货', type: '订单通知', content: '订单 ZB3266465385 已由顺丰发出，请注意查收。', target: '指定会员', status: '已发送', createdAt: daysAgo(3, 4) },
    { id: 4, title: '会员权益升级公告', type: '系统通知', content: '钻石会员新增免费体检 1 次与专属健康管家服务。', target: '金卡及以上', status: '草稿', createdAt: daysAgo(4, 3) },
    { id: 5, title: '朝阳店本周义诊活动', type: '门店通知', content: '本周六 10:00-16:00 朝阳旗舰店免费中医义诊，欢迎预约。', target: '北京地区会员', status: '已发送', createdAt: daysAgo(5, 5) },
    { id: 6, title: '积分兑换上新', type: '积分通知', content: '积分商城新增艾灸套装、养生茶礼盒，快去兑换吧。', target: '全部会员', status: '草稿', createdAt: daysAgo(7, 2) }
  ];

  const tasks = [
    { id: 1, name: '每日签到', points: 10, desc: '每日登录打卡', enabled: true, done: 3280 },
    { id: 2, name: '锻炼打卡', points: 30, desc: '跑步或运动 30 分钟', enabled: true, done: 1860 },
    { id: 3, name: '日行一善', points: 20, desc: '今天做了一件好事', enabled: true, done: 1240 },
    { id: 4, name: '陪伴孩子', points: 20, desc: '陪孩子阅读或游戏 30 分钟', enabled: true, done: 980 },
    { id: 5, name: '陪伴老人', points: 30, desc: '陪伴父母聊天或散步', enabled: true, done: 1520 },
    { id: 6, name: '健康饮食', points: 15, desc: '少油少盐，按时吃饭', enabled: true, done: 760 },
    { id: 7, name: '早睡早起', points: 15, desc: '23 点前入睡', enabled: false, done: 430 }
  ];

  const settings = {
    shopName: '中兵康养商城',
    contact: '400-888-6666',
    serviceTime: '09:00 - 21:00',
    freeShipping: 99,
    autoConfirmDays: 7,
    noticeEnabled: true,
    pointsRate: 1,
    invoiceEnabled: true
  };

  const aftersales = [
    {
      id: 'as-1001',
      no: 'AS2026001001',
      orderNo: 'ZB2026001000',
      orderId: 'o1000',
      member: '张先生',
      phone: '138****8888',
      type: 'refund_only',
      status: 'pending',
      reason: '商品质量问题',
      description: '收到的健康手环无法开机，申请仅退款。',
      amount: 299,
      items: [{ productId: 1, name: '智能健康手环 Pro', spec: '尊享版 / 曜石黑', price: 299, qty: 1, color: '#2ec4b6' }],
      returnLogistics: null,
      exchangeLogistics: null,
      auditReply: '',
      createdAt: daysAgo(0, 5),
      updatedAt: daysAgo(0, 5)
    },
    {
      id: 'as-1002',
      no: 'AS2026001002',
      orderNo: 'ZB2026001037',
      orderId: 'o1037',
      member: '李女士',
      phone: '139****2233',
      type: 'return_refund',
      status: 'approved',
      reason: '商品与描述不符',
      description: '实际颜色与页面描述不一致，需要退货。',
      amount: 129,
      items: [{ productId: 3, name: '艾灸养生套装', spec: '十盒装 / 温经散寒', price: 129, qty: 1, color: '#f59e0b' }],
      returnLogistics: null,
      exchangeLogistics: null,
      auditReply: '同意退货退款，请尽快寄回商品。',
      createdAt: daysAgo(1, 3),
      updatedAt: daysAgo(0, 8)
    },
    {
      id: 'as-1003',
      no: 'AS2026001003',
      orderNo: 'ZB2026001074',
      orderId: 'o1074',
      member: '王阿姨',
      phone: '137****6677',
      type: 'exchange',
      status: 'buyer_shipped',
      reason: '发错货',
      description: '收到的型号不对，需要换货。',
      amount: 399,
      items: [{ productId: 5, name: '经络按摩仪', spec: '多功能 / 充电款', price: 399, qty: 1, color: '#8b5cf6' }],
      returnLogistics: { company: '顺丰速运', no: 'SF9876543210', time: daysAgo(0, 2) },
      exchangeLogistics: null,
      auditReply: '同意换货，收到后将为您换出正确型号。',
      createdAt: daysAgo(2, 4),
      updatedAt: daysAgo(0, 2)
    },
    {
      id: 'as-1004',
      no: 'AS2026001004',
      orderNo: 'ZB2026001111',
      orderId: 'o1111',
      member: '刘先生',
      phone: '135****1122',
      type: 'refund_only',
      status: 'done',
      reason: '不想要了',
      description: '下单后改变主意，未发货，申请仅退款。',
      amount: 159,
      items: [{ productId: 4, name: '助眠香薰礼盒', spec: '薰衣草 / 安神助眠', price: 159, qty: 1, color: '#ec4899' }],
      returnLogistics: null,
      exchangeLogistics: null,
      auditReply: '同意退款。',
      createdAt: daysAgo(4, 6),
      updatedAt: daysAgo(3, 2)
    }
  ];

  window.ZBSeed = {
    products: products,
    orders: orders,
    outbounds: [],
    aftersales: aftersales,
    members: members,
    coupons: coupons,
    gifts: gifts,
    exchangeRecords: exchangeRecords,
    stores: stores,
    experts: experts,
    travel: travel,
    articles: articles,
    services: services,
    serviceOrders: serviceOrders,
    appointments: appointments,
    messages: messages,
    tasks: tasks,
    settings: settings
  };
})();
