import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Switch, Route } from "react-router-dom";

import "./asset/css/App.css";

import Tool from "./page/Tool";
import Submission from "./page/Submission";
import Export from "./page/Export";

class App extends React.Component {

  render() {

    return (
      <Router>
        <Switch>
          <Route path="/tool" component={Tool} />
          <Route path="/create" component={Submission}/>
          <Route path="/submission/:id" component={Export}/>
        </Switch>
      </Router>
    );
  }
}

export default App;