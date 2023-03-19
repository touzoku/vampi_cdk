import { Stack, StackProps, aws_wafv2 as waf } from "aws-cdk-lib";
import { Vampi } from "./Vampi";
import { Construct } from "constructs";

export class VampiOnlyStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		new Vampi(this, "Vampi");
	}
}
