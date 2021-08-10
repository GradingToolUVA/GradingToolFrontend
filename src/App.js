import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Switch, Route } from "react-router-dom";

import "./asset/less/App.less";
import { Layout } from "antd";

import Tool from "./page/Tool";
import Submission from "./page/Submission";

const { Header, Footer } = Layout;

class App extends React.Component {

  render() {

    return (
      <Router>
        <Switch>
          <Route path="/tool" component={Tool} />
          <Route path="/submission" component={Submission}/>
        </Switch>
      </Router>
    );
  }
}

export default App;