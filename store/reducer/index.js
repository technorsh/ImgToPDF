import { initialState } from "./../initialState";
import { ADD_IMAGE , SET_IMAGE , CROP_IMAGE , REMOVE_IMAGE } from "./../actions/constants";

const cropData = ( index , newData , state ) => {
  let newState = []
  state.images.map((value,i) => {
    if(i===index){
      newState.push(newData)
    }
    else{
      newState.push(value);
    }
  })
  return newState;
}

const removeData = ( index , state ) => {
  state.images.splice(index,1);
  return state.images;
}

const rootReducer = (state = initialState, action) => {
  switch(action.type){
    case ADD_IMAGE:{
      return Object.assign({}, state, {
         images: state.images.concat(action.payload)
      });
      break;
    }
    case SET_IMAGE :{
      return {
         images: action.payload
      };
      break;
    }
    case CROP_IMAGE:{
      var newState = cropData(action.index , action.payload , state );
      return {
         images: newState
      };
      break;
    }
    case REMOVE_IMAGE:{
      var newState = removeData(action.index,  state );
      return {
         images: newState
      };
      break;
    }
    default :
      return state;
  }
};

export default rootReducer;
