import bingCountries from "./bing-countries.json";
import bingLanguages from './bing-languages.json'

const operators = {
  "Contains:": "contains:",
  "Ext:": "ext:",
  "Filetype:": "filetype:",
  "In anchor:": "inanchor:",
  "In body:": "inbody:",
  "In title:": "intitle:",
  "IP address:": "ip:",
  "Language:": "language:",
  "Loc:": "loc:",
  "Prefer:": "prefer:",
  "Site:": "site:",
  // "Feed:": "feed:",
  // "Hasfeed:": "hasfeed:",
  "URL:": "url:",
};

export const bingSettings = {countries: bingCountries, languages: bingLanguages, operators}
