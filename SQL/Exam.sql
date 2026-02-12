create database EcommerceDB;
use EcommerceDB;

CREATE TABLE Customers
(
    CustomerID INT PRIMARY KEY,
    Name VARCHAR(100),
    Email VARCHAR(100),
    Address VARCHAR(200)
);

CREATE TABLE Products
(
    ProductID INT PRIMARY KEY,
    ProductName VARCHAR(100),
    Price DECIMAL(10,2),
    StockQuantity INT
);

alter table Products add constraint StockQuantity check (StockQuantity >= 0);

CREATE TABLE Orders
(
    OrderID INT PRIMARY KEY,
    CustomerID INT,
    OrderDate DATE,
    TotalAmount DECIMAL(10,2),

    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

CREATE TABLE Cart
(
    CartID INT PRIMARY KEY,
    CustomerID INT,
    ProductID INT,
    Quantity INT,
    AddedDate DATE,

    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

CREATE TABLE OrderDetails
(
    OrderDetailID INT PRIMARY KEY,
    OrderID INT,
    ProductID INT,
    Quantity INT,
    UnitPrice DECIMAL(10,2),

    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

select * from sys.tables;

INSERT INTO Customers VALUES
(1,'John Doe','john@example.com','123 Elm St'),
(2,'Jane Smith','jane@example.com','456 Oak St'),
(3,'Alice Brown','alice@example.com','789 Pine St');
INSERT INTO Customers VALUES
(4,'Michael Scott','michael@dundermifflin.com','Scranton'),
(5,'Dwight Schrute','dwight@dundermifflin.com','Scranton'),
(6,'Jim Halpert','jim@dundermifflin.com','Stamford'),
(7,'Pam Beesly','pam@dundermifflin.com','Scranton'),
(8,'Ryan Howard','ryan@dundermifflin.com','New York');

INSERT INTO Products VALUES
(101,'Laptop',800,50),
(102,'Smartphone',500,30),
(103,'Headphones',150,100);
INSERT INTO Products VALUES
(105,'Monitor',300,40),
(106,'Keyboard',50,200),
(107,'Mouse',30,250);

INSERT INTO Orders VALUES
(201,1,'2024-08-01',1200),
(202,2,'2024-08-03',500),
(203,1,'2024-08-05',800),
(204,3,'2023-12-10',1500);
INSERT INTO Orders VALUES
(206,5,'2026-02-01',600),
(207,6,'2026-01-25',300);
INSERT INTO Orders VALUES
(208,7,'2024-05-10',800),
(209,5,'2024-03-12',400);
INSERT INTO Orders VALUES
(210,4,'2026-02-05',900),
(211,4,'2026-02-08',700);

INSERT INTO OrderDetails VALUES
(1,201,101,1,800),      
(2,201,103,2,150);
INSERT INTO OrderDetails VALUES
(3,202,102,1,500);
INSERT INTO OrderDetails VALUES
(4,203,101,1,800);
INSERT INTO OrderDetails VALUES
(5,204,101,1,800),
(6,204,102,1,500),
(7,204,103,1,150);
INSERT INTO OrderDetails VALUES
(8,205,101,1,800),
(9,205,105,2,300);
INSERT INTO OrderDetails VALUES
(10,206,102,1,500),
(11,206,106,2,50);
INSERT INTO OrderDetails VALUES
(12,207,107,5,30);

INSERT INTO OrderDetails VALUES
(13,208,104,2,400);

INSERT INTO OrderDetails VALUES
(14,209,105,1,300);
INSERT INTO OrderDetails VALUES
(15,210,101,1,800),
(16,210,103,2,150);

INSERT INTO OrderDetails VALUES
(17,211,104,1,400),
(18,211,106,4,50);

INSERT INTO Cart VALUES
(301,1,101,2,'2024-07-28'),
(302,2,102,1,'2024-07-29'),
(303,3,103,3,'2024-07-30');

--Section 2: Order Grouping Record and Report 
-- 2. Write an SQL query to group orders by customer and report the total amount spent by each customer.

select c.CustomerID, c.Name, sum(o.TotalAmount) as TotalAmountSpent from Customers c 
join
Orders o on c.CustomerID = o.CustomerID
group by c.CustomerID,c.Name;

--3. Write a query to list the top 5 products based on the highest number of orders.

select top 5 p.ProductID, p.ProductName, count(od.OrderID) as TotalSold
from Products p 
join
OrderDetails od on p.ProductID = od.ProductID
group by p.ProductID, p.ProductName
order by TotalSold desc;

-- Section 3
-- 4. Create a stored procedure to insert a new product 
--    or update the existing product's details (name, price, stock quantity) if the ProductID already exists.

create or alter procedure sp_InsertOrUpdate
@ProductID int,
@ProductName varchar(20),
@Price decimal(10,2),
@StockQuantity int
as 
begin
    if exists (select 1 from Products where ProductID = @ProductID )
    begin
        update Products 
        set ProductName = @ProductName,
            Price = @Price,
            StockQuantity = @StockQuantity
            where ProductID = @ProductID
    end
    else
    begin
        insert into Products values(@ProductID,@ProductName,@Price,@StockQuantity);
    end
end;

select * from Products;
exec sp_InsertOrUpdate 104,'Mouse',200,50;

 --   5. Write a stored procedure to insert a new order and update the product stock quantity accordingly

 create or alter procedure sp_InsertOrder
 @OrderID int,
 @CustomerID int,
 @ProductID int,
 @Quantity int
 as
 begin
    declare @Price decimal(10,2)
    declare @Total decimal(10,2)
    
    select @Price = Price from Products where ProductID = @ProductID
    set @Total = @Price * @Quantity;

    insert into Orders values (@OrderID,@CustomerID, getdate(), @Total);

    update Products
    set StockQuantity = StockQuantity - @Quantity
    where ProductID = @ProductID 
 end

 select * from Products;
 select * from Orders;
 exec sp_InsertOrUpdate 102,'Smartphone',500,20;
 exec sp_InsertOrder 205,2,102,10;

 -- Section 4: Stored Procedure with Functions
--      6. Create a function to calculate the discount based on the order total amount: 
--         If amount is greater than or equal to 1000 then give 20% discount
--         If amount is greater than or equal to 500 then give 10% discount
--         In all other cases give 0% discount

create function TotalDiscount(
@Amount decimal(10,2) 
)
returns decimal(10,2)
as
begin
    declare  @discount decimal(10,2)

    if @Amount >=1000
    begin
        set @discount = @Amount * 0.20
    end
    else if @Amount >=500
    begin
        set @discount = @Amount * 0.10
    end
    else 
        set @discount = 0 

    return @discount
end;

--  7. Write a stored procedure that uses this function to apply the discount and return the final payable amount for a given OrderID. 

create procedure sp_GetFinalAmount
@OrderID int
as
begin
    declare @amount int
    declare @discount decimal(10,2)

    select @amount = TotalAmount from Orders where OrderId = @OrderId;

    set @discount = dbo.TotalDiscount(@amount)

    select @ORderID as OrderID, @amount as OriginalAmount, @discount as DiscountedPrice, (@amount-@discount) as FinalAmount

end;


SELECT * FROM Orders;
SELECT dbo.TotalDiscount(1600) AS Discount;
EXEC sp_GetFinalAmount 204;

--8 -- Section 5: Stored Procedure with Split Column Value and Join Another Table
--     Create a stored procedure that accepts a comma-separated list of ProductIDs,
--     splits the values, and joins with the Products table to display the product details (name, price, stock quantity). 


create procedure sp_GetProductById
@ProductIds varchar(max)
as
begin
    select * from Products
    where ProductID in (
    select value from string_split(@ProductIds,',')
    );
end;

declare @data = ('abx','     dsfds','     dsfds','   ','   ','  dsfds')
select value from string_split(@data,',');

select * from Products;
exec sp_GetProductById '101,103,104';

--   -- Section 6: Stored Procedure with Math Logic 
-- 9. Write a stored procedure to calculate the following statistics for each product: 

create procedure sp_ProductStatistics
as
begin
    select p.ProductID, p.ProductName, sum(od.Quantity) as TotalSold, sum(p.Price * od.Quantity) as TotalRevenue, avg(od.Quantity) as AvgOrderQty,
    stdev(od.Quantity) as StdDevOrderQty
    from OrderDetails od 
    join
    Products p on od.ProductID = p.ProductID
    group by p.ProductID, p.ProductName;
end

exec sp_ProductStatistics;


--10 Write a stored procedure to find customers who have not placed any orders in the last 6 months.

create procedure sp_InactiveCustomer
as
begin
    select c.CustomerID, c.Name, max(o.OrderDate) as LastOrderdate from Orders o 
    right join
    Customers c on o.CustomerID = c.CustomerID
    group by c.CustomerID, c.Name
    having max(o.OrderDate) < dateadd(month,-6,getdate())
    or max(o.OrderDate) is null
end

select * from Orders;
exec sp_InactiveCustomer;

--11  
--Write a store procedure
--Implement a CASE statement within a query to categorize customers based on their total purchase amount into 'Gold', 'Silver', or 'Bronze' tiers
--    Customers who have placed 3 or more orders and have a total purchase amount greater than 1000 should be categorized as 'Gold'.
--    Customers who have placed 2 orders and have a total purchase amount greater than 500 should be categorized as 'Silver'.
--    All other customers should be categorized as 'Bronze'.

create procedure sp_customerCategory
as
begin
    select c.CustomerID, c.Name, count(o.OrderID) as TotalOrders, sum(o.TotalAmount) as OrderAmount, 
        case 
            when count(o.OrderID) >= 3 and sum(o.TotalAmount) > 1000
            then 'GOLD'

            when  count(o.OrderID) = 2 and sum(o.TotalAmount) > 500
            then 'Silver'

            else 'Bronze'
        end as category
    
    from Customers c
    left join
    Orders o on c.CustomerID = o.CustomerID
     group by c.CustomerID, c.Name;
end

exec sp_customerCategory;