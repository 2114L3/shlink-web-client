import caretDownIcon from '@fortawesome/fontawesome-free-solid/faCaretDown';
import caretUpIcon from '@fortawesome/fontawesome-free-solid/faCaretUp';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { head, isEmpty, pick, toPairs, keys, values } from 'ramda';
import React from 'react';
import { connect } from 'react-redux';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import qs from 'qs';
import PropTypes from 'prop-types';
import { serverType } from '../servers/prop-types';
import { ShortUrlsRow } from './helpers/ShortUrlsRow';
import { listShortUrls, shortUrlType } from './reducers/shortUrlsList';
import './ShortUrlsList.scss';
import { shortUrlsListParamsType } from './reducers/shortUrlsListParams';

const SORTABLE_FIELDS = {
  dateCreated: 'Created at',
  shortCode: 'Short URL',
  originalUrl: 'Long URL',
  visits: 'Visits',
};

export class ShortUrlsListComponent extends React.Component {
  static propTypes = {
    listShortUrls: PropTypes.func,
    shortUrlsListParams: shortUrlsListParamsType,
    match: PropTypes.object,
    location: PropTypes.object,
    loading: PropTypes.bool,
    error: PropTypes.bool,
    shortUrlsList: PropTypes.arrayOf(shortUrlType),
    selectedServer: serverType,
  };

  refreshList = (extraParams) => {
    const { listShortUrls, shortUrlsListParams } = this.props;

    listShortUrls({
      ...shortUrlsListParams,
      ...extraParams,
    });
  };
  determineOrderDir = (field) => {
    if (this.state.orderField !== field) {
      return 'ASC';
    }

    const newOrderMap = {
      ASC: 'DESC',
      DESC: undefined,
    };

    return this.state.orderDir ? newOrderMap[this.state.orderDir] : 'ASC';
  };
  orderBy = (field) => {
    const newOrderDir = this.determineOrderDir(field);

    this.setState({ orderField: newOrderDir !== undefined ? field : undefined, orderDir: newOrderDir });
    this.refreshList({ orderBy: { [field]: newOrderDir } });
  };
  renderOrderIcon = (field, className = 'short-urls-list__header-icon') => {
    if (this.state.orderField !== field) {
      return null;
    }

    return (
      <FontAwesomeIcon
        icon={this.state.orderDir === 'ASC' ? caretUpIcon : caretDownIcon}
        className={className}
      />
    );
  };

  constructor(props) {
    super(props);

    const { orderBy } = props.shortUrlsListParams;

    this.state = {
      orderField: orderBy ? head(keys(orderBy)) : undefined,
      orderDir: orderBy ? head(values(orderBy)) : undefined,
    };
  }

  componentDidMount() {
    const { match: { params }, location, shortUrlsListParams } = this.props;
    const query = qs.parse(location.search, { ignoreQueryPrefix: true });

    this.refreshList({ page: params.page, tags: query.tag ? [ query.tag ] : shortUrlsListParams.tags });
  }

  renderShortUrls() {
    const { shortUrlsList, selectedServer, loading, error, shortUrlsListParams } = this.props;

    if (error) {
      return (
        <tr>
          <td colSpan="6" className="text-center table-danger">Something went wrong while loading short URLs :(</td>
        </tr>
      );
    }

    if (loading) {
      return <tr><td colSpan="6" className="text-center">Loading...</td></tr>;
    }

    if (!loading && isEmpty(shortUrlsList)) {
      return <tr><td colSpan="6" className="text-center">No results found</td></tr>;
    }

    return shortUrlsList.map((shortUrl) => (
      <ShortUrlsRow
        shortUrl={shortUrl}
        selectedServer={selectedServer}
        key={shortUrl.shortCode}
        refreshList={this.refreshList}
        shortUrlsListParams={shortUrlsListParams}
      />
    ));
  }

  renderMobileOrderingControls() {
    return (
      <div className="d-block d-md-none mb-3">
        <UncontrolledDropdown>
          <DropdownToggle caret className="btn-block">
            Order by
          </DropdownToggle>
          <DropdownMenu className="short-urls-list__order-dropdown">
            {toPairs(SORTABLE_FIELDS).map(([ key, value ]) => (
              <DropdownItem key={key} active={this.state.orderField === key} onClick={() => this.orderBy(key)}>
                {value}
                {this.renderOrderIcon(key, 'short-urls-list__header-icon--mobile')}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.renderMobileOrderingControls()}
        <table className="table table-striped table-hover">
          <thead className="short-urls-list__header">
            <tr>
              <th
                className="short-urls-list__header-cell short-urls-list__header-cell--with-action"
                onClick={() => this.orderBy('dateCreated')}
              >
                {this.renderOrderIcon('dateCreated')}
                Created at
              </th>
              <th
                className="short-urls-list__header-cell short-urls-list__header-cell--with-action"
                onClick={() => this.orderBy('shortCode')}
              >
                {this.renderOrderIcon('shortCode')}
                Short URL
              </th>
              <th
                className="short-urls-list__header-cell short-urls-list__header-cell--with-action"
                onClick={() => this.orderBy('originalUrl')}
              >
                {this.renderOrderIcon('originalUrl')}
                Long URL
              </th>
              <th className="short-urls-list__header-cell">Tags</th>
              <th
                className="short-urls-list__header-cell short-urls-list__header-cell--with-action"
                onClick={() => this.orderBy('visits')}
              >
                <span className="nowrap">{this.renderOrderIcon('visits')} Visits</span>
              </th>
              <th className="short-urls-list__header-cell">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {this.renderShortUrls()}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

const ShortUrlsList = connect(
  pick([ 'selectedServer', 'shortUrlsListParams' ]),
  { listShortUrls }
)(ShortUrlsListComponent);

export default ShortUrlsList;
