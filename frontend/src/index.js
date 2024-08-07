
  import React from 'react';
  import ReactDOM from 'react-dom';
  import { BrowserRouter } from 'react-router-dom';
  import { Provider } from 'react-redux';
  import './index.css';
  import App from './App';
  import configureStore from './store';
  import { restoreCSRF, csrfFetch } from './store/csrf';
  import ModalProvider from './context/Modal.js'

  const store = configureStore();

  if (process.env.NODE_ENV !== 'production') {
    restoreCSRF();

    window.csrfFetch = csrfFetch;
    window.store = store;
  }

  function Root() {
    return (
      <ModalProvider>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </ModalProvider>
    );
  }

  ReactDOM.render(
    <React.StrictMode>
      <Root/>
    </React.StrictMode>,
    document.getElementById('root')
  );
