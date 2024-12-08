import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';
import logger from './config/logger';
import authRouter from './routes/auth';
import tenantRouter from './routes/tenant';
import userRouter from './routes/user';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { globalErrorHandler } from './middlewares/globalError';
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: ['http://localhost:5173'],
        credentials: true,
    }),
);
app.use('/auth', authRouter);
app.use('/tenants', tenantRouter);
app.use('/users', userRouter);

app.use(globalErrorHandler);
// app.use((error: HttpError, _req: Request, res: Response, _next: NextFunction) => {
//     logger.error(error.message);
//     const statusCode = error.statusCode || error.status || 500;

//     res.status(statusCode).json({
//         errors: [
//             {
//                 type: error.name,
//                 msg: error.message,
//                 path: '',
//                 location: '',
//                 details: error.stack,
//             },
//         ],
//     });
// });

export default app;
