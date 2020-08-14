-- Drops the programming_db if it already exists --
DROP DATABASE IF EXISTS employee_tracker_db;
-- Create a database called programming_db --
CREATE DATABASE employee_tracker_db;

-- Use programming db for the following statements --
use employee_tracker_db;

CREATE TABLE department(
  -- Create a numeric column called "id" which will automatically increment its default value as we create new rows. --
id int AUTO_INCREMENT not null,
  -- Create a string column called "language" --
name varchar(30) not null, 
  -- Set the id as this table's primary key
  primary key (id)
);

CREATE TABLE role(
  -- Create a numeric column called "id" which will automatically increment its default value as we create new rows. --
id int AUTO_INCREMENT not null,
  -- Create a string column called "language" --
title varchar(30) not null, 
salary decimal(10,2) not null,
department_id int not null,
foreign key (department_id) references department (id),
  -- Set the id as this table's primary key
  primary key (id)
);

CREATE TABLE employee(
  -- Create a numeric column called "id" which will automatically increment its default value as we create new rows. --
id int AUTO_INCREMENT not null,
  -- Create a string column called "language" --
first_name varchar(30) not null, 
last_name varchar(30) not null, 
role_id int not null,
manager_id int,
foreign key (role_id) references role (id),
foreign key (manager_id) references employee (id),
  primary key (id)
);

INSERT INTO department (name)
VALUES ("Finance");

INSERT INTO role (title,salary,department_id)
VALUES ("CFO",100000,1);