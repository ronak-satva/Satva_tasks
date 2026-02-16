
CREATE TABLE Teams (
    team_id SERIAL PRIMARY KEY,
    team_name VARCHAR(100) UNIQUE NOT NULL,
    city VARCHAR(100) NOT NULL,
    founded_date DATE
);

CREATE TYPE player_role AS ENUM
('Batsman', 'Bowler', 'AllRounder', 'WicketKeeper');

CREATE TABLE Players (
    player_id SERIAL PRIMARY KEY,
    player_name VARCHAR(100) NOT NULL,
    age INT CHECK (age > 15),
    role player_role,
    team_id INT,
    joining_date DATE DEFAULT CURRENT_DATE,

    FOREIGN KEY (team_id)
        REFERENCES Teams(team_id)
        ON DELETE SET NULL
);

CREATE TABLE Coaches (
    coach_id SERIAL PRIMARY KEY,
    coach_name VARCHAR(100) NOT NULL,
    experience_years INT CHECK (experience_years >= 0),
    role VARCHAR(50),
    nationality VARCHAR(50),
    team_id INT,   -- ❗ Removed NOT NULL

    FOREIGN KEY (team_id)
        REFERENCES Teams(team_id)
        ON DELETE SET NULL
);

CREATE TABLE Venues (
    venue_id SERIAL PRIMARY KEY,
    venue_name VARCHAR(100) UNIQUE NOT NULL,
    city VARCHAR(100),
    capacity INT CHECK (capacity > 0)
);

CREATE TABLE Matches (
    match_id SERIAL PRIMARY KEY,
    match_date TIMESTAMP NOT NULL,
    venue_id INT NOT NULL,
    team1_id INT NOT NULL,
    team2_id INT NOT NULL,
    winner_team_id INT,

    CONSTRAINT unique_venue_datetime
        UNIQUE (venue_id, match_date),

    CONSTRAINT different_teams
        CHECK (team1_id <> team2_id),

    FOREIGN KEY (venue_id)
        REFERENCES Venues(venue_id)
        ON DELETE CASCADE,

    FOREIGN KEY (team1_id)
        REFERENCES Teams(team_id)
        ON DELETE CASCADE,

    FOREIGN KEY (team2_id)
        REFERENCES Teams(team_id)
        ON DELETE CASCADE,

    FOREIGN KEY (winner_team_id)
        REFERENCES Teams(team_id)
        ON DELETE SET NULL
);

CREATE TABLE Player_Performance (
    performance_id SERIAL PRIMARY KEY,
    match_id INT NOT NULL,
    player_id INT NOT NULL,
    runs_scored INT DEFAULT 0 CHECK (runs_scored >= 0),
    wickets_taken INT DEFAULT 0 CHECK (wickets_taken >= 0),
    catches INT DEFAULT 0 CHECK (catches >= 0),

    FOREIGN KEY (match_id)
        REFERENCES Matches(match_id)
        ON DELETE CASCADE,

    FOREIGN KEY (player_id)
        REFERENCES Players(player_id)
        ON DELETE CASCADE
);

INSERT INTO Teams (team_name, city, founded_date) VALUES
('Mumbai Indians', 'Mumbai', '2010-03-15'),
('Delhi Capitals', 'Delhi', '2012-06-20'),
('RCB', 'Bangalore', '2015-01-10'),
('CSK', 'Chennai', '2018-09-05');
INSERT INTO Teams (team_name, city, founded_date) VALUES
('Sunrises Hyderadabad', 'Hyderadabad', '2010-04-18'),
('Gujarat Titans', 'Gujarat', '2021-06-20');

select * from Teams;

INSERT INTO Coaches (coach_name, experience_years, role, nationality, team_id) VALUES
('Rahul Dravid', 12, 'Head Coach', 'India', 1),
('Steve Smith', 8, 'Assistant Coach', 'Australia', 1),
('David Warner', 10, 'Head Coach', 'Australia', 2),
('Shreyas Iyer', 6, 'Assistant Coach', 'India', 2),
('Michael Clarke', 15, 'Head Coach', 'Australia', 3),
('Anil Kumble', 18, 'Head Coach', 'India', 4);

select * from Coaches;

