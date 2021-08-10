import axiosConfig from '../config/axiosConfig';

export const postRubric = (params) => {
  return axiosConfig.post("rubric/upload", params);
};

export const getRubricByName = (name) => {
  return axiosConfig.get("rubric/get_by_name?assignment_name=" + name);
}