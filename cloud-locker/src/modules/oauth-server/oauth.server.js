const OAuth2Server = require('oauth2-server');
const _ = require('lodash');
const moment = require('moment');
const OauthModel = require('./oauth.model');
const UnauthorizedError = require('../errors/unauthorized-error');

class AuthServer {
    constructor() {
        this.server = new OAuth2Server({
            model: OauthModel,
            accessTokenLifetime: 60 * 60 /*60 minutes*/
        });
    }

    createClient = async () => {
        return OauthModel.createClient();
    };

    createToken = async (clientId, clientSecret) => {
        //authorization key is base64(clientId:secretId)
        const clientBuffer = Buffer.from(`${clientId}:${clientSecret}`);
        const clientBufferInBase64 = clientBuffer.toString('base64');

        //Create a valid request to the oauth2 server
        const body = { "grant_type": "client_credentials" };
        const request = new OAuth2Server.Request({
            "method": "POST",
            body,
            "headers": {
                "authorization": `Basic ${clientBufferInBase64}`,
                "content-type": "application/x-www-form-urlencoded",
                'content-length': JSON.stringify(body).length
            },
            "query": {}
        });

        const response = new OAuth2Server.Response({});
        return this.server.token(request, response);
    }

    validate = async (accessToken) => {
        if (_.isEmpty(accessToken)) {
            throw new UnauthorizedError("Access Token is a mandatory parameter");
        }

        const token = await OauthModel.getAccessToken(accessToken);
        if (_.isEmpty(token)) {
            throw new UnauthorizedError("Access Token is not valid");
        }

        if (moment.utc().isSameOrAfter(moment(token.accessTokenExpiresAt))) {
            throw new UnauthorizedError("Access Token is not valid anymore");
        }

        return true;
    }
}

module.exports = AuthServer;