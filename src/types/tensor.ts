import type { TrainData } from "./traindata";

export type NlpType = {
  addLanguage: (language: string) => void;
  addDocument: (language: string, question: string, formatted: string) => void;
  addAnswer: (language: string, formatted: string, answer: string) => void;
  train: () => Promise<void>;
  save: () => void;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  process: (language: string, message: string) => Promise<any | {
    answer: string;
  }>;
};

export interface Tensor {
  nlp?: NlpType;
  init: () => Promise<void>;
  loadModel: () => Promise<void>;
  getData: () => Promise<TrainData[]>;
  addModel: (trainingData: TrainData[]) => Promise<void>;
  detectLanguage: (text: string, fallBack?: string) => Promise<string>;
  getAnAnswer: (message: string, language: string) => Promise<string>;
  answerTheQuestion: (message: string) => Promise<string>;
}
