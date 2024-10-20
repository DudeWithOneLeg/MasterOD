
import React from "react";
import { useModal } from "../../context/Modal";

function OpenModalButton({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
  className,
  buttonImg
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = (e) => {
    e.preventDefault();
    if (typeof onButtonClick === "function") onButtonClick();
    if (typeof onModalClose === "function") setOnModalClose(onModalClose);
    setModalContent(modalComponent);
  };

  return <button onClick={onClick} className={className}>
    {buttonImg ?? buttonImg}
    <p className="w-fit">{buttonText ?? buttonText}</p>
  </button>;
}

export default OpenModalButton;
