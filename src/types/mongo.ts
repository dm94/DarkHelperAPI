import { MongoCollections } from "./shared";
import { TrainData } from "./traindata";

export interface MongoConnector {
  getTrainData: (collection: MongoCollections) => Promise<TrainData[]>;
  addTrainData: (data: TrainData, collectionName: MongoCollections) => Promise<void>;
  getTrainDataById: (id: string, collectionName: MongoCollections) => Promise<TrainData | undefined>;
  deleteEntryById: (id: string, collectionName: MongoCollections) => Promise<void>;
}