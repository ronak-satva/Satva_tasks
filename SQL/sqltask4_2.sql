use  SalesDB;

CREATE TABLE Customer (
    CustomerId INT PRIMARY KEY,
    Name VARCHAR(50),
    Address VARCHAR(100)
);

CREATE TABLE CustomerProducts (
    ProductId INT PRIMARY KEY,
    ProductName VARCHAR(50),
    CustomerIDs VARCHAR(50)
);

INSERT INTO Customer VALUES
(1, 'Jeshal', 'Amreli'),
(2, 'Jigna', 'Ahmedabad'),
(3, 'Rajesh', 'Baroda');

INSERT INTO CustomerProducts VALUES
(1, 'Nokia',   '1,2,3'),
(2, 'iPhone',  '2,3'),
(3, 'Samsung', '1');

SELECT
    c.CustomerId,
    c.Name AS CustomerName,
    c.Address,
    STRING_AGG(cp.ProductName, ',') AS Products  
FROM Customer c
JOIN CustomerProducts cp
    CROSS APPLY STRING_SPLIT(cp.CustomerIDs, ',') s 
        ON s.value = c.CustomerId  --Take one value at a time
GROUP BY
    c.CustomerId,
    c.Name,
    c.Address
