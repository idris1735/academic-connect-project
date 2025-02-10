import { create } from 'zustand'

export const useLoadingStore = create((set) => ({
  isLoading: false,
  loadingMessage: '',
  setLoading: (loading, message = '') => 
    set({ isLoading: loading, loadingMessage: message }),
})) 