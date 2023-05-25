import express from "express";
import cors from "cors";

import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
} from "./errorHandlers.js";

const server = express();

// * MIDDLEWARES *
server.use(cors());
server.use(express.json());

// **** ENDPOINTS ****
//server.use("/users", usersRouter);
//server.use("/recipes", recipesRouter);

// ** ERROR HANDLERS **
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

export default server;
