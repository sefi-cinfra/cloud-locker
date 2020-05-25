const _ = require('lodash');

const Oauth2Server = require('./modules/oauth-server/oauth.server');
const UnauthorizedError = require('./modules/errors/unauthorized-error');

const IpRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;


const validateTokenAsync = async (event) => {
    event = event || {};
    try {
        const server = new Oauth2Server();
        await server.validate(event.accessToken);

    } catch (ex) {
        if (ex instanceof UnauthorizedError) {
            return {
                statusCode: 401,
                body: 'token is invalid'
            };
        }

        return {
            statusCode: 500,
            body: JSON.stringify(ex),
        };
    }
};

const validateOpenAccessRequest = (event) => {
    if (_.isUndefined(event) || _.isUndefined(event.ipAddress) || _.isUndefined(event.port) ||
    _.isUndefined(event.ttl) || _.isUndefined(event.securityGroupId) || _.isUndefined(event.region)) {
        return {
            statusCode: 400,
            message: "missing mandatory arguments",
        };
    }

    if(isNaN(parseInt(event.port))){
        return {
            statusCode: 400,
            message: "port must be a valid number",
        };
    }

    const port = parseInt(event.port);
    if (port < 1 || port > 65536) {
        return {
            statusCode: 400,
            message: "port is our of range",
        };
    }

    if (!IpRegex.test(event.ipAddress)) {
        return {
            statusCode: 400,
            message: "ip is not valid",
        };
    }

    if(isNaN(parseInt(event.ttl)) || parseInt(event.ttl) < 0){
        return {
            statusCode: 400,
            message: "ttl must be a valid number",
        };
    }
};
module.exports = {
    validateTokenAsync,
    validateOpenAccessRequest
};
