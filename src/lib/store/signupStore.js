import { create } from 'zustand'

export const useSignupStore = create((set) => ({
  userType: null,
  subOption: null,
  formData: {},
  setUserType: (type) => set({ userType: type }),
  setSubOption: (option) => set({ subOption: option }),
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  resetStore: () =>
    set({
      userType: null,
      subOption: null,
      formData: {},
    }),
}))
