import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  PersonalFamilyData,
  AddressIDData,
  ProfessionalEducationData,
  PaymentReferenceData,
  ContactReferenceData,
} from '@/validations/staff';

export type StaffFormStep = 1 | 2 | 3 | 4 | 5 | 6;

export type ProfilePersonalData = Pick<
  PersonalFamilyData,
  | 'nameEn'
  | 'nameBn'
  | 'fatherNameBn'
  | 'fatherNameEn'
  | 'motherNameBn'
  | 'motherNameEn'
  | 'gender'
  | 'maritalStatus'
  | 'religion'
  | 'nationality'
  | 'photoUrl'
  | 'photoFile'
> & { photoBase64?: string };

export type AddressIdentityData = AddressIDData;

export type EducationQualificationData = Pick<
  ProfessionalEducationData,
  | 'designation'
  | 'designationCustom'
  | 'department'
  | 'employmentType'
  | 'education'
  | 'isHafiz'
  | 'certificateFiles'
  | 'certificateUrls'
>;

export type ExperienceSkillsData = Pick<
  ProfessionalEducationData,
  | 'socialLinks'
  | 'cvFile'
  | 'cvUrl'
  | 'previousWorkplace'
  | 'previousWorkDuration'
  | 'totalExperienceYears'
  | 'specialSkills'
  | 'experienceLetterFile'
  | 'experienceLetterUrl'
> & { isHafiz?: boolean; tazkiyahFile?: File; tazkiyahUrl?: string };

export { type ContactReferenceData };

export type PaymentAgreementData = Pick<
  PaymentReferenceData,
  | 'expectedSalary'
  | 'expectedJoiningDate'
  | 'paymentMethod'
  | 'bankName'
  | 'bankBranch'
  | 'accountName'
  | 'accountNumber'
  | 'mobileBankingProvider'
  | 'mobileBankingNumber'
  | 'declaration'
  | 'termsAccepted'
  | 'signatureFile'
  | 'signatureUrl'
  | 'additionalNotes'
>;

// ─── State interface ────────────────────────────────────────
interface StaffFormState {
  currentStep: StaffFormStep;
  step1Data: Partial<ProfilePersonalData>;
  step2Data: Partial<AddressIdentityData>;
  step3Data: Partial<EducationQualificationData>;
  step4Data: Partial<ExperienceSkillsData>;
  step5Data: Partial<ContactReferenceData>;
  step6Data: Partial<PaymentAgreementData>;
  step1Complete: boolean;
  step2Complete: boolean;
  step3Complete: boolean;
  step4Complete: boolean;
  step5Complete: boolean;
  incompleteSteps: number[];
  isSubmitting: boolean;
  submittedStaffId: string | null;

  setStep1Data: (data: Partial<ProfilePersonalData>) => void;
  setStep2Data: (data: Partial<AddressIdentityData>) => void;
  setStep3Data: (data: Partial<EducationQualificationData>) => void;
  setStep4Data: (data: Partial<ExperienceSkillsData>) => void;
  setStep5Data: (data: Partial<ContactReferenceData>) => void;
  setStep5Complete: (val: boolean) => void;
  setStep6Data: (data: Partial<PaymentAgreementData>) => void;

  // Patch methods (auto-save only) – do NOT mark step complete
  patchStep1Data: (data: Partial<ProfilePersonalData>) => void;
  patchStep2Data: (data: Partial<AddressIdentityData>) => void;
  patchStep3Data: (data: Partial<EducationQualificationData>) => void;
  patchStep4Data: (data: Partial<ExperienceSkillsData>) => void;
  patchStep5Data: (data: Partial<ContactReferenceData>) => void;

  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: StaffFormStep) => void;
  markIncomplete: (step: number) => void;
  markComplete: (step: number) => void;
  setSubmitting: (val: boolean) => void;
  setSubmittedStaffId: (id: string) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 1 as StaffFormStep,
  step1Data: {} as Partial<ProfilePersonalData>,
  step2Data: {} as Partial<AddressIdentityData>,
  step3Data: {} as Partial<EducationQualificationData>,
  step4Data: {} as Partial<ExperienceSkillsData>,
  step5Data: {} as Partial<ContactReferenceData>,
  step6Data: {} as Partial<PaymentAgreementData>,
  step1Complete: false,
  step2Complete: false,
  step3Complete: false,
  step4Complete: false,
  step5Complete: false,
  incompleteSteps: [] as number[],
  isSubmitting: false,
  submittedStaffId: null as string | null,
};

// ─── Store ─────────────────────────────────────────────────
// sessionStorage: persists across same-tab page reloads,
// clears when tab closes. Perfect for multi-step forms.
// Can hold ~50MB vs localStorage's ~5MB → base64 images fit.

