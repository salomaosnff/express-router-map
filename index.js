const Express = require("express");

class RouterMap {
  constructor(map, express) {
    this.express = express || RouterMap.express || Express;
    this.use = map.use && map.use.constructor === Object ? map.use : {};
    this.routes =
      map.routes && map.routes.constructor === Object ? map.routes : {};

    this.notFound =
      typeof map.notFound === "function"
        ? map.notFound
        : (req, res, next) => next();

    this.errorHandler =
      typeof map.errorHandler === "function"
        ? map.errorHandler
        : (e, req, res, next) => next(e);
  }

  static normalize(value, array = true) {
    if (typeof value === "function") return array ? [value] : value;

    if (value instanceof RouterMap) {
      return value.toRouter();
    }

    if (value instanceof Array) {
      return value.map(v => RouterMap.normalize(v, false));
    }

    return value;
  }

  toRouter() {
    const router = this.express.Router();

    for (let path in this.use) {
      let middleware = RouterMap.normalize(this.use[path]);
      router.use(path, middleware);
    }

    for (let path in this.routes) {
      const route = router.route(path);
      const routeItem = this.routes[path];

      if (typeof routeItem === "function" || routeItem.constructor === Array) {
        route.all(routeItem);
        continue;
      }

      for (let method in routeItem) {
        let middlewares = RouterMap.normalize(routeItem[method]);
        method = method.toLowerCase();
        route[method].call(route, middlewares);
      }
    }

    if (this.notFound) {
      router.use(this.notFound);
    }

    if (this.errorHandler) {
      router.use(this.errorHandler);
    }

    return router;
  }
}

RouterMap.express = Express;

module.exports = RouterMap;
