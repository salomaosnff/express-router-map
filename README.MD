# Express Router Map

## Install

```bash
npm i --save @salomaosnff/express-router-map
```

## Example

```javascript
const express = require("express");
const RouterMap = require("@salomaosnff/express-router-map");

const app = express();

// Create RouterMap instance
const mainRouter = new RouterMap({
  // Set your routes here
  routes: {
    "/": (req, res) => res.send("Welcome to home!"),
    "/donate": (req, res) => res.send("Please, pay me a coffee."),
    "/error": (req, res, next) => next(new Error("Ops!"))
  },

  // NotFound Handler
  notFound: (req, res, next) => next(new Error("Not Found")),

  // Error Handler
  error: (err, req, res, next) => {
    res.send(`An error has occurred: ${err.message}`);
  }
});

// Transforms to Express Router
app.use(mainRouter.toRouter());

app.listen(8080, () => console.log("Server is running..."));
```

## Methods and Middleware stack

```javascript
new RouterMap({
  routes: {
    "/users": {
      GET: UsersController.listAll,
      POST: [checkAuth(), UsersController.create] // Use an array to define a stack of middlewares to execute!
    },
    "/users/:id": {
      GET: UsersController.getOne,
      PUT: [checkAuth(), UsersController.updateOne],
      DELETE: [checkAuth(), UsersController.removeOne]
    }
  }
});
```

## Rest API Example

```javascript
// products.js
module.exports = new RouterMap({
  routes: {
    "/": {
      GET: (req, res) => res.send("List All Products"),
      POST: (req, res) => res.send("Product Created!"),
      ALL: (req, res) => res.send("Method Not Allowed!")
    },
    "/:id": {
      GET: (req, res) => res.send("Show Product details"),
      PUT: (req, res) => res.send("Product Updated!"),
      DELETE: (req, res) => res.send("Product Removed!"),
      ALL: (req, res) => res.send("Method Not Allowed!")
    }
  }
});
```

```javascript
// api.js
module.exports = new RouterMap({
  routes: {
    "/": (req, res) => res.send("Explore the API!")
  },
  // Set API Entrypoints here
  use: {
    "/products": productsMap
  },
  notFound: (req, res, next) => next(new Error("Entrypoint not Found."))
});
```

```javascript
// router.js
const apiMap = require("./api");

module.exports = new RouterMap({
  // Set pages here
  routes: {
    "/": (req, res) => res.send("Website Homepage")
  },

  // Set sub-applications here
  use: {
    "/api": apiMap
  }
});
```
