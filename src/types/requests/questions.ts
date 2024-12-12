import type { MongoCollections } from "@customtypes/shared";
import type { RequestGenericInterface } from "fastify/types/request";

export interface GetTrainDataRequest extends RequestGenericInterface {
  Querystring: {
    size?: number;
    page?: number;
    collection: MongoCollections;
    language?: string;
  };
}

export interface ApproveQuestionRequest extends RequestGenericInterface {
  Params: {
    questionid: string;
  };
}

export interface DeleteQuestionRequest extends RequestGenericInterface {
  Params: {
    questionid: string;
  };
  Querystring: {
    collection: MongoCollections;
  };
}
