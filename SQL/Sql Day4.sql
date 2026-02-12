create database SalesDB;
use SalesDB;

CREATE TABLE Customers (
    CustomerID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerName VARCHAR(100),
    Email VARCHAR(100),
    City VARCHAR(50),
    CreatedDate DATETIME DEFAULT GETDATE()
);

CREATE TABLE Products (
    ProductID INT IDENTITY(1,1) PRIMARY KEY,
    ProductName VARCHAR(100),
    Price DECIMAL(10,2),
    Stock INT
);

CREATE TABLE Orders (
    OrderID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerID INT,
    OrderDate DATETIME DEFAULT GETDATE(),
    TotalAmount DECIMAL(10,2),

    CONSTRAINT FK_Orders_Customers
    FOREIGN KEY (CustomerID)
    REFERENCES Customers(CustomerID)
    ON DELETE CASCADE
);

CREATE TABLE OrderItems (
    OrderItemID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT,
    ProductID INT,
    Quantity INT,
    Price DECIMAL(10,2),

    CONSTRAINT FK_OrderItems_Orders
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),

    CONSTRAINT FK_OrderItems_Products
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

CREATE TABLE Payments (
    PaymentID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT,
    PaidAmount DECIMAL(10,2),
    PaymentDate DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Payments_Orders
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);

--1 . Create Bulk insert type for Customer.

create type dbo.CustomerType as table
(
    CustomerName varchar(100),
    Email varchar(100),
    City varchar(50)
);

create procedure sp_BulkInsertCustomers
    @Customers dbo.CustomerType readonly
as
begin
    insert into Customers (CustomerName, Email, City)
    select CustomerName, Email, City
    from @Customers;
end;

DECLARE @CustomerData dbo.CustomerType;

INSERT INTO @CustomerData (CustomerName, Email, City)
VALUES
('Amit Sharma', 'amit@gmail.com', 'Delhi'),
('Anita Verma', 'anita@gmail.com', 'Mumbai'),
('Rahul Mehta', 'rahul@gmail.com', 'Bangalore'),
('Priya Singh', 'priya@gmail.com', 'Delhi'),
('Arjun Patel', 'arjun@gmail.com', 'Ahmedabad'),
('Ayesha Khan', 'ayesha@gmail.com', 'Mumbai'),
('Rohit Kumar', 'rohit@gmail.com', 'Pune'),
('Neha Gupta', 'neha@gmail.com', 'Delhi'),
('Suresh Reddy', 'suresh@gmail.com', 'Hyderabad'),
('Kiran Rao', 'kiran@gmail.com', 'Bangalore'),
('Anil Joshi', 'anil@gmail.com', 'Mumbai'),
('Akash Malhotra', 'akash@gmail.com', 'Delhi');

EXEC sp_BulkInsertCustomers @CustomerData;
select * from Customers;

-- create bulk insert for product

create type dbo.ProductType as table
(
    ProductName varchar(100),
    Price decimal(10,2),
    Stock int
);

create procedure sp_BulkInsertProducts
    @Products dbo.ProductType readonly
as
begin
    insert into Products (ProductName, Price, Stock)
    select ProductName, Price, Stock
    from @Products;
end;

DECLARE @ProductData dbo.ProductType;

INSERT INTO @ProductData (ProductName, Price, Stock)
VALUES
('Laptop', 60000, 50),
('Mobile Phone', 30000, 100),
('Tablet', 25000, 70),
('Headphones', 3000, 200),
('Smart Watch', 15000, 80),
('Keyboard', 1200, 150),
('Mouse', 800, 180),
('Monitor', 12000, 60),
('Printer', 9000, 40),
('Camera', 45000, 30);

EXEC sp_BulkInsertProducts @ProductData;

INSERT INTO Orders (CustomerID, OrderDate, TotalAmount)
VALUES
(1, DATEADD(MONTH, -1, GETDATE()), 90000),
(1, DATEADD(MONTH, -2, GETDATE()), 30000),
(1, DATEADD(MONTH, -3, GETDATE()), 15000),
(1, DATEADD(MONTH, -4, GETDATE()), 12000),
(1, DATEADD(MONTH, -5, GETDATE()), 8000),
(1, DATEADD(MONTH, -6, GETDATE()), 5000),

(2, DATEADD(MONTH, -1, GETDATE()), 60000),
(2, DATEADD(MONTH, -2, GETDATE()), 45000),

