import { actionOfType, DeploymentCheckActionType, GitlabDeploymentAction } from "./GitlabDeploymentAction";
import { GitLabPipeline } from "netlify-cms-backend-gitlab/src/API";
import { GitlabPipelinesUpdateAction } from "./GitlabPipelinesUpdateAction";

export { GitlabDeploymentAction, DeploymentCheckActionType } from "./GitlabDeploymentAction";

export function gitlabDeploymentCheckStarted(): GitlabDeploymentAction {
  return actionOfType(DeploymentCheckActionType.GITLAB_DEPLOYMENT_CHECK_STARTED);
}

export function pipelinesUpdate(pipelines:GitLabPipeline[]):GitlabDeploymentAction {
  return GitlabPipelinesUpdateAction.for(pipelines);
}
