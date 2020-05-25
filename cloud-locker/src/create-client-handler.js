const Oauth2Server = require('./modules/oauth-server/oauth.server');

exports.handler = async (event) => {
    try {
        const server = new Oauth2Server();
        const client = await server.createClient();

        return {
            statusCode: 200,
            body: client,
        };

    } catch (ex) {
        return {
            statusCode: 500,
            body: JSON.stringify(ex),
        };
    }

};