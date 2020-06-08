import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import LRTemplate from "../Common/LRTemplate";

function RegisterPage(){
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState({});
  const [reserror, setReserror] = useState("");
  const [successmsg, setSuccessmsg] = useState("");

  const registerUser = () => {
    let errorData = {};
    setError(errorData);
    setReserror('');
    setSuccessmsg('');
    if(!username)errorData.username = true;
    if(!name)errorData.name = true;
    if(!email)errorData.email = true;
    if(!pwd)errorData.pwd = true;

    if(Object.values(errorData).indexOf(true) !== -1){
      setError(errorData);
      return;
    }

    axios.post("/api/create-user", {
      name: name,
    	email: email,
    	username: username,
    	ps: pwd
    }).then(res => {
      if(res && res.data && res.data.status === "fail"){
        setReserror(res.data.msg);
        return;
      }
      if(res && res.data && res.data.status === "success"){
        setSuccessmsg(res.data.msg);
        setUsername('');
        setName('');
        setEmail('');
        setPwd('');
        return;
      }

    }).catch(err => {
      setReserror("Failed");
    });
  }

  return(
    <LRTemplate>
      <form autoComplete="off">
        <div className={`input-container ${error && error.username?'error':''}`}>
          <label className="input-label">Username</label>
          <input className="input-field" type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
        </div>
        <div className={`input-container ${error && error.email?'error':''}`}>
          <label className="input-label">Email</label>
          <input className="input-field" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className={`input-container ${error && error.name?'error':''}`}>
          <label className="input-label">Name</label>
          <input className="input-field" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className={`input-container ${error && error.pwd?'error':''}`}>
          <label className="input-label">Password</label>
          <input className="input-field" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
        </div>
        {
          reserror &&
          <p className="error-text">{reserror}</p>
        }
        {
          successmsg &&
          <p className="success-text">{successmsg}</p>
        }
        <button type="button" className=" btn btn-full btn-primary" onClick={registerUser}>Register</button>
      </form>
    </LRTemplate>
  );
}

export default RegisterPage;