export const useStaffFormStore = create<StaffFormState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep1Data: data =>
        set(s => ({
          step1Data: { ...s.step1Data, ...data },
          step1Complete: true,
          incompleteSteps: s.incompleteSteps.filter(x => x !== 1),
        })),

      setStep2Data: data =>
        set(s => ({
          step2Data: { ...s.step2Data, ...data },
          step2Complete: true,
          incompleteSteps: s.incompleteSteps.filter(x => x !== 2),
        })),

      setStep3Data: data =>
        set(s => ({
          step3Data: { ...s.step3Data, ...data },
          step3Complete: true,
          incompleteSteps: s.incompleteSteps.filter(x => x !== 3),
        })),

      setStep4Data: data =>
        set(s => ({
          step4Data: { ...s.step4Data, ...data },
          step4Complete: true,
          incompleteSteps: s.incompleteSteps.filter(x => x !== 4),
        })),

      setStep5Data: data =>
        set(s => ({
          step5Data: { ...s.step5Data, ...data },
          step5Complete: true,
          incompleteSteps: s.incompleteSteps.filter(x => x !== 5),
        })),

      setStep5Complete: val => set({ step5Complete: val }),

      // ─── Patch methods (auto-save only) ─────────────────────
      // These update step data WITHOUT marking the step complete.
      patchStep1Data: data =>
        set(s => ({
          step1Data: { ...s.step1Data, ...data },
        })),
      patchStep2Data: data =>
        set(s => ({
          step2Data: { ...s.step2Data, ...data },
        })),
      patchStep3Data: data =>
        set(s => ({
          step3Data: { ...s.step3Data, ...data },
        })),
      patchStep4Data: data =>
        set(s => ({
          step4Data: { ...s.step4Data, ...data },
        })),
      patchStep5Data: data =>
        set(s => ({
          step5Data: { ...s.step5Data, ...data },
        })),

      setStep6Data: data =>
        set(s => ({ step6Data: { ...s.step6Data, ...data } })),

      nextStep: () =>
        set(s => ({
          currentStep: Math.min(s.currentStep + 1, 6) as StaffFormStep,
        })),

      prevStep: () =>
        set(s => ({
          currentStep: Math.max(s.currentStep - 1, 1) as StaffFormStep,
        })),

      goToStep: step => set({ currentStep: step }),

      markIncomplete: step => {
        const { incompleteSteps } = get();
        if (!incompleteSteps.includes(step))
          set({ incompleteSteps: [...incompleteSteps, step] });
      },

      markComplete: step =>
        set({
          incompleteSteps: get().incompleteSteps.filter(s => s !== step),
          ...(step === 1 && { step1Complete: true }),
          ...(step === 2 && { step2Complete: true }),
          ...(step === 3 && { step3Complete: true }),
          ...(step === 4 && { step4Complete: true }),
          ...(step === 5 && { step5Complete: true }),
        }),

      setSubmitting: val => set({ isSubmitting: val }),
      setSubmittedStaffId: id => set({ submittedStaffId: id }),
      reset: () => set(initialState),
    }),

    {
      name: 'mms-staff-form-v2',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? sessionStorage // ← KEY CHANGE: sessionStorage survives reloads
          : ({} as Storage)
      ),

      // ─── partialize ────────────────────────────────────────
      // RULE: Strip File objects (not serializable).
      //       KEEP all base64 strings (data:...) — they're just strings.
      //       KEEP all URL strings.
      //       sessionStorage has ~50MB limit, base64 images are ~100-300KB each.
      partialize: state => ({
        currentStep: state.currentStep,
        step1Complete: state.step1Complete,
        step2Complete: state.step2Complete,
        step3Complete: state.step3Complete,
        step4Complete: state.step4Complete,
        step5Complete: state.step5Complete,
        incompleteSteps: state.incompleteSteps,

        step1Data: {
          ...state.step1Data,
          photoFile: undefined, // ← File: strip
          // photoBase64: KEEP (string)
          // photoUrl:    KEEP (string)
        },

        step2Data: {
          ...state.step2Data,
          nidFrontCopyFile: undefined, // ← File: strip
          nidBackCopyFile: undefined, // ← File: strip
          // nidFrontBase64:  KEEP (string) ← persists across reloads!
          // nidBackBase64:   KEEP (string)
          // nidFrontCopyUrl: KEEP (string)
          // nidBackCopyUrl:  KEEP (string)
        },

        step3Data: {
          ...state.step3Data,
          certificateFiles: undefined, // ← File[]: strip
          // certificateUrls: KEEP (string[]) ← base64 array persists!
        },

        step4Data: {
          ...state.step4Data,
          cvFile: undefined, // ← File: strip
          experienceLetterFile: undefined, // ← File: strip
          tazkiyahFile: undefined, // ← File: strip
          // cvUrl:               KEEP (string base64)
          // experienceLetterUrl: KEEP (string base64)
          // tazkiyahUrl:         KEEP (string base64)
        },

        step5Data: state.step5Data, // no files, keep as-is
        step6Data: {
          ...state.step6Data,
          signatureFile: undefined, // ← File: strip (not serializable)
          // signatureUrl:         KEEP (string base64)
        },
      }),
    }
  )
);

// ─── Selector hooks ─────────────────────────────────────────
export const useCurrentStep = () => useStaffFormStore(s => s.currentStep);
export const useStep1Data = () => useStaffFormStore(s => s.step1Data);
export const useStep2Data = () => useStaffFormStore(s => s.step2Data);
export const useStep3Data = () => useStaffFormStore(s => s.step3Data);
export const useStep4Data = () => useStaffFormStore(s => s.step4Data);
export const useStep5Data = () => useStaffFormStore(s => s.step5Data);
export const useStep6Data = () => useStaffFormStore(s => s.step6Data);
export const useStep5Complete = () => useStaffFormStore(s => s.step5Complete);
export const useIsSubmitting = () => useStaffFormStore(s => s.isSubmitting);
export const useIncompleteSteps = () =>
  useStaffFormStore(s => s.incompleteSteps);
