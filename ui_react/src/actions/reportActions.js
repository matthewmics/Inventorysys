const setSelectedItems = (dispatch, items) => {
  dispatch({
    type: "SET_REPORT_SELECTED_ITEMS",
    value: items,
  });
};

const reportActions = { setSelectedItems };
export default reportActions;
