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
    ready: 'Analysis runs locally. The independent evidence assessment compares public résumé and project sources. The on-device model separately reads the complete job description and published Markdown résumé when they fit its context. The first AI run downloads model files. The job description is not uploaded.',
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

export const roleFitAiFailureMessages = Object.freeze({
  input_context_limit: "The complete job description and published résumé exceed this local model's conservative input budget. Nothing was truncated. The independent evidence assessment remains available.",
  resume_unavailable: "The published Markdown résumé could not be prepared for local AI processing.",
  generation_limit: "The local model reached its output limit before completing its Markdown assessment.",
  empty_response: "The local model returned an empty response.",
  response_too_long: "The model returned an oversized Markdown response.",
  structured_output_unsupported: "The model runtime rejected the requested generation format.",
  download_failed: "Model files could not be downloaded. Check the connection or browser model-cache settings.",
  load_failed: "The local AI model could not initialize on this device.",
  generation_failed: "The local AI model encountered an error during text generation.",
  model_ready_timeout: "The model reported 100% loaded but did not finish initializing. The attempt was stopped.",
  stream_startup_timeout: "The model did not start returning its response. The attempt was stopped.",
  first_token_timeout: "The local model did not deliver its first token within the time limit while preparing the prompt or generating. A smaller model was attempted if available. This does not establish whether WebGPU stalled.",
  generation_stalled: "The model began responding, but generation stopped progressing before it finished.",
  generation_timeout: "The local model exceeded its maximum generation duration. The attempt was stopped.",
  invalid_stream: "The model returned an unsupported streaming response.",

  memory_limit: "The device ran out of available memory while running the local AI model.",
  gpu_error: "WebGPU became unavailable or reported a device error during local AI processing."
});
