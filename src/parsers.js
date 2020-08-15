import YAML from 'js-yaml';
import ini from 'ini';

const parse = {
  ini: (string) => ini.parse(string),
  json: (string) => JSON.parse(string),
  yam: (string) => YAML.safeLoad(string),
  yml: (string) => YAML.safeLoad(string),
};

export default parse;
