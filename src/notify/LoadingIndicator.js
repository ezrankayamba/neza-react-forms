import React, { Component } from "react";
import { IconLoading } from "../_helpers/Incons";

const LoadingIndicator = ({ isLoading }) => {
  return isLoading ? (
    <div className="loading-indicator">
      <IconLoading />
    </div>
  ) : null;
};

export default LoadingIndicator;
