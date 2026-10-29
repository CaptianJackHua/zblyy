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

export const quickEntries = [
  { id: 1, name: '智慧健康', icon: 'dumbbell', path: '/modules/smart-health/index', color: '#e0f7f5', textColor: '#2ec4b6' },
  { id: 2, name: '健康服务', icon: 'hospital', path: '/modules/health-service/index', color: '#e8f4fd', textColor: '#3b82f6' },
  { id: 3, name: '养生体验', icon: 'leaf', path: '/modules/health-preserve/index', color: '#fef3e2', textColor: '#f59e0b' },
  { id: 4, name: '康养旅居', icon: 'mountain', path: '/modules/health-travel/index', color: '#fce4ec', textColor: '#e91e63' }
];

export const contentBanners = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800',
    title: '秋季养生节',
    desc: '院内理疗项目 8 折起',
    path: '/modules/activity/detail?id=1'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    title: '云南康养之旅',
    desc: '7 天 6 晚套餐限时抢购',
    path: '/modules/activity/detail?id=2'
  }
];

export const healthModules = [
  { id: 1, name: '健康档案', icon: 'clipboard', desc: '个人健康数据', path: '/modules/health-archive/index' },
  { id: 2, name: '健康评估', icon: 'chart', desc: '风险测评问卷', path: '/modules/health-assessment/index' },
  { id: 3, name: '设备管理', icon: 'watch', desc: '智能穿戴绑定', path: '/modules/device-manage/index' },
  { id: 4, name: '我的报告', icon: 'file', desc: '体检检测报告', path: '/modules/health-report/index' }
];

export const memberBenefits = [
  { id: 1, name: '我的会员权益', desc: '查看等级与特权', path: '/modules/member/index' },
  { id: 2, name: '亲友关怀服务', desc: '为亲友办理康养', path: '/modules/member/family-care' },
  { id: 3, name: '积分与礼遇', desc: '积分查询兑换', path: '/modules/member/points' }
];

export const activityCards = [
  {
    id: 1,
    type: 'travel',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
    title: '度假旅居',
    desc: '云南 · 大理 7 天 6 晚康养之旅',
    price: 6880,
    originalPrice: 8880,
    tag: '限时特惠',
    path: '/modules/activity/detail?id=1'
  },
  {
    id: 2,
    type: 'hotel',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    title: '特色住宿',
    desc: '安吉竹海康养酒店 3 天 2 晚',
    price: 1999,
    originalPrice: 2880,
    tag: '含早餐',
    path: '/modules/activity/detail?id=2'
  }
];

export const shopProducts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
    name: '智能健康手环 Pro',
    spec: '尊享版 / 曜石黑',
    price: 299,
    originalPrice: 399,
    sold: 1234
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    name: '便携式血压计',
    spec: '上臂式 / 标准版',
    price: 188,
    originalPrice: 258,
    sold: 892
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?w=400',
    name: '艾灸养生套装',
    spec: '十盒装 / 温经散寒',
    price: 129,
    originalPrice: 198,
    sold: 2156
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400',
    name: '助眠香薰礼盒',
    spec: '薰衣草 / 安神助眠',
    price: 159,
    originalPrice: 229,
    sold: 678
  }
];

export const newsList = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400',
    title: '秋季养生：5 个小动作让你气血充盈',
    summary: '秋季是养生的黄金季节，中医推荐这几个简单的日常养生方法...',
    time: '2026-10-28',
    views: 1234
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
    title: '高血压患者的饮食注意事项',
    summary: '科学饮食对于控制血压至关重要，这些食物建议多吃...',
    time: '2026-10-27',
    views: 2891
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400',
    title: '如何选择适合自己的运动方式',
    summary: '不同年龄、不同体质的人，运动方式的选择也大有讲究...',
    time: '2026-10-26',
    views: 1567
  }
];

export const storeList = [
  { id: 1, name: '中兵康养中心（朝阳店）', address: '北京市朝阳区建国路 88 号', distance: 2.3, tel: '010-88888888' },
  { id: 2, name: '中兵康养中心（海淀店）', address: '北京市海淀区中关村大街 1 号', distance: 5.8, tel: '010-66666666' },
  { id: 3, name: '中兵康养中心（东城店）', address: '北京市东城区东长安街 100 号', distance: 8.1, tel: '010-77777777' }
];
