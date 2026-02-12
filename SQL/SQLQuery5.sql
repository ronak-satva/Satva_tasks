CREATE DATABASE CustomerOrderManagementDB;

USE CustomerOrderManagementDB;

CREATE TABLE Departments (
    DepartmentId INT PRIMARY KEY,
    DepartmentName VARCHAR(50),
    Location VARCHAR(50)
);

CREATE TABLE Customers (
    CustomerId INT PRIMARY KEY,
    CustomerName VARCHAR(50),
    Email VARCHAR(100),
    Phone VARCHAR(15),
    DepartmentId INT,
    FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId)
);

CREATE TABLE Orders (
    OrderId INT PRIMARY KEY,
    CustomerId INT NULL,
    OrderDate DATE,
    TotalAmount DECIMAL(10,2),
    FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId)
);

INSERT INTO Departments VALUES
(1, 'Sales', 'Delhi'),
(2, 'Marketing', 'Mumbai'),
(3, 'Finance', 'Bangalore'),
(4, 'IT', 'Pune'),
(5, 'HR', 'Chennai');

INSERT INTO Customers VALUES
(1, 'Ronak', 'ronak@gmail.com', '1234567890', 1),
(2, 'Dev', 'dev@example.com', '2345678901', 2),
(3, 'Ishan', 'ishan@example.com', '3456789012', 3),
(4, 'Meet', 'meet@example.com', '4567890123', 4),
(5, 'Parth', 'parth@example.com', '5678901234', 1);

INSERT INTO Orders VALUES
(101, 1, '2024-02-15', 100.00),
(102, 2, '2024-02-16', 150.00),
(103, NULL, '2024-02-17', 200.00),
(104, 2, '2023-06-10', 250.00),
(105, 3, '2024-03-20', 150.00),
(106, 1, '2023-09-12', 150.00),
(107, 2, '2024-05-01', 250.00);

--  1. Retrieve a list of orders along with the names of customers who placed those orders.
-- Include only orders placed by existing customers.
SELECT o.OrderId, c.CustomerName, o.OrderDate
FROM Orders o
INNER JOIN Customers c ON o.CustomerId = c.CustomerId;

--2. Retrieve a list of all orders along with the names of customers who placed those orders.
-- Include orders placed by customers who are not registered in the system

SELECT o.OrderId, c.CustomerName, o.OrderDate
FROM Orders o
LEFT JOIN Customers c ON o.CustomerId = c.CustomerId;

--3. Retrieve a list of all customers who placed orders, even those without any orders.
--Include  the details of orders they placed, if any.

select o.OrderId, c.CustomerName, o.OrderDate
from Orders o
right join Customers c on o.CustomerId = c.CustomerId;

--4. Retrieve a comprehensive list of all orders and customers,
-- including those without any  orders and customers who haven't placed any orders. 

select o.OrderId, c.CustomerName, o.OrderDate
from Orders o
full join Customers c on o.customerId = c.CustomerId;

-- 5. Generate a list of all possible combinations of orders and customers.

select o.OrderId, c.CustomerName, o.OrderDate
from Orders o
cross join Customers c;

-- 6. Retrieve the top 3 customers who have spent the highest total amount. 

select top 3 o.OrderId, c.CustomerName, count(o.OrderId) as "Total Orders", sum(o.TotalAmount) as "TotalAmountSpent"
from Customers c
join
Orders o on c.CustomerId = o.CustomerId
group by c.CustomerName, o.OrderId
order by TotalAmountSpent DESC;

-- 7. Retrieve the details of customers who have not placed any orders. 
select * from Customers;
select * from Orders;

select c.CustomerId, c.CustomerName, c.Email, c.Phone
from Customers c
left join Orders o
on c.CustomerId = o.CustomerId
where o.OrderId is null;

-- 8. Retrieve the total number of orders and total amount spent by each customer for orders  placed in 2024. 

select  c.CustomerId, c.CustomerName, count(o.OrderId) as "TotalOrders", sum(o.TotalAmount) as "TotalAmountSpent"
from Customers c
left join
Orders o
on c.CustomerId = o.CustomerId
and year(o.OrderDate) = 2024
group by c.CustomerId, c.CustomerName;

--9. Retrieve the top 5 departments with the highest average total amount spent by customers in  orders. 


SELECT TOP 5
    d.DepartmentId,
    d.DepartmentName,
    AVG(o.TotalAmount) AS AverageTotalAmountSpent
FROM Departments d
JOIN Customers c ON d.DepartmentId = c.DepartmentId
JOIN Orders o ON c.CustomerId = o.CustomerId
GROUP BY d.DepartmentId, d.DepartmentName
ORDER BY AverageTotalAmountSpent DESC;

--10. Retrieve the department with the highest total number of orders. 

SELECT TOP 1
    d.DepartmentId,
    d.DepartmentName,
    COUNT(o.OrderId) AS TotalOrders
FROM Departments d
JOIN Customers c ON d.DepartmentId = c.DepartmentId
JOIN Orders o ON c.CustomerId = o.CustomerId
GROUP BY d.DepartmentId, d.DepartmentName
ORDER BY TotalOrders DESC;

--11 Retrieve the top 3 customers who have the highest total amount spent on orders in 2024

SELECT TOP 3
    c.CustomerId,
    c.CustomerName,
    SUM(o.TotalAmount) AS TotalAmountSpent
FROM Customers c
JOIN Orders o ON c.CustomerId = o.CustomerId
WHERE YEAR(o.OrderDate) = 2024
GROUP BY c.CustomerId, c.CustomerName
ORDER BY TotalAmountSpent DESC;

--12 Retrieve the details of departments with at least 2 employees and the total number of orders  placed by those employees. 

SELECT
    d.DepartmentId,
    d.DepartmentName,
    COUNT(o.OrderId) AS TotalOrders
FROM Departments d
JOIN Customers c ON d.DepartmentId = c.DepartmentId
LEFT JOIN Orders o ON c.CustomerId = o.CustomerId
GROUP BY d.DepartmentId, d.DepartmentName
HAVING COUNT(DISTINCT c.CustomerId) >= 2;

--13 Retrieve the customers who have placed orders both in 2023 and 2024. 


SELECT DISTINCT
    c.CustomerId,
    c.CustomerName,
    c.Email,
    c.Phone
FROM Customers c
JOIN Orders o ON c.CustomerId = o.CustomerId
WHERE YEAR(o.OrderDate) IN (2023, 2024)
GROUP BY c.CustomerId, c.CustomerName, c.Email, c.Phone
HAVING COUNT(DISTINCT YEAR(o.OrderDate)) = 2;

