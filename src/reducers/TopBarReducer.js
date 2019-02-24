const initialState = {
  displayName: null,
  product: null
};

const topBarReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ME_SUCCESS":
      if (action.payload) {
        return {
          ...state,
          displayName: action.payload.body.display_name,
          product: action.payload.body.product
        };
      } else {
        return {
          ...state
        };
      }

    default:
      return state;
  }
};

export default topBarReducer;
