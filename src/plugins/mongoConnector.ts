import { MongoConnector } from "@customtypes/mongo";
import { MongoCollections } from "@customtypes/shared";
import { TrainData } from "@customtypes/traindata";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

let serverInstance: FastifyInstance;

const controller: MongoConnector = {
    getTrainData: async (collection: MongoCollections) => {
        if (!serverInstance) {
            return [];
        }

        const questionsCollection = serverInstance.mongo.client.db('dark').collection(collection);
        const response = await questionsCollection.find({}, { projection: { _id: 0, question: 1, answer: 1, language: 1 } }).toArray();

        return response as unknown as TrainData[];
    },
    addTrainData: async (data: TrainData, collectionName: MongoCollections) => {
        if (!serverInstance) {
            return;
        }

        const collection = serverInstance.mongo.client.db('dark').collection(collectionName);
        await collection.insertOne(data);
    }
}

const tensorPlugin: FastifyPluginAsync = async (server) => {
  serverInstance = server;
  server.decorate("mongoConnector", controller);
};

declare module 'fastify' {
  export interface FastifyInstance {
    mongoConnector: MongoConnector;
  }
}

export default fp(tensorPlugin);