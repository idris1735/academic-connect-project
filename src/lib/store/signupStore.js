import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useSignupStore = create(
  persist(
    (set) => ({
      step: 1,
      userType: null,
      subOption: null,
      formData: {},
      setStep: (step) => set({ step }),
      setUserType: (type) => set({ userType: type }),
      setSubOption: (option) => set({ subOption: option }),
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      resetStore: () =>
        set({
          step: 1,
          userType: null,
          subOption: null,
          formData: {},
        }),
    }),
    {
      name: 'signup-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)