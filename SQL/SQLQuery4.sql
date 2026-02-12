CREATE DATABASE SchoolManagement;

USE SchoolManagement;

CREATE TABLE Students (
    StudentId INT IDENTITY(1,1) PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50),
    Gender CHAR(1) CHECK (Gender IN ('M','F')),
    DateOfBirth DATE NOT NULL,
    Email VARCHAR(100) UNIQUE,
    Phone VARCHAR(15) UNIQUE,
    CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE Teachers (
    TeacherId INT IDENTITY(1,1) PRIMARY KEY,
    TeacherName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(15) UNIQUE,
    HireDate DATE NOT NULL
);

CREATE TABLE Classes (
    ClassId INT IDENTITY(1,1) PRIMARY KEY,
    ClassName VARCHAR(20) NOT NULL,
    Section CHAR(1) NOT NULL,
    CONSTRAINT UQ_Class_Section UNIQUE (ClassName, Section) -- Composite UNIQUE
);

CREATE TABLE Subjects (
    SubjectId INT IDENTITY(1,1) PRIMARY KEY,
    SubjectName VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Enrollments (
    EnrollmentId INT IDENTITY(1,1) PRIMARY KEY,
    StudentId INT NOT NULL,
    ClassId INT NOT NULL,
    SubjectId INT NOT NULL,
    TeacherId INT NOT NULL,

    CONSTRAINT FK_Enroll_Student FOREIGN KEY (StudentId)
        REFERENCES Students(StudentId),
    CONSTRAINT FK_Enroll_Class FOREIGN KEY (ClassId)
        REFERENCES Classes(ClassId),
    CONSTRAINT FK_Enroll_Subject FOREIGN KEY (SubjectId)
        REFERENCES Subjects(SubjectId),
    CONSTRAINT FK_Enroll_Teacher FOREIGN KEY (TeacherId)
        REFERENCES Teachers(TeacherId),

    CONSTRAINT UQ_Enrollment UNIQUE (StudentId, SubjectId)
);

CREATE TABLE Attendance (
    AttendanceId INT IDENTITY(1,1) PRIMARY KEY,
    StudentId INT NOT NULL,
    AttendanceDate DATE NOT NULL,
    Status VARCHAR(10) CHECK (Status IN ('Present','Absent')),

    CONSTRAINT FK_Attendance_Student FOREIGN KEY (StudentId)
        REFERENCES Students(StudentId),

    CONSTRAINT UQ_Attendance UNIQUE (StudentId, AttendanceDate)
);

CREATE TABLE Fees (
    FeeId INT IDENTITY(1,1) PRIMARY KEY,
    StudentId INT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL CHECK (Amount > 0),
    PaidDate DATE,
    Status VARCHAR(10) CHECK (Status IN ('Paid','Pending')),

    CONSTRAINT FK_Fees_Student FOREIGN KEY (StudentId)
        REFERENCES Students(StudentId)
);

INSERT INTO Classes (ClassName, Section)
VALUES
('8', 'A'),
('8', 'B'),
('9', 'A'),
('9', 'B'),
('10', 'A');

INSERT INTO Students (FirstName, LastName, Gender, DateOfBirth, Email, Phone)
VALUES
('Rahul', 'Sharma', 'M', '2008-05-12', 'rahul@gmail.com', '9000000001'),
('Priya', 'Verma', 'F', '2009-03-22', 'priya@gmail.com', '9000000002'),
('Amit', 'Singh', 'M', '2008-11-10', 'amit@gmail.com', '9000000003'),
('Neha', 'Gupta', 'F', '2009-07-18', 'neha@gmail.com', '9000000004'),
('Rohan', 'Mehta', 'M', '2008-01-30', 'rohan@gmail.com', '9000000005');

INSERT INTO Subjects (SubjectName)
VALUES
('Mathematics'),
('Science'),
('English'),
('History'),
('Computer');

INSERT INTO Teachers (TeacherName, Email, Phone, HireDate)
VALUES
('Anita Verma', 'anita@gmail.com', '9111111111', '2019-06-01'),
('Suresh Kumar', 'suresh@gmail.com', '9222222222', '2018-07-15'),
('Pooja Sharma', 'pooja@gmail.com', '9333333333', '2020-01-10'),
('Ramesh Patel', 'ramesh@gmail.com', '9444444444', '2017-03-25'),
('Kavita Joshi', 'kavita@gmail.com', '9555555555', '2021-09-05');

INSERT INTO Enrollments (StudentId, ClassId, SubjectId, TeacherId)
VALUES
(1, 1, 1, 1),
(2, 2, 2, 2),
(3, 3, 3, 3),
(4, 4, 4, 4),
(5, 5, 5, 5);

INSERT INTO Attendance (StudentId, AttendanceDate, Status)
VALUES
(1, '2026-02-01', 'Present'),
(2, '2026-02-01', 'Absent'),
(3, '2026-02-01', 'Present'),
(4, '2026-02-01', 'Present'),
(5, '2026-02-01', 'Absent');

INSERT INTO Fees (StudentId, Amount, PaidDate, Status)
VALUES
(1, 15000, '2026-01-10', 'Paid'),
(2, 15000, NULL, 'Pending'),
(3, 15000, '2026-01-15', 'Paid'),
(4, 15000, NULL, 'Pending'),
(5, 15000, '2026-01-20', 'Paid');


SELECT * FROM Classes;
SELECT * FROM Students;
SELECT * FROM Subjects;
SELECT * FROM Teachers;
SELECT * FROM Enrollments;
SELECT * FROM Attendance;
SELECT * FROM Fees;


select * from Teachers where TeacherName = 'Anita Verma';

SELECT * 
FROM Students
WHERE DateOfBirth > '2009-01-01';

SELECT * 
FROM Students
WHERE Gender != 'M';

SELECT * 
FROM Students
WHERE DateOfBirth BETWEEN '2008-01-01' AND '2009-12-31';

SELECT * 
FROM Students
WHERE FirstName LIKE 'R%';

SELECT * 
FROM Teachers
WHERE TeacherId IN (1,3,5);


UPDATE Students
SET Phone = 9999999999
WHERE StudentId = 1;

select * from Students;

UPDATE Students
SET Email = 'priya_new@gmail.com',
    Phone = '9888888888'
WHERE StudentId = 2;

select * from Students;

DELETE FROM Enrollments
WHERE ClassId = 1;

ALTER TABLE Enrollments DROP CONSTRAINT FK_Enroll_Student;
ALTER TABLE Attendance DROP CONSTRAINT FK_Attendance_Student;
ALTER TABLE Fees DROP CONSTRAINT FK_Fees_Student;

ALTER TABLE Enrollments
ADD CONSTRAINT FK_Enroll_Student FOREIGN KEY (StudentId)
REFERENCES Students(StudentId)
ON DELETE CASCADE;

-- Attendance → Students
ALTER TABLE Attendance
ADD CONSTRAINT FK_Attendance_Student FOREIGN KEY (StudentId)
REFERENCES Students(StudentId)
ON DELETE CASCADE;

-- Fees → Students
ALTER TABLE Fees
ADD CONSTRAINT FK_Fees_Student FOREIGN KEY (StudentId)
REFERENCES Students(StudentId)
ON DELETE CASCADE;

ALTER TABLE Enrollments DROP CONSTRAINT FK_Enroll_Class;

ALTER TABLE Enrollments
ADD CONSTRAINT FK_Enroll_Class FOREIGN KEY (ClassId)
REFERENCES Classes(ClassId)
ON DELETE CASCADE;

-- Delete a student
DELETE FROM Students
WHERE StudentId = 1;

SELECT * FROM Enrollments;   -- Rows with StudentId = 1 are gone
SELECT * FROM Attendance;    -- Rows with StudentId = 1 are gone
SELECT * FROM Fees;  



