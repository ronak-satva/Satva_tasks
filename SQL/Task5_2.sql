-- Given fields are Student ID, Name, Age, Gender, Address, Email, Phone Number,
--Course ID, Course Name, Instructor, Credit Hours, Grade.
--What’s wrong with this?

--One row can repeat student info for every course.

--Course details repeat for every student.

--Instructor info repeats for every course.

--Causes data redundancy, update anomalies, and inconsistency.


--Assumptions Made

-- 1) Each student has:
-- 2)One unique Student ID
-- 3)One email address
-- 4)One phone number
-- 5)Each course has:
--6)One unique Course ID
--7)A single instructor
--8)An instructor can teach multiple courses.
--9)A student can enroll in multiple courses.
--10)A grade is assigned per student per course.
--11)Instructor details are limited to Instructor ID and Instructor Name.

--Entities Identified

	--Student

	--Course

    --Instructor

     --Enrollment

-- 1NF :- Atomic values (no multi-valued fields)
		--No repeating groups

-- 2NF :- Must be in 1NF
--		  No partial dependency on a composite key

--STUDENT
--      StudentID → Name, Age, Gender, Address, Email, Phone

--COURSE
--      CourseID → CourseName, CreditHours, Instructor

--ENROLLMENT
--      StudentID + CourseID → Grade

-- 3NF :- Must be in 2NF
--		  No transitive dependency

--        CourseID → Instructor
--		  Instructor → InstructorName

CREATE TABLE Student (
    StudentID INT PRIMARY KEY,
    Name VARCHAR(100),
    Age INT,
    Gender VARCHAR(10),
    Address VARCHAR(255),
    Email VARCHAR(100) UNIQUE,
    PhoneNumber VARCHAR(15)
);

CREATE TABLE Instructor (
    InstructorID INT PRIMARY KEY,
    InstructorName VARCHAR(100)
);

CREATE TABLE Course (
    CourseID INT PRIMARY KEY,
    CourseName VARCHAR(100),
    CreditHours INT,
    InstructorID INT,
    FOREIGN KEY (InstructorID) REFERENCES Instructor(InstructorID)
);

CREATE TABLE Enrollment (
    StudentID INT,
    CourseID INT,
    Grade CHAR(2),
    PRIMARY KEY (StudentID, CourseID),
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID),
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID)
);