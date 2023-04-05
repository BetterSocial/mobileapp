import {SET_COMMENT_LIST} from '../Types';

const commentState = {
  comments: []
};
const commentReducer = (state = commentState, action) => {
  switch (action.type) {
    case SET_COMMENT_LIST:
      return {
        ...state,
        comments: action.payload
      };
    default:
      return state;
  }
};
export {commentReducer, commentState};
