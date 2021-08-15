import axios from "axios";
import Cookies from 'js-cookie';
import {message} from "antd";

const instance = axios.create({
  //where we make our configurations
  //baseURL: "http://localhost:8000"
  //baseURL: "http://127.0.0.1:8000"
  baseURL: "https://gradingtoolbackend.herokuapp.com/"
});

const csrftoken = '';
axios.get('/gradetool/csrf_cookie')
  .then((response) => {
    message.success("Got cookies.")
    console.log(response.headers)
  })
  .catch((error) => {
    message.error("Failed to get cookies.")
    console.log(error)
  })

instance.defaults.withCredentials = true
instance.defaults.headers.common["x-csrftoken"] = csrftoken

/*const csrftoken = Cookies.get('csrftoken')
instance.defaults.withCredentials = true
//instance.defaults.xsrfCookieName = 'csrftoken'
//instance.defaults.xsrfHeaderName = 'X-CSRFToken'
instance.defaults.headers.common["x-csrftoken"] = csrftoken;*/

/* Possible interceptor use
instance.interceptors.request.use(function (config) {
    config.headers['x-csrftoken'] = csrftoken
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });
 */

export default instance;
