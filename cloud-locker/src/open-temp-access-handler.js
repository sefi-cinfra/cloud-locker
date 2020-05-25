
const _ = require('lodash');

const Validator = require('./validator');
const DynamicAccess = require('./modules/dynamic-access/dynamics-access');

const NotFoundError = require('./modules/errors/not-found-error');
/*
    ipAddress - IP Access
    port - Port
    ttl - Time to live (in minutes)
*/
exports.handler = async (event) => {
    //Validation
    const validator = await Validator.validateTokenAsync(event) || Validator.validateOpenAccessRequest(event);

    if(!_.isEmpty(validator)){
        return validator;
    }

    const dynamicAccess = new DynamicAccess();
    try{
        const res = dynamicAccess.openAccessAsync(event.ipAddress, parseInt(event.port), parseInt(event.ttl), event.securityGroupId, event.region);
        return {
            statusCode: 200,
            body: { },
        };
    } catch(ex){
        if(ex instanceof(NotFoundError)){
            return {
                statusCode: 404,
                message: 'could not find security group'
            };
        }

        return {
            statusCode: 500,
            message: 'an unhandled error occurred while trying to open dynamic access',
            stack: ex.stack
        };
    }
};