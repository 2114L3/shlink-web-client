import React from 'react';
import { Link } from 'react-router-dom';
import * as PropTypes from 'prop-types';

const propTypes = {
  to: PropTypes.string,
  btnText: PropTypes.string,
};

const NotFound = ({ to = '/', btnText = 'Home' }) => (
  <div className="home">
    <h2>Oops! We could not find requested route.</h2>
    <p>
      Use your browser{'\''}s back button to navigate to the page you have previously come from, or just press this button.
    </p>
    <br />
    <Link to={to} className="btn btn-outline-primary btn-lg">{btnText}</Link>
  </div>
);

NotFound.propTypes = propTypes;

export default NotFound;
