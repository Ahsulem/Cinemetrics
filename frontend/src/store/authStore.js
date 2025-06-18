import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useAuthStore = create((set, get) => ({
  // initial states
  user: null,
  isLoading: false,
  error: null,
  message: null,
  fetchingUser: true,

  // Clear error function
  clearError: () => set({ error: null }),

  // functions
  signup: async (username, email, password) => {
    set({ isLoading: true, message: null, error: null });

    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, {
        username,
        email,
        password,
      });

      if (response.data.success) {
        set({ 
          user: response.data.user, 
          isLoading: false,
          error: null 
        });
        return response.data;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error signing up";
      set({
        isLoading: false,
        error: errorMessage,
        user: null
      });
      throw new Error(errorMessage);
    }
  },

  login: async (username, password) => {
    set({ isLoading: true, message: null, error: null });

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        username,
        password,
      });

      if (response.data.success) {
        const { user, message } = response.data;
        set({
          user,
          message,
          isLoading: false,
          error: null
        });
        return { user, message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error logging in";
      set({
        isLoading: false,
        error: errorMessage,
        user: null
      });
      throw new Error(errorMessage);
    }
  },

  fetchUser: async () => {
    set({ fetchingUser: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/api/auth/fetch-user`);
      
      if (response.data.success) {
        set({ 
          user: response.data.user, 
          fetchingUser: false,
          error: null 
        });
      }
    } catch (error) {
      set({
        fetchingUser: false,
        error: null, // Don't show error for failed auth check
        user: null,
      });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null, message: null });

    try {
      const response = await axios.post(`${API_URL}/api/auth/logout`);
      
      if (response.data.success) {
        const { message } = response.data;
        set({
          message,
          isLoading: false,
          user: null,
          error: null,
        });
        return { message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error logging out";
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw new Error(errorMessage);
    }
  },

  // Movie-related actions
  trackMovieView: async (movieId) => {
    try {
      await axios.post(`${API_URL}/api/movies/track-view`, { movieId });
    } catch (error) {
      console.error("Error tracking movie view:", error);
    }
  },

  toggleMovieLike: async (movieId) => {
    try {
      const response = await axios.post(`${API_URL}/api/movies/like`, { movieId });
      return response.data;
    } catch (error) {
      console.error("Error toggling movie like:", error);
      throw error;
    }
  },

  toggleMovieBookmark: async (movieId) => {
    try {
      const response = await axios.post(`${API_URL}/api/movies/bookmark`, { movieId });
      return response.data;
    } catch (error) {
      console.error("Error toggling movie bookmark:", error);
      throw error;
    }
  },

  getUserBookmarks: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/movies/bookmarks`);
      return response.data.bookmarks || [];
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      return [];
    }
  }
}));