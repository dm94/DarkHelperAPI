import { RequestGenericInterface } from 'fastify/types/request';

export interface AnswerQuestionRequest extends RequestGenericInterface {
  Querystring: {
      answer: string;
  };
}