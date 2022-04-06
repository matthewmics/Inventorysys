export const checkIfItemInTransaction = (item) => {
  return (
    ["pending", "borrowed", "in progress"].includes(item.borrow_status) ||
    ["pending", "job order created"].includes(item.repair_status) ||
    ["pending", "in progress"].includes(item.transfer_status)
  );
};
