import { SET_DOMAIN_DATA } from '../Types';

const setDomainData = (data, dispatch) => {
  dispatch({
    type: SET_DOMAIN_DATA,
    payload: data,
  });
};

export default setDomainData;
