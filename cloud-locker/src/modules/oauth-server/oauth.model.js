// Copied from https://github.com/14gasher/oauth-example/blob/master/auth/oauth/model.js
// See https://oauth2-server.readthedocs.io/en/latest/model/spec.html for what you can do with this

const _ = require('lodash');
const Uuid = require('uuid/v4');
const moment = require('moment');
const Dynamo = require('../wrappers/dynamo/dynamo');
const Client = require('./client.model');
const Token = require('./token.model');

const NotImplementedError = require('../errors/not-implemented-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const CLIENT_TABLE = "cloud-locker-clients";
const TOKEN_TABLE = "cloud-locker-tokens";


module.exports = {
    getClient: async (clientId, clientSecret) => {
        const dynamo = new Dynamo();

        const client = await dynamo.getItemAsync(CLIENT_TABLE, { 'ClientId': { S: clientId } });
        if (_.isEmpty(client) || _.isEmpty(client.Item)) {
            throw new UnauthorizedError("client is not valid");
        }

        if (client.Item.ClientSecret.S != clientSecret) {
            throw new UnauthorizedError("secret is not valid");
        }

        return new Client(client.Item.ClientId.S, client.Item.ClientSecret.S, client.Item.Grants.SS);
    },

    getUserFromClient: async function (client) {
        return {};
    },

    saveToken: async (token, client, user) => {
        const dynamo = new Dynamo();

        const tokenObj = new Token(token.accessToken, token.accessTokenExpiresAt, client.clientId, user);

        await dynamo.putItemAsync(TOKEN_TABLE, tokenObj.toDynamoObject());
        //await dynamo.enableTtl(TOKEN_TABLE, "TtlEpochSeconds");
        
        return tokenObj;

    },

    getAccessToken: async (token) => {

        const dynamo = new Dynamo();

        const tokenObj = await dynamo.getItemAsync(TOKEN_TABLE, { 'AccessToken': { S: token } });
        if (_.isEmpty(tokenObj) || _.isEmpty(tokenObj.Item)) {
            throw new UnauthorizedError("token is not valid");
        }

        return new Token(tokenObj.Item.AccessToken.S, new Date(tokenObj.Item.AccessTokenExpiresAt.S),
        tokenObj.Item.Client.S, {});
    },

    revokeToken: (token) => {
        throw new NotImplementedError("revoke token is not supported");
    },

    createClient: async () => {
        const dynamo = new Dynamo();
        const client = new Client(Uuid(), Uuid(), ["client_credentials"]);

        await dynamo.putItemAsync(CLIENT_TABLE, client.toDynamoObject());
        return client;
    }
}