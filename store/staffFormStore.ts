import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  PersonalFamilyData,
  AddressIDData,
  ProfessionalEducationData,
  PaymentReferenceData,
} from "@/validations/staff";

// ─── Types ─────────────────────────────────────────────────
export type StaffFormStep = 1 | 2 | 3 | 4;

interface StaffFormState {
  // Current step
  currentStep: StaffFormStep;

  // Per-step data (partial — user may not have filled yet)
  step1Data: Partial<PersonalFamilyData>;
  step2Data: Partial<AddressIDData>;
  step3Data: Partial<ProfessionalEducationData>;
  step4Data: Partial<PaymentReferenceData>;

  // Completion flags (step was submitted via "Next" button)
  step1Complete: boolean;
  step2Complete: boolean;
  step3Complete: boolean;

  // Steps the user visited but didn't complete (shows red mark)
  incompleteSteps: number[];

  // Submission state
  isSubmitting: boolean;
  submittedStaffId: string | null;

  // Actions
  setStep1Data: (data: Partial<PersonalFamilyData>) => void;
  setStep2Data: (data: Partial<AddressIDData>) => void;
  setStep3Data: (data: Partial<ProfessionalEducationData>) => void;
  setStep4Data: (data: Partial<PaymentReferenceData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: StaffFormStep) => void;
  markIncomplete: (step: number) => void;
  markComplete: (step: number) => void;
  setSubmitting: (val: boolean) => void;
  setSubmittedStaffId: (id: string) => void;
  reset: () => void;
}

// ─── Initial state ─────────────────────────────────────────
const initialState = {
  currentStep:      1 as StaffFormStep,
  step1Data:        {},
  step2Data:        {},
  step3Data:        {},
  step4Data:        {},
  step1Complete:    false,
  step2Complete:    false,
  step3Complete:    false,
  incompleteSteps:  [],
  isSubmitting:     false,
  submittedStaffId: null,
};

// ─── Store ─────────────────────────────────────────────────
export const useStaffFormStore = create<StaffFormState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep1Data: (data) =>
        set((state) => ({
          step1Data:     { ...state.step1Data, ...data },
          step1Complete: true,
          incompleteSteps: state.incompleteSteps.filter(s => s !== 1),
        })),

      setStep2Data: (data) =>
        set((state) => ({
          step2Data:     { ...state.step2Data, ...data },
          step2Complete: true,
          incompleteSteps: state.incompleteSteps.filter(s => s !== 2),
        })),

      setStep3Data: (data) =>
        set((state) => ({
          step3Data: { ...state.step3Data, ...data },
          step3Complete: true,
          incompleteSteps: state.incompleteSteps.filter(s => s !== 3),
        })),

      setStep4Data: (data) =>
        set((state) => ({
          step4Data: { ...state.step4Data, ...data },
        })),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 4) as StaffFormStep,
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1) as StaffFormStep,
        })),

      goToStep: (step) => {
        const { currentStep, step1Complete, step2Complete, step3Complete } = get();

        // Mark current step as incomplete if navigating away without completing
        if (step !== currentStep) {
          const isIncomplete = (
            (currentStep === 1 && !step1Complete) ||
            (currentStep === 2 && !step2Complete) ||
            (currentStep === 3 && !step3Complete)
          );
          if (isIncomplete && !get().incompleteSteps.includes(currentStep)) {
            set({ incompleteSteps: [...get().incompleteSteps, currentStep] });
          }
        }

        // Allow free navigation to any step (forward or backward)
        return set({ currentStep: step as StaffFormStep });
      },

      markIncomplete: (step) => {
        const { incompleteSteps } = get();
        if (!incompleteSteps.includes(step)) {
          set({ incompleteSteps: [...incompleteSteps, step] });
        }
      },

      markComplete: (step) => {
        set({
          incompleteSteps: get().incompleteSteps.filter(s => s !== step),
          ...(step === 1 && { step1Complete: true }),
          ...(step === 2 && { step2Complete: true }),
          ...(step === 3 && { step3Complete: true }),
        });
      },

      setSubmitting: (val) => set({ isSubmitting: val }),

      setSubmittedStaffId: (id) => set({ submittedStaffId: id }),

      // Form submit হলে বা cancel করলে সব clear
      reset: () => set(initialState),
    }),
    {
      name:    "mms-staff-form", // localStorage key
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : ({} as Storage)
      ),
      // File objects store করবো না — serializable না
      partialize: (state) => ({
        currentStep:   state.currentStep,
        step1Complete: state.step1Complete,
        step2Complete: state.step2Complete,
        step3Complete: state.step3Complete,
        incompleteSteps: state.incompleteSteps,
        step1Data: {
          ...state.step1Data,
          photoFile: undefined, // File object বাদ
        },
        step2Data: {
          ...state.step2Data,
          nidFrontCopyFile:    undefined,
          nidBackCopyFile:     undefined,
        },
        step3Data: {
          ...state.step3Data,
          certificateFiles:    undefined,
          experienceLetterFile:undefined,
          cvFile:              undefined,
          tazkiyahFile:        undefined,
        },
        step4Data: state.step4Data,
      }),
    }
  )
);

// ─── Selector hooks (re-render minimize করতে) ─────────────
export const useCurrentStep  = () => useStaffFormStore((s) => s.currentStep);
export const useStep1Data    = () => useStaffFormStore((s) => s.step1Data);
export const useStep2Data    = () => useStaffFormStore((s) => s.step2Data);
export const useStep3Data    = () => useStaffFormStore((s) => s.step3Data);
export const useStep4Data    = () => useStaffFormStore((s) => s.step4Data);
export const useIsSubmitting = () => useStaffFormStore((s) => s.isSubmitting);
export const useIncompleteSteps = () => useStaffFormStore((s) => s.incompleteSteps);
