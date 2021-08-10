import React from "react";
import axios from "axios";

class CSRFToken extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      csrftoken: ''
    }
  }

  componentDidMount() {
    this.fetchData()
    this.setState({
      csrftoken: this.getCookie('csrftoken')
    }, () => console.log(this.state.csrftoken))
  }

  fetchData = async () => {
    try {
      let response = await axios.get(`http://127.0.0.1:8000/gradetool/csrf_cookie`, {withCredentials: true});
      console.log(response)
    } catch (err) {
      console.log(err)
    }
  };

  getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      let cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }


  render() {
    return (
      <input type='hidden' name='csrfmiddlewaretoken' value={this.state.csrftoken} />
    )
  }
}

export default CSRFToken;