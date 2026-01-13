import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  monthlyBudget: 0,
  categories: [
    { id: "food", name: "Yemek", icon: "coffee", color: "#F59E0B", budget: 0, spent: 0 },
    { id: "transport", name: "Ulaşım", icon: "navigation", color: "#3B82F6", budget: 0, spent: 0 },
    { id: "shopping", name: "Alışveriş", icon: "shopping-bag", color: "#EC4899", budget: 0, spent: 0 },
    { id: "entertainment", name: "Eğlence", icon: "film", color: "#8B5CF6", budget: 0, spent: 0 },
    { id: "bills", name: "Faturalar", icon: "file-text", color: "#EF4444", budget: 0, spent: 0 },
    { id: "health", name: "Sağlık", icon: "heart", color: "#10B981", budget: 0, spent: 0 },
    { id: "other", name: "Diğer", icon: "more-horizontal", color: "#6B7280", budget: 0, spent: 0 },
  ],
  budgetHistory: [],
};

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    // Aylık bütçe belirle
    setMonthlyBudget: (state, action) => {
      const amount = Math.max(0, Math.min(action.payload, 1000000)); // Max 1M limit
      state.monthlyBudget = amount;
    },

    // Kategori bütçesi belirle
    setCategoryBudget: (state, action) => {
      const { categoryId, amount } = action.payload;
      const category = state.categories.find((c) => c.id === categoryId);
      if (category) {
        category.budget = Math.max(0, Math.min(amount, 100000)); // Max 100K limit
      }
    },

    // Kategori harcaması ekle
    addExpense: (state, action) => {
      const { categoryId, amount } = action.payload;
      const category = state.categories.find((c) => c.id === categoryId);
      if (category && amount > 0) {
        category.spent += amount;
      }
    },

    // Kategori harcamasını sıfırla
    resetCategorySpent: (state, action) => {
      const categoryId = action.payload;
      const category = state.categories.find((c) => c.id === categoryId);
      if (category) {
        category.spent = 0;
      }
    },

    // Tüm harcamaları sıfırla (yeni ay)
    resetAllSpent: (state) => {
      state.categories.forEach((category) => {
        category.spent = 0;
      });
    },

    // Bütçe geçmişine kaydet
    saveBudgetHistory: (state, action) => {
      const { month, year } = action.payload;
      const historyEntry = {
        month,
        year,
        totalBudget: state.monthlyBudget,
        totalSpent: state.categories.reduce((sum, c) => sum + c.spent, 0),
        categories: state.categories.map((c) => ({
          id: c.id,
          budget: c.budget,
          spent: c.spent,
        })),
        savedAt: new Date().toISOString(),
      };
      
      // Max 12 ay geçmiş tut
      state.budgetHistory.unshift(historyEntry);
      if (state.budgetHistory.length > 12) {
        state.budgetHistory = state.budgetHistory.slice(0, 12);
      }
    },

    // Tümünü sıfırla
    resetBudget: (state) => {
      state.monthlyBudget = 0;
      state.categories.forEach((category) => {
        category.budget = 0;
        category.spent = 0;
      });
    },
  },
});

export const {
  setMonthlyBudget,
  setCategoryBudget,
  addExpense,
  resetCategorySpent,
  resetAllSpent,
  saveBudgetHistory,
  resetBudget,
} = budgetSlice.actions;

// Selectors
export const selectMonthlyBudget = (state) => state.budget.monthlyBudget;
export const selectCategories = (state) => state.budget.categories;
export const selectTotalSpent = (state) =>
  state.budget.categories.reduce((sum, c) => sum + c.spent, 0);
export const selectTotalBudget = (state) =>
  state.budget.categories.reduce((sum, c) => sum + c.budget, 0);
export const selectBudgetHistory = (state) => state.budget.budgetHistory;

export default budgetSlice.reducer;
