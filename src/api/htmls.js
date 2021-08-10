import axiosConfig from '../config/axiosConfig';

//Get the HTMLs of sites

export const getCurrentHTML = (url) => {
  return axiosConfig.get("parsing/current_page_only?encoded_url=" + url);
};

export const getAllLinkedPages = (url) => {
  return axiosConfig.get("parsing/all_linked_pages?encoded_url=" + url);
};