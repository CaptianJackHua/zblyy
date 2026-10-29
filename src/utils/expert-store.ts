import { reactive } from 'vue';
import { getExpert, type ConsultKey } from '@/data/experts';

export type ApptStatus = 'pending' | 'upcoming' | 'ready' | 'done';

export interface Appointment {
  id: string;
  expertId: number;
  expertName: string;
  expertRole: string;
  type: ConsultKey;
  typeName: string;
  price: number;
  dateLabel: string;
  time: string;
  startAt: number;
  paid: boolean;
  finished: boolean;
  createdAt: number;
}

const STORAGE_KEY = 'zb-expert-appointments';

export const expertState = reactive<{ appointments: Appointment[] }>({ appointments: [] });

const restore = () => {
  try {
    const saved = uni.getStorageSync(STORAGE_KEY);
    if (saved) expertState.appointments = JSON.parse(saved) || [];
  } catch (e) {
    // 忽略本地缓存异常
  }
};

const persist = () => {
  uni.setStorageSync(STORAGE_KEY, JSON.stringify(expertState.appointments));
};

restore();

export const appointmentStatus = (a: Appointment): ApptStatus => {
  if (!a.paid) return 'pending';
  if (a.finished) return 'done';
  const now = Date.now();
  if (now < a.startAt) return 'upcoming';
  if (now < a.startAt + 60 * 60 * 1000) return 'ready';
  return 'done';
};

export const statusText = (status: ApptStatus) =>
  ({ pending: '待支付', upcoming: '待开始', ready: '可咨询', done: '已完成' }[status]);

export const createAppointment = (params: {
  expertId: number;
  type: ConsultKey;
  dateLabel: string;
  time: string;
  startAt: number;
}) => {
  const expert = getExpert(params.expertId);
  if (!expert) return null;
  const consult = expert.consultTypes.find((t) => t.key === params.type) || expert.consultTypes[0];
  const appt: Appointment = {
    id: `A${Date.now()}`,
    expertId: expert.id,
    expertName: expert.name,
    expertRole: expert.role,
    type: consult.key,
    typeName: consult.name,
    price: consult.price,
    dateLabel: params.dateLabel,
    time: params.time,
    startAt: params.startAt,
    paid: false,
    finished: false,
    createdAt: Date.now()
  };
  expertState.appointments.unshift(appt);
  persist();
  return appt;
};

export const payAppointment = (id: string) => {
  const appt = expertState.appointments.find((a) => a.id === id);
  if (appt) {
    appt.paid = true;
    persist();
  }
};

export const finishAppointment = (id: string) => {
  const appt = expertState.appointments.find((a) => a.id === id);
  if (appt) {
    appt.finished = true;
    persist();
  }
};

export const getAppointment = (id: string) => expertState.appointments.find((a) => a.id === id);

export const sortedAppointments = () =>
  [...expertState.appointments].sort((a, b) => b.createdAt - a.createdAt);
