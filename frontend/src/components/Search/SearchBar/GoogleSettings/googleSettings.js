import googleLanguages from "./google-languages.json";
import googleCountries from "./google-countries.json";

const googleOperators = {
  "Site:": "site:",
  "In title:": "intitle:",
  "In url:": "inurl:",
  "Include text:": "intext:",
  "Exclude site:": "-site:",
  "Exclude from title:": "-intitle:",
  "Exclude from url:": "-inurl:",
  "Exclude from text:": "-intext:",
};

export const googleSettings = {operators: googleOperators, countries: googleCountries, languages: googleLanguages}
