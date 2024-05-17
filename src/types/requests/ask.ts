import { RequestGenericInterface } from 'fastify/types/request';

export interface AnswerQuestionRequest extends RequestGenericInterface {
  Querystring: {
    question: string;
  };
}