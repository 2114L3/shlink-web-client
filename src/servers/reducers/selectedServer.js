import { createAction, handleActions } from 'redux-actions';
import { resetShortUrlParams } from '../../short-urls/reducers/shortUrlsListParams';

/* eslint-disable padding-line-between-statements */
export const SELECT_SERVER = 'shlink/selectedServer/SELECT_SERVER';
export const RESET_SELECTED_SERVER = 'shlink/selectedServer/RESET_SELECTED_SERVER';
/* eslint-enable padding-line-between-statements */

const defaultState = null;

export const resetSelectedServer = createAction(RESET_SELECTED_SERVER);

export const selectServer = (serversService) => (serverId) => (dispatch) => {
  dispatch(resetShortUrlParams());

  const selectedServer = serversService.findServerById(serverId);

  dispatch({
    type: SELECT_SERVER,
    selectedServer,
  });
};

const reducer = handleActions({
  [RESET_SELECTED_SERVER]: () => defaultState,
  [SELECT_SERVER]: (state, { selectedServer }) => selectedServer,
}, defaultState);

export default reducer;
