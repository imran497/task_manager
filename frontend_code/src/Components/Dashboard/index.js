import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

import LoggedinTemplate from "../Common/LoggedinTemplate";
import AddTask from "./AddTask";

function TaskCard({task}){
  const [countDown, setCountDown] = useState("00:00:00")

  const parseRemainingTime = (tasktime) => {
    const curTime = moment();
    const hrs = tasktime.diff(curTime, 'hours')%24;
    const min = tasktime.diff(curTime, 'minutes')%60;
    const sec = tasktime.diff(curTime, 'seconds')%60;
    if(hrs < 0 || min < 0 || sec < 0){
      return "00:00:00";
    }
    return `${hrs < 10?"0"+hrs:hrs}:${min < 10?"0"+min:min}:${sec < 10?"0"+sec:sec}`;
  }

  useEffect(() => {
    setInterval(() => {
      setCountDown(parseRemainingTime(moment(task.et)));
    }, 1000);
  });

  return(
    <div key={task.title} className="task-card">
      <h5 className="task-title">{task.title}</h5>
      <p className="task-end">{countDown}</p>
    </div>
  );
}

function Dashboard(){
  const [taskInfo, setTaskInfo] = useState([]);
  const [fetchComplete, setFetchComplete] = useState(false);
  const [dateToFetch, setDateToFetch] = useState(moment());
  const [showAddTask, setAddTask] = useState(false);

  useEffect(() => {
    if(!fetchComplete){
      getTasks(dateToFetch);
    }
  }, [fetchComplete]);

  const getTasks = (date) => {
    setDateToFetch(date);
    const { email } = localStorage.getItem("u")?JSON.parse(localStorage.getItem("u")):{email:''};
    axios.get(`/api/get-tickets-list?user=${email}&date=${date.format("YYYY-MM-DD")}`).then(res => {
      setFetchComplete(true);
      if(res && res.data && res.data.status === "success"){
        setTaskInfo(res.data.data);
        return;
      }
      setTaskInfo([]);
    }).catch(err => {
      setTaskInfo([]);
    });
  }

  const TaskTemplate = () => {
    if(fetchComplete && taskInfo.length){
      return(
        <section className="task-container">
          {
            taskInfo.map(task => {
              let countDown;

              return(
                <TaskCard task={task}/>
              );
            })
          }
        </section>
      );
    }
    if(fetchComplete)return <h1 className="text-center">No tasks</h1>
    return <h3 className="text-center">Loading...</h3>
  }

  return(
    <LoggedinTemplate>
      <main className="content-main">
        <div className="text-center">
          <button className="btn btn-primary"  onClick={() => getTasks(moment(dateToFetch).subtract(1, 'days'))}>Previous</button>
          <button className="btn" disabled>{moment(dateToFetch).format("YYYY-MM-DD")}</button>
          <button className="btn btn-primary" onClick={() => getTasks(moment(dateToFetch).add(1, 'days'))} disabled={moment(dateToFetch).diff(moment()) >= 0}>Next</button>
          <button className="btn btn-success ml-1em" onClick={() => setAddTask(true)}>Add Task</button>
        </div>
        <TaskTemplate/>
        {
          showAddTask &&
          <AddTask hideTask={() => {setAddTask(false);getTasks(moment());}}/>
        }
      </main>
    </LoggedinTemplate>
  )
}

export default Dashboard;
