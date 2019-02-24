const initialState = {
  displayName: null,
  product: null
};

const topBarReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ME_SUCCESS":
      console.log(action.payload.body);
      return {
        ...state,
        displayName: action.payload.body.display_name,
        product: action.payload.body.product
      };
    default:
      return state;
  }
};

export default topBarReducer;
