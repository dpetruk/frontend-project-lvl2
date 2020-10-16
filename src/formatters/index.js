import _ from 'lodash';
import getStylish from './stylish.js';
import getPlain from './plain.js';

const formatters = {
  stylish: getStylish,
  plain: getPlain,
  json: JSON.stringify,
};

const selectFormatter = (format) => {
  if (!_.has(formatters, format)) {
    throw new Error(`Unknown format '${format}'.`);
  }

  return formatters[format];
};

export default selectFormatter;
