CREATE TABLE company (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE department (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES company(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    budget NUMERIC(12,2) NOT NULL
);

CREATE TABLE employee (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES company(id) ON DELETE CASCADE,
    department_id UUID REFERENCES department(id) ON DELETE SET NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    salary NUMERIC(10,2),
    joining_date DATE,
    is_active BOOLEAN DEFAULT TRUE
);

INSERT INTO company (name) VALUES
('TechSoft'),
('FinCorp'),
('HealthPlus'),
('EduWorld'),
('RetailHub');

INSERT INTO department (company_id, name, budget)
SELECT id, 'IT', 500000 FROM company WHERE name='TechSoft';

INSERT INTO department (company_id, name, budget)
SELECT id, 'HR', 200000 FROM company WHERE name='TechSoft';

INSERT INTO department (company_id, name, budget)
SELECT id, 'Finance', 400000 FROM company WHERE name='FinCorp';

INSERT INTO department (company_id, name, budget)
SELECT id, 'Operations', 300000 FROM company WHERE name='HealthPlus';

INSERT INTO department (company_id, name, budget)
SELECT id, 'Sales', 350000 FROM company WHERE name='RetailHub';

select * from department;

INSERT INTO employee (company_id, department_id, first_name, last_name, salary, joining_date)
SELECT c.id, d.id, 'Rahul', 'Sharma', 50000, '2023-01-10'
FROM company c JOIN department d ON c.id=d.company_id
WHERE c.name='TechSoft' AND d.name='IT';

INSERT INTO employee (company_id, department_id, first_name, last_name, salary, joining_date)
SELECT c.id, d.id, 'Ronak', 'Jha', 80000, '2023-02-10'
FROM company c JOIN department d ON c.id=d.company_id
WHERE c.name='TechSoft' AND d.name='IT';

INSERT INTO employee (company_id, department_id, first_name, last_name, salary, joining_date)
SELECT c.id, d.id, 'Anita', 'Verma', 60000, '2022-03-15'
FROM company c JOIN department d ON c.id=d.company_id
WHERE c.name='TechSoft' AND d.name='HR';

INSERT INTO employee (company_id, department_id, first_name, last_name, salary, joining_date)
SELECT c.id, d.id, 'Karan', 'Mehta', 70000, '2021-07-20'
FROM company c JOIN department d ON c.id=d.company_id
WHERE c.name='FinCorp' AND d.name='Finance';

INSERT INTO employee (company_id, department_id, first_name, last_name, salary, joining_date)
SELECT c.id, d.id, 'Priya', 'Singh', 55000, '2020-05-05'
FROM company c JOIN department d ON c.id=d.company_id
WHERE c.name='HealthPlus' AND d.name='Operations';

INSERT INTO employee (company_id, department_id, first_name, last_name, salary, joining_date)
SELECT c.id, d.id, 'Amit', 'Kumar', 65000, '2019-09-09'
FROM company c JOIN department d ON c.id=d.company_id
WHERE c.name='RetailHub' AND d.name='Sales';

select * from employee;

-- Task 1: Department Salary Summary Function 

create or replace function dep_summary_function (dept_id uuid)
returns table(
total_active_employees bigint,
total_salary numeric(10,2),
average_salary numeric(10,2)
)
as
$$
	begin
		return query
		select 
			count(*) filter(where is_active=true),
			coalesce(sum(salary) filter(where is_active = true),0),
			coalesce(avg(salary) filter(where is_active = true),0)
		from employee
		where department_id = dept_id;
	end;
$$ language plpgsql;

SELECT * FROM dep_summary_function('6a7f8da1-3a4d-4a8d-9cf4-c16b21eb4237');

-- Task 2: Employee Transfer Procedure 
select * from employee;
select * from department;

create or replace procedure transfer_employee(
	employee_id uuid,
	new_department_id uuid
)
as 
$$
	declare emp_company uuid;
	declare dept_company uuid;
	begin
		
		select company_id into emp_company
		from employee
		where id = employee_id;

		if emp_company is null
		then
			raise exception 'Employee doesnot exist';
		end if;

		select company_id into dept_company
		from department
		where id = new_department_id;

		if dept_company is null
		then
			raise exception 'Department doesnot exist';
		end if;

		if emp_company <> dept_company
		then
			raise exception 'Departments belongs to different company';
		end if;

		update employee 
		set department_id = new_department_id
		where id = employee_id;
	end;
$$ language plpgsql

select * from employee;
select * from department;
select * from company;
call transfer_employee('467147f0-b4f5-4bd8-b724-c4d48fd88825','6a7f8da1-3a4d-4a8d-9cf4-c16b21eb4237');
call transfer_employee('f1c7694b-d9c5-4652-ab3f-fe8e8941b6fd','cd3a8687-ec76-4048-b63e-6389e5fda5e0');


-- Task 3: Increase Salary by Employee Function 

create or replace function increase_salary(
employee_id uuid,
percent_inc numeric(5,2)
)
returns numeric(10,2)
as
$$
	declare current_salary numeric(10,2);
	begin

		if percent_inc > 200
		then
			raise exception 'Increment cannot be more than 200';
		end if;
		if percent_inc <=0
		then
			raise exception 'Percentage increse cannot be negative and 0';
		end if;

		select salary into current_salary
		from employee
		where id = employee_id
		and is_active = true;

		if current_salary is null
		then
			raise exception 'Employee doesnot exist';
		end if;

		update employee
		set salary = salary + ( salary * percent_inc /100)
		where id = employee_id;

		return current_salary + (current_salary * percent_inc / 100);
	end;
$$ language plpgsql;

select * from employee;
select * from increase_salary('b8fc4ba8-46ab-41e3-a60d-8e285bd80e2b',210);
select * from increase_salary('17fd0db5-ceec-4210-9e1b-7c5798558ee2',210);
update employee
set is_active = 'f'
where id = '87723f6a-f6ee-4a9b-b0c4-5dd9b795ea12';

INSERT INTO employee (company_id, department_id, first_name, last_name, salary, joining_date,is_active)
SELECT c.id, d.id, 'Amit', 'Kumar', 65000, '2019-09-09', false
FROM company c JOIN department d ON c.id=d.company_id
WHERE c.name='RetailHub' AND d.name='Sales';

































-- Extra Queries
-- Function to return highest salary employee in company
select * from employee;

create or replace function high_salary(comp_name varchar(20))
returns numeric(10,2)
as
$$
declare max_sal numeric(10,2);
	begin
		select max(e.salary) into max_sal
		from employee e 
		join department d on e.department_id = d.id
		join company c on e.company_id = c.id
		where c.name = comp_name;

		return max_sal;
	end;
$$ language plpgsql;

drop function high_salary(comp_name varchar(20));

select * from high_salary('TechSoft');

-- Function to calculate yearly salary

select * from employee;
create function yr_salary(emp_id uuid)
returns numeric(10,2)
as
$$
declare monthly_sal numeric(10,2);
	begin
		select salary into monthly_sal 
		from employee
		where id = emp_id;

		return monthly_sal * 12;
	end;
$$ language plpgsql;

select * from yr_salary('b8fc4ba8-46ab-41e3-a60d-8e285bd80e2b');


-- 
select * from employee;
select * from department;
create or replace function dep_budget_enforcement(
dept_id uuid,
inc_percent numeric(10,2)
)
returns numeric(10,2)
as
$$
	declare curr_total_sal numeric(10,2);
	declare new_total_sal numeric(10,2);
	declare dept_budget numeric(10,2);
	begin
		if inc_percent <= 0
		then
			raise exception 'Percent increase should always be more than 0.';
		end if;

		select coalesce(sum(salary) filter(where is_active = true),0) into curr_total_sal
		from employee
		where department_id = dept_id;

		new_total_sal := curr_total_sal + (curr_total_sal * inc_percent / 100);

		select budget into dept_budget from department
		where id = dept_id;

		
		if new_total_sal > dept_budget
		then
			raise exception 'Department budget is less';
		end if ;

		return dept_budget - new_total_sal;
	end
$$ language plpgsql;


select * from dep_budget_enforcement('6a7f8da1-3a4d-4a8d-9cf4-c16b21eb4237',5);



