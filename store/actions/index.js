import { ADD_IMAGE , SET_IMAGE , CROP_IMAGE , REMOVE_IMAGE , ADD_PDF , SET_PDF , REMOVE_PDF } from "./constants";

export function addImages(payload) {
  return { type: ADD_IMAGE, payload }
};

export function addPdfs(payload) {
  return { type: ADD_PDF, payload }
};

export function setImages(payload) {
  return { type: SET_IMAGE, payload }
};

export function setPdfs(payload) {
  return { type: SET_PDF, payload }
};

export function cropImages( index , payload ) {
  return { type: CROP_IMAGE, index , payload }
};

export function removeImages( index ) {
  return { type: REMOVE_IMAGE, index }
};

export function removePdfs( index ) {
  return { type: REMOVE_PDF, index }
};
