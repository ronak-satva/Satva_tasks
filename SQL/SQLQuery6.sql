CREATE DATABASE SalesManagementDB;

USE SalesManagementDB;

CREATE TABLE Customer (
    CustomerID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName  VARCHAR(50) NOT NULL,
    LastName   VARCHAR(50) NOT NULL,
    Email      VARCHAR(100) UNIQUE NOT NULL,
    Phone      VARCHAR(20) UNIQUE
);

CREATE TABLE Product (
    ProductID   INT IDENTITY(1,1) PRIMARY KEY,
    Name        VARCHAR(100) NOT NULL,
    Price       DECIMAL(10,2) NOT NULL CHECK (Price > 0),
    Description TEXT
);

CREATE TABLE Orders (
    OrderID      INT IDENTITY(1,1) PRIMARY KEY,
    CustomerID   INT NOT NULL,
    ProductID    INT NOT NULL,
    OrderDate    DATETIME NOT NULL DEFAULT GETDATE(),
    Qty          INT NOT NULL CHECK (Qty > 0),
    Rate         DECIMAL(10,2) NOT NULL CHECK (Rate > 0),
    TotalAmount  DECIMAL(10,2) NOT NULL,

    CONSTRAINT FK_Orders_Customer
        FOREIGN KEY (CustomerID)
        REFERENCES Customer(CustomerID),

    CONSTRAINT FK_Orders_Product
        FOREIGN KEY (ProductID)
        REFERENCES Product(ProductID)
);

CREATE TABLE Payment (
    PaymentID   INT IDENTITY(1,1) PRIMARY KEY,
    OrderID     INT NOT NULL,
    Amount      DECIMAL(10,2) NOT NULL CHECK (Amount > 0),
    PaymentDate DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Payment_Order
        FOREIGN KEY (OrderID)
        REFERENCES Orders(OrderID)
);

SELECT name FROM sys.tables;

--1. Create a Store-Procedure insert operation for all tables (Customer, Product,  Order, Payment) 

-- Insert for customer
CREATE PROCEDURE sp_InsertCustomer
@FirstName VARCHAR(50),
@LastName VARCHAR(50),
@Email VARCHAR(100),
@Phone VARCHAR(20)
AS
BEGIN
  INSERT INTO Customer (FirstName, LastName, Email,Phone)
  VALUES (@FirstName, @LastName, @Email, @Phone);
END;

EXEC sp_InsertCustomer 
    @FirstName = 'Rahul',
    @LastName  = 'Sharma',
    @Email     = 'rahul.sharma@gmail.com',
    @Phone     = '9876543210';

EXEC sp_InsertCustomer 
    @FirstName = 'Ronak',
    @LastName  = 'Jha',
    @Email     = 'ronak@gmail.com',
    @Phone     = '9876543210';

EXEC sp_InsertCustomer 
    @FirstName = 'Anita',
    @LastName  = 'Verma',
    @Email     = 'anita.verma@gmail.com',
    @Phone     = '9123456789';

EXEC sp_InsertCustomer 'Rahul',  'Mehta',  'rahul.mehta@gmail.com',   '9876543212';
EXEC sp_InsertCustomer 'Priya',  'Singh',  'priya.singh@gmail.com',  '9876543213';
EXEC sp_InsertCustomer 'Karan',  'Malhotra','karan.m@gmail.com',     '9876543214';

select * from Customer;

-- Insert procedure for product
CREATE PROCEDURE sp_InsertProduct
@Name VARCHAR(100),
@Price DECIMAL(10,2),
@Description TEXT
AS
BEGIN INSERT INTO Product (Name, Price, Description)
      VALUES (@Name, @Price, @Description);
END;

EXEC sp_InsertProduct 'Laptop',     60000.00, 'Dell Inspiron Laptop';
EXEC sp_InsertProduct 'Mobile',     25000.00, 'Samsung Galaxy';
EXEC sp_InsertProduct 'Headphones',  3000.00, 'Noise Cancelling';
EXEC sp_InsertProduct 'Keyboard',    1500.00, 'Mechanical Keyboard';
EXEC sp_InsertProduct 'Mouse',        800.00, 'Wireless Mouse';

--- Insert  procedure for Order

CREATE PROC sp_InsertOrder
    @CustomerID INT,
    @OrderDate DATETIME,
    @ProductID INT,
    @Qty INT,
    @Rate DECIMAL(10,2)
AS
BEGIN
    DECLARE @TotalAmount DECIMAL(10,2);
    SET @TotalAmount = @Qty * @Rate;

    INSERT INTO Orders (CustomerID, OrderDate, ProductID, Qty, Rate, TotalAmount)
    VALUES (@CustomerID, @OrderDate, @ProductID, @Qty, @Rate, @TotalAmount);
