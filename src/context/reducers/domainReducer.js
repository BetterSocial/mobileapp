import { SET_DOMAIN_DATA, SET_SELECTED_LAST_DOMAIN } from '../Types';

const domainState = {
  domains: [],
  selectedLastDomain: null,
};

const domainReducer = (state = domainState, action) => {
  switch (action.type) {
    case SET_DOMAIN_DATA:
      return {
        ...state,
        domains: action.payload,
      };
    case SET_SELECTED_LAST_DOMAIN:
      return {
        ...state,
        selectedLastDomain: action.payload,
      };
    default:
      return state;
  }
};

export { domainReducer, domainState };
