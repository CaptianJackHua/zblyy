// 商城优惠券数据（演示用，本地固定数据）
export interface Coupon {
  id: number;
  title: string;
  amount: number;
  threshold: number;
  scope: string;
  expire: string;
  status: 'available' | 'used' | 'expired';
}

export const coupons: Coupon[] = [
  { id: 1, title: '新客首单券', amount: 20, threshold: 199, scope: '商城通用', expire: '2026-11-30', status: 'available' },
  { id: 2, title: '智能穿戴专享券', amount: 30, threshold: 299, scope: '智能穿戴品类', expire: '2026-11-15', status: 'available' },
  { id: 3, title: '养生保健满减券', amount: 60, threshold: 599, scope: '养生保健品类', expire: '2026-11-20', status: 'available' },
  { id: 4, title: '会员回馈券', amount: 15, threshold: 99, scope: '商城通用', expire: '2026-09-30', status: 'used' },
  { id: 5, title: '双十一预热券', amount: 40, threshold: 399, scope: '商城通用', expire: '2026-10-15', status: 'expired' }
];

export const availableCoupons = () => coupons.filter((c) => c.status === 'available');

/** 当前订单金额可用的最优券（满足门槛且减免最多） */
export const bestCouponFor = (total: number) =>
  availableCoupons()
    .filter((c) => total >= c.threshold)
    .sort((a, b) => b.amount - a.amount)[0];
