import {
  AUTH_USER,
  REGISTER_SUCCES,
  REGISTER_ERROR,
  LOGIN_ERROR,
  LOGIN_SUCCES,
  LOG_OUT,
  CLEAN_ALERT,
  SHOW_ALERT,
} from "../../types";

export default (state, action) => {
  switch (action.type) {
    case REGISTER_SUCCES:
    case REGISTER_ERROR:
    case LOGIN_ERROR:
      return {
        ...state,
        alert: action.payload,
      };

    case LOGIN_SUCCES:
      localStorage.setItem("token", action.payload);
      return {
        ...state,
        token: action.payload,
        auth: true,
      };

    case AUTH_USER:
      return {
        ...state,
        user: action.payload,
        auth: true,
      };

    case LOG_OUT:
        localStorage.removeItem("token");
      return {
        ...state,
        user: null,
        token: null,
        auth: null,
      };

    case CLEAN_ALERT:
      return {
        ...state,
        alert: null,
      };

    default:
      return {
        ...state,
      };
  }
};
