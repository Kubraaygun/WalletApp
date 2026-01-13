import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favorites: [],
  recentContacts: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    // Favori ekle
    addFavorite: (state, action) => {
      const contact = action.payload;
      // Duplicate kontrolü - güvenlik için
      const exists = state.favorites.some(
        (f) => f.phone === contact.phone || f.iban === contact.iban
      );
      if (!exists && state.favorites.length < 20) {
        state.favorites.unshift({
          id: Date.now().toString(),
          ...contact,
          addedAt: new Date().toISOString(),
        });
      }
    },
    
    // Favori sil
    removeFavorite: (state, action) => {
      const id = action.payload;
      state.favorites = state.favorites.filter((f) => f.id !== id);
    },
    
    // Favori güncelle
    updateFavorite: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.favorites.findIndex((f) => f.id === id);
      if (index !== -1) {
        // Sanitize updates - güvenlik için
        const safeUpdates = {
          name: updates.name?.slice(0, 50),
          phone: updates.phone?.replace(/[^0-9+]/g, "").slice(0, 15),
          iban: updates.iban?.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(0, 26),
          avatar: updates.avatar,
        };
        state.favorites[index] = { ...state.favorites[index], ...safeUpdates };
      }
    },
    
    // Son kişilere ekle
    addRecentContact: (state, action) => {
      const contact = action.payload;
      // Duplicate varsa kaldır, başa ekle
      state.recentContacts = state.recentContacts.filter(
        (c) => c.phone !== contact.phone && c.iban !== contact.iban
      );
      state.recentContacts.unshift({
        ...contact,
        lastUsed: new Date().toISOString(),
      });
      // Max 10 kişi tut
      if (state.recentContacts.length > 10) {
        state.recentContacts = state.recentContacts.slice(0, 10);
      }
    },
    
    // Tüm favorileri temizle
    clearFavorites: (state) => {
      state.favorites = [];
    },
    
    // Son kişileri temizle
    clearRecentContacts: (state) => {
      state.recentContacts = [];
    },
  },
});

export const {
  addFavorite,
  removeFavorite,
  updateFavorite,
  addRecentContact,
  clearFavorites,
  clearRecentContacts,
} = favoritesSlice.actions;

// Selectors
export const selectFavorites = (state) => state.favorites.favorites;
export const selectRecentContacts = (state) => state.favorites.recentContacts;
export const selectFavoriteById = (id) => (state) =>
  state.favorites.favorites.find((f) => f.id === id);

export default favoritesSlice.reducer;
