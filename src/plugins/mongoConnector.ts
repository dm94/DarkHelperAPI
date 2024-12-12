import type { MongoConnector } from "@customtypes/mongo";
import type { MongoCollections } from "@customtypes/shared";
import type { TrainData } from "@customtypes/traindata";
import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

let serverInstance: FastifyInstance;

const controller: MongoConnector = {
  getTrainData: async (collection: MongoCollections) => {
    if (!serverInstance) {
      return [];
    }

    const questionsCollection = serverInstance.mongo.client
      .db(serverInstance.config.MONGODB_DATABASE)
      .collection(collection);
    const response = await questionsCollection
      .find({}, { projection: { _id: 0, question: 1, answer: 1, language: 1 } })
      .toArray();

    return response as unknown as TrainData[];
  },
  addTrainData: async (data: TrainData, collectionName: MongoCollections) => {
    if (!serverInstance) {
      return;
    }

    const collection = serverInstance.mongo.client
      .db(serverInstance.config.MONGODB_DATABASE)
      .collection(collectionName);
    await collection.insertOne(data);
  },
  getTrainDataById: async (id: string, collection: MongoCollections) => {
    if (!serverInstance) {
      return undefined;
    }

    const questionsCollection = serverInstance.mongo.client
      .db(serverInstance.config.MONGODB_DATABASE)
      .collection(collection);
    const objectId = new serverInstance.mongo.ObjectId(id);
    const data = await questionsCollection.findOne(
      { _id: objectId },
      { projection: { _id: 0, question: 1, answer: 1, language: 1 } },
    );
    return data as unknown as TrainData;
  },
  deleteEntryById: async (id: string, collection: MongoCollections) => {
    if (!serverInstance) {
      return;
    }

    const questionsCollection = serverInstance.mongo.client
      .db(serverInstance.config.MONGODB_DATABASE)
      .collection(collection);
    const objectId = new serverInstance.mongo.ObjectId(id);
    await questionsCollection.deleteOne({ _id: objectId });
  },
};

const tensorPlugin: FastifyPluginAsync = async (server) => {
  serverInstance = server;
  server.decorate("mongoConnector", controller);
};

declare module "fastify" {
  export interface FastifyInstance {
    mongoConnector: MongoConnector;
  }
}

export default fp(tensorPlugin);
