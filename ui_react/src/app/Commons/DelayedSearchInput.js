import React from "react";
import { Icon, Input } from "semantic-ui-react";

export const DelayedSearchInput = ({ onSearch, searchRef }) => {
  var timeoutInstance = null;

  const handleInputChange = (e) => {
    if (timeoutInstance != null) clearTimeout(timeoutInstance);
    timeoutInstance = setTimeout(() => {
      onSearch(e.target.value);
    }, 250);
  };

  return (
    <Input
      ref={searchRef}
      onChange={handleInputChange}
      placeholder="Search"
      icon={<Icon name="search" inverted circular />}
    />
  );
};
