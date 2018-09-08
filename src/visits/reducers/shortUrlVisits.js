import { curry } from 'ramda';
import PropTypes from 'prop-types';
import shlinkApiClient from '../../api/ShlinkApiClient';

/* eslint-disable padding-line-between-statements, newline-after-var */
export const GET_SHORT_URL_VISITS_START = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS_START';
export const GET_SHORT_URL_VISITS_ERROR = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS_ERROR';
export const GET_SHORT_URL_VISITS = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS';
/* eslint-enable padding-line-between-statements, newline-after-var */

export const shortUrlVisitsType = PropTypes.shape({
  visits: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.bool,
});

const initialState = {
  visits: [],
  loading: false,
  error: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_SHORT_URL_VISITS_START:
      return {
        ...state,
        loading: true,
      };
    case GET_SHORT_URL_VISITS_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      };
    case GET_SHORT_URL_VISITS:
      return {
        visits: action.visits,
        loading: false,
        error: false,
      };
    default:
      return state;
  }
}

export const _getShortUrlVisits = (shlinkApiClient, shortCode, dates) => async (dispatch) => {
  dispatch({ type: GET_SHORT_URL_VISITS_START });

  try {
    const visits = await shlinkApiClient.getShortUrlVisits(shortCode, dates);

    dispatch({ visits, type: GET_SHORT_URL_VISITS });
  } catch (e) {
    dispatch({ type: GET_SHORT_URL_VISITS_ERROR });
  }
};

export const getShortUrlVisits = curry(_getShortUrlVisits)(shlinkApiClient);
