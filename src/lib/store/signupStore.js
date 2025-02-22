import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useSignupStore = create(
  persist(
    (set) => ({
      step: 1,
      userType: '',
      subOption: null,
      formData: {
        fullName: '',
        email: '',
        password: '',
        occupation: '',
        researchInterests: '',
      },
      setStep: (step) => set({ step }),
      setUserType: (type) => set({ userType: type }),
      setSubOption: (option) => set({ subOption: option }),
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      resetForm: () =>
        set({
          step: 1,
          userType: '',
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
