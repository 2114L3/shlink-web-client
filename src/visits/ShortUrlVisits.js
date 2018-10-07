import preloader from '@fortawesome/fontawesome-free-solid/faCircleNotch';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { isEmpty, mapObjIndexed, pick } from 'ramda';
import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'reactstrap';
import PropTypes from 'prop-types';
import DateInput from '../common/DateInput';
import MutedMessage from '../utils/MuttedMessage';
import { getShortUrlVisits, shortUrlVisitsType } from './reducers/shortUrlVisits';
import {
  processBrowserStats,
  processCountriesStats,
  processOsStats,
  processReferrersStats,
} from './services/VisitsParser';
import { VisitsHeader } from './VisitsHeader';
import { GraphCard } from './GraphCard';
import { getShortUrlDetail, shortUrlDetailType } from './reducers/shortUrlDetail';
import './ShortUrlVisits.scss';

export class ShortUrlsVisitsComponent extends React.Component {
  static propTypes = {
    processOsStats: PropTypes.func,
    processBrowserStats: PropTypes.func,
    processCountriesStats: PropTypes.func,
    processReferrersStats: PropTypes.func,
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    getShortUrlVisits: PropTypes.func,
    shortUrlVisits: shortUrlVisitsType,
    getShortUrlDetail: PropTypes.func,
    shortUrlDetail: shortUrlDetailType,
  };
  static defaultProps = {
    processOsStats,
    processBrowserStats,
    processCountriesStats,
    processReferrersStats,
  };

  state = { startDate: undefined, endDate: undefined };
  loadVisits = () => {
    const { match: { params }, getShortUrlVisits } = this.props;

    getShortUrlVisits(params.shortCode, mapObjIndexed(
      (value) => value && value.format ? value.format('YYYY-MM-DD') : value,
      this.state
    ));
  };

  componentDidMount() {
    const { match: { params }, getShortUrlDetail } = this.props;

    this.loadVisits();
    getShortUrlDetail(params.shortCode);
  }

  render() {
    const {
      processOsStats,
      processBrowserStats,
      processCountriesStats,
      processReferrersStats,
      shortUrlVisits,
      shortUrlDetail,
    } = this.props;

    const renderVisitsContent = () => {
      const { visits, loading, error } = shortUrlVisits;

      if (loading) {
        return <MutedMessage><FontAwesomeIcon icon={preloader} spin /> Loading...</MutedMessage>;
      }

      if (error) {
        return (
          <Card className="mt-4" body inverse color="danger">
            An error occurred while loading visits :(
          </Card>
        );
      }

      if (isEmpty(visits)) {
        return <MutedMessage>There are no visits matching current filter  :(</MutedMessage>;
      }

      return (
        <div className="row">
          <div className="col-md-6">
            <GraphCard title="Operating systems" stats={processOsStats(visits)} />
          </div>
          <div className="col-md-6">
            <GraphCard title="Browsers" stats={processBrowserStats(visits)} />
          </div>
          <div className="col-md-6">
            <GraphCard title="Countries" stats={processCountriesStats(visits)} isBarChart />
          </div>
          <div className="col-md-6">
            <GraphCard title="Referrers" stats={processReferrersStats(visits)} isBarChart />
          </div>
        </div>
      );
    };

    return (
      <div className="shlink-container">
        <VisitsHeader shortUrlDetail={shortUrlDetail} shortUrlVisits={shortUrlVisits} />

        <section className="mt-4">
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 offset-xl-6 offset-lg-4">
              <DateInput
                selected={this.state.startDate}
                placeholderText="Since"
                isClearable
                maxDate={this.state.endDate}
                onChange={(date) => this.setState({ startDate: date }, () => this.loadVisits())}
              />
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6">
              <DateInput
                className="short-url-visits__date-input"
                selected={this.state.endDate}
                placeholderText="Until"
                isClearable
                minDate={this.state.startDate}
                onChange={(date) => this.setState({ endDate: date }, () => this.loadVisits())}
              />
            </div>
          </div>
        </section>

        <section>
          {renderVisitsContent()}
        </section>
      </div>
    );
  }
}

const ShortUrlsVisits = connect(
  pick([ 'shortUrlVisits', 'shortUrlDetail' ]),
  { getShortUrlVisits, getShortUrlDetail }
)(ShortUrlsVisitsComponent);

export default ShortUrlsVisits;
