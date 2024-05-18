import { Static, Type } from '@sinclair/typebox';

export const TranDataSchema = Type.Object({
  id: Type.Optional(Type.String()),
  question: Type.String(),
  answer: Type.String(),
  language: Type.String(),
  guilid: Type.Optional(Type.String()),
});

export type TrainData = Static<typeof TranDataSchema>;
