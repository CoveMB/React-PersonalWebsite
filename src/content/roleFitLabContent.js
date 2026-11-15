import { ROLE_FIT_LAB_LEAD } from './texts/roleFitTexts';

export const roleFitLabSectionContent = {
  badge: 'Local AI · Evidence-grounded',
  contactLinkLabel: 'Send me the role directly',
  contactPrompt: 'Prefer a direct conversation instead?',
  eyebrow: 'Optional lab',
  fieldHint: 'Paste a role description. Enter inserts a new line; Ctrl+Enter (or Cmd+Enter) starts both assessments. Re-analyze any time.',
  inputLabel: 'Role description',
  lead: ROLE_FIT_LAB_LEAD,
  noteLabel: 'Privacy',
  placeholder: 'Paste a job posting to compare its requirements with documented portfolio and résumé work.',
};

export const roleFitLabMessageContent = {
  browserSupport: {
    ready: 'Analyze starts both assessments. The local model ranks verified requirement matches; its first use may download substantial files. Pasted role text stays on this device.',
    unavailable: 'The mechanical assessment works without a GPU. This browser cannot run the local AI model (WebGPU/Worker required); your role text stays on this device.',
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
