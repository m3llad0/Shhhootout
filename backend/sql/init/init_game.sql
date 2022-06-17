create schema game;

use game;


-- Table creation

-- create table if not exists  `activation_token` (
-- 	token_id varchar(255) primary key,
--     user_id varchar(20) NOT NULL unique,
--     expire_date datetime NOT NULL
-- );

create table if not exists  `user` (
	user_id binary(16) primary key default (UUID_TO_BIN(UUID())),
    username varchar(20) NOT NULL unique,
    password varchar(255) NOT NULL,
    -- password varchar(255) NOT NULL
    email varchar(255) unique NOT NULL
    -- active boolean default false
);

create table if not exists  `level` (
	level_id binary(16) primary key unique default (UUID_TO_BIN(UUID())),
    creator_id binary(16),
    name varchar(20),
    verified bool default false,
    description text,
    level_data json,
    update_date datetime default NOW(),
    create_date datetime default NOW(),
    
	foreign key (creator_id) references `user`(user_id)
);

create table if not exists  `session` (
	session_id binary(16) primary key default (UUID_TO_BIN(UUID())),
	user_id binary(16),
    time_editor int default 0,
	time_play int default 0,
    time_other int default 0,
	start_date  timestamp default current_timestamp,
	end_date   timestamp default current_timestamp on update current_timestamp,
    agent text,
    
    foreign key (user_id) references `user`(user_id) on delete cascade
);

create table if not exists   `score` (
	score_id binary(16) primary key default (UUID_TO_BIN(UUID())),
	user_id binary(16),
	level_id binary(16),
    session_id binary(16),
    `time` int default 0,
	completed bool default false,
	`date` timestamp default current_timestamp,
    
    foreign key (user_id) references `user`(user_id) on delete cascade,
	foreign key (level_id) references `level`(level_id) on delete cascade,
	foreign key (session_id) references `session`(session_id)
);

create table if not exists `user_level_interaction` (
    level_id binary(16) not null,
    user_id binary(16) not null,
    `like` bool default false,
    completed bool default false,


    foreign key (level_id) references `level`(level_id) on delete cascade,
    foreign key (user_id) references `user`(user_id) on delete cascade,

    primary key (level_id, user_id)
);


DELIMITER //

CREATE PROCEDURE GetUserGlobalStatistic (IN user varchar(20)) 
BEGIN

    DECLARE levels_played,deaths,total_time_played,levels_created INT;
   
    select count(DISTINCT score.level_id)
    into levels_played
    from `score`
    join user on score.user_id=user.user_id
    where user.username=user;

    select count(*)
    into deaths
    from `score`
    join user on score.user_id=user.user_id
    where user.username=user and completed=false;

    select COALESCE(sum(time_play),0)
    into total_time_played
    from `session`
    join user on session.user_id=user.user_id
    where user.username=user;

    select count(*)
    into levels_created
    from `level`
    join user on level.creator_id=user.user_id
    where user.username=user;

    select levels_played, deaths, total_time_played, levels_created;

END // 


create procedure GetLevelStatistics (IN level binary(16))
begin
    select count(IF(completed = true, 1, 0)) as completions, count(IF(completed = false, 0, 1)) as deaths, COALESCE(min(time),-1) as highscore
    from `score`
    where level_id=level;

end // 

CREATE PROCEDURE ValidateUser(
	IN username VARCHAR(20),
	IN email VARCHAR(255)
)
DETERMINISTIC
NO SQL
BEGIN
	IF CHAR_LENGTH(username) <  5 THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Username must be at least 5 characters';
	END IF;
	IF NOT (SELECT email REGEXP '$[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$') THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Wrong email';
	END IF;
END//

CREATE PROCEDURE ValidateLevel(
	IN lname VARCHAR(20)
)
DETERMINISTIC
NO SQL
BEGIN
	IF CHAR_LENGTH(lname) < 2 THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Name must be at least 2 characters';
	END IF;
END//

DELIMITER ;

-- View Creation
create view trending_levels as (
select BIN_TO_UUID(level.level_id) as level_id,BIN_TO_UUID(level.creator_id) as creator_id, level.name,level.description, level.verified , SUM(user_level_interaction.like) as likes 
from level 
join user_level_interaction on level.level_id=user_level_interaction.level_id
group by level.level_id 
limit 10
);

create view user_level_statistics as (
select score.level_id, COALESCE(highscore, 0) as highscore, `name`, COUNT(score.score_id) as times_played, SUM(score.completed) as completed,  (COUNT(score.completed) - SUM(score.completed)) as deaths
    from `level`
	natural join score 
    left join (
		select level_id, min(time) as highscore
		from score
		where completed = true
		group by user_id
    ) as sub
    on score.level_id=sub.level_id
    group by user_id
);

-- Triggers  

CREATE TRIGGER validate_user_tr
BEFORE UPDATE ON user FOR EACH ROW
CALL ValidateUser(NEW.username, NEW.email);

CREATE TRIGGER validate_level_tr
BEFORE UPDATE ON level FOR EACH ROW
CALL ValidateLevel(NEW.name);

-- Data

-- Create Data

-- INSERT INTO user (username, email, password) VALUES 
-- ("fanzy", "stephan.guingor04@gmail.com", "somehash"),
-- ("juan", "juan.guingor04@gmail.com", "somehash"),
-- ("fred", "fred.guingor04@gmail.com", "somehash"),
-- ("henry", "henry.guingor04@gmail.com", "somehash"),
-- ("alfred", "alf@gmail.com", "somehash"),
-- ("jupi", "jupi.guingor04@gmail.com", "somehash"),
-- ("mei", "mei.guingor04@gmail.com", "somehash"),
-- ("mayweather", "mayweather.guingor04@gmail.com", "somehash"),
-- ("shwartz", "shwartz@gmail.com", "somehash"),
-- ("samailama", "samailama4@gmail.com", "somehash"),
-- ("penelope", "penelope@gmail.com", "somehash"),
-- ("freddy", "freddy@gmail.com", "somehash"),
-- ("wodo", "wodo@gmail.com", "somehash"),
-- ("diego", "deigo@gmail.com", "somehash"),
-- ("fran", "fran@gmail.com", "somehash"),
-- ("felipe", "felipe@gmail.com", "somehash"),
-- ("jaunito", "jaunito@gmail.com", "somehash"),
-- ("elmo", "elmo@gmail.com", "somehash"),
-- ("elmordisko", "elmordisko@gmail.com", "somehash");


-- INSERT INTO level  (creator_id, name, verified, description)
-- SELECT user_id, "Some", false, "Description"
-- FROM user;

-- INSERT INTO user_level_interaction(user_id, level_id, `like`, completed)
-- select 	user.user_id, level_id, true, true
-- from user
-- cross join level
-- limit 500;

-- INSERT INTO session(user_id, time_editor, time_play, time_other, agent)
-- select user_id, floor(rand() * 100), floor(rand() * 100), floor(rand() * 100), "mozilla"
-- from user;

-- INSERT INTO score(user_id, level_id, session_id)
-- select 	(select user_id from user limit 1) , (select level_id from level  limit 1) , (select session_id from session  limit 1);

-- INSERT INTO score(user_id, level_id, session_id, time)
-- select 	user.user_id, level_id, session_id, round(rand() * 2000)
-- from user
-- cross join level
-- cross join session
-- limit 500;

-- update ignore level_statistic set likes = round(rand() * 200000) where likes = 0;

-- update ignore global_statistic set levels_played = round(rand() * 200000), deaths =round(rand() * 200000), levels_created = round(rand() * 30000), total_downloads =round(rand() * 200000), total_likes = round(rand() * 200000);
