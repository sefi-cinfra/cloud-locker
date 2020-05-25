process.env.AWS_ACCESS_KEY_ID = "AKIAZURWB2HDSITDFF5F";
process.env.AWS_SECRET_ACCESS_KEY = "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";
process.env.AWS_REGION = "eu-west-2";

/*const Auth = require('./modules/oauth-server/oauth.server');
const lambda1 = require('./open-access-to-security-group-handler');
const lambda2 = require('./access-ttl-handler');
*/
const lambda = require('./create-token-handler');
const start = async () => {
    const res = await lambda.handler({clientId: "774398c1-2c2a-4519-b82c-2d430be35a7e", clientSecret: "fad00f45-b1b6-4693-a9bf-9214c4967e43"});
    /*const auth = new Auth();
    const token = await auth.createToken("774398c1-2c2a-4519-b82c-2d430be35a7e","fad00f45-b1b6-4693-a9bf-9214c4967e43");
    const accessToken = token.accessToken;
    const res = await lambda1.handler({accessToken, ipAddress:"79.180.217.215", port:22, ttl:"5", securityGroupId: 'sg-01f5bdb5fb4ff3a8b', region:'eu-west-2'});
    */
   
    //const res = await lambda2.handler({});
    console.log("");
};

start();

module.exports = {
    start
};

