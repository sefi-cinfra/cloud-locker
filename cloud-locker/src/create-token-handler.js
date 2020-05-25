const Oauth2Server = require('./modules/oauth-server/oauth.server');
const _ = require('lodash');
exports.handler = async (event) => {

    if(_.isEmpty(event.clientId) || _.isEmpty(event.clientSecret)){
        return {
            statusCode: 400,
            body: {message: 'clientId and clientSecret are mandatory parameters'},
        };
    }

    try {
        const server = new Oauth2Server();
        const token = await server.createToken(event.clientId, event.clientSecret);

        return {
            statusCode: 200,
            body: token,
        };

    } catch (ex) {
        return {
            statusCode: 401,
            body: {message: 'token is not valid'},
        };
    }

};