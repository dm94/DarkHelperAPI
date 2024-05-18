

import { MongoCollections } from '@customtypes/shared';
import { RequestGenericInterface } from 'fastify/types/request';

export interface GetTrainDataRequest extends RequestGenericInterface {
  Querystring: {
    size?: number;
    page?: number;
    collection: MongoCollections;
    language?: string;
  };
}