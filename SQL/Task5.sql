CREATE DATABASE RetailDB;

USE RetailDB;

CREATE TABLE Customers (
    Customer_id INT IDENTITY PRIMARY KEY,
    First_name VARCHAR(50),
    Last_name VARCHAR(50),
    Email VARCHAR(100),
    Phone VARCHAR(20),
    Address VARCHAR(200),
    City VARCHAR(50),
    State_province VARCHAR(50),
    Country VARCHAR(50),
    Postal_code VARCHAR(10),
    Date_of_birth DATE,
    Gender CHAR(1)
);

CREATE TABLE Products (
    Product_id INT IDENTITY PRIMARY KEY,
    Product_name VARCHAR(100),
    Category_name VARCHAR(50),
    Unit_price DECIMAL(10,2),
    Featured BIT DEFAULT 0
);

CREATE TABLE Promotions (
    Promotion_id INT IDENTITY PRIMARY KEY,
    Product_id INT,
    Promotion_name VARCHAR(100),
    Start_date DATE,
    End_date DATE,
    DiscountAmount DECIMAL(10,2),
    Active BIT,
    FOREIGN KEY (Product_id)
        REFERENCES Products(Product_id)
        ON DELETE CASCADE
);

CREATE TABLE Orders (
    Order_id INT IDENTITY PRIMARY KEY,
    Promotion_id INT NULL,
    Product_id INT,
    Quantity INT,
    Customer_id INT,
    Order_date DATE,
    Price DECIMAL(10,2),
    FOREIGN KEY (Promotion_id)
        REFERENCES Promotions(Promotion_id)
        ON DELETE NO ACTION,
    FOREIGN KEY (Product_id)
        REFERENCES Products(Product_id)
        ON DELETE CASCADE,
    FOREIGN KEY (Customer_id)
        REFERENCES Customers(Customer_id)
        ON DELETE CASCADE
);

CREATE TABLE Category_Summary (
    Category_summary_id INT IDENTITY PRIMARY KEY,
    Category_name VARCHAR(50),
    Revenue DECIMAL(12,2)
);

CREATE TABLE Departments (
    Department_id INT IDENTITY PRIMARY KEY,
    Department_name VARCHAR(50)
);

CREATE TABLE Employees (
    Employee_id INT IDENTITY PRIMARY KEY,
    First_name VARCHAR(50),
    Last_name VARCHAR(50),
    Department_id INT,
    Salary DECIMAL(10,2),
    FOREIGN KEY (Department_id) 
        REFERENCES Departments(Department_id)
        ON DELETE CASCADE
);

CREATE TABLE Salary_History (
    Sync_History_id INT IDENTITY PRIMARY KEY,
    Employee_id INT,
    Salary DECIMAL(10,2),
    Effective_date DATE,
    FOREIGN KEY (Employee_id)
        REFERENCES Employees(Employee_id)
        ON DELETE CASCADE
);

select * from sys.tables;


INSERT INTO Departments VALUES ('IT'), ('HR'), ('Finance');

INSERT INTO Employees VALUES
('Amit','Shah',1,60000),
('Neha','Verma',1,55000),
('Raj','Patel',2,40000),
('Sneha','Iyer',3,70000);

INSERT INTO Salary_History VALUES
(1,55000,'2024-01-01'),
(1,60000,'2025-01-01');

INSERT INTO Customers VALUES
('Rahul','Mehta','rahul@gmail.com','9999','Addr1','Mumbai','MH','India','400001','1995-01-01','M'),
('Pooja','Singh','pooja@gmail.com','8888','Addr2','Delhi','DL','India','110001','1996-05-02','F'),
('Ankit','Kumar','ankit@gmail.com','7777','Addr3','Pune','MH','India','411001','1994-03-10','M');

INSERT INTO Products VALUES
('Laptop','Electronics',50000,0),
('Phone','Electronics',20000,0),
('Chair','Furniture',5000,0),
('Table','Furniture',8000,0),
('Headphones','Electronics',3000,0);

--4 insert via subquery

INSERT INTO Promotions (Product_id, Promotion_name, Start_date, End_date, DiscountAmount, Active)
SELECT Product_id, 
       'Festive Offer',
       DATEADD(MONTH,-1,GETDATE()),
       DATEADD(MONTH,1,GETDATE()),
       2000,
       1
FROM Products
WHERE Product_id <= 5;

INSERT INTO Orders VALUES
(1,1,2,1,GETDATE(),50000),
(1,1,2,1,GETDATE(),50000),
(1,1,2,1,GETDATE(),50000),
(1,2,1,2,GETDATE(),20000),
(1,3,1,3,GETDATE(),5000);

--1  RANK(): Rank employees within each department based on their Salary.

select * , rank() over(partition by Department_id order by Salary desc) as SalaryRank
from Employees;

--2 DENSERANK(): Determine the top three performing customers based on orders placed in current month and assign a dense rank to them.

SELECT TOP 3 Customer_id,
COUNT(*) AS TotalOrders,
DENSE_RANK() OVER (ORDER BY COUNT(*) DESC) AS DenseRank
FROM Orders
WHERE MONTH(Order_date)=MONTH(GETDATE())
GROUP BY Customer_id;

