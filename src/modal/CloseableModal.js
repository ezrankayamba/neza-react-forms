import "./Modal.css";
import React from "react";

const CloseableModal = ({ modalId, handleClose, show, content, ...props }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";
  const otherClick = e => {
    if (e.target.id === modalId) {
      e.stopPropagation();
      handleClose(e);
    }
  };
  return (
    <div className={showHideClassName} onClick={otherClick} id={modalId}>
      <div className="modal-main p-0">{content}</div>
    </div>
  );
};

export default CloseableModal;
