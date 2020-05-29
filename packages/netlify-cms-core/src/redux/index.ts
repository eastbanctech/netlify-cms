import { AnyAction, applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk';
import { waitUntilAction } from './middleware/waitUntilAction';
import reducer from '../reducers/combinedReducer';
import { State } from '../types/redux';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from "./sagas";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: Function;
  }
}

const sagaMiddleware: SagaMiddleware = createSagaMiddleware();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const store = createStore<State, any, {}, {}>(
  reducer,
  compose(
    applyMiddleware(thunkMiddleware as ThunkMiddleware<State, AnyAction>, waitUntilAction, sagaMiddleware),
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : (f: Function): Function => f,
  ),
);

sagaMiddleware.run(rootSaga);

export default store;
