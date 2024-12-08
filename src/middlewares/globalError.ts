import { NextFunction, Response, Request } from 'express';

import { HttpError } from 'http-errors';
import logger from '../config/logger';
import { v4 as uuidv4 } from 'uuid';

export const globalErrorHandler = (
    error: HttpError,
    req: Request,
    res: Response,
    _next: NextFunction,
) => {
    const errorId = uuidv4();
    const statusCode = error.status || 500;
    const isProduction = process.env.NODE_ENV === 'dev';
    let message = isProduction ? 'Internal server error' : error.message;

    if (statusCode < 500) {
        message = error.message;
    }
    logger.error(error.message, {
        refID: errorId,
        error: error.stack,
        path: req.path,
        method: req.method,
        statusCode,
    });
    res.status(statusCode).json({
        errors: [
            {
                refID: errorId,
                type: error.name,
                msg: message,
                statusCode,
                path: req.path,
                method: req.method,
                location: 'Auth Server',
                stack: isProduction ? null : error.stack,
            },
        ],
    });
};
