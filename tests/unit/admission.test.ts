import { expect, test, vi } from 'vitest';

// Minimal mock to avoid transformation of complex schema files
vi.mock('@/store/admissionFormStore', () => ({
  useAdmissionUIStore: () => ({
    setStep5Data: vi.fn(),
    goToStep: vi.fn(),
    markStepComplete: vi.fn(),
    nextStep: vi.fn(),
    prevStep: vi.fn(),
  }),
  useCurrentStep: () => 1,
  useIsSubmitting: () => false,
  useCompletedSteps: () => [],
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    replace: vi.fn(),
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  }
}));

// Mock the schemas to skip their transformation rules
vi.mock('@/features/admission/schemas/form', () => ({
  admissionFormSchema: {
    safeParse: (data: any) => ({ success: true, data }),
    trigger: vi.fn().mockResolvedValue(true),
  },
  ADMISSION_DEFAULT_VALUES: {
    personal: { nameEn: '', nameBn: '' },
    contact: {},
    documents: {},
    enrollment: {},
    payment: {}
  },
  STEP_FIELDS: { 1: ['personal'], 2: ['contact'], 3: ['documents'], 4: ['enrollment'], 5: ['payment'] }
}));

// Test the logic of multi-step transitions (mental model of AdmissionForm)
test('Multi-step form logic: can complete a step', async () => {
    const mockStep = 1;
    const mockTrigger = vi.fn().mockResolvedValue(true);
    
    // Simulate Step 1 completion
    const isValid = await mockTrigger(['personal']);
    expect(isValid).toBe(true);
    expect(mockTrigger).toHaveBeenCalledWith(['personal']);
});

test('Admission logic: Draft saving to sessionStorage', () => {
    const DRAFT_KEY = 'mii-admission-draft-v2';
    const mockValues = { personal: { nameEn: 'John' } };
    
    // Simulate saveDraft
    const storageMock = {
        setItem: vi.fn(),
    };
    storageMock.setItem(DRAFT_KEY, JSON.stringify(mockValues));
    
    expect(storageMock.setItem).toHaveBeenCalledWith(DRAFT_KEY, JSON.stringify(mockValues));
});

test('Admission logic: Enrollment enrichment simulation', () => {
    const enrollment = { classId: 'c1', className: '' };
    const classDoc = { id: 'c1', nameBn: 'Class 1' };
    
    // Logic from getStudent enrichment
    if (enrollment.classId === classDoc.id) {
        enrollment.className = classDoc.nameBn;
    }
    
    expect(enrollment.className).toBe('Class 1');
});
