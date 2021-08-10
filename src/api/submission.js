import axiosConfig from '../config/axiosConfig';

export const postSubmission = (params) => {
  return axiosConfig.post("submission/submit", params);
}

export const getSubmission = (group_name, assignment_name, semester) => {
  return axiosConfig.get("submission/get" + 
    "?group_name=" + group_name + 
    "&assignment_name=" + assignment_name + 
    "&semester=" + semester);
}

export const getSubmissionPages = (group_name, assignment_name, semester) => {
  return axiosConfig.get("submission/get_pages" + 
    "?group_name=" + group_name + 
    "&assignment_name=" + assignment_name + 
    "&semester=" + semester);
}

export const postComment = (pageId, params) => {
  return axiosConfig.post("submission/comment?id=" + pageId, params);
}

export const patchComment = (id, params) => {
  return axiosConfig.patch("submission/comment?id=" + id, params);
}

export const deleteComment = (id, params) => {
  return axiosConfig.delete("submission/comment?id=" + id, params);
}

export const getComments = (pageId) => {
  return axiosConfig.get("submission/get_comments?id=" + pageId);
}
