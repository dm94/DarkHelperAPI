import { TrainData } from "./traindata";

export type NlpType = {
  addLanguage: (language: string) => void;
  addDocument: (language: string, question: string, formatted: string) => void;
  addAnswer: (language: string, formatted: string, answer: string) => void;
  train: () => Promise<void>;
  save: () => void;
  process: (language: string, message: string) => Promise<any>;
}
  
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