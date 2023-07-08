let logger = global.logger;

export default class {
  #dictionary = {};

  constructor() {
    if (logger === undefined) {
      logger = console;
      setTimeout(this.changeLogger, 1 * 1000);
    }
  }

  changeLogger() {
    logger = global.logger;
  }

  getDict = () => {
    return this.#dictionary;
  };

  resolveDict = async (search) => {
    logger.debug("resolver", "Got function request " + search);
    return new Promise(async (resolve, reject) => {
      if (this.#dictionary[search] !== undefined) {
        logger.debug(
          "resolver",
          "Resolved function request " + search + " from cache"
        );
        resolve(this.#dictionary[search]);
      } else {
        try {
          const splitSearch = search.split(".");
          let importString;

          if (process.platform === "win32") {
            importString = "file://" + process.cwd() + "/src/";
          } else {
            importString = process.cwd() + "/src/";
          }

          while (splitSearch.length > 0) {
            let currElem = splitSearch.shift();

            importString += currElem + "/";
          }

          import(importString.slice(0, -1) + ".mjs").then((mod) => {
            logger.debug(
              "resolver",
              "Resolved function request " + search + " per import."
            );

            if (mod.default !== undefined) {
              this.#dictionary[search] = mod.default;
              resolve(mod.default);
            } else {
              resolve(mod);
            }
          });
        } catch (err) {
          logger.error("express", err);

          reject(err);
        }
      }
    });
  };
}
