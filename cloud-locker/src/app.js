
/*const Auth = require('./modules/oauth-server/oauth.server');
const lambda1 = require('./open-access-to-security-group-handler');
const lambda2 = require('./access-ttl-handler');
*/
const lambda = require('./create-token-handler');
const start = async () => {
    const res = await lambda.handler({clientId: "", clientSecret: ""});
    //const res = await lambda2.handler({});
    console.log("");
};

start();

module.exports = {
    start
};

