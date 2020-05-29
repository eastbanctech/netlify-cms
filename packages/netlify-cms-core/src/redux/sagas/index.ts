import { all, call, delay, fork } from '@redux-saga/core/effects';

export const rootSaga = function* root() {
  yield all([
    fork(testSaga)
  ])
};

function* testSaga() {
  try {
    while (true) {
      yield call(() => console.log('testSaga has been launched'));
      yield delay(5000)
    }
  } finally {
    console.log('testSaga has been stopped');
  }
}
