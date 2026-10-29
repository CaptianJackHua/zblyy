export type ConsultKey = 'text' | 'phone' | 'video';

export interface ConsultType {
  key: ConsultKey;
  name: string;
  duration: string;
  price: number;
  desc: string;
}

export interface Expert {
  id: number;
  name: string;
  role: string;
  title: string;
  years: number;
  rating: number;
  tags: string[];
  intro: string;
  avatarBg: string;
  consultTypes: ConsultType[];
}

const baseTypes = (text: number, phone: number, video: number): ConsultType[] => [
  { key: 'text', name: '图文咨询', duration: '30 分钟', price: text, desc: '文字留言，专家 30 分钟内回复' },
  { key: 'phone', name: '电话咨询', duration: '20 分钟', price: phone, desc: '专家来电，一对一沟通' },
  { key: 'video', name: '视频咨询', duration: '30 分钟', price: video, desc: '视频连线，面对面问诊' }
];

export const experts: Expert[] = [
  {
    id: 1,
    name: '周敏',
    role: '心理咨询师',
    title: '国家二级心理咨询师',
    years: 10,
    rating: 4.9,
    tags: ['焦虑情绪', '睡眠障碍', '压力管理'],
    intro: '从事心理咨询工作 10 年，累计个案时长 3000+ 小时，擅长认知行为疗法，帮助来访者缓解焦虑、改善睡眠。',
    avatarBg: '#d7f5f0',
    consultTypes: baseTypes(99, 199, 299)
  },
  {
    id: 2,
    name: '陈立',
    role: '心理咨询师',
    title: '心理健康顾问',
    years: 8,
    rating: 4.8,
    tags: ['亲子关系', '情绪疏导', '职场压力'],
    intro: '专注家庭与亲子关系咨询 8 年，擅长以家庭系统视角帮助家庭成员改善沟通方式、重建亲密关系。',
    avatarBg: '#e3eefc',
    consultTypes: baseTypes(89, 179, 269)
  },
  {
    id: 3,
    name: '刘婧',
    role: '健康管理师',
    title: '高级健康管理师',
    years: 12,
    rating: 4.9,
    tags: ['慢病管理', '体重管理', '体检解读'],
    intro: '12 年健康管理经验，服务企业高管与慢病人群 2000+，擅长结合体检数据制定个性化健康改善方案。',
    avatarBg: '#e8f7dd',
    consultTypes: baseTypes(129, 219, 319)
  },
  {
    id: 4,
    name: '赵鹏',
    role: '健康管理师',
    title: '健康管理师',
    years: 6,
    rating: 4.7,
    tags: ['亚健康调理', '运动指导', '作息管理'],
    intro: '专注亚健康人群的生活方式干预 6 年，从作息、运动、饮食三个维度帮助用户恢复精力状态。',
    avatarBg: '#fdf0dc',
    consultTypes: baseTypes(99, 189, 279)
  },
  {
    id: 5,
    name: '孙悦',
    role: '营养师',
    title: '注册营养师',
    years: 9,
    rating: 4.9,
    tags: ['膳食搭配', '三高饮食', '减脂餐'],
    intro: '注册营养师，9 年临床营养与膳食指导经验，擅长为三高人群、减脂人群设计可执行的一周食谱。',
    avatarBg: '#ffe9e3',
    consultTypes: baseTypes(109, 199, 289)
  },
  {
    id: 6,
    name: '吴涛',
    role: '营养师',
    title: '公共营养师',
    years: 7,
    rating: 4.8,
    tags: ['孕产营养', '儿童营养', '中老年营养'],
    intro: '专注孕产与儿童营养 7 年，擅长分阶段营养补充建议，帮助家庭建立科学的饮食结构。',
    avatarBg: '#efe8fd',
    consultTypes: baseTypes(99, 179, 269)
  }
];

export const getExpert = (id: number) => experts.find((e) => e.id === id);
