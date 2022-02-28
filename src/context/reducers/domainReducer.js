import { SET_DOMAIN_DATA, SET_PROFILE_DOMAIN, SET_SELECTED_LAST_DOMAIN } from '../Types';

const domainState = {
  domains: [],
  selectedLastDomain: null,
  profileDomain: '',
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
    case SET_PROFILE_DOMAIN:
      return {
        ...state,
        profileDomain: action.payload,
      };
    default:
      return state;
  }
};

export { domainReducer, domainState };
