import { RequestGenericInterface } from 'fastify/types/request';

export interface AddAnswerToDatabaseRequest extends RequestGenericInterface {
  Body: {
    question: string;
    answer: string;
    collection: MongoCollections;
    guilid?: string;
  };
}

export enum MongoCollections {
  QUESTIONS_EXTRA = "extraquestions",
  QUESTIONS = "questions"
}