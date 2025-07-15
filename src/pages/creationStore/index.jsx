import React from "react";
import {
  CreationStoreContext,
  CreationStoreController,
} from "./CreationStore.control";
import CreationStore from "./CreationStore";

const CreationStoreComponent = () => {
  return (
    <>
      <CreationStoreController>
        <CreationStore />
      </CreationStoreController>
    </>
  );
};

export default CreationStoreComponent;
