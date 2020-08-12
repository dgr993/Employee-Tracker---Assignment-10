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

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
});

function start() {
    inquirer.prompt(
        {
            type: "list",
            name: "what",
            message: "What would you like to do?",
            choices: ["Add Departments", "Add Roles", "Add Employees", "View Departments", "View Roles", "View Employees", "Update Employee Roles", "Done"]
        })

        .then(function (answer) {
            switch (answer.what) {
                case "Add Departments":
                    addDepartments();
                    break;
                case "Add Roles":
                    addRoles();
                    break;
                case "Add Employees":
                    addEmployees();
                    break;
                case "View Departments":
                    viewDepartments();
                    break;
                case "View Roles":
                    viewRoles();
                    break;
                case "View Employees":
                    viewEmployees();
                    break;
                case "Update Employee Roles":
                    updateEmpolyeeRoles();
                    break;
                default:
                    connection.end();
            }
        })

}

function addDepartments() {
    inquirer.prompt([

        {
            type: "input",
            name: "department",
            message: "Enter your department"
        }
    ])

        .then(function (answer) {
            connection.query("INSERT INTO department SET ?", { name: answer.department }, function (err) {
                if (err) throw err

                start();
            }
            )
        })
}

function addRoles() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err
        let myDep = res.map(dep => {
            return ({
                name: dep.name,
                value: dep.id
            })
        })

        inquirer.prompt([

            {
                type: "input",
                name: "title",
                message: "Enter the title of the role"
            },
            {
                type: "input",
                name: "salary",
                message: "Enter the salary for the role"
            },
            {
                type: "list",
                name: "department_id",
                message: "Enter the department_id",
                choices: myDep
            }

        ])

            .then(function (answer) {
                connection.query("INSERT INTO role SET ?", { title: answer.title, salary: answer.salary, department_id: answer.department_id}, function (err) {
                    if (err) throw err

                    start();
                }
                )
            })
    })


}