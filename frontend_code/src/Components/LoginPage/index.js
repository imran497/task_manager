import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

import LRTemplate from "../Common/LRTemplate";

function LoginPage(){
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState({});
  const [reserror, setReserror] = useState('');

  const loginUser = () => {
    let errorData = {};
    setError(errorData);
    setReserror('');
    if(!email)errorData.email = true;
    if(!pwd)errorData.pwd = true;

    if(Object.values(errorData).indexOf(true) !== -1){
      setError(errorData);
      return;
    }

    axios.post("/api/login", {
    	email: email,
    	ps: pwd
    }).then(res => {
      if(res && res.data && res.data.status === "fail"){
        setReserror(res.data.msg);
        return;
      }
      if(res && res.data && res.data.status === "success"){
        localStorage.setItem("u", JSON.stringify(res.data.data));
        history.push("/dashboard");
        return;
      }
    }).catch(err => {
      setReserror("Failed");
    });
  }

  return(
    <LRTemplate>
      <form autoComplete="off">
        <div className={`input-container ${error && error.email?'error':''}`}>
          <label className="input-label">Email</label>
          <input className="input-field" type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className={`input-container ${error && error.pwd?'error':''}`}>
          <label className="input-label">Password</label>
          <input className="input-field" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
        </div>
        {
          reserror &&
          <p className="error-text">{reserror}</p>
        }
        <button type="button" className=" btn btn-full btn-primary" onClick={loginUser}>Login</button>
      </form>
    </LRTemplate>
  );
}

export default LoginPage;
