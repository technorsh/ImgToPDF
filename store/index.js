import { createStore , applyMiddleware ,compose } from "redux";
import rootReducer from "./reducer";
import checkDataMiddleware from "./middleware";
import thunk from "redux-thunk";

const storeEnhancers = compose;

const store = createStore(
  rootReducer,
  storeEnhancers(applyMiddleware(checkDataMiddleware,thunk))
);

export default store;
