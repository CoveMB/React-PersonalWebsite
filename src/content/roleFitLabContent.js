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

export const roleFitAiFailureMessages = Object.freeze({
  invalid_json: "The local model returned text that was not valid JSON.",
  invalid_schema: "The local model returned JSON with the wrong structure.",
  no_valid_notes: "The model returned structured output, but no notes passed the source-evidence checks.",
  no_notes_generated: "The local model returned a valid but empty assessment; no additional AI commentary was generated.",
  generation_limit: "The local model reached its generation limit before producing a usable structured response.",
  empty_response: "The local model returned an empty response.",
  response_too_long: "The model returned an oversized response that could not be validated.",
  validation_unavailable: "The model response could not be checked against the current evidence.",
  structured_output_unsupported: "The local model or runtime rejected JSON-constrained generation.",
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