END;

EXEC sp_InsertOrder 1, '2025-01-10', 1, 1, 60000.00;
EXEC sp_InsertOrder 2, '2025-01-12', 2, 2, 25000.00;
EXEC sp_InsertOrder 3, '2025-01-15', 3, 3, 3000.00;
EXEC sp_InsertOrder 4, '2025-01-18', 4, 1, 1500.00;
EXEC sp_InsertOrder 5, '2025-01-20', 5, 2, 800.00;

select * from Orders;

-- Insert procdure for payment


CREATE PROC sp_InsertPayment
    @OrderID INT,
    @Amount DECIMAL(10,2)
AS
BEGIN
    INSERT INTO Payment (OrderID, Amount, PaymentDate)
    VALUES (@OrderID, @Amount, GETDATE());
END;

EXEC sp_InsertPayment 1, 60000.00;
EXEC sp_InsertPayment 3, 9000.00;
EXEC sp_InsertPayment 4, 1500.00;
EXEC sp_InsertPayment 5, 1600.00;

-- 2. Update procedure for Customer

CREATE PROCEDURE sp_UpdateCustomer
@CustomerId INT,
@FirstName VARCHAR(50),
@LastName VARCHAR(50),
@Email VARCHAR(100),
@Phone VARCHAR(20)
AS
BEGIN

UPDATE Customer
SET FirstName = @FirstName,LastName = @LastName,Email=@Email,Phone=@Phone
WHERE CustomerId = @CustomerId;
END;

select * from Customer;

EXEC sp_UpdateCustomer 1,'Rohit','Sharma','rohit@gmail.com','955845769';

select * from Customer;

-- Update Procedure for product

CREATE PROC sp_UpdateProduct
    @ProductID INT,
    @Name VARCHAR(100),
    @Price DECIMAL(10,2),
    @Description TEXT
AS
BEGIN
    UPDATE Product
    SET Name=@Name, Price=@Price, Description=@Description
    WHERE ProductID=@ProductID;
END;

select * from Product;

EXEC sp_UpdateProduct 
    1, 'Gaming Laptop', 75000, 'High performance laptop';

select * from Product;

-- Update Order
CREATE PROC sp_UpdateOrder
    @OrderID INT,
    @Qty INT,
    @Rate DECIMAL(10,2)
AS
BEGIN
    UPDATE Orders
    SET Qty=@Qty,
        Rate=@Rate,
        TotalAmount=@Qty*@Rate
    WHERE OrderID=@OrderID;
END;

select * from Orders;

EXEC sp_UpdateOrder 
    1, 3, 60000;

select * from Orders;


-- Payment Update
CREATE PROC sp_UpdatePayment
    @PaymentID INT,
    @Amount DECIMAL(10,2)
AS
BEGIN
    UPDATE Payment
    SET Amount=@Amount
    WHERE PaymentID=@PaymentID;
END;


select * from Payment;

EXEC sp_UpdatePayment 
    1, 125000;

select * from Payment;


--3. Create procedure for get all customer,product,order,payment

CREATE PROCEDURE sp_GetCustomers AS SELECT * FROM Customer;

CREATE PROCEDURE sp_GetProducts AS SELECT * FROM Product;

CREATE PROCEDURE sp_GetOrders AS SELECT * FROM Orders;

CREATE PROCEDURE sp_GetPayments AS SELECT * FROM Payment;


EXEC sp_GetCustomers;
EXEC sp_GetProducts;
EXEC sp_GetOrders;
EXEC sp_GetPayments;

--4 Delete by primary key

CREATE PROC sp_DeleteCustomer @CustomerID INT AS
DELETE FROM Customer WHERE CustomerID=@CustomerID;
GO

CREATE PROC sp_DeleteProduct @ProductID INT AS
DELETE FROM Product WHERE ProductID=@ProductID;
GO

CREATE PROC sp_DeleteOrder @OrderID INT AS
DELETE FROM Orders WHERE OrderID=@OrderID;
GO

CREATE PROC sp_DeletePayment @PaymentID INT AS
DELETE FROM Payment WHERE PaymentID=@PaymentID;

EXEC sp_DeleteCustomer 5;
EXEC sp_DeleteProduct 5;
EXEC sp_DeleteOrder 5;
EXEC sp_DeletePayment 5;

-- 5  Create a stored procedure that updates the price of a product given its  ProductID.

CREATE PROCEDURE sp_UpdateProductPrice
    @ProductID INT,
    @NewPrice DECIMAL(10,2)
AS
BEGIN
    UPDATE Product SET Price=@NewPrice
    WHERE ProductID=@ProductID;
