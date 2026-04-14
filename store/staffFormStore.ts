import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  PersonalFamilyData,
  AddressIDData,
  ProfessionalEducationData,
  PaymentReferenceData,
} from '@/validations/staff';

export type StaffFormStep = 1 | 2 | 3 | 4 | 5 | 6;

// Step 1: Profile & Personal Information
export type ProfilePersonalData = Pick<PersonalFamilyData, 
  | 'nameEn' | 'nameBn' | 'fatherNameBn' | 'fatherNameEn' 
  | 'motherNameBn' | 'motherNameEn' | 'gender' | 'maritalStatus' 
  | 'religion' | 'nationality' | 'photoUrl' | 'photoFile'
> & { photoBase64?: string };

// Step 2: Address & Identity
export type AddressIdentityData = AddressIDData;

// Step 3: Education & Qualifications (includes designation, education, certificate)
export type EducationQualificationData = Pick<ProfessionalEducationData,
  | 'designation' | 'designationCustom' | 'department' | 'employmentType'
  | 'education' | 'isHafiz' | 'certificateFiles' | 'certificateUrls'
>;

// Step 4: Experience & Skills (moved from Step 3)
export type ExperienceSkillsData = Pick<ProfessionalEducationData,
  | 'socialLinks' | 'cvFile' | 'cvUrl' | 'tazkiyahFile' | 'tazkiyahUrl'
  | 'previousWorkplace' | 'previousWorkDuration' | 'totalExperienceYears'
  | 'specialSkills' | 'experienceLetterFile' | 'experienceLetterUrl'
> & { isHafiz?: boolean };

// Step 5: Contact & Reference
export type ContactReferenceData = Pick<PaymentReferenceData,
  | 'phonePrimary' | 'phoneSecondary' | 'email' | 'whatsappNo'
  | 'emergencyContactNo' | 'emergencyRelationship'
  | 'referenceName' | 'referencePhone' | 'referenceOccupation'
>;

// Step 6: Payment & Agreement
export type PaymentAgreementData = Pick<PaymentReferenceData,
  | 'expectedSalary' | 'expectedJoiningDate'
  | 'paymentMethod' | 'bankName' | 'bankBranch' | 'accountName' | 'accountNumber'
  | 'mobileBankingProvider' | 'mobileBankingNumber'
  | 'declaration' | 'additionalNotes'
>;

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
  
  // Setters
  setStep1Data: (data: Partial<ProfilePersonalData>) => void;
  setStep2Data: (data: Partial<AddressIdentityData>) => void;
  setStep3Data: (data: Partial<EducationQualificationData>) => void;
  setStep4Data: (data: Partial<ExperienceSkillsData>) => void;
  setStep5Data: (data: Partial<ContactReferenceData>) => void;
  setStep5Complete: (val: boolean) => void;
  setStep6Data: (data: Partial<PaymentAgreementData>) => void;
  
  // Navigation
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: StaffFormStep) => void;
  markIncomplete: (step: number) => void;
  markComplete: (step: number) => void;
  
  // Submission
  setSubmitting: (val: boolean) => void;
  setSubmittedStaffId: (id: string) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 1 as StaffFormStep,
  step1Data: {},
  step2Data: {},
  step3Data: {},
  step4Data: {},
  step5Data: {},
  step6Data: {},
  step1Complete: false,
  step2Complete: false,
  step3Complete: false,
  step4Complete: false,
  step5Complete: false,
  incompleteSteps: [] as number[],
  isSubmitting: false,
  submittedStaffId: null,
};

