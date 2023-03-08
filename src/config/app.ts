import express from "express";
import morgan from "morgan";
import router from "../routes";
import helmet from "helmet";
// import reqLimiterMiddleware from "../utilities/reqLimiter";
import cors from "../utilities/cors";
import path from "path";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
//import * as server from "./server";
// import socketIo from 'socket.io';
const app = express();


Sentry.init({
  dsn: "https://458586c7cf2e44f7b9593e647ef0a686@o214497.ingest.sentry.io/5974282",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "pug");

// static folder
//app.use(express.static(path.join(__dirname, "../../public")));
app.use("/uploads", express.static("uploads"));

// cors configuration
const corsOptions = {
  origin: "*",
};
app.use((req, res, next) => cors(req, res, next, corsOptions));

// security
// app.use((req, res, next) => reqLimiterMiddleware(req, res, next));
app.use(helmet());

// routes
app.use(Sentry.Handlers.tracingHandler());
app.use(router);
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

//_________________________________________________



export default app;
