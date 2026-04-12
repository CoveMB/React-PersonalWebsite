export const roleFitLabSectionContent = {
  badge: "Local role-fit assistant",
  contactLinkLabel: "Send me the role directly",
  contactPrompt: "Prefer a direct conversation instead?",
  eyebrow: "Optional lab",
  fieldHint: "Press Enter to generate. Use Shift+Enter for a new line.",
  inputLabel: "Role description",
  lead:
    "This browser-side lab gives a quick role-fit read grounded in portfolio work and resume context. It is useful as a fast first pass, not the main hiring narrative.",
  noteLabel: "Local note",
  placeholder:
    "Paste the role here. The assistant will generate a concise fit summary grounded in portfolio work and resume context.",
  resultEyebrow: "Assistant output",
};

export const roleFitLabMessageContent = {
  browserSupport: {
    missingWebGpu:
      "This feature needs WebGPU, so it works best on recent Chrome or Edge desktop browsers.",
    missingWorker:
      "This browser does not support the worker needed for the local lab.",
    ready:
      "Your pasted job description stays in the browser. The first use needs to download the model, which may take some time.",
  },
  buttonLabels: {
    analyze: "Analyze",
    loading: "Loading lab",
    running: "Running analysis",
  },
  errors: {
    browserUnsupported:
      "This feature needs WebGPU and a worker-enabled browser, ideally recent Chrome or Edge on desktop.",
    downloadFailed:
      "The model files could not be downloaded on this connection.",
    emptyResponse: "The model returned an empty response.",
    genericGenerationFailure:
      "The local lab could not analyze this role on this device.",
    incompatibleBrowser:
      "This browser could not start the local lab model. Try a recent Chrome or Edge desktop build.",
    missingJobDescription: "Paste a job description first.",
    missingModel: "No compatible local model was found.",
    shortJobDescription:
      "Add a little more detail so the assistant has enough context.",
  },
  labels: {
    loadedModel: "Loaded model",
    localLab: "local lab",
  },
  statusMessages: {
    default: "",
    generating: "Running the local role-fit analysis...",
    loading: "Preparing the local lab model...",
    ready:
      "Local lab is ready. Press Enter to generate, or use Shift+Enter for a new line.",
    success:
      "Analysis ready. Paste another role and press Enter to compare a new fit.",
  },
};
