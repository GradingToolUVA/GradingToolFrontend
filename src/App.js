import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Switch, Route } from "react-router-dom";

import "./asset/css/App.css";

import Tool from "./page/Tool";
import Rubric from "./page/Rubric";
import Export from "./page/Export";
import Login from "./page/Login";
import Register from "./page/Register";

import { Provider } from 'react-redux';
import store from './store';

class App extends React.Component {

  render() {

    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/tool" component={Tool} />
            <Route path="/create" component={Rubric}/>
            <Route path="/submission/:id" component={Export}/>
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;