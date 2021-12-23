import axiosConfig from '../config/axiosConfig';

export const postRubric = (params) => {
  return axiosConfig.post("rubric/upload", params);
};

export const getRubricByName = (name) => {
  return axiosConfig.get("rubric/get_by_name?assignment_name=" + name);
}

export const getAllRubrics = () => {
  return axiosConfig.get("rubric/get_rubrics");
}

export const getRubricById = (id) => {
  return axiosConfig.get("rubric/get_by_id?id=" + id);
}

export const updateRubric = (id, params) => {
  return axiosConfig.patch("rubric/update?id=" + id, params);
}