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

create table if not exists  `global_statistic` (
	user_id binary(16) primary key,
    levels_played int default 0,
    deaths int default 0,
	levels_created smallint default 0,
    total_downloads int default 0,
    total_likes int default 0,
    last_update timestamp default current_timestamp on update current_timestamp,
  
	foreign key (user_id) references `user`(user_id) on delete cascade
);

create table if not exists `starred_levels` (
    level_id binary(16) not null,
    user_id binary(16) not null,

    foreign key (level_id) references `level`(level_id) on delete cascade,
    foreign key (user_id) references `user`(user_id) on delete cascade,

    primary key (level_id, user_id)
);

create table if not exists  `level_statistic` (
	level_id binary(16) primary key,
    likes int default 0,
    deaths int default 0,
    completions  int default 0,
	
    foreign key (level_id) references `level`(level_id) on delete cascade
);

-- View Creation
create view trending_levels as (
	select * 
    from `level`
    natural join `level_statistic` 
    order by likes desc
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

-- could automate for all tables containing a user
create trigger tr_create_user_deps 
after insert
on `game`.user
for each row
insert into `global_statistic`(user_id)
values(NEW.user_id);

create trigger tr_create_level_deps 
after insert
on `game`.level
for each row
insert into `level_statistic`(level_id)
values(NEW.level_id);


-- Data

-- Create Data

INSERT INTO user (username, email, password) VALUES 
("fanzy", "stephan.guingor04@gmail.com", "somehash"),
("juan", "juan.guingor04@gmail.com", "somehash"),
("fred", "fred.guingor04@gmail.com", "somehash"),
("henry", "henry.guingor04@gmail.com", "somehash"),
("alfred", "alf@gmail.com", "somehash"),
("jupi", "jupi.guingor04@gmail.com", "somehash"),
("mei", "mei.guingor04@gmail.com", "somehash"),
("mayweather", "mayweather.guingor04@gmail.com", "somehash"),
("shwartz", "shwartz@gmail.com", "somehash"),
("samailama", "samailama4@gmail.com", "somehash"),
("penelope", "penelope@gmail.com", "somehash"),
("freddy", "freddy@gmail.com", "somehash"),
("wodo", "wodo@gmail.com", "somehash"),
("diego", "deigo@gmail.com", "somehash"),
("fran", "fran@gmail.com", "somehash"),
("felipe", "felipe@gmail.com", "somehash"),
("jaunito", "jaunito@gmail.com", "somehash"),
("elmo", "elmo@gmail.com", "somehash"),
("elmordisko", "elmordisko@gmail.com", "somehash");


INSERT INTO level  (creator_id, name, verified, description)
SELECT user_id, "Some", false, "Description"
FROM user;

INSERT INTO session(user_id, time_editor, time_play, time_other, agent)
select user_id, floor(rand() * 100), floor(rand() * 100), floor(rand() * 100), "mozilla"
from user;

INSERT INTO score(user_id, level_id, session_id)
select 	(select user_id from user limit 1) , (select level_id from level  limit 1) , (select session_id from session  limit 1);

INSERT INTO score(user_id, level_id, session_id, time)
select 	user.user_id, level_id, session_id, round(rand() * 2000)
from user
cross join level
cross join session
limit 500;

update ignore level_statistic set likes = round(rand() * 200000) where likes = 0;

update ignore global_statistic set levels_played = round(rand() * 200000), deaths =round(rand() * 200000), levels_created = round(rand() * 30000), total_downloads =round(rand() * 200000), total_likes = round(rand() * 200000);
