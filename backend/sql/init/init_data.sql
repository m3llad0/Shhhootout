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

INSERT INTO room  (level_id, room_id)
SELECT level_id, floor(rand() * 100)
FROM level;

INSERT INTO object (level_id, object_id, extra_data)
SELECT level_id, floor(rand() * 100), CONV(123, 2, 16)
FROM level;

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