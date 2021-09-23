import axiosConfig from '../config/axiosConfig';

export const getLastSession = () => {
  return axiosConfig.get("gradetool/session");
}

export const postLastSession = (params) => {
  return axiosConfig.post("gradetool/session", params);
}