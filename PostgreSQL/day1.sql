create table student(
	id SERIAL PRIMARY KEY,
	name VARCHAR(20),
	marks INT
);

INSERT INTO student(name,marks) VALUES('Ronak',50);
INSERT INTO student(name,marks) VALUES('Ashish',30),('Anshul',45),('Abhishek',60),('jay',55);

select * from public.student;

UPDATE student
SET marks = 25
where id = 2;

DELETE FROM student 
WHERE marks < 40;

select * from public.student;


-- TASK 2 apply ACID compliance 

CREATE TABLE accounts (
	account_id INT PRIMARY KEY,
	account_name VARCHAR(20) NOT NULL,
	balance NUMERIC(10,2) CHECK (balance >= 0)
);

INSERT INTO accounts VALUES
(1, 'Account A', 5000),
(2, 'Account B', 3000);

BEGIN;
DO $$
BEGIN
	IF EXISTS (SELECT 1 FROM accounts WHERE account_name = 'Account B' and balance >=1000) then
		UPDATE accounts
		SET balance = balance - 1000
		WHERE account_id = 1;

		UPDATE accounts
		SET balance = balance + 1000
		WHERE account_id = 2;

		COMMIT;

	ELSE
		ROLLBACK;

	END IF;
	
END $$;

COMMIT;

select * from accounts;

ROLLBACK;

--3  Employees having more than average salary.

CREATE TABLE employees (
    emp_id SERIAL PRIMARY KEY,
    emp_name VARCHAR(100),
    department VARCHAR(50),
    salary NUMERIC(10,2)
);

INSERT INTO employees (emp_name, department, salary) VALUES
('John', 'HR', 40000),
('Alice', 'IT', 60000),
('Bob', 'IT', 50000),
('Carol', 'Finance', 70000);

select * from employees
where salary > (select avg(salary) from employees);


--4  Find employees per department

select department , count(*) as "TotalEmployees"
from employees
group by department; 

--5 Rank employees according to salary.

select emp_name,salary,
rank() over (order by salary) as "RANK"
from employees;




