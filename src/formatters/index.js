import _ from 'lodash';
import getStylish from './stylish.js';
import getPlain from './plain.js';

const formatters = {
  stylish: getStylish,
  plain: getPlain,
  json: JSON.stringify,
};

const selectFormatter = (name) => {
  if (!_.has(formatters, name)) {
    const errorMessage = `Unknown formatter name '${name}'.`;
    return () => errorMessage;
  }

  return formatters[name];
};

export default selectFormatter;
