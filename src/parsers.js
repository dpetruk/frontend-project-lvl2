import YAML from 'js-yaml';
import ini from 'ini';

const parsers = {
  ini: (string) => ini.parse(string),
  json: (string) => JSON.parse(string),
  yaml: (string) => YAML.safeLoad(string),
  yml: (string) => YAML.safeLoad(string),
};

const selectParser = (extension) => parsers[extension];

export default selectParser;
