import {
	Stack,
	StackProps,
	aws_ecs as ecs,
	aws_ecs_patterns as patterns,
	aws_logs as logs,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export interface VampiWallarmStackProps extends StackProps {
	token: string;
}

export class VampiWallarmStack extends Stack {
	constructor(scope: Construct, id: string, props: VampiWallarmStackProps) {
		super(scope, id, props);

		const cluster = new ecs.Cluster(this, "Cluster", {
			enableFargateCapacityProviders: true,
			containerInsights: true,
		});
		const service = new patterns.ApplicationLoadBalancedFargateService(
			this,
			"Vampi",
			{
				cluster,
				memoryLimitMiB: 512,
				desiredCount: 1,
				cpu: 256,
				taskImageOptions: {
					containerName: "wallarm",
					enableLogging: true,
					logDriver: ecs.LogDriver.awsLogs({
						logRetention: logs.RetentionDays.ONE_DAY,
						streamPrefix: "vampi/wallarm",
					}),
					image: ecs.ContainerImage.fromRegistry("wallarm/node"),
					containerPort: 80,
					environment: {
						WALLARM_API_HOST: "us1.api.wallarm.com",
						WALLARM_API_TOKEN: props.token,
						NGINX_BACKEND: "localhost:5000",
						WALLARM_MODE: "block",
					},
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

		service.taskDefinition.addContainer("vampi", {
			image: ecs.ContainerImage.fromRegistry("erev0s/vampi"),
			cpu: 256,
			memoryLimitMiB: 512,
			logging: ecs.LogDriver.awsLogs({
				streamPrefix: "vampi",
				logRetention: logs.RetentionDays.ONE_DAY,
			}),
			portMappings: [
				{
					containerPort: 5000,
				},
			],
		});
	}
}
