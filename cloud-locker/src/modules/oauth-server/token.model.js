const moment = require('moment');

class Token{
    constructor(accessToken, accessTokenExpiresAt, client, user) {
       this.accessToken = accessToken;
       this.accessTokenExpiresAt = accessTokenExpiresAt;
       this.client = client;
       this.user = user;
    }

    toDynamoObject = () => {
        return {

            'AccessToken': { S: this.accessToken },
            'AccessTokenExpiresAt': { S: this.accessTokenExpiresAt.toUTCString() },
            'Client': {S: this.client},
            'CreationTime': {S: moment.utc().format('YYYY-MM-DD HH:mm:ss')},
            'TtlEpochSeconds':  {N: Math.round(this.accessTokenExpiresAt.valueOf() / 1000).toString()}
        }
    }
}

module.exports = Token;
