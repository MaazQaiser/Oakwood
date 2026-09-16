import { MARKETING_CONSENT_WORDING } from "@/lib/eligibility/copy";
import { eskimoIntegration, liveChatIntegration } from "@/lib/api/integrations";

export const SUPPORT_HUB_EYEBROW = "Support";
export const SUPPORT_HUB_H1 = "How can we help?";
export const SUPPORT_HUB_INTRO =
  "Find an answer, get in touch, or raise a complaint. Call if you can, or send a message if we cannot pick up.";

export const SUPPORT_HUB_META_TITLE = "Help and contact";
export const SUPPORT_HUB_META_DESCRIPTION =
  "Contact Oakwood Motor Company in Bury and Chorley, browse FAQs, or raise a complaint. Call 0161 762 1000 or send a message.";

export const CONTACT_SECTION_TITLE = "Contact Oakwood";
export const CONTACT_CHOOSE_HELP = "Choose what you need help with";
export const CONTACT_METHOD_TITLE = "How would you like to get in touch?";
export const CONTACT_CALL = "Call Oakwood";
export const CONTACT_MESSAGE = "Send us a message";
export const CONTACT_CALLBACK = "Request a callback";
export const CONTACT_DIRECTIONS = "Get directions";

export const CONTACT_OUT_OF_HOURS =
  "If we cannot take your call, send a message or request a callback. We do not leave you with a closed page.";

export const CONTACT_CHAT_UNAVAILABLE =
  "Managed live chat is not connected yet. Use the form or request a callback instead.";

export const CONTACT_HOURS_NOTICE =
  "Opening hours will appear here when the location content source is connected.";

export const CONTACT_FORM_TITLE = "Send a message";
export const CONTACT_FORM_INTRO =
  "Tell us how we can help. We only ask for what we need to handle your enquiry.";
export const CONTACT_SUBMIT = "Send message";
export const CONTACT_CALLBACK_SUBMIT = "Request a callback";
export const CONTACT_SUCCESS_TITLE = "We've received your message.";
export const CONTACT_SUCCESS_NEXT =
  "Oakwood will contact you using the details you gave.";
export const CONTACT_FAILURE_TITLE = "We couldn't send your message.";
export const CONTACT_TRY_AGAIN = "Try again";

export const CONTACT_VEHICLE_HEADING = "Vehicle";
export const CONTACT_STOCK_HEADING = "Stock reference";

export const FAQ_H1 = "Frequently asked questions";
export const FAQ_INTRO =
  "Answers from Oakwood’s published buying, finance, reservation and aftersales information. If you cannot find what you need, contact us.";
export const FAQ_META_TITLE = "FAQs";
export const FAQ_META_DESCRIPTION =
  "FAQs about buying a used car from Oakwood, finance eligibility, part exchange, reservations, servicing, MOT and warranty.";
export const FAQ_SEARCH_LABEL = "Search questions";
export const FAQ_EMPTY =
  "We don't have a published answer for that yet. Contact Oakwood and we'll help.";
export const FAQ_CONTACT = "Contact Oakwood";

export const COMPLAINTS_H1 = "Complaints";
export const COMPLAINTS_INTRO =
  "You can raise a complaint online or by calling Oakwood. You do not have to phone before you submit a complaint on this page.";
export const COMPLAINTS_META_TITLE = "Complaints";
export const COMPLAINTS_META_DESCRIPTION =
  "How to raise a complaint with Oakwood Motor Company. Submit a complaint online or call our Bury showroom.";
export const COMPLAINTS_HOW_TITLE = "How to raise a complaint";
export const COMPLAINTS_HOW_BODY =
  "Use the form on this page, or call Oakwood using the number shown for Bury. Include enough detail for us to understand what happened. An existing order or reservation reference helps if you have one.";
export const COMPLAINTS_HANDLE_TITLE = "How Oakwood handles complaints";
export const COMPLAINTS_HANDLE_BODY =
  "Oakwood will review what you send and contact you using the details you give. Approved response deadlines and any escalation process are not published on this website yet, so this page does not invent them.";
export const COMPLAINTS_NEXT_TITLE = "What happens next";
export const COMPLAINTS_NEXT_BODY =
  "After you submit, you will see a confirmation and a reference. Keep that reference if you contact us again.";
export const COMPLAINTS_SUBMIT = "Submit complaint";
export const COMPLAINTS_SUCCESS_TITLE = "Your complaint has been submitted.";
export const COMPLAINTS_SUCCESS_NEXT =
  "Oakwood will review it and contact you using the details you gave.";
export const COMPLAINTS_FAILURE_TITLE = "We couldn't submit your complaint.";
export const COMPLAINTS_PROCEDURE_PENDING =
  "A full written complaint procedure is not in the content source yet. This page does not add timelines or regulator steps that Oakwood has not published here.";

export const SUPPORT_CRM_NOTICE =
  "Enquiries are stored until the CRM is connected. Eskimo is not live on this site.";

export const SUPPORT_PRIVACY_NOTE =
  "We use your details to handle this enquiry. See the privacy policy for how Oakwood uses personal data.";

export const SUPPORT_MARKETING_CONSENT = MARKETING_CONSENT_WORDING;
export const SUPPORT_MARKETING_SEPARATE =
  "Marketing updates are optional and separate from this enquiry.";

export const SUPPORT_CHAT_CONNECTED = liveChatIntegration.implemented;
export const SUPPORT_CRM_CONNECTED = eskimoIntegration.implemented;
