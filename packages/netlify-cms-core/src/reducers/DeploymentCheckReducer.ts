import { AnyAction } from "redux";
import { DeploymentCheckActionType } from "../actions/gitlab-deployment";

export type DeploymentCheck = { isStarted: boolean };

const initialState = {isStarted: false};

export default function deploymentCheckReducer(state: DeploymentCheck = initialState, action: AnyAction) {
  if (action.type !== DeploymentCheckActionType.GITLAB_DEPLOYMENT_CHECK_STARTED) return state;

  return {isStarted: true};
}