END;

EXEC sp_UpdateProductPrice 
    @ProductID = 1,
    @NewPrice = 80000;

--6  Insert Order with Auto Total
--7 Insert Payment with ORder ID and amount

--8 Create a stored procedure that retrieves the total payments made by each 
--customer by joining the Customer and Payment tables
--and aggregating the  amounts for each customer

CREATE PROC sp_TotalPaymentsByCustomer
AS
BEGIN
    SELECT c.CustomerID, c.FirstName, c.LastName,
           SUM(p.Amount) AS TotalPaid
    FROM Customer c
    JOIN Orders o ON c.CustomerID=o.CustomerID
    JOIN Payment p ON o.OrderID=p.OrderID
    GROUP BY c.CustomerID, c.FirstName, c.LastName;
END;

EXEC sp_TotalPaymentsByCustomer;

--9  Write a stored procedure that identifies customers who have not made any
--payments by comparing the Customer table with the Payment table and returning
--the relevant records.

CREATE PROC sp_CustomersWithoutPayments
AS
BEGIN
    SELECT c.*
    FROM Customer c
    LEFT JOIN Orders o ON c.CustomerID=o.CustomerID
    LEFT JOIN Payment p ON o.OrderID=p.OrderID
    WHERE p.PaymentID IS NULL;
END;

EXEC sp_CustomersWithoutPayments;

--10  .Develop a stored procedure that calculates the total revenue for a given period  by summing up the TotalAmount
--from the Order table for orders placed within  that period. 

CREATE PROC sp_TotalRevenueByPeriod
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SELECT SUM(TotalAmount) AS TotalRevenue
    FROM Orders
    WHERE OrderDate BETWEEN @StartDate AND @EndDate;
END;

EXEC sp_TotalRevenueByPeriod 
    '2025-01-01', '2025-12-31';

--11  Design a stored procedure that retrieves all orders along with customer and  product details by joining the Order, Customer, and Product tables.

CREATE PROC sp_OrderDetails
AS
BEGIN
    SELECT o.OrderID, c.FirstName, p.Name,
           o.Qty, o.TotalAmount, o.OrderDate
    FROM Orders o
    JOIN Customer c ON o.CustomerID=c.CustomerID
    JOIN Product p ON o.ProductID=p.ProductID;
END;

EXEC sp_OrderDetails;


--12.Retrieve the top N customers with the highest total payments. 

CREATE PROC sp_TopCustomersByPayment
    @TopN INT
AS
BEGIN
    SELECT TOP (@TopN) c.CustomerID, c.FirstName,
           SUM(p.Amount) AS TotalPaid
    FROM Customer c
    JOIN Orders o ON c.CustomerID=o.CustomerID
    JOIN Payment p ON o.OrderID=p.OrderID
    GROUP BY c.CustomerID, c.FirstName
    ORDER BY TotalPaid DESC;
END;

EXEC sp_TopCustomersByPayment 
    @TopN = 3;

-- 13.Retrieve all orders made by customers who have made payments within the last  N months

CREATE PROC sp_OrdersPaidLastNMonths
    @Months INT
AS
BEGIN
    SELECT DISTINCT o.*
    FROM Orders o
    JOIN Payment p ON o.OrderID=p.OrderID
    WHERE p.PaymentDate >= DATEADD(MONTH, -@Months, GETDATE());
END;

EXEC sp_OrdersPaidLastNMonths 
    @Months = 1;

--14.Calculate the total revenue for each product category.

CREATE PROC sp_RevenuePerProduct
AS
BEGIN
    SELECT p.Name, SUM(o.TotalAmount) AS Revenue
    FROM Orders o
    JOIN Product p ON o.ProductID=p.ProductID
    GROUP BY p.Name;
END;

EXEC sp_RevenuePerProduct;

--15.Retrieve the most profitable product (highest total revenue). 

CREATE PROC sp_MostProfitableProduct
AS
BEGIN
    SELECT TOP 1 p.Name, SUM(o.TotalAmount) AS Revenue
    FROM Orders o
    JOIN Product p ON o.ProductID=p.ProductID
    GROUP BY p.Name
    ORDER BY Revenue DESC;
END;

EXEC sp_MostProfitableProduct;

--16.Retrieve customers who have made purchases of a specific product within a  given date range. 

CREATE PROC sp_CustomersByProductAndDate
    @ProductID INT,
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SELECT DISTINCT c.*
    FROM Customer c
    JOIN Orders o ON c.CustomerID=o.CustomerID
    WHERE o.ProductID=@ProductID
      AND o.OrderDate BETWEEN @StartDate AND @EndDate;
END;

