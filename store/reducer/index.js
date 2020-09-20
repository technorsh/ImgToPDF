import { initialState } from "./../initialState";
import { ADD_IMAGE , SET_IMAGE , CROP_IMAGE , REMOVE_IMAGE , ADD_PDF , SET_PDF , REMOVE_PDF } from "./../actions/constants";

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
const removePDFData = ( index , state ) => {
  state.pdfs.splice(index,1);
  return state.pdfs;
}

const rootReducer = (state = initialState, action) => {
  switch(action.type){
    case ADD_IMAGE:{
      return Object.assign({}, state, {
         images: state.images.concat(action.payload),
         pdfs:[],
      });
      break;
    }
    case ADD_PDF:{
      return Object.assign({}, state, {
         images:[],
         pdfs: state.pdfs.concat(action.payload),
      });
      break;
    }
    case SET_IMAGE :{
      return {
         images: action.payload,
         pdfs:[],
      };
      break;
    }
    case SET_PDF :{
      return {
         images:[],
         pdfs: action.payload
      };
      break;
    }
    case CROP_IMAGE:{
      var newState = cropData(action.index , action.payload , state );
      return {
         images: newState,
         pdfs:[],
      };
      break;
    }
    case REMOVE_IMAGE:{
      var newState = removeData(action.index,  state );
      return {
         images: newState,
         pdfs:[],
      };
      break;
    }
    case REMOVE_PDF:{
      var newState = removePDFData(action.index,  state );
      return {
         images:[],
         pdfs: newState
      };
      break;
    }
    default :
      return state;
  }
};

export default rootReducer;
