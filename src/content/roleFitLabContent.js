import { ROLE_FIT_LAB_LEAD } from "./texts/roleFitTexts";

export const roleFitLabSectionContent = {
  badge: "Evidence-grounded · Local",
  contactLinkLabel: "Send me the role directly",
  contactPrompt: "Prefer a direct conversation instead?",
  eyebrow: "Optional lab",
  fieldHint: "Paste a role description. Enter inserts a new line; Ctrl+Enter (or Cmd+Enter) analyzes it. No account or GPU required.",
  inputLabel: "Role description",
  lead: ROLE_FIT_LAB_LEAD,
  noteLabel: "Privacy",
  placeholder: "Paste the job posting here to compare its requirements with documented portfolio and résumé work.",
  enhancementTitle: "Optional AI interpretation",
  enhancementNote: "Runs on your device after you choose it; first use downloads model files and may be slow. The immediate report remains available if it fails.",
};

export const roleFitLabMessageContent = {
  browserSupport: {
    ready: "The immediate analysis runs here without a model. Optional enhancement needs WebGPU and a separate model download; the posting is not uploaded.",
    unavailable: "The immediate analysis works here. Optional local-model enhancement needs a browser with WebGPU and Worker support.",
  },
  buttonLabels: { analyze: "Analyze requirements" },
  errors: {
    missingJobDescription: "Paste a role description first.",
    tooLong: "This posting exceeds 12,000 characters. Remove some text before analyzing; nothing has been silently truncated.",
    missingModel: "No compatible local model was found.",
    enhancementFailed: "Local enhancement failed on this device. Your immediate assessment is unchanged.",
  },
  statusMessages: {
    loading: "Loading the optional local model…",
    success: "Evidence-grounded assessment ready.",
    enhanced: "Validated local enhancement applied; sourced evidence rules remain in force.",
    baselinePreserved: "The immediate assessment remains available.",
    noNewEvidence: "The model did not offer usable verified refinements; the immediate assessment remains available.",
  },
};
