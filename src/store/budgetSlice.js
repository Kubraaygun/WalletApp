import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  monthlyBudget: 0,
  categories: [
    { id: "food", name: "Yemek", icon: "coffee", color: "#F59E0B", budget: 0 },
    { id: "transport", name: "Ulaşım", icon: "navigation", color: "#3B82F6", budget: 0 },
    { id: "shopping", name: "Alışveriş", icon: "shopping-bag", color: "#EC4899", budget: 0 },
    { id: "entertainment", name: "Eğlence", icon: "film", color: "#8B5CF6", budget: 0 },
    { id: "bills", name: "Faturalar", icon: "file-text", color: "#EF4444", budget: 0 },
    { id: "health", name: "Sağlık", icon: "heart", color: "#10B981", budget: 0 },
    { id: "other", name: "Diğer", icon: "more-horizontal", color: "#6B7280", budget: 0 },
  ],
  expenses: [], // Tüm harcama kayıtları
};

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    // Aylık bütçe belirle
    setMonthlyBudget: (state, action) => {
      const amount = Math.max(0, Math.min(action.payload, 1000000));
      state.monthlyBudget = amount;
    },

    // Kategori bütçesi belirle
    setCategoryBudget: (state, action) => {
      const { categoryId, amount } = action.payload;
      const category = state.categories.find((c) => c.id === categoryId);
      if (category) {
        category.budget = Math.max(0, Math.min(amount, 100000));
      }
    },

    // Harcama ekle
    addExpense: (state, action) => {
      const { categoryId, amount, description = "" } = action.payload;
      const category = state.categories.find((c) => c.id === categoryId);
      
      // Eski persisted state'de expenses yoksa oluştur
      if (!state.expenses) {
        state.expenses = [];
      }
      
      if (category && amount > 0 && amount <= 100000) {
        const expense = {
          id: Date.now().toString(),
          categoryId,
          categoryName: category.name,
          categoryColor: category.color,
          categoryIcon: category.icon,
          amount: Math.round(amount * 100) / 100, // 2 decimal
          description: description.slice(0, 100), // Max 100 char
          date: new Date().toISOString(),
          createdAt: Date.now(),
        };
        state.expenses.unshift(expense);
        
        // Max 500 harcama tut (memory için)
        if (state.expenses.length > 500) {
          state.expenses = state.expenses.slice(0, 500);
        }
      }
    },

    // Harcama sil
    removeExpense: (state, action) => {
      const expenseId = action.payload;
      state.expenses = state.expenses.filter((e) => e.id !== expenseId);
    },

    // Belirli kategorinin harcamalarını temizle
    clearCategoryExpenses: (state, action) => {
      const categoryId = action.payload;
      state.expenses = state.expenses.filter((e) => e.categoryId !== categoryId);
    },

    // Tüm harcamaları temizle
    clearAllExpenses: (state) => {
      state.expenses = [];
    },

    // Tümünü sıfırla
    resetBudget: (state) => {
      state.monthlyBudget = 0;
      state.categories.forEach((category) => {
        category.budget = 0;
      });
      state.expenses = [];
    },
  },
});

export const {
  setMonthlyBudget,
  setCategoryBudget,
  addExpense,
  removeExpense,
  clearCategoryExpenses,
  clearAllExpenses,
  resetBudget,
} = budgetSlice.actions;

// Helper functions
const isToday = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const isThisWeek = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  weekStart.setHours(0, 0, 0, 0);
  return date >= weekStart;
};

const isThisMonth = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
};

// Selectors with null safety
export const selectMonthlyBudget = (state) => state.budget?.monthlyBudget ?? 0;
export const selectCategories = (state) => state.budget?.categories ?? [];
export const selectExpenses = (state) => state.budget?.expenses ?? [];

// Bugünkü harcamalar
export const selectTodayExpenses = (state) =>
  (state.budget?.expenses ?? []).filter((e) => isToday(e.date));

export const selectTodayTotal = (state) =>
  (state.budget?.expenses ?? [])
    .filter((e) => isToday(e.date))
    .reduce((sum, e) => sum + e.amount, 0);

// Bu haftanın harcamaları
export const selectWeekExpenses = (state) =>
  (state.budget?.expenses ?? []).filter((e) => isThisWeek(e.date));

export const selectWeekTotal = (state) =>
  (state.budget?.expenses ?? [])
    .filter((e) => isThisWeek(e.date))
    .reduce((sum, e) => sum + e.amount, 0);

// Bu ayın harcamaları
export const selectMonthExpenses = (state) =>
  (state.budget?.expenses ?? []).filter((e) => isThisMonth(e.date));

export const selectMonthTotal = (state) =>
  (state.budget?.expenses ?? [])
    .filter((e) => isThisMonth(e.date))
    .reduce((sum, e) => sum + e.amount, 0);

// Kategori bazlı aylık harcamalar
export const selectCategoryMonthlySpent = (categoryId) => (state) =>
  (state.budget?.expenses ?? [])
    .filter((e) => e.categoryId === categoryId && isThisMonth(e.date))
    .reduce((sum, e) => sum + e.amount, 0);

// Tüm kategorilerin aylık harcamaları
export const selectCategoriesWithSpent = (state) =>
  (state.budget?.categories ?? []).map((category) => ({
    ...category,
    spent: (state.budget?.expenses ?? [])
      .filter((e) => e.categoryId === category.id && isThisMonth(e.date))
      .reduce((sum, e) => sum + e.amount, 0),
  }));

// Son 7 günün günlük harcamaları (grafik için)
export const selectLast7DaysData = (state) => {
  const expenses = state.budget?.expenses ?? [];
  const result = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toDateString();
    
    const dayTotal = expenses
      .filter((e) => new Date(e.date).toDateString() === dateStr)
      .reduce((sum, e) => sum + e.amount, 0);
    
    const dayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
    result.push({
      day: dayNames[date.getDay()],
      amount: dayTotal,
    });
  }
  
  return result;
};

// Kategori bazlı toplam (pie chart için)
export const selectCategoryTotals = (state) =>
  (state.budget?.categories ?? []).map((category) => ({
    name: category.name,
    color: category.color,
    amount: (state.budget?.expenses ?? [])
      .filter((e) => e.categoryId === category.id && isThisMonth(e.date))
      .reduce((sum, e) => sum + e.amount, 0),
  })).filter((c) => c.amount > 0);

export default budgetSlice.reducer;
