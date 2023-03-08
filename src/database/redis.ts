import redis from "redis";

const redisClient = redis.createClient({
  host: "127.0.0.1",
  port: 6379,
  enable_offline_queue: false,
});

redisClient.on("error", (err) => console.log(err));

export default redisClient;
