import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { VampiAwsWafStack } from "../aws/VampiAwsWafStack";

test("Service Created", () => {
	const app = new cdk.App();
	// WHEN
	const stack = new VampiAwsWafStack(app, "MyTestStack");
	// THEN
	const template = Template.fromStack(stack);
	template.hasResourceProperties("AWS::ECS::Service", {
		DesiredCount: 1,
	});
});