EXEC sp_CustomersByProductAndDate 
    1, '2025-01-01', '2025-03-31';

--17.Calculate the average order value for each customer. 

CREATE PROC sp_AvgOrderValueByCustomer
AS
BEGIN
    SELECT CustomerID, AVG(TotalAmount) AS AvgOrderValue
    FROM Orders
    GROUP BY CustomerID;
END;

EXEC sp_AvgOrderValueByCustomer;

--18.Retrieve orders with the highest total amounts for each customer.

CREATE PROC sp_HighestOrderPerCustomer
AS
BEGIN
    SELECT *
    FROM Orders o
    WHERE TotalAmount = (
        SELECT MAX(TotalAmount)
        FROM Orders
        WHERE CustomerID=o.CustomerID
    );
END;

EXEC sp_HighestOrderPerCustomer;

--19.Calculate the total number of orders and the total revenue generated by each  customer for a specific year. 

CREATE PROC sp_CustomerOrdersByYear
    @Year INT
AS
BEGIN
    SELECT CustomerID,
           COUNT(OrderID) AS TotalOrders,
           SUM(TotalAmount) AS TotalRevenue
    FROM Orders
    WHERE YEAR(OrderDate)=@Year
    GROUP BY CustomerID;
END;

EXEC sp_CustomerOrdersByYear 
    @Year = 2025;


--20.Retrieve orders that have not been paid within a certain period.

CREATE PROC sp_UnpaidOrders
    @Days INT
AS
BEGIN
    SELECT o.*
    FROM Orders o
    LEFT JOIN Payment p ON o.OrderID=p.OrderID
    WHERE p.OrderID IS NULL
      AND o.OrderDate < DATEADD(DAY, -@Days, GETDATE());
END;

EXEC sp_UnpaidOrders 
    @Days = 30;

--21.Identify customers who have made consecutive purchases within a given  timeframe. 

CREATE PROC sp_ConsecutivePurchasesWithinDays
    @Days INT
AS
BEGIN
    SELECT DISTINCT
        o1.CustomerID
    FROM Orders o1
    JOIN Orders o2
        ON o1.CustomerID = o2.CustomerID
       AND o2.OrderDate > o1.OrderDate
       AND DATEDIFF(DAY, o1.OrderDate, o2.OrderDate) <= @Days;
END;

EXEC sp_ConsecutivePurchasesWithinDays 10;


--22.Calculate the total revenue for each customer in the last N months.

CREATE PROCEDURE sp_RevenueLastNMonths
    @Months INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        CustomerID,
        SUM(TotalAmount) AS Revenue
    FROM Orders
    WHERE OrderDate >= DATEADD(MONTH, -@Months, GETDATE())
    GROUP BY CustomerID;
END;
GO

EXEC sp_RevenueLastNMonths 
    @Months = 15;

--23.Retrieve orders where the product price is higher than the average price of all  products 

CREATE PROCEDURE sp_OrdersAboveAvgPrice
AS
BEGIN
    SET NOCOUNT ON;

    SELECT o.*
    FROM Orders o
    WHERE o.Rate >
    (
        SELECT AVG(p.Price)
        FROM Product p
    );
END;

EXEC sp_OrdersAboveAvgPrice;


--24.Calculate the average time between consecutive orders for each customer.

CREATE PROC sp_AvgTimeBetweenOrders
AS
BEGIN
    SELECT CustomerID,
           AVG(DaysDiff) AS AvgDays
    FROM
    (
        SELECT CustomerID,
               DATEDIFF(DAY,
                   LAG(OrderDate) OVER (PARTITION BY CustomerID ORDER BY OrderDate),
                   OrderDate
               ) AS DaysDiff
        FROM Orders
    ) t
    WHERE DaysDiff IS NOT NULL
    GROUP BY CustomerID;
END;

EXEC sp_InsertOrder 1, '2025-02-05', 2, 1, 25000;

EXEC sp_AvgTimeBetweenOrders;

--25.Create a store procedure create with pagination, sorting and searching with order  table.

CREATE PROC sp_OrderPagination
    @PageNo INT,
    @PageSize INT,
    @SearchCustomerID INT = NULL,
    @SortColumn VARCHAR(20) = 'OrderDate'
AS
BEGIN
    SELECT *
    FROM Orders
    WHERE (@SearchCustomerID IS NULL OR CustomerID=@SearchCustomerID)
    ORDER BY
        CASE WHEN @SortColumn='OrderDate' THEN OrderDate END
    OFFSET (@PageNo-1)*@PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;

EXEC sp_OrderPagination
    @PageNo = 1,
    @PageSize = 5,
    @SearchCustomerID = NULL,
    @SortColumn = 'OrderDate';
