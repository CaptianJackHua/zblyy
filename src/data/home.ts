// 首页数据
export const bannerList = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    title: '山水为境',
    subtitle: '康养为本',
    tag: '健康生活'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    title: '中兵智慧健康',
    subtitle: 'AI 守护每一刻',
    tag: '智能科技'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    title: '康养旅居套餐',
    subtitle: '开启身心放松之旅',
    tag: '限时优惠'
  }
];

// 快捷入口 8 宫格
export const quickEntries = [
  { id: 1, name: '智慧健康', icon: 'pulse', path: '/modules/smart-health/index', color: '#e0f7f5', textColor: '#2ec4b6' },
  { id: 2, name: '专家服务', icon: 'stethoscope', path: '/modules/health-service/index', color: '#f3e8fd', textColor: '#8b5cf6' },
  { id: 3, name: '养生健康', icon: 'leaf', path: '/modules/health-preserve/index', color: '#e0f2e9', textColor: '#22c55e' },
  { id: 4, name: '康养旅居', icon: 'mountain', path: '/modules/health-travel/index', color: '#fce4ec', textColor: '#e91e63' },
  { id: 5, name: '健康评估', icon: 'chart', path: '/modules/health-assessment/index', color: '#e8f4fd', textColor: '#3b82f6' },
  { id: 6, name: '设备管理', icon: 'watch', path: '/modules/device-manage/index', color: '#fef3e2', textColor: '#f59e0b' },
  { id: 7, name: '疾病百科', icon: 'book', path: '/modules/news/index', color: '#e0f7f5', textColor: '#14b8a6' },
  { id: 8, name: '会员权益', icon: 'medal', path: '/modules/member/index', color: '#eef2f6', textColor: '#64748b' }
];

// 健康数据 - 绑定设备
export const healthDevice = {
  name: '中兵智能手表 S1',
  connected: true,
  synced: '同步于 2 分钟前',
  battery: 86,
  path: '/modules/device-manage/index'
};

// 健康数据 - 心率
export const heartRate = {
  value: 72,
  unit: '次/分',
  status: '正常',
  reference: '参考 60-100',
  bars: [34, 52, 68, 46, 88, 58, 74, 40, 96]
};

// 健康数据 - 指标
export const healthMetrics = [
  { id: 1, name: '血压', value: '118/75', unit: 'mmHg', bars: [40, 62, 48, 70, 56, 84, 50] },
  { id: 2, name: '血氧', value: '98', unit: '%', bars: [52, 44, 66, 58, 74, 62, 86] },
  { id: 3, name: '血糖', value: '5.6', unit: 'mmol/L', bars: [44, 58, 50, 68, 60, 78, 54] }
];

// 健康产品
export const shopProducts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400',
    name: '灵芝孢子粉',
    spec: '破壁灵芝 / 60g 礼盒装',
    price: 465,
    originalPrice: 599,
    sold: 1234,
    tag: '热卖'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400',
    name: '即食燕窝',
    spec: '冰糖燕窝 / 70g×6 瓶',
    price: 399,
    originalPrice: 499,
    sold: 892,
    tag: '新品'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400',
    name: '复合益生菌',
    spec: '300 亿活性菌 / 30 条装',
    price: 198,
    originalPrice: 258,
    sold: 2156,
    tag: '热卖'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400',
    name: '益母草蜂蜜',
    spec: '天然成熟蜜 / 500g',
    price: 88,
    originalPrice: 128,
    sold: 678,
    tag: ''
  }
];

// 健康资讯分类
export const newsTabs = ['推荐', '养生', '健康', '运动', '疫苗'];

export const newsList = [
  {
    id: 1,
    category: '养生',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400',
    title: '夏季健康管理指南：科学防暑，守护全家健康',
    summary: '夏季高温易引发中暑与心脑血管问题，掌握科学防暑方法，让全家人安然度夏...',
    time: '2026-10-28',
    views: 1234
  },
  {
    id: 2,
    category: '健康',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
    title: '高血压患者的饮食注意事项',
    summary: '科学饮食对于控制血压至关重要，这些食物建议多吃...',
    time: '2026-10-27',
    views: 2891
  },
  {
    id: 3,
    category: '运动',
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400',
    title: '如何选择适合自己的运动方式',
    summary: '不同年龄、不同体质的人，运动方式的选择也大有讲究...',
    time: '2026-10-26',
    views: 1567
  },
  {
    id: 4,
    category: '疫苗',
    image: 'https://images.unsplash.com/photo-1632053002928-1919605ee6f7?w=400',
    title: '流感疫苗接种季来临，这些人群建议优先接种',
    summary: '老年人、儿童与慢病患者是流感高风险人群，及时接种疫苗可有效降低重症风险...',
    time: '2026-10-25',
    views: 986
  }
];

export const storeList = [
  { id: 1, name: '中兵康养中心（朝阳店）', address: '北京市朝阳区建国路 88 号', distance: 2.3, tel: '010-88888888' },
  { id: 2, name: '中兵康养中心（海淀店）', address: '北京市海淀区中关村大街 1 号', distance: 5.8, tel: '010-66666666' },
  { id: 3, name: '中兵康养中心（东城店）', address: '北京市东城区东长安街 100 号', distance: 8.1, tel: '010-77777777' }
];
