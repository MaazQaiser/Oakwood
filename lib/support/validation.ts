import { contactError, locationError, normaliseRegistration } from "@/lib/aftersales/validation";
import { supportComplaintCategories, supportEnquiryTypes } from "@/lib/support/content";
import type { SupportComplaintCategory, SupportEnquiryType } from "@/types/support";

export { contactError, locationError, normaliseRegistration };

export function enquiryTypeError(value: string): string | undefined {
  if (!supportEnquiryTypes.some((item) => item.value === value)) {
    return "Choose what you need help with.";
  }
  return undefined;
}

export function complaintCategoryError(value: string): string | undefined {
  if (!supportComplaintCategories.some((item) => item.value === value)) {
    return "Choose a complaint category.";
  }
  return undefined;
}

export function messageError(value: string, label = "message"): string | undefined {
  if (!value.trim()) {
    return `Enter a ${label}.`;
  }
  if (value.trim().length < 10) {
    return `Enter a little more detail so we can help.`;
  }
  return undefined;
}

export function isEnquiryType(value: string): value is SupportEnquiryType {
  return supportEnquiryTypes.some((item) => item.value === value);
}

export function isComplaintCategory(
  value: string,
): value is SupportComplaintCategory {
  return supportComplaintCategories.some((item) => item.value === value);
}
