import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

import LoginPage from "./Components/LoginPage";
import RegisterPage from "./Components/RegisterPage";
import Dashboard from "./Components/Dashboard";
import Page404 from "./Components/Common/Page404";

import "./Styles.scss";


ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={LoginPage}/>
      <Route path="/login" exact component={LoginPage}/>
      <Route path="/register" exact component={RegisterPage}/>
      <Route path="/dashboard" exact component={Dashboard}/>
      <Route component={Page404}/>
    </Switch>
  </BrowserRouter>
  , document.getElementById("app-root"));
