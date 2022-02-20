const openModal = (dispatch, title, content, onConfirm, onCancel) => {
  dispatch({
    type: "OPEN_MODAL",
    title,
    content,
    onCancel,
    onConfirm,
  });
};

const closeModal = (dispatch) => {
  dispatch({
    type: "CLOSE_MODAL",
  });
};

const setLoading = (dispatch, value) => {
  dispatch({
    type: "SET_MODAL_LOADING",
    value,
  });
};

const modalActions = { openModal };
export default modalActions;
