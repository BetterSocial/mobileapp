import {
  DISCOVERY_SET_DATA,
  DISCOVERY_SET_LOADING_DATA,
} from '../Types';

/**
 *
 * @param {Boolean} isLoading
 * @param {Any} dispatch
 */
const setDiscoveryLoadingData = async (isLoading, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_LOADING_DATA,
    payload: isLoading,
  });
};

/**
 *
 * @param {import('../../service/discovery').FetchDiscoveryDataResponse} data
 * @param {Any} dispatch
 */
const setDiscoveryData = async (data, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_DATA,
    payload: {
      discovery: data,
    },
  });
};

const DiscoveryAction = {
  setDiscoveryLoadingData,
  setDiscoveryData,
};

export default DiscoveryAction;
