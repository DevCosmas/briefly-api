import dotenv from 'dotenv';
dotenv.config();
import createServer from './utils/server';

const PORT: number = (process.env.PORT as any) || 3000;
// console.log(process.env.NODE_ENV);

const app = createServer();
app.listen(PORT, () => {
  console.log('Server is up and paying attention');
});
