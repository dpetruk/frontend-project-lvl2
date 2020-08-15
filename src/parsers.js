import YAML from 'js-yaml';

const parse = {
  JSON: (string) => JSON.parse(string),
  YAML: (string) => YAML.safeLoad(string),
  YML: (string) => YAML.safeLoad(string),
};

export default parse;
