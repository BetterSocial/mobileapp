import { SET_DOMAIN_DATA } from '../Types';

const domainState = {
  domains: [],
};

const domainReducer = (state = domainState, action) => {
  switch (action.type) {
    case SET_DOMAIN_DATA:
      return {
        ...state,
        domains: action.payload,
      };
    default:
      return state;
  }
};

export { domainReducer, domainState };
