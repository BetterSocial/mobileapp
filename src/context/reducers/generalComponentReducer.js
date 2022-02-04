import {
  DISCOVERY_SET_SEARCH_BAR,
} from '../Types';

const generalComponentState = {
  discoverySearchBarText: '',
};
const generalComponentReducer = (state = generalComponentState, action) => {
  switch (action.type) {
    case DISCOVERY_SET_SEARCH_BAR:
      return {
        ...state,
        discoverySearchBarText: action.payload,
      };
    default:
      return state;
  }
};
export { generalComponentReducer, generalComponentState };
