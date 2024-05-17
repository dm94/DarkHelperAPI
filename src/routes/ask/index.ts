import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import { Error400Default, Error503Default } from '@customtypes/errors';
import { AnswerQuestionRequest } from '@customtypes/requests/ask';

const routes: FastifyPluginAsync = async (server) => {
  server.get<AnswerQuestionRequest>(
    '/',
    {
      onRequest: [server.botAuth],
      schema: {
        description:
          'Receives a question that the AI answers',
        summary: 'answerQuestion',
        operationId: 'answerQuestion',
        tags: ['bot'],
        querystring: {
          type: 'object',
          required: ['answer'],
          properties: {
            answer: { type: 'string' },
          },
        },
        security: [
          {
            apiKey: [],
          },
        ],
        response: {
          200: Type.Object({
            reply: Type.String(),
          }),
          400: Error400Default,
          503: Error503Default,
        },
      },
    },
    async (request, reply) => {
      if (!request?.query?.answer) {
        return reply.code(400).send();
      }

      try { 
        const response = await server.tensor.answerTheQuestion(request.query.answer);

        return reply.code(200).send({
          reply: response,
        });
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
