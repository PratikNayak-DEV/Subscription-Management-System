import { create } from 'zustand';

export const CATEGORIES = {
  entertainment: { label: 'Entertainment', color: '#6366F1', bg: '#EEF2FF' },
  music: { label: 'Music', color: '#0EA5E9', bg: '#E0F2FE' },
  productivity: { label: 'Productivity', color: '#10B981', bg: '#D1FAE5' },
  gaming: { label: 'Gaming', color: '#F59E0B', bg: '#FEF3C7' },
  health: { label: 'Health', color: '#EC4899', bg: '#FCE7F3' },
  cloud: { label: 'Cloud', color: '#8B5CF6', bg: '#EDE9FE' },
  news: { label: 'News', color: '#64748B', bg: '#F1F5F9' },
  other: { label: 'Other', color: '#71717A', bg: '#F4F4F5' },
};

const INITIAL_SUBS = [
  { id: '1', name: 'Netflix', price: 15.99, cycle: 'Monthly', category: 'entertainment', nextBill: '2026-05-12', icon: '🎬', color: '#E50914' },
  { id: '2', name: 'Spotify', price: 9.99, cycle: 'Monthly', category: 'music', nextBill: '2026-05-14', icon: '🎵', color: '#1DB954' },
  { id: '3', name: 'Amazon Prime', price: 14.99, cycle: 'Monthly', category: 'entertainment', nextBill: '2026-06-20', icon: '📦', color: '#FF9900' },
  { id: '4', name: 'iCloud', price: 2.99, cycle: 'Monthly', category: 'cloud', nextBill: '2026-05-18', icon: '☁️', color: '#0071E3' },
  { id: '5', name: 'Notion', price: 8.00, cycle: 'Monthly', category: 'productivity', nextBill: '2026-05-25', icon: '📝', color: '#000000' },
];

export const useSubscriptionStore = create((set, get) => ({
  subscriptions: INITIAL_SUBS,

  addSubscription: (sub) => {
    const newSub = {
      ...sub,
      id: Date.now().toString(),
      icon: sub.icon || '📱',
      color: sub.color || CATEGORIES[sub.category]?.color || '#6366F1',
    };
    set((state) => ({ subscriptions: [newSub, ...state.subscriptions] }));
  },

  deleteSubscription: (id) => {
    set((state) => ({
      subscriptions: state.subscriptions.filter((s) => s.id !== id),
    }));
  },

  getTotalMonthly: () => {
    return get().subscriptions.reduce((acc, sub) => {
      if (sub.cycle === 'Yearly') return acc + sub.price / 12;
      return acc + sub.price;
    }, 0);
  },

  getUpcoming: (days = 7) => {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);
    return get().subscriptions
      .filter((s) => {
        const d = new Date(s.nextBill);
        return d >= now && d <= future;
      })
      .sort((a, b) => new Date(a.nextBill) - new Date(b.nextBill));
  },

  getCategoryBreakdown: () => {
    const subs = get().subscriptions;
    const map = {};
    subs.forEach((s) => {
      const cat = s.category || 'other';
      if (!map[cat]) map[cat] = 0;
      map[cat] += s.cycle === 'Yearly' ? s.price / 12 : s.price;
    });
    return Object.entries(map).map(([cat, amount]) => ({
      category: cat,
      amount: parseFloat(amount.toFixed(2)),
      ...CATEGORIES[cat],
    }));
  },
}));
