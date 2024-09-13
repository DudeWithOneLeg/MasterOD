import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import configureStore from "./store";
import { restoreCSRF, csrfFetch } from "./store/csrf";
import ModalProvider from "./context/Modal.js";
import { SearchProvider } from "./context/SearchContext.js";
import { ResultsProvider } from "./context/ResultsContext.js";

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
    restoreCSRF();

    window.csrfFetch = csrfFetch;
    window.store = store;
}

function Root() {
    return (
        <Provider store={store}>
            <ResultsProvider>
                <SearchProvider>
                    <ModalProvider>
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                    </ModalProvider>
                </SearchProvider>
            </ResultsProvider>
        </Provider>
    );
}

ReactDOM.render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>,
    document.getElementById("root")
);
