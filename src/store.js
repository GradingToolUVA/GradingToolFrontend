import { applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import combineReducers from './reducers/index.js';
import {configureStore} from "@reduxjs/toolkit";
const initialState = {};

const middleware = [thunk];

const store = configureStore(
  {reducer: combineReducers},
  initialState,
  composeWithDevTools(applyMiddleware(...middleware)),
);

export default store;