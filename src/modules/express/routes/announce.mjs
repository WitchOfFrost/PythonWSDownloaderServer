const logger = global.logger;
const resolver = global.resolver;

export default (expressInstance) => {
  logger.info("express-routes", "Loading Announce routes...");

  expressInstance.get("/v1/announce", async (req, res, next) => {
    const endpoint = await resolver.resolveDict("api.announce");
    endpoint.GET(req, res);
  });

  expressInstance.post("/v1/announce", async (req, res) => {
    const endpoint = await resolver.resolveDict("api.announce");
    endpoint.POST(req, res);
  });

  logger.info("express-routes", "Loaded Announce routes!");
};
