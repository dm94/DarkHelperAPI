import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import { Error400Default, Error503Default } from '@customtypes/errors';
import { AddAnswerToDatabaseRequest } from '@customtypes/requests/train';
import { MongoCollections } from '@customtypes/shared';
import { TrainData } from '@customtypes/traindata';

const routes: FastifyPluginAsync = async (server) => {
  server.post<AddAnswerToDatabaseRequest>(
    '/',
    {
      onRequest: [server.botAuth],
      schema: {
        description:
          'Train the bot by adding questions and answers',
        summary: 'addAnswerToDatabase',
        operationId: 'addAnswerToDatabase',
        tags: ['bot'],
        body: {
          type: 'object',
          properties: {
            question: { type: 'string' },
            answer: { type: 'string' },
            collection: { type: 'string', enum: Object.values(MongoCollections), },
            guilid: { type: 'string' },
          },
        },
        security: [
          {
            apiKey: [],
          },
        ],
        response: {
          201: Type.Object({}),
          400: Error400Default,
          503: Error503Default,
        },
      },
    },
    async (request, reply) => {
      if (!request?.body?.question || !request?.body?.answer || !request?.body?.collection) {
        return reply.code(400).send();
      }

      if (!Object.values(MongoCollections).includes(request?.body?.collection)) {
        return reply.code(400).send();
      }

      try { 
        const language = await server.tensor.detectLanguage(request?.body?.question);

        const data: TrainData = request?.body?.guilid ? {
          guilid: request?.body?.guilid,
          language: language,
          question: request?.body?.question,
          answer: request?.body?.answer,
        } : {
          language: language,
          question: request?.body?.question,
          answer: request?.body?.answer,
        }

        await server.mongoConnector.addTrainData(data, request.body.collection);

        return reply.code(201).send();
      } catch (error) {
        console.error(error);
        return reply.code(503).send({
          message: "Error: Internal error"
        });
      }
    },
  );
};

export default routes;
