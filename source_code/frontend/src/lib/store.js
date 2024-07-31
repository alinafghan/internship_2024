import { createStore } from "redux";

// Initial state
const initialState = {
  isDarkMode: JSON.parse(localStorage.getItem("isDarkMode")) || false,
};

// Action Types
const TOGGLE_DARK_MODE = "TOGGLE_DARK_MODE";
const SET_DARK_MODE = "SET_DARK_MODE";

// Action Creators
export const toggleDarkMode = () => ({
  type: TOGGLE_DARK_MODE,
});

export const setDarkMode = (isDarkMode) => ({
  type: SET_DARK_MODE,
  payload: isDarkMode,
});

// Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_DARK_MODE:
      const newDarkModeStatus = !state.isDarkMode;
      localStorage.setItem("isDarkMode", JSON.stringify(newDarkModeStatus));
      return {
        ...state,
        isDarkMode: newDarkModeStatus,
      };
    case SET_DARK_MODE:
      localStorage.setItem("isDarkMode", JSON.stringify(action.payload));
      return {
        ...state,
        isDarkMode: action.payload,
      };
    default:
      return state;
  }
};

// Create Store
const store = createStore(reducer);

// Selector
export const selectDarkMode = (state) => state.isDarkMode;

export default store;
