import { MongoCollections } from "./shared";
import { TrainData } from "./traindata";

export interface MongoConnector {
    getTrainData: (collection: MongoCollections) => Promise<TrainData[]>;
    addTrainData: (data: TrainData, collectionName: MongoCollections) => Promise<void>;
}