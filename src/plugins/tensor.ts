import { dockStart } from "@nlpjs/basic";
import { NormalizerEs, StemmerEs, StopwordsEs } from "@nlpjs/lang-es";
import { NormalizerEn, StemmerEn, StopwordsEn } from "@nlpjs/lang-en";
import cld from "cld";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { Tensor } from "@customtypes/tensor";
import fp from "fastify-plugin";
import { MongoCollections, validLanguages } from "@customtypes/shared";
import { TrainData } from "@customtypes/traindata";

const normalizerEs = new NormalizerEs();
const normalizerEn = new NormalizerEn();

const stemmerEs = new StemmerEs();
stemmerEs.stopwords = new StopwordsEs();

const stemmerEn = new StemmerEn();
stemmerEn.stopwords = new StopwordsEn();

let serverInstance: FastifyInstance;

const tensor: Tensor = {
  nlp: undefined,
  init: async () => {
    const dock = await dockStart({
      settings: {
        nlp: {
          languages: validLanguages,
        },
      },
      use: ["Nlp", "Basic", "LangEn", "LangEs"],
    });
    tensor.nlp = dock.get("nlp");
    if (!tensor.nlp) {
      return;
    }

    tensor.nlp.addLanguage("es");
    tensor.nlp.addLanguage("en");

    await tensor.loadModel();
  },
  loadModel: async () => {
    const data = await tensor.getData();
    await tensor.addModel(data);
  },
  getData: async () => {
    let data: TrainData[] = [];

    try {
      await Promise.all(Object.values(MongoCollections).map(async (collection) => {
        const response = await serverInstance.mongoConnector.getTrainData(collection);
        data = data.concat(response);
      }));

      console.info(`${new Date().toLocaleTimeString()} | ${data.length} Questions/Answers loaded from DB`);
    } catch (error) {
      console.log(error);
    }

    return data;
  },
  addModel: async (trainingData: TrainData[]) => {
    if (!tensor?.nlp) {
      return;
    }

    console.info(new Date().toLocaleTimeString(), "AI Logic: Model loading");

    try {
      trainingData.forEach((data) => {
        if (!data.question || !data.answer) {
          return;
        }
  
        if (!validLanguages.includes(data.language)) {
          return;
        }
  
        const language = data.language ?? "es";
        let formatted = data.answer;
  
        if (language === "es") {
          const tokens = stemmerEs.tokenizeAndStem(data.question, false);
          formatted = tokens.join(".").toLowerCase();
        } else if (language === "en") {
          const tokens = stemmerEn.tokenizeAndStem(data.question, false);
          formatted = tokens.join(".").toLowerCase();
        }
  
        tensor.nlp?.addDocument(language, data.question, formatted);
        tensor.nlp?.addAnswer(language, formatted, data.answer);
      });
      await tensor.nlp?.train();
      tensor.nlp?.save();
    } catch (error) {
      console.log(error);
    }

    console.info(new Date().toLocaleTimeString(), "AI Logic: Model loaded");
  },
  detectLanguage: async (text, fallBack = "en") => {
    try {
      const response = await cld.detect(text);
      if (response?.languages && response?.languages.length > 0) {
        return response.languages?.[0]?.code;
      }
    } catch (err) {
      console.warn(err);
    }

    return fallBack;
  },
  getAnAnswer: async (message, language) => {
    if (!tensor?.nlp) {
      return;
    }

    if (language === "es") {
      message = normalizerEs.normalize(message);
    } else if (language === "en") {
      message = normalizerEn.normalize(message);
    }

    const response = await tensor.nlp?.process(language, message);
    if (response?.answer) {
      return response.answer;
    }
  
    return null;
  },
  answerTheQuestion: async (question: string) => {
    const language = await tensor.detectLanguage(question);
    const response = await tensor.getAnAnswer(question, language);

    return response ?? "No answer";
  }
}

const tensorPlugin: FastifyPluginAsync = async (server) => {
  serverInstance = server;
  await tensor.init();
  server.decorate("tensor", tensor);
};

declare module 'fastify' {
  export interface FastifyInstance {
    tensor: Tensor;
  }
}

export default fp(tensorPlugin);