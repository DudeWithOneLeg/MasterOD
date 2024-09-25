import googleLanguages from "./google-languages.json";
import googleCountries from "./google-countries.json";

const googleOperators = {
  "Site:": { text: "site:", example: ".edu" },
  "In title:": { text: "intitle:", example: "research paper" },
  "In url:": { text: "inurl:", example: "pdf" },
  "Include text:": { text: "intext:", example: "organic chemistry" },
  "Exclude site:": { text: "-site:", example: "wikipedia.org" },
  "Exclude from title:": { text: "-intitle:", example: "login" },
  "Exclude from url:": { text: "-inurl:", example: "forum" },
  "Exclude from text:": { text: "-intext:", example: "advertisement" }
};

export const googleSettings = {operators: googleOperators, countries: googleCountries, languages: googleLanguages}
