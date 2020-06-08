import React, { useState } from "react";
import axios from "axios";
import moment from "moment";

function AddTask({hideTask}){
  const [title, setTitle] = useState("");
  const [starttime, setStarttime] = useState("");
  const [endtime, setEndtime] = useState("");
  const [project, setProject] = useState("");
  const [error, setError] = useState({});

  const addTask = () => {
    if(!title || !moment(starttime).isValid() || !moment(endtime).isValid() || !project){
      alert("Enter valid data");
      return;
    }
    const { email } = localStorage.getItem("u")?JSON.parse(localStorage.getItem("u")):{email:''};

    axios.post("/api/create-task", {title, stime:starttime, etime: endtime, pid: project, email}).then(res => {
      hideTask();
    }).catch(err => {
      console.log(err);
    });
  }

  return(
    <section className="form-task-section">
      <div className="form-task-container">
        <form autoComplete="off">
          <div className={`input-container ${error && error.title?'error':''}`}>
            <label className="input-label">Title</label>
            <input className="input-field" type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
          </div>
          <div className={`input-container ${error && error.title?'error':''}`}>
            <label className="input-label">Start Time</label>
            <input className="input-field" placeholder="YYYY-MM-DD hh:mm:ss" type="text" value={starttime} onChange={(e) => setStarttime(e.target.value)}/>
          </div>
          <div className={`input-container ${error && error.title?'error':''}`}>
            <label className="input-label">End Time</label>
            <input className="input-field" placeholder="YYYY-MM-DD hh:mm:ss" type="text" value={endtime} onChange={(e) => setEndtime(e.target.value)}/>
          </div>
          <div className={`input-container ${error && error.title?'error':''}`}>
            <label className="input-label">Project</label>
            <select className="input-field" type="text" value={project} onChange={(e) => setProject(e.target.value)}>
              <option value={""} disabled>-- select --</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </div>
          <button type="button" className=" btn btn-full btn-primary" onClick={addTask}>Add Task</button>
          <button type="button" className=" btn btn-full btn-info" onClick={hideTask}>Cancel</button>
        </form>
      </div>
    </section>
  );
}

export default AddTask;
