import { RateLimiterRedis } from "rate-limiter-flexible";
import redisClient from "../database/redis";

const reqLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 50, // 50 requests
  duration: 20, // per 20 second by IP
});

const reqLimiterMiddleware = (req, res, next) => {
  reqLimiter
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).json({
        message: "Too many requested",
      });
    });
};

export default reqLimiterMiddleware;
