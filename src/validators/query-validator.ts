import { checkSchema } from 'express-validator';

export default checkSchema(
    {
        q: {
            trim: true,
            customSanitizer: {
                options: (value: unknown) => {
                    return value ? value : '';
                },
            },
        },

        currentPage: {
            trim: true,
            customSanitizer: {
                options: (currentPage) => {
                    const parsedValue = Number(currentPage);
                    return isNaN(Number(currentPage)) ? 1 : parsedValue;
                },
            },
        },
        perPage: {
            trim: true,
            customSanitizer: {
                options: (perPage) => {
                    const parsedValue = Number(perPage);
                    return isNaN(Number(perPage)) ? 6 : parsedValue;
                },
            },
        },
    },
    ['query'],
);
