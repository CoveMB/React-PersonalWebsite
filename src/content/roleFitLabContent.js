import { ROLE_FIT_LAB_LEAD } from './texts/roleFitTexts';

export const roleFitLabSectionContent = {
  badge: 'On-device AI · Evidence-led',
  contactLinkLabel: 'Send me the role directly',
  contactPrompt: 'Prefer a direct conversation instead?',
  eyebrow: 'Optional lab',
  fieldHint: 'Paste a job description. Enter adds a line; Ctrl+Enter (or Cmd+Enter) analyzes the role. You can re-analyze at any time.',
  inputLabel: 'Role description',
  lead: ROLE_FIT_LAB_LEAD,
  noteLabel: 'Privacy',
  placeholder: 'Paste the job posting. The analysis compares each identified requirement with documented résumé and project experience.',
};

export const roleFitLabMessageContent = {
  browserSupport: {
    ready: 'Analysis runs locally. Requirements are compared with public résumé and project evidence, then the on-device model may add short interpretations. Its first run downloads model files and it analyzes a bounded selection of requirements from the full posting. The posting is not uploaded.',
    unavailable: 'This browser cannot run the on-device model (WebGPU and Worker required). A clearly labeled evidence-only comparison is available instead. Your pasted job description stays on this device.',
  },
  buttonLabels: { analyze: 'Analyze role' },
  errors: {
    missingJobDescription: 'Paste a role description first.',
    tooLong: 'This posting exceeds 12,000 characters. Remove some text before analyzing; nothing has been silently truncated.',
    missingModel: 'No compatible local AI model was found.',
    modelFailed: 'The local AI model could not finish on this device.',
  },
  statusMessages: {
    loading: 'Preparing the local AI model…',
  },
};
