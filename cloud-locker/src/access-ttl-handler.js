const _ = require('lodash');

const DynamicAccess = require('./modules/dynamic-access/dynamics-access');

/*
    This lambda is private and not accessible outside your AWS
    It triggered by cloud-watch-event every 1 minute.
*/
exports.handler = async (event) => {

    const dynamicAccess = new DynamicAccess();
    try {
        const res = dynamicAccess.accessTtlAsync();
        return {
            statusCode: 200,
            body: {},
        };
    } catch (ex) {
        return {
            statusCode: 500,
            message: 'an unhandled error occurred while trying to run TTL lambda',
            stack: ex.stack
        };
    }
};