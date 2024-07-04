import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import { Error400Default, Error404Default, Error503Default } from '@customtypes/errors';
import { ApproveQuestionRequest } from '@customtypes/requests/questions';
import { MongoCollections } from '@customtypes/shared';

const routes: FastifyPluginAsync = async (server) => {
  server.post<ApproveQuestionRequest>(
    '/',
    {
      onRequest: [server.botAuth],
      schema: {
        description: 'Approve a question',
        summary: 'approveQuestion',
        operationId: 'approveQuestion',
        tags: ['web'],
        params: {
          type: 'object',
          properties: {
            questionid: { type: 'string' },
          },
        },
        security: [
          {
            apiKey: [],
          },
        ],
        response: {
          200: Type.Object({}),
          404: Error404Default,
          400: Error400Default,
          503: Error503Default,
        },
      },
    },
    async (request, reply) => {
      console.log("Entra")


      if (!request?.params.questionid) {
        return reply.code(400).send();
      }

      try {
        const data = await server.mongoConnector.getTrainDataById(request.params.questionid, MongoCollections.QUESTIONS_EXTRA);
        if (!data) {
          return reply.code(404).send();
        }

        await server.mongoConnector.addTrainData(data, MongoCollections.QUESTIONS);
          await server.mongoConnector.deleteEntryById(request.params.questionid, MongoCollections.QUESTIONS_EXTRA);

        return reply.code(200).send();
      } catch(error) {
        console.error(error);
        return reply.code(503).send({
          message: "Error: Internal error"
        });
      }
    },
  );
};

export default routes;
