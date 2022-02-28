import { SET_DOMAIN_DATA, SET_SELECTED_LAST_DOMAIN } from '../Types';

const setDomainData = (data, dispatch) => {
  dispatch({
    type: SET_DOMAIN_DATA,
    payload: data,
  });
};

const selectedLastDomain = (data, dispatch) => {
  dispatch({
    type: SET_SELECTED_LAST_DOMAIN,
    payload: data,
  });
};
export {
  selectedLastDomain,
  setDomainData,
};
