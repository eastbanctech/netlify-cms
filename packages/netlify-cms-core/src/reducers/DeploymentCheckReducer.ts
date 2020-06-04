import { DeploymentCheckActionType, GitlabDeploymentAction } from "../actions/gitlab-deployment";
import { GitlabPipelinesUpdateAction } from "../actions/gitlab-deployment/GitlabPipelinesUpdateAction";

export type DeploymentCheck = { isStarted: boolean, status: string };

const UNKNOWN_STATUS = 'Unknown';
const initialState = {isStarted: false, status: UNKNOWN_STATUS};

export default function deploymentCheckReducer(state: DeploymentCheck = initialState, action: GitlabDeploymentAction) {

  switch (action.type) {
    case DeploymentCheckActionType.GITLAB_DEPLOYMENT_CHECK_STARTED: {
      return {...state, isStarted: true};
    }

    case DeploymentCheckActionType.GITLAB_PIPELINES_UPDATE: {
      const pipelinesUpAction = action as GitlabPipelinesUpdateAction;

      const sortedPipelines = pipelinesUpAction
        .pipelines
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      if (sortedPipelines.length > 0) {
        return {...state, status: sortedPipelines[0].status}
      } else if (state.status !== UNKNOWN_STATUS) {
        return {...state, status: UNKNOWN_STATUS}
      }
    }
  }

  return state;
}
