var mysql = require("mysql");
var inquirer = require("inquirer");
require('dotenv').config();

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.password,
  database: "employee_tracker_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
    start();
});

function start(){
    inquirer.prompt(
        {
        type: "list",
        name: "what",
        message: "What would you like to do?",
        choices:[ "Add Departments, Roles, and Employees", "View Departments, Roles, and Employees","Update Employee Roles","Done"]
        })  
    
    .then(function(answer){
        if(answer.what === "Add Departments, Roles, and Employees"){
            add();
        }
        else if(answer.what === "View Departments, Roles, and Employees"){
            view();
        }
        else if(answer.what === "Update Employee Roles"){
            update();
        }
        else{
            connection.end();
        }
    })
}

function add() {
    inquirer.prompt ([ 
   
   {
       type: "input",
       name: "name",
       message: "Enter your name"
   },
  
   {
       type: "input",
       name: "email",
       message: "Enter your email"
   },
 
   {
       type: "input",
       name: "id",
       message: "Enter your id"
   },
  
   {
       type: "list",
       name: "job",
       message: "Enter your job role",
       choices: ['Engineer','Intern','Manager']

   }
   ])


}