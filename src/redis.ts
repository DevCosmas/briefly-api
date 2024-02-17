import * as redis from 'redis';

const client: any = redis.createClient({
  password: process.env.REDIS_PASSWORD as string,
  socket: {
    host: process.env.REDIS_HOST as string,
    port: process.env.REDIS_PORT as any,
  },
});
// const client: any = redis.createClient(process.env.REDIS_HOST as any);
client.on('error', (err: any) => console.log('Redis Client Error', err));
client.connect();
export default client;
