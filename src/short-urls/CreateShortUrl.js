import downIcon from '@fortawesome/fontawesome-free-solid/faAngleDoubleDown';
import upIcon from '@fortawesome/fontawesome-free-solid/faAngleDoubleUp';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { assoc, dissoc, isNil, pick, pipe, replace, trim } from 'ramda';
import React from 'react';
import { connect } from 'react-redux';
import TagsInput from 'react-tagsinput'
import { Collapse } from 'reactstrap';
import DateInput from '../common/DateInput';
import CreateShortUrlResult from './helpers/CreateShortUrlResult';
import { createShortUrl, resetCreateShortUrl } from './reducers/shortUrlCreationResult';

export class CreateShortUrl extends React.Component {
  state = {
    longUrl: '',
    tags: [],
    customSlug: undefined,
    validSince: undefined,
    validUntil: undefined,
    maxVisits: undefined,
    moreOptionsVisible: false
  };

  render() {
    const { createShortUrl, shortUrlCreationResult, resetCreateShortUrl } = this.props;

    const changeTags = tags => this.setState({ tags: tags.map(pipe(trim, replace(/ /g, '-'))) });
    const renderOptionalInput = (id, placeholder, type = 'text', props = {}) =>
      <input
        className="form-control"
        type={type}
        placeholder={placeholder}
        value={this.state[id]}
        onChange={e => this.setState({ [id]: e.target.value })}
        {...props}
      />;
    const createDateInput = (id, placeholder, props = {}) =>
      <DateInput
        selected={this.state[id]}
        placeholderText={placeholder}
        onChange={date => this.setState({ [id]: date })}
        isClearable
        {...props}
      />;
    const formatDate = date => isNil(date) ? date : date.format();
    const save = e => {
      e.preventDefault();
      createShortUrl(pipe(
        dissoc('moreOptionsVisible'), // Remove moreOptionsVisible property
        assoc('validSince', formatDate(this.state.validSince)),
        assoc('validUntil', formatDate(this.state.validUntil))
      )(this.state));
    };

    return (
      <div className="short-urls-container">
        <form onSubmit={save}>
          <div className="form-group">
            <input
              className="form-control form-control-lg"
              type="url"
              placeholder="Insert the URL to be shortened"
              required
              value={this.state.longUrl}
              onChange={e => this.setState({ longUrl: e.target.value })}
            />
          </div>

          <Collapse isOpen={this.state.moreOptionsVisible}>
            <div className="form-group">
              <TagsInput
                value={this.state.tags}
                onChange={changeTags}
                onlyUnique
                inputProps={{ placeholder: 'Add tags to the URL' }}
              />
            </div>

            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  {renderOptionalInput('customSlug', 'Custom slug')}
                </div>
                <div className="form-group">
                  {renderOptionalInput('maxVisits', 'Maximum number of visits allowed', 'number', { min: 1 })}
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  {createDateInput('validSince', 'Enabled since...', { maxDate: this.state.validUntil })}
                </div>
                <div className="form-group">
                  {createDateInput('validUntil', 'Enabled until...', { minDate: this.state.validSince })}
                </div>
              </div>
            </div>
          </Collapse>

          <div>
            <button
              type="button"
              className="btn btn-outline-secondary create-short-url__btn"
              onClick={() => this.setState({ moreOptionsVisible: !this.state.moreOptionsVisible })}
            >
              <FontAwesomeIcon icon={this.state.moreOptionsVisible ? upIcon : downIcon} />
              &nbsp;
              {this.state.moreOptionsVisible ? 'Less' : 'More'} options
            </button>
            <button
              className="btn btn-outline-primary create-short-url__btn float-right"
              disabled={shortUrlCreationResult.loading}
            >
              {shortUrlCreationResult.loading ? 'Creating...' : 'Create'}
            </button>
          </div>

          <CreateShortUrlResult {...shortUrlCreationResult} resetCreateShortUrl={resetCreateShortUrl} />
        </form>
      </div>
    );
  }
}

export default connect(pick(['shortUrlCreationResult']), {
  createShortUrl,
  resetCreateShortUrl
})(CreateShortUrl);
