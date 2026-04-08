import { WebWorkerMLCEngineHandler } from "@mlc-ai/web-llm";

const roleFitWorkerHandler = new WebWorkerMLCEngineHandler();

self.onmessage = (event) => {
  roleFitWorkerHandler.onmessage(event);
};
