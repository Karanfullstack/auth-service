import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';
import logger from './config/logger';
import userRouter from './routes/auth';
import tenantRouter from './routes/tenant';
import cookieParser from 'cookie-parser';
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', userRouter);
app.use('/tenants', tenantRouter);

app.use((error: HttpError, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(error.message);
    const statusCode = error.statusCode || error.status || 500;

    res.status(statusCode).json({
        errors: [
            {
                type: error.name,
                msg: error.message,
                path: '',
                location: '',
                details: error.stack,
            },
        ],
    });
});

export default app;
