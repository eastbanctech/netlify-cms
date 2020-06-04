import { DeploymentCheckActionType, GitlabDeploymentAction } from "./GitlabDeploymentAction";
import { GitLabPipeline } from "netlify-cms-backend-gitlab/src/API";

export class GitlabPipelinesUpdateAction extends GitlabDeploymentAction {
  constructor(readonly pipelines: GitLabPipeline[]) {
    super(DeploymentCheckActionType.GITLAB_PIPELINES_UPDATE);
  }

  public static for(pipelines: GitLabPipeline[]): GitlabDeploymentAction {
    return new GitlabPipelinesUpdateAction(pipelines).asObject();
  }
}