--3  ROWNUMBER(): Generate a query that includes the total number of orders for each customer,
--assigning a row number to each order within the customer's record. 

SELECT *,
ROW_NUMBER() OVER (PARTITION BY Customer_id ORDER BY Order_date) AS RowNum
FROM Orders;

--4  b. Trigger: Update the 'Products' table where the product’s order is placed more than
--      thrice in the current month to mark these product as 'Featured'.

create trigger trg_FeaturedProduct 
on Orders
after insert as
begin
    update p 
    set Featured =1 
    from Products p
    where Product_id in (
    select Product_id from Orders
    where
    month(Order_date) = month(GETDATE())
    group by Product_id
    having count(*) > 3);
end;

INSERT INTO Orders (Promotion_id, Product_id, Quantity, Customer_id, Order_date, Price)
VALUES
(1,1,1,1,GETDATE(),50000),
(1,1,1,1,GETDATE(),50000),
(1,1,1,1,GETDATE(),50000),
(1,1,1,1,GETDATE(),50000);

SELECT Product_id, Product_name, Featured
FROM Products
WHERE Product_id = 1;


--4 (c) Ensure to delete any promotions created (Start_date) before last 6 months. 

insert into Promotions (Product_id,Promotion_name,Start_date,End_date,DiscountAmount,Active)
values(1,'Festive Offer','2025-06-12','2025-08-12',3000,0);

select * from Promotions;

DELETE FROM Promotions
WHERE Start_date < DATEADD(MONTH,-6,GETDATE());

select * from Promotions;

--5 Create a view that joins the 'Orders' and 'Customers' tables to display order details along with customer information.

create view [ Order Details with Customer Information] as

select c.Customer_id,c.First_name,c.Last_name,o.Order_id,Order_date from Customers c
join Orders o
on c.Customer_id = o.Customer_id;

select * from [ Order Details with Customer Information];

--6 Build a complex view that joins multiple tables such as ‘Orders’, 'Products' 
--to display detailed order data along with product information for last 3 months.

CREATE VIEW vw_OrderProductDetails
AS
SELECT o.Order_id, o.Order_date, p.Product_name, p.Category_name, o.Price
FROM Orders o
JOIN Products p ON o.Product_id = p.Product_id
WHERE o.Order_date >= DATEADD(MONTH,-3,GETDATE());

select * from vw_OrderProductDetails;


--7 View with WITH CHECK OPTION: Implement a view that shows employee salaries 
--and allows for salary updates. Utilize the 'WITH CHECK OPTION' to ensure that salary must be > 10000.


CREATE VIEW vw_EmployeeSalary
AS
SELECT Employee_id, First_name, Salary
FROM Employees
WHERE Salary > 10000
WITH CHECK OPTION;


select * from vw_EmployeeSalary;

update vw_EmployeeSalary
set Salary =2000
where Employee_id = 3;

--8 User-defined Functions: Develop a function that calculates the total cost of an order based on the quantity and unit price of each product.

create function TotalCost(
@quantity int,
@price decimal(10,2)
)
returns decimal(10,2)
as
begin
return @quantity*@price;
end;

select dbo.TotalCost(10,200);

select Order_id, Customer_id, Quantity, Price, dbo.TotalCost(Quantity,Price) as TotalPrice
from Orders;

--9  WHILE Loop with Continue and Break: 
    --a) Create a temp table named "#Numbers" with a single column named "Value" to store integer values.

    create table #Numbers (
    Value int 
    );

    --b) Populate the "#Numbers" table with integers from 1 to 10.
    
    INSERT INTO #Numbers VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10);

    --c) Implement a WHILE loop to iterate through the "Numbers" table.
    --   Within the loop, print each integer value.
    --   If the integer value is even, skip to the next iteration using CONTINUE.
    --   If the integer value is 5, break out of the loop using BREAK.

    DECLARE @num INT = 1;

    WHILE @num <= 10
    BEGIN
        IF @num % 2 = 0
        BEGIN
            SET @num += 1;
            CONTINUE;
        END

        IF @num = 5
            BREAK;

        PRINT @num;
        SET @num += 1;
    END


--  10) Cursor: Write a cursor to iterate through a ‘Order’ ’table
--      and calculate the total revenue generated by each product category.
--      Display the results and insert them in a separate summary table.

declare @Category varchar(30),
        @Revenue decimal(10,2)

DECLARE cur_Category CURSOR FOR
SELECT p.Category_name, SUM(o.Price)
FROM Orders o
JOIN Products p ON o.Product_id = p.Product_id
GROUP BY p.Category_name;

OPEN cur_Category;

FETCH NEXT FROM cur_Category INTO @Category,@Revenue;

while @@FETCH_STATUS = 0 
BEGIN
    INSERT INTO Category_Summary VALUES(@Category,@Revenue);
    FETCH NEXT FROM cur_Category INTO @Category,@Revenue;
END;

CLOSE cur_Category;
DEALLOCATE cur_Category;

select * from Category_Summary;

while condition
       begin
        
       end