import { checkSchema } from 'express-validator';

export default checkSchema({
    name: {
        errorMessage: 'Name is required',
        notEmpty: true,
        isLength: {
            options: { min: 5, max: 100 },
            errorMessage: 'Length must be between 5 and 100',
        },
    },
    address: {
        errorMessage: 'Addreess is required',
        notEmpty: true,
        isLength: {
            options: { min: 5, max: 255 },
            errorMessage: 'Lenght must be between 5 and 255',
        },
    },
});
