export interface MallProduct {
  id: number;
  name: string;
  spec: string;
  price: number;
  originalPrice: number;
  sold: number;
  tag?: string;
  category: string;
  image: string;
  desc: string;
  features: string[];
}

export const mallCategories = ['全部', '智能穿戴', '养生保健', '理疗仪器', '助眠产品', '营养补充'];

export const products: MallProduct[] = [
  {
    id: 1,
    name: '智能健康手环 Pro',
    spec: '尊享版 / 曜石黑',
    price: 299,
    originalPrice: 399,
    sold: 1234,
    tag: '热销',
    category: '智能穿戴',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
    desc: '全天候心率、血氧、睡眠监测，数据自动同步中兵康养健康档案。',
    features: ['24 小时心率 / 血氧监测', '睡眠质量分析', '50 米防水', '14 天超长续航']
  },
  {
    id: 2,
    name: '便携式血压计',
    spec: '上臂式 / 标准版',
    price: 188,
    originalPrice: 258,
    sold: 892,
    tag: '新品',
    category: '智能穿戴',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    desc: '医用级测量精度，一键测量并自动记录，支持异常血压提醒。',
    features: ['医用级测量精度', '双人 198 组记忆', '不规则心跳提示', '大屏大字显示']
  },
  {
    id: 3,
    name: '艾灸养生套装',
    spec: '十盒装 / 温经散寒',
    price: 129,
    originalPrice: 198,
    sold: 2156,
    category: '养生保健',
    image: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?w=400',
    desc: '精选陈年艾绒，温和渗透，适合日常居家温经散寒、缓解疲劳。',
    features: ['三年陈艾绒', '无烟配方', '独立密封包装', '附穴位图册']
  },
  {
    id: 4,
    name: '助眠香薰礼盒',
    spec: '薰衣草 / 安神助眠',
    price: 159,
    originalPrice: 229,
    sold: 678,
    category: '助眠产品',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400',
    desc: '天然植物精油复配，睡前扩香 20 分钟，帮助放松身心、更快入睡。',
    features: ['纯植物精油', '无火香薰', '可持续 45 天', '礼盒装送人自用皆宜']
  },
  {
    id: 5,
    name: '经络按摩仪',
    spec: '多功能 / 充电款',
    price: 399,
    originalPrice: 599,
    sold: 456,
    tag: '限时特惠',
    category: '理疗仪器',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    desc: '六种按摩模式，模拟推拿手法，肩颈腰背多部位适用。',
    features: ['6 种按摩模式', '15 档力度调节', '热敷 + 脉冲双效', 'Type-C 快充']
  },
  {
    id: 6,
    name: '营养蛋白粉',
    spec: '500g / 香草味',
    price: 268,
    originalPrice: 368,
    sold: 1789,
    category: '营养补充',
    image: 'https://images.unsplash.com/photo-1559757148-6c3203a5bd3a?w=400',
    desc: '优质乳清蛋白，每份含 20g 蛋白，适合中老年及运动人群日常补充。',
    features: ['每份 20g 优质蛋白', '低糖低脂配方', '易冲泡不结块', '香草口味']
  },
  {
    id: 7,
    name: '颈椎按摩枕',
    spec: '记忆棉 / 护颈款',
    price: 199,
    originalPrice: 289,
    sold: 1063,
    category: '理疗仪器',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
    desc: '慢回弹记忆棉贴合颈椎曲线，日常午休与久坐放松都适用。',
    features: ['慢回弹记忆棉', '人体工学曲线', '可拆洗枕套', '附热敷袋']
  },
  {
    id: 8,
    name: '黑芝麻丸',
    spec: '九蒸九晒 / 低糖',
    price: 89,
    originalPrice: 139,
    sold: 3320,
    tag: '口碑好物',
    category: '养生保健',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400',
    desc: '九蒸九晒工艺，芝麻含量高，低糖配方，日常滋补更方便。',
    features: ['九蒸九晒工艺', '低糖不腻', '独立小包装', '每日 2 丸']
  }
];

export const getProduct = (id: number) => products.find((p) => p.id === id);
