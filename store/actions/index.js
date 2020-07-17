import { ADD_IMAGE , SET_IMAGE , CROP_IMAGE , REMOVE_IMAGE } from "./constants";

export function addImages(payload) {
  return { type: ADD_IMAGE, payload }
};

export function setImages(payload) {
  return { type: SET_IMAGE, payload }
};

export function cropImages( index , payload ) {
  return { type: CROP_IMAGE, index , payload }
};

export function removeImages( index ) {
  return { type: REMOVE_IMAGE, index }
};
