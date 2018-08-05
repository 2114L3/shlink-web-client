import caretDownIcon from '@fortawesome/fontawesome-free-solid/faCaretDown';
import caretUpIcon from '@fortawesome/fontawesome-free-solid/faCaretUp';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { isEmpty, pick } from 'ramda';
import React from 'react';
import { connect } from 'react-redux';
import { ShortUrlsRow } from './helpers/ShortUrlsRow';
import { listShortUrls } from './reducers/shortUrlsList';
import './ShortUrlsList.scss';

export class ShortUrlsList extends React.Component {
  refreshList = extraParams => {
    const { listShortUrls, shortUrlsListParams } = this.props;
    listShortUrls({
      ...shortUrlsListParams,
      ...extraParams
    });
  };

  constructor(props) {
    super(props);

    const orderBy = props.shortUrlsListParams.orderBy;
    this.state = {
      orderField: orderBy ? Object.keys(orderBy)[0] : 'dateCreated',
      orderDir: orderBy ? Object.values(orderBy)[0] : 'ASC',
    }
  }

  componentDidMount() {
    const { match: { params } } = this.props;
    this.refreshList({ page: params.page });
  }

  render() {
    const orderBy = field => {
      const newOrderDir = this.state.orderField !== field ? 'ASC' : (this.state.orderDir === 'DESC' ? 'ASC' : 'DESC');
      this.setState({ orderField: field, orderDir: newOrderDir });
      this.refreshList({ orderBy: { [field]: newOrderDir } })
    };
    const renderOrderIcon = field => {
      if (this.state.orderField !== field) {
          return null;
      }

      return (
        <FontAwesomeIcon
          icon={this.state.orderDir === 'ASC' ? caretUpIcon : caretDownIcon}
          className="short-urls-list__header-icon"
        />
      );
    };

    return (
      <table className="table table-striped table-hover">
        <thead className="short-urls-list__header">
          <tr>
            <th
              className="short-urls-list__header-cell short-urls-list__header-cell--with-action"
              onClick={() => orderBy('dateCreated')}
            >
              {renderOrderIcon('dateCreated')}
              Created at
            </th>
            <th
              className="short-urls-list__header-cell short-urls-list__header-cell--with-action"
              onClick={() => orderBy('shortCode')}
            >
              {renderOrderIcon('shortCode')}
              Short URL
            </th>
            <th
              className="short-urls-list__header-cell short-urls-list__header-cell--with-action"
              onClick={() => orderBy('originalUrl')}
            >
              {renderOrderIcon('originalUrl')}
              Long URL
            </th>
            <th className="short-urls-list__header-cell">Tags</th>
            <th
              className="short-urls-list__header-cell short-urls-list__header-cell--with-action"
              onClick={() => orderBy('visits')}
            >
              <span className="nowrap">{renderOrderIcon('visits')} Visits</span>
            </th>
            <th className="short-urls-list__header-cell">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {this.renderShortUrls()}
        </tbody>
      </table>
    );
  }

  renderShortUrls() {
    const { shortUrlsList, selectedServer, loading, error, shortUrlsListParams } = this.props;
    if (error) {
      return <tr><td colSpan="6" className="text-center table-danger">Something went wrong while loading short URLs :(</td></tr>;
    }

    if (loading) {
      return <tr><td colSpan="6" className="text-center">Loading...</td></tr>;
    }

    if (! loading && isEmpty(shortUrlsList)) {
      return <tr><td colSpan="6" className="text-center">No results found</td></tr>;
    }

    return shortUrlsList.map(shortUrl => (
      <ShortUrlsRow
        shortUrl={shortUrl}
        selectedServer={selectedServer}
        key={shortUrl.shortCode}
        refreshList={this.refreshList}
        shortUrlsListParams={shortUrlsListParams}
      />
    ));
  }
}

export default connect(pick(['selectedServer', 'shortUrlsListParams']), { listShortUrls })(ShortUrlsList);
