import React, { Component } from "react";
import InputControl from "./inputs/InputControl";
import "./CommonForm.css";
import { IconClose } from "../_helpers/Incons";

const validateForm = errors => {
  let valid = true;
  Object.values(errors).forEach(val => val.length > 0 && (valid = false));
  return valid;
};

export class CommonForm extends Component {
  constructor(props) {
    super(props);
    const errors = {};
    const data = {};
    this.props.meta.fields.forEach(f => {
      errors[f.name] = "";
      data[f.name] = f.value ? f.value : null;
    });
    this.state = {
      data,
      errors: errors
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setChanged = this.setChanged.bind(this);
  }

  validateOne(name, value) {
    const errors = this.state.errors;
    const field = this.props.meta.fields.find(f => f.name === name);
    if (field.validator) {
      const v = field.validator;
      errors[field.name] = v.valid(value)
        ? ""
        : v.error
        ? v.error
        : "Invalid entry";
    }
    return errors;
  }

  validateAll() {
    let tmp = {};
    for (const f of this.props.meta.fields) {
      const name = f.name;
      const value = this.state.data[name];
      const errors = this.validateOne(name, value);
      tmp = { ...tmp, ...errors };
    }
    return tmp;
  }

  handleChange(event) {
    const { name, value, type, multiple } = event.target;
    if (type === "checkbox") {
      this.setCheckBoxChanged(event, name, value);
    } else {
      event.preventDefault();
      if (type === "file") {
        this.setFileChanged(event, name);
      } else if (type === "select-multiple") {
        this.setMultiSelectChanged(event, name, value);
      } else {
        this.setChanged(name, value);
      }
    }
  }

  setChanged(name, value) {
    this.props.clearNewOption(name);
    const errors = this.validateOne(name, value);
    this.setState({ errors, data: { ...this.state.data, [name]: value } });
  }

  setFileChanged(e, name) {
    const file = e.target.files[0];
    this.props.clearNewOption(name);
    const errors = this.validateOne(name, file);
    this.setState({ errors, data: { ...this.state.data, [name]: file } });
  }

  setMultiSelectChanged(e, name, value) {
    const selObj = e.target;
    const options = selObj.options;
    const res = [];
    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      if (opt.selected) {
        res.push(opt.value);
      }
    }

    this.props.clearNewOption(name);
    const errors = this.validateOne(name, res);
    this.setState({ errors, data: { ...this.state.data, [name]: res } });
  }

  setCheckBoxChanged(e, name, value) {
    const boxes = document.querySelectorAll(`input[name=${name}]`);
    const res = [];
    for (let i = 0; i < boxes.length; i++) {
      const opt = boxes[i];
      if (opt.checked) {
        res.push(opt.value);
      }
    }
    this.props.clearNewOption(name);
    const errors = this.validateOne(name, res);
    this.setState({ errors, data: { ...this.state.data, [name]: res } });
  }

  clearFormData() {
    const data = this.state.data;
    Object.keys(data).forEach(function(key, index) {
      this[key] = "";
    }, data);
    this.setState({ data });
  }

  handleSubmit(event) {
    event.preventDefault();
    const errors = this.validateAll();
    this.setState({ errors });
    if (validateForm(this.state.errors)) {
      const onSubmit = this.props.meta.onSubmit;
      if (onSubmit) {
        onSubmit(this.state.data, res => {
          if (res) {
            this.clearFormData();
          }
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { newOptions } = this.props;
    this.props.meta.fields.forEach(({ name }) => {
      if (newOptions[name] && prevState.data[name] !== newOptions[name].id) {
        this.setState({
          data: { ...this.state.data, [name]: newOptions[name].id }
        });
      }
    });
  }

  render() {
    const { errors, data } = this.state;
    const { meta, onClose, newOptions, readOnly, encType } = this.props;
    const defaultClose = () => console.log("Close not handled...");
    const handleClose = onClose || defaultClose;

    return (
      <div className="form-wrap bg-light">
        {meta.title && (
          <div className="form-header p-2">
            <h5 className="">
              <span>{meta.title}</span>
            </h5>
            {onClose && (
              <div className="float-right">
                <button
                  className="float-right btn btn-link p-0 text-warning"
                  onClick={handleClose}
                >
                  <IconClose />
                </button>
              </div>
            )}
          </div>
        )}
        <div className="form-v-scroll">
          <form
            onSubmit={this.handleSubmit}
            noValidate
            className="p-2"
            encType={encType}
          >
            <fieldset disabled={readOnly}>
              {meta.fields.map(f => {
                return (
                  <div key={f.name} className="mb-2">
                    <InputControl
                      onShowPopup={this.props.onShowPopup}
                      readOnly={readOnly}
                      field={f}
                      value={
                        f.other && newOptions && newOptions[f.name]
                          ? newOptions[f.name].id
                          : data[f.name] || ""
                      }
                      name={f.name}
                      id={f.name}
                      className="form-control p-2"
                      onChange={this.handleChange}
                      noValidate
                      errors={errors}
                      setChanged={this.setChanged}
                    />
                    {f.info && (
                      <div className="info">
                        <small>{f.info}</small>
                      </div>
                    )}
                  </div>
                );
              })}
              {!readOnly && (
                <div className="submit pt-3">
                  <button className="btn btn-sm btn-primary">
                    {meta.btnLabel || "Submit"}
                  </button>
                </div>
              )}
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
}

export default CommonForm;