(3, DATEADD(MONTH, -1, GETDATE()), 30000),
(4, DATEADD(MONTH, -1, GETDATE()), 20000);


INSERT INTO OrderItems (OrderID, ProductID, Quantity, Price)
VALUES
(1, 1, 1, 60000),
(1, 4, 2, 3000),
(1, 5, 1, 15000),

(2, 2, 1, 30000),

(3, 6, 2, 1200),
(3, 7, 2, 800),

(4, 8, 1, 12000),

(5, 4, 2, 3000),

(6, 7, 1, 800),

(7, 1, 1, 60000),
(8, 10, 1, 45000),

(9, 2, 1, 30000),
(10, 3, 1, 25000);

-- Order 1 (Partial Payment)
INSERT INTO Payments (OrderID, PaidAmount)
VALUES
(1, 40000),
(1, 50000);

-- Full payments
INSERT INTO Payments (OrderID, PaidAmount)
VALUES
(2, 30000),
(3, 15000),
(4, 12000),
(5, 8000),
(6, 5000),
(7, 60000),
(8, 45000),
(9, 30000),
(10, 25000)

--2  Write query which give top 10 customers order by city

select top (10) * from Customers order by City;

--3 Write a query which gives the result using the’ Like.’ keyword.
select* from Customers;

SELECT *
FROM Customers
WHERE CustomerName LIKE 'Mumbai';

--4 Write a query using ‘In’ Key world on the City column of the Customer table.
--4 Write a column query using ‘In’ Key world on the City column of the Customer table.
--4 Write a query using ‘In’ Key world on the City column of the Customer table.
--4 Write a query using ‘In’ Key world on the City of the Customer table.
--4 Write a query using ‘In’ column Key world on the City column of the Customer table.

SELECT * FROM descc


select * from descc
where Description like '%column%';




select * from customers where city = "Mumbai"
SELECT *
FROM Customers
WHERE City IN ('Delhi', 'Mumbai', 'Bangalore');

--5 Use the MERGE statement to update existing customer details or insert new customers into the customers table based on incoming data.

SELECT * FROM Customers;

DECLARE @CustomerData dbo.CustomerType;
INSERT INTO @CustomerData (CustomerName, Email, City)
VALUES
('Amit Sharma', 'amit@gmail.com', 'Delhi'),   
('Neha Gupta', 'neha@gmail.com', 'Mumbai'),  
('Ravi Kumar', 'ravi@gmail.com', 'Chennai'); 

MERGE Customers AS Target
USING @CustomerData AS Source
ON Target.Email = Source.Email

WHEN MATCHED THEN
    UPDATE SET
        Target.CustomerName = Source.CustomerName,
        Target.City = Source.City

WHEN NOT MATCHED THEN
    INSERT (CustomerName, Email, City)
    VALUES (Source.CustomerName, Source.Email, Source.City);

select * from Customers;




-- 6.Use the MERGE statement to update existing product details or insert new products into the products table based on incoming data.

SELECT * FROM Products;

DECLARE @ProductData dbo.ProductType;
INSERT INTO @ProductData (ProductName, Price, Stock)
VALUES
('Laptop', 58000, 45),          
('Mobile Phone', 32000, 90),    
('Bluetooth Speaker', 4500, 60),
('Web Camera', 3500, 40);       

MERGE Products AS Target
USING @ProductData AS Source
ON Target.ProductName = Source.ProductName

WHEN MATCHED THEN
    UPDATE SET
        Target.Price = Source.Price,
        Target.Stock = Source.Stock

WHEN NOT MATCHED THEN
    INSERT (ProductName, Price, Stock)
    VALUES (Source.ProductName, Source.Price, Source.Stock);

SELECT * FROM Products;

--7 Procedure to Insert a new order into the Orders table and retrieve the generated OrderID.
--Update the order, Add or Update Payment table accordingly. Make sure to consider partial payment.


