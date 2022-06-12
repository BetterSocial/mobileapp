const initialStartupState = {
  id: null,
  deeplinkProfile: true,
};

const initialStartupReducer = (state = initialStartupState, action) => {
  switch (action.type) {
    case 'SET_INITIAL_STARTUP':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
export { initialStartupReducer, initialStartupState };