INSERT INTO Players (player_name, age, role, team_id) VALUES
('Rohit Sharma', 35, 'Batsman', 1),
('Hardik Pandya', 30, 'AllRounder', 1),
('Jasprit Bumrah', 29, 'Bowler', 1),
INSERT INTO Players (player_name, age, role, team_id) VALUES('Ryan Rickelton', 33,'WicketKeeper',1);

('Shikhar Dhawan', 34, 'Batsman', 2),
('Rishabh Pant', 26, 'WicketKeeper', 2),
('Kuldeep Yadav', 28, 'Bowler', 2),

('Virat Kohli', 34, 'Batsman', 3),
('AB de Villiers', 38, 'Batsman', 3),
INSERT INTO Players (player_name, age, role, team_id) VALUES('Yash Dayal', 28, 'Bowler', 3),
('Jitesh Sharma', 26, 'WicketKeeper', 3);

('MS Dhoni', 41, 'WicketKeeper', 4),
('Ravindra Jadeja', 33, 'AllRounder', 4);
INSERT INTO Players (player_name, age, role, team_id) VALUES('Ayush Mhatre', 19, 'Batsman', 4),
('Ashwin', 28, 'Bowler', 4);

select * from Players;

INSERT INTO Venues (venue_name, city, capacity) VALUES
('Wankhede Stadium', 'Mumbai', 33000),
('Arun Jaitley Stadium', 'Delhi', 41000),
('Chinnaswamy Stadium', 'Bangalore', 38000);

select * from Venues;

INSERT INTO Matches (match_date, venue_id, team1_id, team2_id, winner_team_id) VALUES
('2026-03-01 18:00:00', 1, 1, 2, 1),
('2026-03-02 19:00:00', 2, 2, 3, 3),
('2026-03-03 18:30:00', 3, 3, 4, 4),
('2026-03-04 20:00:00', 1, 1, 3, 3);

select * from Matches;

-- Match 1

INSERT INTO Player_Performance 
(match_id, player_id, runs_scored, wickets_taken, catches) VALUES
(1, 1, 85, 0, 1),   -- Rohit
(1, 2, 40, 2, 0),   -- Hardik
(1, 3, 12, 3, 0),   -- Bumrah
(1, 4, 25, 0, 1),   -- Ryan

(1, 5, 70, 0, 0),   -- Dhawan
(1, 6, 30, 0, 1),   -- Pant
(1, 7, 15, 2, 0);   -- Kuldeep

-- MAtch 2

INSERT INTO Player_Performance 
(match_id, player_id, runs_scored, wickets_taken, catches) VALUES
(2, 5, 60, 0, 0),
(2, 6, 45, 0, 0),
(2, 7, 10, 2, 1),

(2, 8, 95, 0, 0),
(2, 9, 55, 0, 1),
(2, 10, 5, 3, 0),
(2, 11, 35, 0, 1);

-- Match 3

INSERT INTO Player_Performance 
(match_id, player_id, runs_scored, wickets_taken, catches) VALUES
(3, 8, 70, 0, 0),
(3, 9, 65, 0, 1),
(3, 10, 8, 2, 0),
(3, 11, 40, 0, 0),

(3, 12, 75, 0, 1),
(3, 13, 35, 1, 0),
(3, 14, 22, 0, 0),
(3, 15, 18, 2, 0);

-- Match 4

INSERT INTO Player_Performance 
(match_id, player_id, runs_scored, wickets_taken, catches) VALUES
(4, 1, 60, 0, 0),
(4, 2, 35, 1, 0),
(4, 3, 5, 2, 0),
(4, 4, 28, 0, 1),

(4, 8, 110, 0, 1),
(4, 9, 50, 0, 0),
(4, 10, 12, 3, 0),
(4, 11, 20, 0, 1);

select * from Player_Performance;

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'teams';

-- 1 List Players with Their Team Name

select ply.player_id, ply.player_name, tm.team_name
from teams tm 
join players ply on tm.team_id = ply.team_id;

--2  Show All Teams and Their Players (Even If No Players)

select tm.team_name, ply.player_name
from teams tm
left join players ply on tm.team_id = ply.team_id;

--3 Show All Teams and Coaches

Show All
