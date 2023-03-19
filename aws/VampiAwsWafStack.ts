import { Stack, StackProps, aws_wafv2 as waf } from "aws-cdk-lib";
import { Vampi } from "./Vampi";
import { Construct } from "constructs";

export class VampiAwsWafStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		const { service } = new Vampi(this, "Vampi");

		const acl = new waf.CfnWebACL(this, "WAF", {
			defaultAction: {
				allow: {},
			},
			scope: "REGIONAL",
			visibilityConfig: {
				cloudWatchMetricsEnabled: false,
				metricName: "vampi-waf",
				sampledRequestsEnabled: false,
			},
			rules: [
				{
					name: "common",
					priority: 0,
					statement: {
						managedRuleGroupStatement: {
							name: "AWSManagedRulesCommonRuleSet",
							vendorName: "AWS",
						},
					},
					visibilityConfig: {
						cloudWatchMetricsEnabled: true,
						metricName: "vampi-crs",
						sampledRequestsEnabled: true,
					},
					overrideAction: {
						none: {},
					},
				},
			],
		});

		new waf.CfnWebACLAssociation(this, "WafAssociatino", {
			resourceArn: service.loadBalancer.loadBalancerArn,
			webAclArn: acl.attrArn,
		});
	}
}
