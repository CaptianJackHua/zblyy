import { reactive } from 'vue';
import type { MallProduct } from '@/data/mall';

export interface CartItem {
  id: number;
  name: string;
  spec: string;
  price: number;
  image: string;
  qty: number;
  selected: boolean;
}

export interface OrderItem {
  id: number;
  name: string;
  spec: string;
  price: number;
  image: string;
  qty: number;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'done';

export interface MallOrder {
  id: string;
  no: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  address: string;
  createdAt: number;
}

const STORAGE_KEY = 'zb-mall-state';

export const mallState = reactive<{
  cart: CartItem[];
  orders: MallOrder[];
  checkout: OrderItem[];
}>({
  cart: [],
  orders: [],
  checkout: []
});

/** 商城内部三个板块（商城 / 购物车 / 我的）当前选中的板块 */
export const mallUi = reactive<{ section: 'mall' | 'cart' | 'mine' }>({ section: 'mall' });

const restore = () => {
  try {
    const saved = uni.getStorageSync(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      mallState.cart = data.cart || [];
      mallState.orders = data.orders || [];
    }
  } catch (e) {
    // 忽略本地缓存异常
  }
};

const persist = () => {
  uni.setStorageSync(STORAGE_KEY, JSON.stringify({ cart: mallState.cart, orders: mallState.orders }));
};

restore();

export const addToCart = (product: MallProduct, qty = 1) => {
  const exist = mallState.cart.find((i) => i.id === product.id);
  if (exist) {
    exist.qty += qty;
  } else {
    mallState.cart.push({
      id: product.id,
      name: product.name,
      spec: product.spec,
      price: product.price,
      image: product.image,
      qty,
      selected: true
    });
  }
  persist();
};

export const removeFromCart = (id: number) => {
  mallState.cart = mallState.cart.filter((i) => i.id !== id);
  persist();
};

export const setCartQty = (id: number, qty: number) => {
  const item = mallState.cart.find((i) => i.id === id);
  if (item) {
    item.qty = Math.max(1, qty);
    persist();
  }
};

export const toggleCartItem = (id: number) => {
  const item = mallState.cart.find((i) => i.id === id);
  if (item) item.selected = !item.selected;
};

export const toggleAllCart = (selected: boolean) => {
  mallState.cart.forEach((i) => (i.selected = selected));
};

export const cartCount = () => mallState.cart.reduce((sum, i) => sum + i.qty, 0);

export const selectedCartItems = () => mallState.cart.filter((i) => i.selected);

export const selectedCartTotal = () =>
  selectedCartItems().reduce((sum, i) => sum + i.price * i.qty, 0);

export const setCheckout = (items: OrderItem[]) => {
  mallState.checkout = items;
};

export const checkoutTotal = () => mallState.checkout.reduce((sum, i) => sum + i.price * i.qty, 0);

export const createOrder = (address: string, discount = 0): MallOrder => {
  const now = Date.now();
  const order: MallOrder = {
    id: `O${now}`,
    no: `ZB${now.toString().slice(-10)}`,
    items: mallState.checkout.map((i) => ({ ...i })),
    total: Math.max(0, checkoutTotal() - discount),
    status: 'pending',
    address,
    createdAt: now
  };
  mallState.orders.unshift(order);
  persist();
  return order;
};

export const payOrder = (id: string) => {
  const order = mallState.orders.find((o) => o.id === id);
  if (order) {
    order.status = 'paid';
    persist();
  }
};

export const shipOrder = (id: string) => {
  const order = mallState.orders.find((o) => o.id === id);
  if (order) {
    order.status = 'shipped';
    persist();
  }
};

export const finishOrder = (id: string) => {
  const order = mallState.orders.find((o) => o.id === id);
  if (order) {
    order.status = 'done';
    persist();
  }
};

export const cancelOrder = (id: string) => {
  mallState.orders = mallState.orders.filter((o) => o.id !== id);
  persist();
};

export const getOrder = (id: string) => mallState.orders.find((o) => o.id === id);

export const orderStatusText = (status: OrderStatus) =>
  ({ pending: '待付款', paid: '待发货', shipped: '待收货', done: '已完成' }[status]);
