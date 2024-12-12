import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";
import { Error400Default, Error503Default } from "@customtypes/errors";
import type { GetTrainDataRequest } from "@customtypes/requests/questions";
import { MongoCollections, validLanguages } from "@customtypes/shared";
import { type TrainData, TranDataSchema } from "@customtypes/traindata";

const routes: FastifyPluginAsync = async (server) => {
  server.get<GetTrainDataRequest, { Reply: TrainData[] }>(
    "/",
    {
      onRequest: [server.botAuth],
      schema: {
        description: "Returns the list of training information",
        summary: "getTrainData",
        operationId: "getTrainData",
        tags: ["web"],
        querystring: {
          type: "object",
          required: ["collection"],
          properties: {
            size: {
              type: "integer",
              default: 10,
              minimum: 1,
              maximum: 100,
            },
            page: {
              type: "integer",
              default: 1,
              minimum: 1,
            },
            collection: {
              type: "string",
              description: "Collection",
              enum: Object.values(MongoCollections),
            },
            language: {
              type: "string",
              description: "To filter by language",
              enum: validLanguages,
            },
          },
        },
        security: [
          {
            apiKey: [],
          },
        ],
        response: {
          200: Type.Array(TranDataSchema),
          400: Error400Default,
          503: Error503Default,
        },
      },
    },
    async (request, reply) => {
      if (!request?.query?.collection) {
        return reply.code(400).send();
      }

      let limit = 10;
      let page = 0;

      if (request.query.size) {
        limit = request.query.size;
      }

      if (request.query.page) {
        page = request.query.page;
      }

      if (page > 0) {
        page = page - 1;
      }

      const filterQuery: { language?: string } = {};
      if (request.query.language) {
        filterQuery.language = request.query.language;
      }

      try {
        const questionsCollection = server.mongo.client
          .db("dark")
          .collection(request.query.collection);

        const data = await questionsCollection
          .find(filterQuery, { projection: { _id: 1, question: 1, answer: 1, language: 1 } })
          .skip(page * limit)
          .limit(limit)
          .toArray();

        const response: TrainData[] = data.map((item) => {
          return {
            id: item._id.toString(),
            question: item.question,
            answer: item.answer,
            language: item.language ?? "en",
          };
        });

        return reply.code(200).send(response);
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
