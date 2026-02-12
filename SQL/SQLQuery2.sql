CREATE DATABASE CompanyManagementDB;

USE CompanyManagementDB;

CREATE TABLE Company (
    CompanyId INT IDENTITY(1,1) PRIMARY KEY,
    CompanyName VARCHAR(100) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Phone VARCHAR(15),
    CreatedAt DATETIME DEFAULT GETDATE()
);

SELECT name FROM sys.tables;

CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId INT NOT NULL,
    UserName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Role VARCHAR(50) CHECK (Role IN ('Admin', 'Employee', 'Manager')),
    CreatedAt DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Users_Company
        FOREIGN KEY (CompanyId)
        REFERENCES Company(CompanyId)
        ON DELETE CASCADE
);

select name from sys.tables;

CREATE TABLE Devices (
    DeviceId INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId INT NOT NULL,
    DeviceName VARCHAR(100) NOT NULL,
    DeviceType VARCHAR(50) CHECK (DeviceType IN ('Laptop', 'Mobile', 'Tablet', 'Desktop')),
    SerialNumber VARCHAR(100) UNIQUE,
    IsActive BIT DEFAULT 1,

    CONSTRAINT FK_Devices_Company
        FOREIGN KEY (CompanyId)
        REFERENCES Company(CompanyId)
        ON DELETE CASCADE
);

select name from sys.tables;

CREATE TABLE Applications (
    ApplicationId INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId INT NOT NULL,
    ApplicationName VARCHAR(100) NOT NULL,
    Version VARCHAR(20),
    LicenseType VARCHAR(50) CHECK (LicenseType IN ('Free', 'Paid', 'Trial')),

    CONSTRAINT FK_Applications_Company
        FOREIGN KEY (CompanyId)
        REFERENCES Company(CompanyId)
        ON DELETE CASCADE
);

CREATE TABLE Marketing (
    MarketingId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    CampaignName VARCHAR(100) NOT NULL,
    Budget DECIMAL(10,2) CHECK (Budget >= 0),
    StartDate DATE,
    EndDate DATE,

    CONSTRAINT FK_Marketing_Users
        FOREIGN KEY (UserId)
        REFERENCES Users(UserId)
        ON DELETE CASCADE
);

CREATE TABLE Personal (
    PersonalId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Address VARCHAR(255),
    DateOfBirth DATE,
    Gender VARCHAR(10) CHECK (Gender IN ('Male', 'Female', 'Other')),

    CONSTRAINT FK_Personal_Users
        FOREIGN KEY (UserId)
        REFERENCES Users(UserId)
        ON DELETE CASCADE
);

INSERT INTO Company (CompanyName, Email, Phone)
VALUES 
('TechNova Pvt Ltd', 'contact@technova.com', '9876543210'),
('InnoSoft Solutions', 'info@innosoft.com', '9123456789'),
('NextGen Systems', 'support@nextgen.com', '9988776655'),
('BlueSky Corp', 'hello@bluesky.com', '9090909090'),
('FutureWorks Ltd', 'admin@futureworks.com', '9112233445');

INSERT INTO Users (CompanyId, UserName, Email, Role)
VALUES
(1, 'Rahul Sharma', 'rahul@technova.com', 'Admin'),
(1, 'Anita Verma', 'anita@technova.com', 'Employee'),
(2, 'Rohit Mehta', 'rohit@innosoft.com', 'Manager'),
(3, 'Sneha Kapoor', 'sneha@nextgen.com', 'Employee'),
(4, 'Amit Singh', 'amit@bluesky.com', 'Admin');

INSERT INTO Devices (CompanyId, DeviceName, DeviceType, SerialNumber)
VALUES
(1, 'Dell Latitude', 'Laptop', 'DL12345'),
(1, 'iPhone 14', 'Mobile', 'IP98765'),
(2, 'HP ProDesk', 'Desktop', 'HP45678'),
(3, 'Samsung Galaxy Tab', 'Tablet', 'SG11122'),
(4, 'Lenovo ThinkPad', 'Laptop', 'LT99887');

INSERT INTO Applications (CompanyId, ApplicationName, Version, LicenseType)
VALUES
(1, 'CRM System', '1.0', 'Paid'),
(1, 'Payroll App', '2.3', 'Paid'),
(2, 'Inventory Tool', '1.5', 'Trial'),
(3, 'Project Tracker', '3.1', 'Free'),
(4, 'Analytics Dashboard', '2.0', 'Paid');

INSERT INTO Marketing (UserId, CampaignName, Budget, StartDate, EndDate)
VALUES
(1, 'Product Launch', 50000, '2024-01-01', '2024-01-31'),
(2, 'Email Campaign', 15000, '2024-02-01', '2024-02-15'),
(3, 'Social Media Ads', 30000, '2024-03-01', '2024-03-20'),
(4, 'Referral Program', 20000, '2024-04-01', '2024-04-30'),
(5, 'Brand Awareness', 40000, '2024-05-01', '2024-05-31');


INSERT INTO Personal (UserId, Address, DateOfBirth, Gender)
VALUES
(1, 'Delhi, India', '1990-05-12', 'Male'),
(2, 'Mumbai, India', '1992-08-25', 'Female'),
(3, 'Pune, India', '1988-11-03', 'Male'),
(4, 'Bangalore, India', '1995-02-18', 'Female'),
(5, 'Hyderabad, India', '1991-07-09', 'Male');

ALTER TABLE Company
ADD CONSTRAINT CK_Company_Phone_10Digits
CHECK (
    Phone LIKE '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
);

INSERT INTO Company (CompanyName, Email, Phone)
VALUES ('Satva', 'satva@gmail.com', '9879816649');


select * from Company;