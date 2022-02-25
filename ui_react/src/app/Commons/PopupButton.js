import React from "react";
import { Button, Popup } from "semantic-ui-react";

export const PopupButton = ({ content, iconName, onClick, color = "teal" }) => {
  return (
    <Popup
      content={content}
      trigger={
        <Button
          color={color}
          icon={iconName}
          circular
          size="tiny"
          onClick={() => {
            onClick();
          }}
        />
      }
    />
  );
};
