import axiosConfig from '../config/axiosConfig';

export const postSubmission = (params) => {
  return axiosConfig.post("submission/submit", params);
}

export const getSubmission = (params) => { //call this with either exportID, or the other three params: assignment_name, group_name, semester
  if(params.exportID === undefined) {
    return axiosConfig.get("submission/get" + 
      "?group_name=" + params.group_name + 
      "&assignment_name=" + params.assignment_name + 
      "&semester=" + params.semester);
  } else {
    return axiosConfig.get("submission/get" + 
      "?export_id=" + params.exportID);
  }
}

export const updateSubmission = (id, params) => {
  return axiosConfig.patch("submission/update_submission?id=" + id, params);
}

export const getSubmissionPages = (submissionID) => {
  // return axiosConfig.get("submission/get_pages" + 
  //   "?group_name=" + group_name + 
  //   "&assignment_name=" + assignment_name + 
  //   "&semester=" + semester);
  return axiosConfig.get("submission/get_pages?id=" + submissionID)
}

export const updatePage = (id, params) => {
  return axiosConfig.patch("submission/page?id=" + id, params)
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
