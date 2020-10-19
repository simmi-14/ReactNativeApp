import {combineReducers} from "redux";

export const u_name = (state='',action) => {
      return (action.type === 'SET_NAME') ?
          action.payload:state;
};
export const u_dob = (state='',action) => {
      return (action.type === 'SET_DOB') ?
          action.payload:state;
};
export const u_email = (state='',action) => {
      return (action.type === 'SET_EMAIL') ?
          action.payload:state;
};
export const u_token = (state='',action) => {
      return (action.type === 'SET_TOKEN') ?
          action.payload:state;
};

let appReducer = combineReducers({
    u_name,
    u_dob,
    u_email,
    u_token,
});

export default appReducer;

