const initialState = { selectedItems: [] };

const reportReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_REPORT_SELECTED_ITEMS":
      return {
        ...state,
        selectedItems: [...action.value],
      };
    default:
      return state;
  }
};

export default reportReducer;
