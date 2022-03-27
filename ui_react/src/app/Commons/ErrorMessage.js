import React, { useEffect, useState } from "react";
import { Message } from "semantic-ui-react";

export const ErrorMessage = ({ errors }) => {
  const [errorList, setErrorList] = useState([]);

  const errorList2 = [];
  for (var props in errors) {
    errorList2.push(errors[props]);
  }

  useEffect(() => {
    setErrorList(errorList2);
  }, [errors]);

  return (
    <Message error>
      <Message.List>
        {errorList.map((err, i) => (
          <Message.Item key={i}>{err}</Message.Item>
        ))}
      </Message.List>
    </Message>
  );
};
