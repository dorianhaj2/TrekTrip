insert into countries(id, name, continent) values (1,'Croatia','Europe');

insert into countries(id, name, continent) values (2, 'Germany', 'Europe');

insert into countries(id, name, continent) values (3, 'Japan', 'Asia');

insert into countries(id, name, continent) values (5, 'China', 'North America');
-- Create table if it doesn't exist
create table if not exists countries (
                                         id int primary key,
                                         name varchar(255),
    continent varchar(255)
    );

-- Insert data
insert into countries (id, name, continent) values (5, 'China', 'Asia');