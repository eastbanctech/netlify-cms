import { all, call, delay, fork, put, select, takeEvery } from 'redux-saga/effects';
import { AUTH_SUCCESS } from "../../actions/auth";
import { AnyAction } from 'redux';
import { isNotNullOrEmpty, isNotNullOrUndefined, Optional } from "@eastbanctech/ts-optional";
import { deploymentCheckStarted } from "../../actions/deploymentCheck";
import { DeploymentCheck } from "../../reducers/DeploymentCheckReducer";

export const rootSaga = function* root() {
  yield all([
    fork(startDeployStatusCheckAfterGitlabAuthSuccess)
  ])
};

function* startDeployStatusCheckAfterGitlabAuthSuccess() {
  yield takeEvery(AUTH_SUCCESS, checkBackendIsGitlab);
}

/**
 *
 * @param action - 'Auth success' action.
 */
function* checkBackendIsGitlab(action: AnyAction) {
  const tokenIsProvided = isNotNullOrUndefined(action.payload) && isNotNullOrEmpty(action.payload.token);

  //the yields are put in if for optimization: short-circuit evaluation will be used.
  console.log('checkBackendIsGitlab', tokenIsProvided, (yield select(backendIsGitlab)), (yield select(deploymentCheckHasNotBeenStarted)))
  if (tokenIsProvided && (yield select(backendIsGitlab)) && (yield select(deploymentCheckHasNotBeenStarted))) {
    yield put(deploymentCheckStarted());
    yield fork(testSaga);
  }
}

const deploymentCheckHasNotBeenStarted = (state: any): boolean =>
  Optional.ofNullable(state.deploymentCheck as DeploymentCheck)
    .map(deploymentCheck => !deploymentCheck.isStarted)
    .orElseThrow(() => new Error('Something wrong with {deploymentCheck} branch of app state'));


const backendIsGitlab = (state: any): boolean => state.config.getIn(['backend', 'name']) === 'gitlab';

function* testSaga() {
  try {
    while (true) {
      yield call(() => console.log('testSaga has been launched'));
      yield delay(5000)
    }
  } finally {
    console.error('testSaga has been stopped');
  }
}
