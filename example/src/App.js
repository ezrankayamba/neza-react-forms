import React from "react";

import { CommonForm } from "neza-react-forms";

const App = () => {
  const form = {
    fields: [{ field: "username" }]
  };
  return <CommonForm meta={form} />;
};

export default App;
