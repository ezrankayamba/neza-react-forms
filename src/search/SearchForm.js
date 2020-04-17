import InputControl from "../forms/inputs/InputControl";
import { IconSearch } from "../_helpers/Incons";
import React, { useState } from "react";

export const SearchForm = ({ searchFields, onSearch }) => {
  let errors0 = {};
  let data0 = {};
  searchFields.forEach(f => {
    errors0[f.search.name] = "";
    data0[f.search.name] = null;
  });
  const [data, setData] = useState(data0);
  let handleChange = event => {
    event.preventDefault();
    const { name, value } = event.target;
    data[name] = value;
    setData(data);
  };
  let search = e => {
    e.preventDefault();
    if (onSearch) {
      onSearch(data, res => {});
    }
  };
  return (
    <div className="container small">
      <form
        onSubmit={search}
        className="d-block pl-3 row d-md-flex search border border-top-0 border-left-0 border-right-0"
      >
        <div className="col-md pl-0">
          <div className="row">
            {searchFields.map(fld => {
              return (
                <div key={fld.name} className="mb-2 col-md-3 pl-0 pr-1">
                  <InputControl
                    field={fld.search}
                    name={fld.search.name}
                    id={fld.search.name}
                    className="form-control p-2"
                    onChange={handleChange}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-auto pb-2 col-md-auto p-0">
          <div className="row mr-0 ml-0">
            <div className="col p-0 pr-1">
              <button className="btn btn-outline-secondary float-right pt-2 pb-2">
                <IconSearch /> <span className="pl-1">Search</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
