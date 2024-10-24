import React, { useRef, useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// Create a context for the modal
const SnackbarContext = createContext();

// Custom hook to use the modal context
export function useSnackbar() {
  return useContext(SnackbarContext);
}

export default function SnackBarProvider({ children }) {
  const snackbarRef = useRef(document.createElement('div'));
  const [snackbarType, setSnackbarType] = useState("");
  const [onModalClose, setOnModalClose] = useState(null);
  const [open, setOpen] = useState(false)

  const closeModal = () => {
    setOpen(false);
    if (typeof onModalClose === "function") {
      setOnModalClose(null);
      onModalClose();
    }
  };

  const openSnackbar = (type) => {
    setSnackbarType(type)
    setOpen(true)
  }

  const contextValue = {
    openSnackbar,
    setOnModalClose,
    closeModal
  };

  const handleClose = () => {
    setOpen(false)
  }

  const snackbarContent = {
    "success" : {
      message: "Success",
      content: (
        <>
          <Button color="secondary" size="small" onClick={handleClose}>
            UNDO
          </Button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      )
    },
    "error" : {
      message: (
        <p className='text-red-400'>An error occured</p>
      ),
      content: (
        <>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      )
    }
  }


  useEffect(() => {
    const snackbarRoot = document.getElementById('snackbar-root');
    if (snackbarRoot && snackbarRef.current) {
      snackbarRoot.appendChild(snackbarRef.current);
    }
    return () => {
      if (snackbarRoot && snackbarRef.current) {
        snackbarRoot.removeChild(snackbarRef.current);
      }
    };
  }, []);

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      {open && snackbarType && ReactDOM.createPortal(
        <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbarContent[snackbarType]?.message}
        action={snackbarContent[snackbarType]?.content}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />,
        snackbarRef.current
      )}
    </SnackbarContext.Provider>
  );
}
