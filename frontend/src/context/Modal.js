import React, { useRef, useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom';

// Create a context for the modal
const ModalContext = createContext();

// Custom hook to use the modal context
export function useModal() {
  return useContext(ModalContext);
}

export default function ModalProvider({ children }) {
  const modalRef = useRef(document.createElement('div'));
  const [modalContent, setModalContent] = useState(null);
  const [onModalClose, setOnModalClose] = useState(null);

  const closeModal = () => {
    setModalContent(null);
    if (typeof onModalClose === "function") {
      setOnModalClose(null);
      onModalClose();
    }
  };

  const contextValue = {
    modalRef,
    modalContent,
    setModalContent,
    setOnModalClose,
    closeModal,
  };

  useEffect(() => {
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot && modalRef.current) {
      modalRoot.appendChild(modalRef.current);
    }
    return () => {
      if (modalRoot && modalRef.current) {
        modalRoot.removeChild(modalRef.current);
      }
    };
  }, []);

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {modalContent && ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 h-screen w-screen">
        <div className="absolute inset-0" onClick={closeModal}></div>
        <div className="relative m-5 rounded-lg z-60 h-1/2 w-1/2 overflow-y-auto">
          {modalContent}
        </div>
      </div>,
        modalRef.current
      )}
    </ModalContext.Provider>
  );
}
