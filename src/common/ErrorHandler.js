import React from 'react';
import * as PropTypes from 'prop-types';
import './ErrorHandler.scss';
import { Button } from 'reactstrap';

const ErrorHandler = ({ location }) => class ErrorHandler extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-handler">
          <h1>Oops! This is awkward :S</h1>
          <p>It seems that something went wrong. Try refreshing the page or just click this button.</p>
          <br />
          <Button outline color="primary" onClick={() => location.reload()}>Take me back</Button>
        </div>
      );
    }

    return this.props.children;
  }
};

export default ErrorHandler;
