import PropTypes from 'prop-types';

/* eslint-disable padding-line-between-statements, newline-after-var */
export const DELETE_TAG_START = 'shlink/deleteTag/DELETE_TAG_START';
export const DELETE_TAG_ERROR = 'shlink/deleteTag/DELETE_TAG_ERROR';
export const DELETE_TAG = 'shlink/deleteTag/DELETE_TAG';
export const TAG_DELETED = 'shlink/deleteTag/TAG_DELETED';
/* eslint-enable padding-line-between-statements, newline-after-var */

export const tagDeleteType = PropTypes.shape({
  deleting: PropTypes.bool,
  error: PropTypes.bool,
});

const defaultState = {
  deleting: false,
  error: false,
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case DELETE_TAG_START:
      return {
        deleting: true,
        error: false,
      };
    case DELETE_TAG_ERROR:
      return {
        deleting: false,
        error: true,
      };
    case DELETE_TAG:
      return {
        deleting: false,
        error: false,
      };
    default:
      return state;
  }
}

export const deleteTag = (buildShlinkApiClient) => (tag) => async (dispatch, getState) => {
  dispatch({ type: DELETE_TAG_START });

  const { selectedServer } = getState();
  const shlinkApiClient = buildShlinkApiClient(selectedServer);

  try {
    await shlinkApiClient.deleteTags([ tag ]);
    dispatch({ type: DELETE_TAG });
  } catch (e) {
    dispatch({ type: DELETE_TAG_ERROR });

    throw e;
  }
};

export const tagDeleted = (tag) => ({ type: TAG_DELETED, tag });
