import { checkSchema } from 'express-validator';

export default checkSchema({
    name: {
        trim: true,
        errorMessage: 'Name is required',
        notEmpty: true,
    },
    address: {
        trim: true,
        errorMessage: 'Address is required',
        notEmpty: true,
    },
});
