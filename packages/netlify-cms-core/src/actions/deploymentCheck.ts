import { Action } from "redux";

export const DEPLOYMENT_CHECK_STARTED = 'DEPLOYMENT_CHECK_STARTED';

export function deploymentCheckStarted(): Action {
  return {type: DEPLOYMENT_CHECK_STARTED};
}
