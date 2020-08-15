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
                message: "Choose the department id for the role",
                choices: myDep
            }

        ])

            .then(function (answer) {
                connection.query("INSERT INTO role SET ?", { title: answer.title, salary: answer.salary, department_id: answer.department_id }, function (err) {
                    if (err) throw err

                    start();
                }
                )
            })
    })
}

function addEmployees() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err
        let myRol = res.map(rol => {
            return ({
                name: rol.title,
                value: rol.id
            })
        })
        connection.query("SELECT * FROM employee", function (err, res) {
            if (err) throw err
            let myEmp = res.map(emp => {
                return ({
                    name: `${emp.first_name} ${emp.last_name}`,
                    value: emp.id
                })
            })
            inquirer.prompt([

                {
                    type: "input",
                    name: "firstname",
                    message: "Enter the first name of the employee"
                },
                {
                    type: "input",
                    name: "lastname",
                    message: "Enter the last name of the employee"
                },
                {
                    type: "list",
                    name: "role_id",
                    message: "Choose the role for the employee",
                    choices: myRol
                },
                {
                    type: "list",
                    name: "manager_id",
                    message: "Choose the manager for the employee",
                    choices: myEmp,
                    when: function (answers) {
                        return myEmp.length > 0
                    }
                }

            ])

                .then(function (answer) {
                    if (!answer.manager_id) {


                        connection.query("INSERT INTO employee SET ?", { first_name: answer.firstname, last_name: answer.lastname, role_id: answer.role_id }, function (err) {
                            if (err) throw err

                            start();
                        }
                        )
                    }
                    else {
                        connection.query("INSERT INTO employee SET ?", { first_name: answer.firstname, last_name: answer.lastname, role_id: answer.role_id, manager_id: answer.manager_id }, function (err) {
                            if (err) throw err

                            start();
                        }
                        )
                    }
                })
        })
    })
}

function viewDepartments() {
    let viewDep = "SELECT * FROM department";
    connection.query(viewDep, function (err, data) {
        if (err) throw err;
        console.table(data);
        start();
    });

};

function viewRoles() {
    let viewRol = "SELECT * FROM role";
    connection.query(viewRol, function (err, data) {
        if (err) throw err;
        console.table(data);
        start();
    });
};

function viewEmployees() {
    let viewEmp = "SELECT * FROM employee";
    connection.query(viewEmp, function (err, data) {
        if (err) throw err;
        console.table(data);
        start();
    });
};

function updateEmpolyeeRoles() {
    let updEmpRol = "SELECT * FROM role";
    connection.query(updEmpRol, function (err, data) {
        if (err) throw err;
        let updRole = data.map(rol => {
            return ({
                name: `${rol.title} ${rol.salary} ${rol.department_id}`,
                value: rol.id
            })
        })
        let updDep = "SELECT * FROM department";
        connection.query(updDep, function (departmentError, departmentData) {
            if (departmentError) throw departmentError;
            let updDept = departmentData.map(rol => {
                return ({
                    name: `${rol.name}`,
                    value: rol.id
                })
            })
            inquirer
                .prompt([
                    {
                        type: "rawlist",
                        name: "updateEmployeeRoles",
                        choices: updRole,
                        message: "What role would you like to update"
                    },
                    {
                        type: "input",
                        name: "new_title",
                        message: "Enter the new title"
                    },
                    {
                        type: "input",
                        name: "new_salary",
                        message: "Enter the new salary"
                    },
                    {
                        type: "rawlist",
                        name: "new_department",
                        message: "Choose the new department",
                        choices: updDept
                    }
                ])
                .then(function (answer) {
                    var chosenItemId;
                    for (var i = 0; i < departmentData.length; i++) {
                        if (departmentData[i].id === answer.updateEmployeeRoles) {
                            chosenItemId = departmentData[i].id;
                        }
                    }
                    connection.query(
                        "UPDATE role SET ? WHERE ?",
                        [
                            {
                                title: answer.new_title,
                                salary: answer.new_salary,
                                department_id: answer.new_department
                            },
                            {
                                id: chosenItemId
                            }
                        ],
                        function(err,data){
                            if (err) throw err
                            console.log(data);
                            start();
                        }
                        )
                })
            })
            
        });
    };