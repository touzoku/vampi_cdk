#!/usr/bin/env node
import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { VampiAwsWafStack } from "./VampiAwsWafStack";
import { VampiWallarmStack } from "./VampiWallarmStack";
import { VampiOnlyStack } from "./VampiOnlyStack";

const app = new App();

new VampiAwsWafStack(app, "VampiAwsWaf");
new VampiWallarmStack(app, "VampiWallarm", {
	token: app.node.tryGetContext("token"),
});
new VampiOnlyStack(app, "VampiNaked");
