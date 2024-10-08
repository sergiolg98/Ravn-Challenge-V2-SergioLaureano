import 'express-async-errors';
import express from 'express';
import routes from './routes';
import { errorHandler } from './infrastructure/http/middlewares/ErrorHandler';

const app = express();

app.use(express.json());
app.use('/api', routes);

app.use(errorHandler);

export default app;
