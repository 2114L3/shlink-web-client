import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { applyMiddleware, compose, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import App from './App';
import './index.scss';
import ScrollToTop from './common/ScrollToTop';
import reducers from './reducers';
import registerServiceWorker from './registerServiceWorker';
import '../node_modules/react-datepicker/dist/react-datepicker.css';
import './common/react-tagsinput.scss';

const composeEnhancers = process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  : compose;
const store = createStore(reducers, composeEnhancers(
  applyMiddleware(ReduxThunk)
));

render(
  <Provider store={store}>
    <BrowserRouter>
      <ScrollToTop>
        <App />
      </ScrollToTop>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
