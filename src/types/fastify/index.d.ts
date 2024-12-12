import type {
  FastifyLoggerInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RawServerDefault,
} from "fastify";

declare module "fastify" {
  export interface FastifyInstance<
    RawServer extends RawServerBase = RawServerDefault,
    _RawRequest extends
      RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
    _RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
    _Logger = FastifyLoggerInstance,
  > {
    authenticate(): void;
    botAuth(): void;
  }
}
