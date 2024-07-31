// SearchContext.js
import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);

  const resetSearchResults = () => {
    setSearchResults([]);
  };

  return (
    <SearchContext.Provider
      value={{ resetSearchResults, searchResults, setSearchResults }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
