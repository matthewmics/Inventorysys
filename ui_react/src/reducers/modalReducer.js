const initial = {
  open: false,
  loading: false,
  title: "",
  content: <div></div>,
  onConfirm: () => console.log("On confirm: no function assigned"),
  onCancel: () => console.log("On cancel: no function assigned"),
};

const modalReducer = (state = initial, action) => {
  switch (action.type) {
    case "OPEN_MODAL":
      state.open = true;
      state.loading = false;
      state.title = action.title;
      state.content = action.content;
      state.onConfirm = action.onConfirm;
      state.onCancel = action.onCancel;
      return state;
    case "CLOSE_MODAL":
      state.open = false;
      return state;
    case "SET_MODAL_LOADING":
      state.loading = action.value;
      return state;
    default:
      return state;
  }
};

export default modalReducer;