CREATE PROCEDURE sp_CreateOrderWithPayment
(
    @CustomerID     INT,
    @TotalAmount    DECIMAL(10,2),
    @PaidAmount     DECIMAL(10,2),  
    @OrderID        INT OUTPUT      
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        --  Insert new order
        INSERT INTO Orders (CustomerID, TotalAmount, OrderDate)
        VALUES (@CustomerID, @TotalAmount, GETDATE());

        SET @OrderID = SCOPE_IDENTITY();

        --  Insert payment (partial or full)
        INSERT INTO Payments (OrderID, PaidAmount, PaymentDate)
        VALUES (@OrderID, @PaidAmount, GETDATE());

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;

        THROW;  -- rethrow error
    END CATCH
END;

DECLARE @NewOrderID INT;

EXEC sp_CreateOrderWithPayment
    @CustomerID = 1,
    @TotalAmount = 90000,
    @PaidAmount = 40000,   -- partial payment
    @OrderID = @NewOrderID OUTPUT; --returns the generated order ID

SELECT @NewOrderID AS GeneratedOrderID;  -- variable to capture output

INSERT INTO Payments (OrderID, PaidAmount)
VALUES (@NewOrderID, 30000);

INSERT INTO Payments (OrderID, PaidAmount)
VALUES (@NewOrderID, 20000);

Select * from Payments;

--8 Implement a stored procedure to delete customers from the Customers table, handling cascading deletes for related orders.

CREATE OR ALTER PROC sp_DeleteCustomer
    @CustomerID INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        --  Delete Payments
        DELETE P
        FROM Payments P
        INNER JOIN Orders O
            ON P.OrderID = O.OrderID
        WHERE O.CustomerID = @CustomerID;

        -- Delete OrderItems
        DELETE OI
        FROM OrderItems OI
        INNER JOIN Orders O
            ON OI.OrderID = O.OrderID
        WHERE O.CustomerID = @CustomerID;

        --  Delete Orders
        DELETE FROM Orders
        WHERE CustomerID = @CustomerID;

        --  Delete Customer
        DELETE FROM Customers
        WHERE CustomerID = @CustomerID;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
EXEC sp_DeleteCustomer @CustomerID = 2;


SELECT * FROM Customers;
SELECT * FROM Orders;
SELECT * FROM Payments;



---------------------   Advanced Querying:


--Task 1: 
--Calculate Total Sales Revenue per Product
--Join the Orders, Payment, and Products tables to calculate the total sales revenue for each product.
--Display the product name along with the total revenue.

SELECT
    p.ProductName,
    SUM(oi.Quantity * oi.Price) AS TotalRevenue
FROM OrderItems oi
JOIN Products p ON oi.ProductID = p.ProductID
JOIN Orders o ON oi.OrderID = o.OrderID
JOIN Payments pay ON o.OrderID = pay.OrderID
GROUP BY p.ProductName;

--Task 2: 
--Identify Customers with High Order Frequency
--Create a query using CTEs to identify customers who have placed orders more than 5 times in the last six months.
--Display customer information such as name and email along with their order frequency.


WITH OrderCTE AS (    --CTE computes order counts per customer in last 6 months.
    SELECT CustomerID, COUNT(*) AS OrderCount
    FROM Orders
    WHERE OrderDate >= DATEADD(MONTH, -6, GETDATE())
    GROUP BY CustomerID
)
SELECT c.CustomerName, c.Email, o.OrderCount
FROM OrderCTE o
JOIN Customers c ON o.CustomerID = c.CustomerID
WHERE o.OrderCount > 5; 

--Task 3: 
--Calculate Average Order Value per Customer
--Utilize temporary tables, table variables, or CTEs to calculate the average order value for each customer.
--Orders table to calculate the total amount spent by each customer.
--Divide the total amount by the number of orders placed by each customer to determine the average order value.
--Display customer information along with their average order value

WITH AvgCTE AS (
    SELECT
        CustomerID,
        SUM(TotalAmount) AS TotalSpent,
        COUNT(*) AS OrderCount
    FROM Orders
    GROUP BY CustomerID
)
SELECT
    c.CustomerName,
    c.Email,
    TotalSpent / OrderCount AS AvgOrderValue
FROM AvgCTE a
JOIN Customers c ON a.CustomerID = c.CustomerID;

--Task 4: 
--Find Best-Selling Products
--Use temporary tables, table variables, or CTEs to find the top 10 best-selling products based on the total quantity sold.
--Join the Products and Order tables to calculate the total quantity sold for each product.
--Display product information for the best-selling products, including product name and total quantity sold.


WITH SalesCTE AS (
    SELECT
        ProductID,
        SUM(Quantity) AS TotalQuantity
    FROM OrderItems
    GROUP BY ProductID
)
SELECT TOP 10
    p.ProductName,
    s.TotalQuantity
FROM SalesCTE s
JOIN Products p ON s.ProductID = p.ProductID
ORDER BY s.TotalQuantity DESC;

update OrderItems set ProductID = null where OrderID=1;


DECLARE @



