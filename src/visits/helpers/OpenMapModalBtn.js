import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt as mapIcon } from '@fortawesome/free-solid-svg-icons';
import { UncontrolledTooltip } from 'reactstrap';
import * as PropTypes from 'prop-types';
import MapModal from './MapModal';
import './OpenMapModalBtn.scss';

export default class OpenMapModalBtn extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  state = { mapIsOpened: false };

  render() {
    const { title } = this.props;
    const toggleMap = () => this.setState(({ mapIsOpened }) => ({ mapIsOpened: !mapIsOpened }));
    const buttonRef = React.createRef();

    return (
      <React.Fragment>
        <button className="btn btn-link open-map-modal-btn__btn" ref={buttonRef} onClick={toggleMap}>
          <FontAwesomeIcon icon={mapIcon} />
        </button>
        <UncontrolledTooltip placement="bottom" target={() => buttonRef.current}>Show in map</UncontrolledTooltip>
        <MapModal toggle={toggleMap} isOpen={this.state.mapIsOpened} title={title} />
      </React.Fragment>
    );
  }
}
