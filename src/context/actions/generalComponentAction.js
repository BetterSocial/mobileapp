import {
  DISCOVERY_SET_SEARCH_BAR,
} from '../Types';

/**
 *
 * @param {String} text
 * @param {Any} dispatch
 */
const setDiscoverySearchBar = async (text, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_SEARCH_BAR,
    payload: text,
  });
};

const GeneralComponentAction = {
  setDiscoverySearchBar,
};

export default GeneralComponentAction;
