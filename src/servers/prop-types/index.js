import PropTypes from 'prop-types';

export const serverType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  url: PropTypes.string,
  apiKey: PropTypes.string,
});
