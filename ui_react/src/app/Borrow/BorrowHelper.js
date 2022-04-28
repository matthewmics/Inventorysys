import { Label } from "semantic-ui-react";

export const LabelBorrowedItems = ({ items }) => {
  const itemObj = {};

  items.forEach((element) => {
    let key = element.inventory_parent_item.name;

    if (!itemObj.hasOwnProperty(key)) {
      itemObj[key] = 1;
    } else {
      itemObj[key] = itemObj[key] + 1;
    }
  });

  return Object.entries(itemObj).map(([k, v], index) => {
    return (
      <Label key={index}>
        {k}
        <Label.Detail>{v}</Label.Detail>
      </Label>
    );
  });
};
