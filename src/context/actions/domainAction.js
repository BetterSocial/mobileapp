import { SET_DOMAIN_DATA, SET_SELECTED_LAST_DOMAIN, SET_PROFILE_DOMAIN } from '../Types';

const setDomainData = (data, dispatch) => {
  dispatch({
    type: SET_DOMAIN_DATA,
    payload: data,
  });
};

const setSelectedLastDomain = (data, dispatch) => {
  dispatch({
    type: SET_SELECTED_LAST_DOMAIN,
    payload: data,
  });
};

const setProfileDomain = (data, dispatch) => {
  dispatch({
    type: SET_PROFILE_DOMAIN,
    payload: data,
  });
};

export {
  setSelectedLastDomain,
  setDomainData,
  setProfileDomain,
};
