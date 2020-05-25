const aws = require("aws-sdk");
const util = require("util");
const _ = require('lodash');

class EC2 {
    constructor(region = null) {
        let ec2;
        if (_.isEmpty(region)) {
            ec2 = new aws.EC2();
        } else {
            ec2 = new aws.EC2({ region });
        }

        this.ec2 = ec2;
        this.describeSecurityGroups = util.promisify(ec2.describeSecurityGroups.bind(ec2));
        this.describeRegions = util.promisify(ec2.describeRegions.bind(ec2));
        this.authorizeSecurityGroupIngress = util.promisify(ec2.authorizeSecurityGroupIngress.bind(ec2));
        this.revokeSecurityGroupIngress = util.promisify(ec2.revokeSecurityGroupIngress.bind(ec2));
    }

    describeSecurityGroupsAsync = async (groupIds = null) => {
        try {
            const req = {};

            if (!_.isEmpty(groupIds)) {
                req.GroupIds = groupIds;
            }

            const res = await this.describeSecurityGroups(req);

            return Promise.resolve(res);
        } catch (ex) {
            return Promise.reject(ex);
        }
    };

    describeRegionsAsync = async () => {
        try {
            const res = await this.describeRegions({});
            return Promise.resolve(res);
        } catch (ex) {
            return Promise.reject(ex);
        }
    };

    authorizeSecurityGroupIngressAsync = async (groupId, fromPort, toPort, cidrIp, description, ipProtocol = "tcp") => {
        const params = {
            GroupId: groupId,
            IpPermissions: [
                {
                    FromPort: fromPort,
                    ToPort: toPort,
                    IpProtocol: ipProtocol,
                    IpRanges: [{
                        CidrIp: cidrIp,
                        Description: description
                    }]
                }
            ]
        }

        try {
            const res = await this.authorizeSecurityGroupIngress(params);

            return Promise.resolve(res);
        } catch (ex) {
            return Promise.reject(ex);
        }
    }

    revokeSecurityGroupIngressAsync = async (groupId, fromPort, toPort, cidrIp, ipProtocol) => {
        const params = {
            GroupId: groupId,
            FromPort: fromPort,
            ToPort: toPort,
            CidrIp: cidrIp,
            IpProtocol: ipProtocol
        }

        try {
            const res = await this.revokeSecurityGroupIngress(params);

            return Promise.resolve(res);
        } catch (ex) {
            return Promise.reject(ex);
        }
    }
}
module.exports = EC2;
