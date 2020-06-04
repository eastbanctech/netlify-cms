import { Action } from 'redux';

export abstract class GitlabDeploymentAction implements Action<DeploymentCheckActionType> {
  public readonly type: DeploymentCheckActionType;


  protected constructor(type: DeploymentCheckActionType) {
    this.type = type;
  }

  public asObject(): GitlabDeploymentAction {
    return {...this};
  }
}

export function actionOfType(type: DeploymentCheckActionType): GitlabDeploymentAction {
  return {type: type} as GitlabDeploymentAction;
}

export enum DeploymentCheckActionType {
  GITLAB_DEPLOYMENT_CHECK_STARTED = 'GITLAB_DEPLOYMENT_CHECK_STARTED',
  GITLAB_PIPELINES_UPDATE = 'GITLAB_PIPELINES_UPDATE'
}
