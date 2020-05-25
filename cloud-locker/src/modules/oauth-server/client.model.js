class Client{
    constructor(clientId, clientSecret, grants) {
       this.clientId = clientId;
       this.clientSecret = clientSecret;
       this.grants = grants;
    }

    toDynamoObject = () => {
        return {

            'ClientId': { S: this.clientId },
            'ClientSecret': { S: this.clientSecret },
            'Grants': {SS: this.grants}
        }
    }
}

module.exports = Client;
