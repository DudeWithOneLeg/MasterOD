import bingCountries from "./bing-countries.json";
import bingLanguages from './bing-languages.json'

const operators = {
  "Contains:": { "text": "contains:", "example": "pdf" },
  "Filetype:": { "text": "filetype:", "example": "pdf" },
  "In anchor:": { "text": "inanchor:", "example": "buy now" },
  "In body:": { "text": "inbody:", "example": "artificial intelligence" },
  "In title:": { "text": "intitle:", "example": "research paper" },
  "IP address:": { "text": "ip:", "example": "192.168.1.1" },
  "Prefer:": { "text": "prefer:", "example": "latest results" },
  "Site:": { "text": "site:", "example": "example.com" },
  "URL:": { "text": "url:", "example": "example.com/about" }
};

export const bingSettings = {countries: bingCountries, languages: bingLanguages, operators}
