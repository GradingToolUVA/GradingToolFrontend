import axiosConfig from '../config/axiosConfig';
import axios from 'axios';

export const getUser = (id) => {
  return axiosConfig.get("accounts/user/" + id);
};

export const login = (username, password) => {
  return axiosConfig.post("accounts/api-token-auth/", {
    username: username,
    password: password,
  });
};

export const register = ({ username, password, email }) => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  // Request Body
  const body = JSON.stringify({ username, email, password });
  return axios.post('http://127.0.0.1:8000/accounts/auth/register', body, config);
};