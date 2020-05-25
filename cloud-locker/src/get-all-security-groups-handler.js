const _ = require('lodash');

const Validator = require('./validator');
const DynamicAccess = require('./modules/dynamic-access/dynamics-access');

exports.handler = async (event) => {
    const validator = await Validator.validateTokenAsync(event);
    
    if(!_.isEmpty(validator)){
        return validator;
    }
    
    const dynamicAccess = new DynamicAccess();

    try{
        const res = await dynamicAccess.getAllAsync();

        return {
            statusCode: 200,
            body: {res},
        };
    }
    catch(ex){
        return {
            statusCode: 500,
            message: 'an unhandled error occurred while trying to get security groups',
            stack: ex.stack
        };
    }
};