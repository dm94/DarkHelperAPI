import type { MongoCollections } from "@customtypes/shared";
import type { RequestGenericInterface } from "fastify/types/request";

export interface AddAnswerToDatabaseRequest extends RequestGenericInterface {
  Body: {
    question: string;
    answer: string;
    collection: MongoCollections;
    guilid?: string;
  };
}
