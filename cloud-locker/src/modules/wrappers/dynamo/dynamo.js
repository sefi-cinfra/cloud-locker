const aws = require("aws-sdk");
const util = require("util");
const _ = require("lodash");

class Dynamo {
    constructor() {
        const dynamoDb = new aws.DynamoDB();
        this.putItem = util.promisify(dynamoDb.putItem.bind(dynamoDb));
        this.getItem = util.promisify(dynamoDb.getItem.bind(dynamoDb));
        this.updateTimeToLive = util.promisify(dynamoDb.updateTimeToLive.bind(dynamoDb));
        this.scan = util.promisify(dynamoDb.scan.bind(dynamoDb));
        this.deleteItem = util.promisify(dynamoDb.deleteItem.bind(dynamoDb));
    }

    putItemAsync = async (tableName, item) => {
        try {
            const res = await this.putItem({
                TableName: tableName,
                Item: item
            });
            return Promise.resolve(res);
        } catch (ex) {
            return Promise.reject(ex);
        }
    };

    getItemAsync = async (tableName, key) => {
        try {
            const res = await this.getItem({
                TableName: tableName,
                Key: key
            });
            return Promise.resolve(res);
        } catch (ex) {
            return Promise.reject(ex);
        }
    };

    enableTtl = async (tableName, attributeName) => {
        const params = {
            TableName: tableName,
            TimeToLiveSpecification: {
                AttributeName: attributeName,
                Enabled: true
            }
        };
        const res = await this.updateTimeToLive(params);
    }

    async scanTableAsync(tableName, expressionAttributeNames = null, expressionAttributeValues = null,
        filterExpression = null, projectionExpression = null) {
        const params = {
            TableName: tableName,
        };

        if (!_.isEmpty(expressionAttributeNames)) {
            params.ExpressionAttributeNames = expressionAttributeNames;
        }

        if (!_.isEmpty(expressionAttributeValues)) {
            params.ExpressionAttributeValues = expressionAttributeValues;
        }

        if (!_.isEmpty(filterExpression)) {
            params.FilterExpression = filterExpression;
        }

        if (!_.isEmpty(projectionExpression)) {
            params.ProjectionExpression = projectionExpression;
        }

        try {
            const res = await this.scan(params);
            return Promise.resolve(res);
        } catch (ex) {
            return Promise.reject(ex);
        }
    }

    deleteItemAsync = async (tableName, key) => {
        try {
            const res = await this.deleteItem({
                TableName: tableName,
                Key: key
            });
            return Promise.resolve(res);
        } catch (ex) {
            return Promise.reject(ex);
        }
    };
}
module.exports = Dynamo;