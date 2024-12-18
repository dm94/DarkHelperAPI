import { version, description, author, homepage, bugs, name } from "../../package.json";

export const schema = {
  openapi: {
    info: {
      title: name,
      description: description,
      version: version,
      contact: {
        name: author,
        url: bugs.url,
      },
    },
    externalDocs: {
      url: homepage,
    },
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
      { name: "bot", description: "Discord bot related end-points" },
      { name: "web", description: "Web related end-points" },
    ],
    components: {
      securitySchemes: {
        apiKey: {
          type: "apiKey",
          name: "apiKey",
          in: "header",
        },
        token: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
  },
  hideUntagged: true,
};
