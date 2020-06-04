import { all, call, delay, fork, put, select, takeEvery } from 'redux-saga/effects';
import { AUTH_SUCCESS } from "../../actions/auth";
import { AnyAction } from 'redux';
import { isNotNullOrEmpty, isNotNullOrUndefined, Optional } from "@eastbanctech/ts-optional";
import { DeploymentCheck } from "../../reducers/DeploymentCheckReducer";
import { Backend, currentBackend } from "../../backend";
import { Config } from "../../types/redux";
import GitLab from "netlify-cms-backend-gitlab/src/implementation";
import { GitLabPipeline } from "netlify-cms-backend-gitlab/src/API";
import { gitlabDeploymentCheckStarted, pipelinesUpdate } from "../../actions/gitlab-deployment";

export const rootSaga = function* root() {
  yield all([
    fork(startDeployStatusCheckAfterGitlabAuthSuccess)
  ])
};

function* startDeployStatusCheckAfterGitlabAuthSuccess() {
  yield takeEvery(AUTH_SUCCESS, checkBackendIsGitlab);
}

/**
 * @param action - 'Auth success' action.
 */
function* checkBackendIsGitlab(action: AnyAction) {
  const tokenIsProvided = isNotNullOrUndefined(action.payload) && isNotNullOrEmpty(action.payload.token);

  //the yields are put in if for optimization: short-circuit evaluation will be used.
  if (tokenIsProvided && (yield select(backendIsGitlab)) && (yield select(deploymentCheckHasNotBeenStarted))) {
    yield put(gitlabDeploymentCheckStarted());
    yield fork(deploymentCheckSaga);
  }
}

function* deploymentCheckSaga() {
  console.log('GitLab deployment check has been launched');
  const config: Config = (yield select(state => state.config)) as Config;

  // @ts-ignore
  const gitlabBackendClient = (currentBackend(config) as Backend).implementation as GitLab;
  try {
    while (true) {
      const response: GitLabPipeline[] = yield call(() => gitlabBackendClient.api?.getRepoPipelines());
      yield put(pipelinesUpdate(response));
      yield delay(5000)
    }
  } finally {
    console.error('GitLab deployment has been stopped');
  }
}

const deploymentCheckHasNotBeenStarted = (state: any): boolean =>
  Optional.ofNullable(state.deploymentCheck as DeploymentCheck)
    .map(deploymentCheck => !deploymentCheck.isStarted)
    .orElseThrow(() => new Error('Something wrong with {deploymentCheck} branch of app state'));

const backendIsGitlab = (state: any): boolean => {
  return state.config.getIn(['backend', 'name']) === 'gitlab';
};
