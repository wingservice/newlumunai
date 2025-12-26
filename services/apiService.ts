
import { User, GeneratedImage, AdminStats, UserCredentials, CreditPlan } from "../types";

const USERS_KEY = 'lumina_users';
const HISTORY_KEY = 'lumina_history';
const SESSION_KEY = 'lumina_session_user_id';
const PLANS_KEY = 'lumina_credit_plans';

export const mockBackend = {
  // --- AUTH METHODS ---
  
  signup: (creds: UserCredentials): User => {
    const usersJson = localStorage.getItem(USERS_KEY);
    const users = usersJson ? JSON.parse(usersJson) : {};
    
    if (users[creds.email]) {
      throw new Error("User with this email already exists");
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: creds.email,
      name: creds.name || creds.email.split('@')[0],
      credits: 5, // Sign up bonus
      isAdmin: false
    };

    users[creds.email] = { ...newUser, password: creds.password };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(SESSION_KEY, newUser.id);
    return newUser;
  },

  login: (creds: UserCredentials): User => {
    const usersJson = localStorage.getItem(USERS_KEY);
    const users = usersJson ? JSON.parse(usersJson) : {};
    
    const userRecord = users[creds.email];
    if (!userRecord || userRecord.password !== creds.password) {
      throw new Error("Invalid email or password");
    }

    const { password, ...user } = userRecord;
    localStorage.setItem(SESSION_KEY, user.id);
    return user;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  // --- USER METHODS ---

  getCurrentUser: (): User | null => {
    const sessionUserId = localStorage.getItem(SESSION_KEY);
    if (!sessionUserId) return null;

    const usersJson = localStorage.getItem(USERS_KEY);
    const users = usersJson ? JSON.parse(usersJson) : {};
    
    const userRecord = Object.values(users).find((u: any) => u.id === sessionUserId);
    if (!userRecord) return null;

    const { password, ...user } = userRecord as any;
    return user;
  },

  getAllUsers: (): User[] => {
    const usersJson = localStorage.getItem(USERS_KEY);
    const users = usersJson ? JSON.parse(usersJson) : {};
    return Object.values(users).map(({ password, ...u }: any) => u);
  },

  updateAnyUserCredits: (userId: string, credits: number): User => {
    const usersJson = localStorage.getItem(USERS_KEY);
    const users = usersJson ? JSON.parse(usersJson) : {};
    
    const email = Object.keys(users).find(k => users[k].id === userId);
    if (email) {
      users[email].credits = credits;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return users[email];
    }
    throw new Error("User not found");
  },

  updateCredits: (amount: number): User => {
    const user = mockBackend.getCurrentUser();
    if (!user) throw new Error("Not authenticated");
    return mockBackend.updateAnyUserCredits(user.id, user.credits + amount);
  },

  deductCredit: (): boolean => {
    const user = mockBackend.getCurrentUser();
    if (!user || user.credits <= 0) return false;
    mockBackend.updateAnyUserCredits(user.id, user.credits - 1);
    return true;
  },

  // --- CREDIT PLAN METHODS ---

  getPlans: (): CreditPlan[] => {
    const plansJson = localStorage.getItem(PLANS_KEY);
    return plansJson ? JSON.parse(plansJson) : [];
  },

  updatePlan: (updatedPlan: CreditPlan): CreditPlan[] => {
    const plans = mockBackend.getPlans();
    const index = plans.findIndex(p => p.id === updatedPlan.id);
    if (index !== -1) {
      plans[index] = updatedPlan;
      localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
    }
    return plans;
  },

  // --- DATA METHODS ---

  saveImage: (prompt: string, imageUrl: string, aspectRatio: string): GeneratedImage => {
    const user = mockBackend.getCurrentUser();
    if (!user) throw new Error("Not authenticated");

    const historyJson = localStorage.getItem(HISTORY_KEY);
    const history = historyJson ? JSON.parse(historyJson) : [];
    
    const newImage: GeneratedImage = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      prompt,
      imageUrl,
      aspectRatio,
      timestamp: Date.now()
    };

    history.unshift(newImage);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
    return newImage;
  },

  getHistory: (userId: string): GeneratedImage[] => {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    const history = historyJson ? JSON.parse(historyJson) : [];
    return history.filter((img: GeneratedImage) => img.userId === userId);
  },

  getAdminStats: (): AdminStats => {
    const users = mockBackend.getAllUsers();
    const historyJson = localStorage.getItem(HISTORY_KEY);
    const history = historyJson ? JSON.parse(historyJson) : [];
    
    return {
      totalUsers: users.length,
      totalCredits: users.reduce((acc, u) => acc + (u.credits || 0), 0),
      totalImages: history.length,
      activeToday: Math.max(1, Math.floor(users.length * 0.4))
    };
  }
};

// Initial seeding for demo
(function seed() {
  const usersJson = localStorage.getItem(USERS_KEY);
  if (!usersJson) {
    mockBackend.signup({ email: 'admin@lumina.ai', password: 'password', name: 'System Admin' });
    const users = JSON.parse(localStorage.getItem(USERS_KEY)!);
    users['admin@lumina.ai'].isAdmin = true;
    users['admin@lumina.ai'].credits = 999;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.removeItem(SESSION_KEY);
  }

  const plansJson = localStorage.getItem(PLANS_KEY);
  if (!plansJson) {
    const defaultPlans: CreditPlan[] = [
      { id: 'starter', name: 'Starter', credits: 20, price: 9.99 },
      { id: 'pro', name: 'Pro Studio', credits: 100, price: 29.99, popular: true },
      { id: 'unlimited', name: 'Unlimited', credits: 500, price: 99.99 }
    ];
    localStorage.setItem(PLANS_KEY, JSON.stringify(defaultPlans));
  }
})();
