import { AnyAction } from "redux";
import { DEPLOYMENT_CHECK_STARTED } from "../actions/deploymentCheck";

export type DeploymentCheck = { isStarted: boolean };

const initialState = {isStarted: false};

export default function deploymentCheckReducer(state: DeploymentCheck = initialState, action: AnyAction) {
  if (action.type !== DEPLOYMENT_CHECK_STARTED) return state;

  return {isStarted: true};
}
