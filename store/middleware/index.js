import { SET_IMAGE , ADD_IMAGE } from "./../actions/constants";

export default function checkDataMiddleware({ dispatch }) {
  return function(next){
    return function(action){
      // if(action.type === SET_IMAGE) {
      //
      // }
      return next(action);
    }
  }
}
