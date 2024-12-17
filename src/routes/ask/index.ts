import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";
import { Error400Default, Error503Default } from "@customtypes/errors";
import type { AnswerQuestionRequest } from "@customtypes/requests/ask";

const routes: FastifyPluginAsync = async (server) => {
  server.get<AnswerQuestionRequest>(
    "/",
    {
      onRequest: [server.botAuth],
      schema: {
        description: "Receives a question that the AI answers",
        summary: "answerQuestion",
        operationId: "answerQuestion",
        tags: ["bot"],
        querystring: {
          type: "object",
          required: ["question"],
          properties: {
            question: { type: "string" },
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
      if (!request?.query?.question) {
        return reply.code(400).send();
      }

      try {
        const response = await server.tensor.answerTheQuestion(request.query.question);
        if (!response) {
          return reply.code(400).send();
        }

        return reply.code(200).send({
          reply: response,
        });
      } catch (error) {
        console.error(error);
        return reply.code(503).send({
          message: "Error: Internal error",
        });
      }
    },
  );
};

export default routes;
