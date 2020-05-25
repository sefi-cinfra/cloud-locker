import thunk from "redux-thunk";
import {applyMiddleware, combineReducers, createStore} from "redux";
import { reducer as reduxFormReducer } from 'redux-form';

import {
    awsReducer
} from "./redux/index";

const reducer = combineReducers({
    aws: awsReducer,
    form: reduxFormReducer
});

const store = createStore(reducer,
    applyMiddleware(thunk));
export default store;
