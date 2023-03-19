# VAmPI Constructs Protected by WAFs

This AWS Cloud Development Kit project launches a [VAmPI](https://github.com/erev0s/VAmPI) docker image behind an AWS ALB in three possible configurations: with AWS WAF enabled, with Wallarm enabled, and not protected by anything at all.

Please be careful. These stacks are not designed for long-time production use and incur quite a high cost on your AWS bill: it creates 3 ALBs and 3 NAT Gateways, which collectively cost over $300/month total.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Deploy

* `pnpm run cdk deploy --all --context token=<WALLARM_NODE_TOKEN>` deploy all stacks to your default AWS account/region
* `pnpm run cdk diff` compare deployed stacks with current state
* `pnpm run cdk synth` emits the synthesized CloudFormation template

