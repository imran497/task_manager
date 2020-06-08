const express = require("express");
const { Pool } = require("pg");

const app = express();
const pool = new Pool();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CREATE USER
app.post('/api/create-user', async (req, res) => {
  const { email, name, username, ps } = req.body;
  // VALIDATE IF MANDATORY FIELDS EXIST
  if(!email || !name || !username || !ps){
    res.status(200).json({msg: "one of Mandatory fields is missing", status: "fail"});
    return;
  }

  try{
    // INSER RECORD
    const { rows } = await pool.query("insert into user_info (email, name, username, pwd) values ($1, $2, $3, $4)", [email.toString(), name.toString(), username.toString(), ps.toString()]);
    res.status(200).json({status: "success", msg: "Registered successfully"});
  }catch(e){
    // CHECK ERROR CODE FOR DUPLICATE RECORDS IN UNIQUE KEYS
    if(e && e.code && e.code === "23505"){
      if(e.constraint.includes("email")){res.status(200).json({status: "fail", msg: "User email already exists"}); return;}

      if(e.constraint.includes("username")){res.status(200).json({status: "fail", msg: "username already exists. choose another."}); return;}

      res.status(200).json({status: "fail", msg: "Duplicate value"});
      return;
    }
    res.status(500).json({status: "fail", msg: "Failed to add User"});
  }
});

// USER LOGIN
app.post('/api/login', async (req, res) => {
  const { email, ps } = req.body;
  if(!email || !ps){
    res.status(200).json({msg: "Missing mandatory field", status: "fail"});
    return;
  }
  try{
    // CHECK IF RECORD EXIST
    const { rows } = await pool.query("select email, name, username from user_info where email like ($1) and pwd like ($2)", [email.toString(), ps.toString()]);

    if(rows.length !== 1){
      res.status(200).json({status: "fail", msg: "User Info not found. Login failed"});
      return;
    }

    res.status(200).json({status: "success", data: rows, msg: "Login successful", data: rows[0]});
  }catch(e){
    // RETURN FAILED RESPONSE
    console.log(e);
    res.status(500).json({status: "fail", msg: "Unknow error", e});
  }
});

// GET ALL THE LIST OF TICKETS ADDED
app.get('/api/get-tickets-list', async (req, res) => {
    try{
      const { user, date } = req.query;
      // FETCH ALL RECORDS
      const { rows } = await pool.query("select *, to_char(end_time, 'YYYY-MM-DD HH24:MI:SS') as et from task_info where email like ($1) and CAST(start_time as DATE)=$2 order by end_time desc", [user.toString(), date.toString()]);
      res.status(200).json({status: "success", data: rows, msg: "Records fetched successfully"});
    }catch(e){
      // RETURN FAILED RESPONSE
      res.status(500).json({status: "fail", msg: "Failed to get records"});
    }
});

// CREATE TASK
app.post('/api/create-task', async (req, res) => {
  const { title, stime, etime, pid, email } = req.body;
  // VALIDATE IF MANDATORY FIELDS EXIST
  if(!title || !stime || !etime || !pid || !email){
    res.status(200).json({msg: "one of Mandatory fields is missing", status: "fail"});
    return;
  }

  try{
    // INSER RECORD
    const { rows } = await pool.query("insert into task_info (title, start_time, end_time, project_id, email) values ($1, $2, $3, $4, $5)", [title.toString(), stime, etime, parseInt(pid), email.toString()]);
    res.status(200).json({status: "success", msg: "Task added successfully"});
  }catch(e){
    // CHECK ERROR CODE FOR FORIEGN KEY EMAIL
    console.log(e);
    if(e && e.code){
      if(e.code == 23503 && e.constraint.includes("email")){res.status(200).json({status: "fail", msg: "email doesn't exist"}); return;}
      if(e.code == 23503 && e.constraint.includes("project_id")){res.status(200).json({status: "fail", msg: "project doesn't exist"}); return;}
      if(e.code == 22007 && e.routine === "DateTimeParseError"){res.status(200).json({status: "fail", msg: "Incorrect date format"}); return;}
    }

    res.status(500).json({status: "fail", msg: "Failed to add task"});
  }
});

// CREATE SERVER ON PORT 3001
app.listen(3001, function(err){
  if(err){
    console.log("Server Error");
  }
  console.log("Server is running on port 3001");
});
