export const uptime = Date.now();

// Resolver

import { default as resolverInstance } from "./resolver/main.mjs";

export const resolver = new resolverInstance();
global.resolver = resolver;

// Logger

const loggingInstance = await resolver.resolveDict(
  "modules.winston.class.loggingInstance"
);

export const logger = new loggingInstance();
global.logger = logger;


// Config

const configInstance = await resolver.resolveDict(
    "modules.dotenv.class.dotenvInstance"
  );
  
  export const config = new configInstance();
  
  config.load();

// Express

const apiInstance = await resolver.resolveDict(
  "modules.express.class.expressInstance"
);

export const api = new apiInstance();
global.api = api;

// Database

const databaseInstance = await resolver.resolveDict(
    "modules.mariadb.class.databaseInstance"
  );
  
  export const database = new databaseInstance();
  global.database = database;
