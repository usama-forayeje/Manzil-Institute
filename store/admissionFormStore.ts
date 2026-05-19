/**
 * store/admissionFormStore.ts
 *
 * SIMPLIFIED — stores only UI state, NOT form data.
 * Form data lives inside React Hook Form (FormProvider).
 * sessionStorage persistence is handled directly in AdmissionForm.tsx.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ─── Types ──────────────────────────────────────────────────

export type AdmissionFormStep = 1 | 2 | 3 | 4 | 5 | 6;



export interface Step5Data {
  studentId:     string;
  studentDocId?: string;
  admissionNo:   string;
  enrollmentIds: string[];
  receiptNo:     string;
  studentNameEn: string;
  studentNameBn: string;
  paidAmount:    number;
  totalAmount:   number;
  admissionDate: string;
  hallName?:     string;
}

interface AdmissionUIState {
  // ── Navigation ──────────────────────────────────────────
  currentStep:    AdmissionFormStep;
  completedSteps: number[];  // steps marked as valid when user clicked Next

  // ── Photo (outside RHF — not JSON-serializable as File) ─
  photoBase64: string | null;

  // ── Submission ──────────────────────────────────────────
  isSubmitting: boolean;

  // ── Success screen data ─────────────────────────────────
  step5Data: Partial<Step5Data>;

  // ── Actions ─────────────────────────────────────────────
  nextStep:       () => void;
  prevStep:       () => void;
  goToStep:       (step: AdmissionFormStep) => void;
  markStepComplete:   (step: number) => void;
  markStepIncomplete: (step: number) => void;

  setPhoto:       (base64: string | null) => void;
  setSubmitting:  (val: boolean) => void;
  setStep5Data:   (data: Partial<Step5Data>) => void;
  reset:          () => void;
}

// ─── Initial State ──────────────────────────────────────────

const initialState = {
  currentStep:    1 as AdmissionFormStep,
  completedSteps: [] as number[],
  photoBase64:    null as string | null,
  isSubmitting:   false,
  step5Data:      {} as Partial<Step5Data>,
};

// ─── Store ──────────────────────────────────────────────────

export const useAdmissionUIStore = create<AdmissionUIState>()(
  persist(
    (set, get) => ({
      ...initialState,

      nextStep: () =>
        set((s) => ({
          currentStep: Math.min(s.currentStep + 1, 6) as AdmissionFormStep,
        })),

      prevStep: () =>
        set((s) => ({
          currentStep: Math.max(s.currentStep - 1, 1) as AdmissionFormStep,
        })),

      goToStep: (step) => set({ currentStep: step }),

      markStepComplete: (step) =>
        set((s) => ({
          completedSteps: s.completedSteps.includes(step)
            ? s.completedSteps
            : [...s.completedSteps, step],
        })),

      markStepIncomplete: (step) =>
        set((s) => ({
          completedSteps: s.completedSteps.filter((x) => x !== step),
        })),

      setPhoto: (base64) => set({ photoBase64: base64 }),

      setSubmitting: (val) => set({ isSubmitting: val }),

      setStep5Data: (data) =>
        set((s) => ({ step5Data: { ...s.step5Data, ...data } })),

      reset: () => {
        // Also clear the form draft from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('mii-admission-draft-v2');
        }
        set(initialState);
      },
    }),

    {
      name: 'mii-admission-ui-v2',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : ({} as Storage)
      ),
      // Only persist navigation + photo (not isSubmitting)
      partialize: (s) => ({
        currentStep:    s.currentStep,
        completedSteps: s.completedSteps,
        photoBase64:    s.photoBase64,
        step5Data:      s.step5Data,
      }),
    }
  )
);

// ─── Fine-grained selectors ──────────────────────────────────

export const useCurrentStep      = () => useAdmissionUIStore((s) => s.currentStep);
export const useIsSubmitting     = () => useAdmissionUIStore((s) => s.isSubmitting);
export const useCompletedSteps   = () => useAdmissionUIStore((s) => s.completedSteps);
export const usePhotoBase64      = () => useAdmissionUIStore((s) => s.photoBase64);
export const useStep5Data        = () => useAdmissionUIStore((s) => s.step5Data);
