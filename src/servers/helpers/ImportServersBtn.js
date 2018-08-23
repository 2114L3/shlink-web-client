import React  from 'react';
import { connect } from 'react-redux';
import { UncontrolledTooltip } from 'reactstrap';
import serversImporter, { serversImporterType } from '../services/ServersImporter';
import { createServers } from '../reducers/server';
import { assoc } from 'ramda';
import { v4 as uuid } from 'uuid';
import PropTypes from 'prop-types';

const defaultProps = {
  serversImporter,
};
const propTypes = {
  onImport: PropTypes.func,
  serversImporter: serversImporterType,
  createServers: PropTypes.func,
};

export class ImportServersBtn extends React.Component {
  constructor(props) {
    super(props);
    this.fileRef = React.createRef();
  }

  render() {
    const { serversImporter: { importServersFromFile }, onImport, createServers } = this.props;
    const onChange = e =>
      importServersFromFile(e.target.files[0])
        .then(servers => servers.map(server => assoc('id', uuid(), server)))
        .then(createServers)
        .then(onImport);

    return (
      <React.Fragment>
        <button
          type="button"
          className="btn btn-outline-secondary mr-2"
          onClick={() => this.fileRef.current.click()}
          id="importBtn"
        >
          Import from file
        </button>
        <UncontrolledTooltip placement="top" target="importBtn">
          You can create servers by importing a CSV file with columns "name", "apiKey" and "url"
        </UncontrolledTooltip>

        <input
          type="file"
          onChange={onChange}
          accept="text/csv"
          className="create-server__csv-select"
          ref={this.fileRef}
        />
      </React.Fragment>
    );
  }
}

ImportServersBtn.defaultProps = defaultProps;
ImportServersBtn.propTypes = propTypes;

export default connect(null, { createServers })(ImportServersBtn);