export const useStaffFormStore = create<StaffFormState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setStep1Data: (data) => set((state) => ({ 
        step1Data: { ...state.step1Data, ...data }, 
        step1Complete: true, 
        incompleteSteps: state.incompleteSteps.filter(s => s !== 1) 
      })),
      
      setStep2Data: (data) => set((state) => ({ 
        step2Data: { ...state.step2Data, ...data }, 
        step2Complete: true, 
        incompleteSteps: state.incompleteSteps.filter(s => s !== 2) 
      })),
      
      setStep3Data: (data) => set((state) => ({ 
        step3Data: { ...state.step3Data, ...data }, 
        step3Complete: true, 
        incompleteSteps: state.incompleteSteps.filter(s => s !== 3) 
      })),
      
      setStep4Data: (data) => set((state) => ({ 
        step4Data: { ...state.step4Data, ...data }, 
        step4Complete: true, 
        incompleteSteps: state.incompleteSteps.filter(s => s !== 4) 
      })),
      
      setStep5Data: (data) => set((state) => ({ 
        step5Data: { ...state.step5Data, ...data }, 
        step5Complete: true, 
        incompleteSteps: state.incompleteSteps.filter(s => s !== 5) 
      })),
      
      setStep5Complete: (val) => set({ step5Complete: val }),
      
      setStep6Data: (data) => set((state) => ({ step6Data: { ...state.step6Data, ...data } })),
      
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 6) as StaffFormStep })),
      
      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) as StaffFormStep })),
      
      goToStep: (step) => {
        const { currentStep, step1Complete, step2Complete, step3Complete, step4Complete, step5Complete } = get();
        if (step !== currentStep) {
          const isIncomplete = 
            (currentStep === 1 && !step1Complete) || 
            (currentStep === 2 && !step2Complete) || 
            (currentStep === 3 && !step3Complete) || 
            (currentStep === 4 && !step4Complete) || 
            (currentStep === 5 && !step5Complete);
          if (isIncomplete && !get().incompleteSteps.includes(currentStep)) {
            set({ incompleteSteps: [...get().incompleteSteps, currentStep] });
          }
        }
        return set({ currentStep: step as StaffFormStep });
      },
      
      markIncomplete: (step) => { 
        const { incompleteSteps } = get(); 
        if (!incompleteSteps.includes(step)) set({ incompleteSteps: [...incompleteSteps, step] }); 
      },
      
      markComplete: (step) => set({ 
        incompleteSteps: get().incompleteSteps.filter(s => s !== step), 
        ...(step === 1 && { step1Complete: true }), 
        ...(step === 2 && { step2Complete: true }), 
        ...(step === 3 && { step3Complete: true }), 
        ...(step === 4 && { step4Complete: true }), 
        ...(step === 5 && { step5Complete: true }) 
      }),
      
      setSubmitting: (val) => set({ isSubmitting: val }),
      setSubmittedStaffId: (id) => set({ submittedStaffId: id }),
      reset: () => set(initialState),
    }),
    { 
      name: 'mms-staff-form', 
      storage: createJSONStorage(() => typeof window !== 'undefined' ? localStorage : ({} as Storage)), 
      partialize: (state) => ({ 
        currentStep: state.currentStep, 
        step1Complete: state.step1Complete, 
        step2Complete: state.step2Complete, 
        step3Complete: state.step3Complete, 
        step4Complete: state.step4Complete, 
        step5Complete: state.step5Complete, 
        incompleteSteps: state.incompleteSteps, 
        step1Data: { ...state.step1Data, photoFile: undefined }, 
        step2Data: { ...state.step2Data, nidFrontCopyFile: undefined, nidBackCopyFile: undefined }, 
        step3Data: state.step3Data, 
        step4Data: { ...state.step4Data, cvFile: undefined, experienceLetterFile: undefined, tazkiyahFile: undefined }, 
        step5Data: state.step5Data, 
        step5Complete: state.step5Complete, 
        step6Data: state.step6Data 
      }) 
    }
  )
);

// Selector hooks
export const useCurrentStep = () => useStaffFormStore((s) => s.currentStep);
export const useStep1Data = () => useStaffFormStore((s) => s.step1Data);
export const useStep2Data = () => useStaffFormStore((s) => s.step2Data);
export const useStep3Data = () => useStaffFormStore((s) => s.step3Data);
export const useStep4Data = () => useStaffFormStore((s) => s.step4Data);
export const useStep5Data = () => useStaffFormStore((s) => s.step5Data);
export const useStep6Data = () => useStaffFormStore((s) => s.step6Data);
export const useStep5Complete = () => useStaffFormStore((s) => s.step5Complete);
export const useIsSubmitting = () => useStaffFormStore((s) => s.isSubmitting);
export const useIncompleteSteps = () => useStaffFormStore((s) => s.incompleteSteps);

// Step labels with colors
export const STAFF_FORM_STEPS = [
  { id: 1, title: 'প্রোফাইল', titleEn: 'Profile', subtitle: 'ব্যক্তিগত তথ্য', icon: 'User', color: 'cyan' },
  { id: 2, title: 'ঠিকানা ও পরিচয়', titleEn: 'Address', subtitle: 'ঠিকানা ও পরিচয়পত্র', icon: 'MapPin', color: 'emerald' },
  { id: 3, title: 'শিক্ষাগত যোগ্যতা', titleEn: 'Education', subtitle: 'শিক্ষাগত যোগ্যতা', icon: 'BookOpen', color: 'violet' },
  { id: 4, title: 'অভিজ্ঞতা ও দক্ষতা', titleEn: 'Experience', subtitle: 'কাজের অভিজ্ঞতা', icon: 'Star', color: 'amber' },
  { id: 5, title: 'যোগাযোগ', titleEn: 'Contact', subtitle: 'যোগাযোগ ও রেফারেন্স', icon: 'Phone', color: 'rose' },
  { id: 6, title: 'পেমেন্ট', titleEn: 'Payment', subtitle: 'বেতন ও চুক্তি', icon: 'Wallet', color: 'indigo' },
] as const;
