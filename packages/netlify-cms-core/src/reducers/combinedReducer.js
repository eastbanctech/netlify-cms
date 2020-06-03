import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as notifReducer } from 'redux-notifications';
import optimist from 'redux-optimist';
import reducers from './index';
import deploymentCheckReducer from "./DeploymentCheckReducer";

export default optimist(
  combineReducers({
    ...reducers,
    deploymentCheck: deploymentCheckReducer,
    notifs: notifReducer,
    routing: routerReducer,
  }),
);
