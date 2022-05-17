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
    -- password varchar(255) NOT NULL
    email varchar(255) unique
    -- active boolean default false
);

create table if not exists  `level` (
	level_id binary(16) primary key default (UUID_TO_BIN(UUID())),
    creator_id binary(16),
    name varchar(20),
    verified bool default false,
    description text,
    update_date datetime default NOW(),
    create_date datetime default NOW(),
    
	foreign key (creator_id) references `user`(user_id)
);

create table if not exists  `room` (
	id binary(16) primary key default (UUID_TO_BIN(UUID())),
	level_id binary(16),
    room_id tinyint NOT NULL,
	x float4 NOT NULL,
    y float4 NOT NULL,
    
    foreign key (level_id) references `level`(level_id) on delete cascade
);

create table if not exists  `object` (
	id binary(16) primary key default (UUID_TO_BIN(UUID())),
	level_id binary(16),
    object_id tinyint NOT NULL,
	x float4 NOT NULL,
    y float4 NOT NULL,
	extra_data  binary(32),
    
    foreign key (level_id) references `level`(level_id) on delete cascade
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


-- Stored Procedures as an example (we want the buisiness logic on the backend)
create procedure SelectAllUsers()
comment "Selects all users"
select * from `user`;

create procedure GetUserStatistics( IN id binary(16) )
comment "Gets user statistics based on its user_id"
select * from user_level_statistics where user_id=id;


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



-- Create Data

INSERT INTO user (username, email) VALUES ("fanzy", "stephan.guingor04@gmail.com");