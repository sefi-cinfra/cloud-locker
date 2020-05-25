const moment = require('moment');
const _ = require('lodash');
const Uuid = require('uuid/v4');

const Dynamo = require('../wrappers/dynamo/dynamo');
const EC2 = require('../wrappers/ec2/ec2');
const NotFoundError = require('../errors/not-found-error');

const { DYNAMIC_ACCESS_TABLE } = require('../../consts');

class DynamicAccess {
    constructor() {
        this.dynamo = new Dynamo();
        this.ec2 = new EC2();
    }

    /* This function create inboundRule and adds new record in Dynamo */
    openAccessAsync = async (ipAddress, port, ttlInMinutes, securityGroupId, region) => {
        const ec2 = new EC2(region);

        //Get specific security group
        let securityGroup = await this.getSecurityGroupByIdAsync(region, securityGroupId);

        //Throw not found if security group doesn't exist in requested region
        if (_.isEmpty(securityGroup)) {
            throw new NotFoundError("Could not find SecurityGroup.");
        }

        //Check if inbound-rule already exists
        const isRuleExists = (securityGroup.IpPermissions.filter(sg => {
            if (sg.FromPort == port && sg.ToPort == port && _.some(sg.IpRanges, { 'CidrIp': `${ipAddress}/32` }))
                return true;
        }) || []).length > 0;


        if (!isRuleExists) {
            const cloudLockerId = `cl-${Uuid().replace(/-/gi, '')}`;

            await ec2.authorizeSecurityGroupIngressAsync(securityGroupId, port, port, `${ipAddress}/32`, cloudLockerId, 'tcp');

            //Update Dynamo DB
            const res = await this.dynamo.putItemAsync(DYNAMIC_ACCESS_TABLE, {
                'Id': { S: cloudLockerId },
                'ipAddress': { S: ipAddress },
                'port': { N: port.toString() },
                'securityGroupId': { S: securityGroupId },
                'region': { S: region },
                'creationTime': { N: moment.utc().unix().toString() },
                'expirationTime': { N: moment.utc().add(ttlInMinutes, 'minutes').unix().toString() }
            });
        }
    }

    /* get all securityGroups */
    getAllAsync = async () => {
        let result = [];

        const regions = await this.ec2.describeRegionsAsync();

        await Promise.all((regions.Regions || []).map(async region => {
            const ec2 = new EC2(region.RegionName);
            try {
                const securityGroups = await ec2.describeSecurityGroupsAsync();
                (securityGroups.SecurityGroups || []).map(async (securityGroup) => {
                    result.push({ securityGroup, region });
                });
            } catch (ex) {
                console.error(`Unable to get securityGroups. error=${ex}`);
            }
        }));

        return result;
    };

    /* remove all expired inboundRules from security group and dynamo */
    accessTtlAsync = async () => {

        const utcNowInUnixTime = moment.utc().unix();

        //Get all expired securityGroups
        const expiredSecurityGroups = await this.dynamo.scanTableAsync(DYNAMIC_ACCESS_TABLE,
            null, //selecting all atributes
            { ":a": { N: utcNowInUnixTime.toString() } },
            "expirationTime < :a",
            null //no projection
        );

        const inboundRulesToDelete = expiredSecurityGroups.Items || [];

        await Promise.all(inboundRulesToDelete.map(async rule => {
            const region = rule.region.S;
            const securityGroupId = rule.securityGroupId.S;
            const port = parseInt(rule.port.N);
            const cidrIp = `${rule.ipAddress.S}/32`;

            //Get the specific security group by id
            const securityGroup = await this.getSecurityGroupByIdAsync(region, securityGroupId);
            if (!_.isEmpty(securityGroup)) {

                //Check if inbound-rule exists with the cloud-locker ID
                const isRuleExists = (securityGroup.IpPermissions.filter(sg => {
                    if (sg.FromPort == port && sg.ToPort == port &&
                        _.some(sg.IpRanges, { 'CidrIp': cidrIp, Description: rule.Id.S }))
                        return true;
                }) || []).length > 0;

                if (isRuleExists) {
                    const ec2 = new EC2(rule.region.S);
                    await ec2.revokeSecurityGroupIngressAsync(securityGroupId, port, port, cidrIp, 'tcp');
                    await this.dynamo.deleteItemAsync(DYNAMIC_ACCESS_TABLE, { 'Id': rule.Id })
                }
            }
        }));
    }

    getSecurityGroupByIdAsync = async (region, securityGroupId) => {
        const ec2 = new EC2(region);

        //Get specific security group
        let securityGroup = null;
        try {
            const res = await ec2.describeSecurityGroupsAsync([securityGroupId]);

            if (!_.isEmpty(res) && !_.isEmpty(res.SecurityGroups) && res.SecurityGroups.length == 1) {
                securityGroup = _.first(res.SecurityGroups);
            }
        } catch (ex) {
        }

        return securityGroup;
    }
}

module.exports = DynamicAccess;
