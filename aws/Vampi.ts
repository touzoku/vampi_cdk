import {
	aws_ecs as ecs,
	aws_ecs_patterns as patterns,
	Resource,
	ResourceProps,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export interface VampiProps extends ResourceProps {
	cluster?: ecs.ICluster;
}

export class Vampi extends Resource {
	public readonly service: patterns.ApplicationLoadBalancedFargateService;

	constructor(scope: Construct, id: string, props?: VampiProps) {
		super(scope, id, props);
		const cluster =
			props?.cluster ??
			new ecs.Cluster(this, "Cluster", {
				enableFargateCapacityProviders: true,
				containerInsights: true,
			});

		this.service = new patterns.ApplicationLoadBalancedFargateService(
			this,
			"Vampi",
			{
				cluster,
				memoryLimitMiB: 512,
				desiredCount: 1,
				cpu: 256,
				taskImageOptions: {
					image: ecs.ContainerImage.fromRegistry("erev0s/vampi"),
					containerPort: 5000,
				},
				capacityProviderStrategies: [
					{ capacityProvider: "FARGATE_SPOT", weight: 1 },
				],
				propagateTags: ecs.PropagatedTagSource.TASK_DEFINITION,
				enableExecuteCommand: true,
				circuitBreaker: {
					rollback: true,
				},
			},
		);
	}
}
