DROP SCHEMA IF EXISTS wanderland CASCADE;
CREATE SCHEMA wanderland;

SET SEARCH_PATH TO wanderland;

CREATE DOMAIN five_level AS int CHECK (VALUE BETWEEN 1 AND 5);
CREATE DOMAIN password_len AS varchar(128) CHECK (length(value) >= 8);
CREATE DOMAIN phone_num_len AS varchar(15) CHECK (length(value) >= 1);


CREATE TYPE gender_type AS ENUM ('m', 'f', 'o');
CREATE TYPE post_type AS ENUM ('guide', 'buddy');
CREATE TYPE continent_type AS ENUM('Asia', 'Africa', 'North America',
                                    'South America', 'Antarctica',
                                    'Europe', 'Oceania');
DROP TABLE IF EXISTS city CASCADE;
create table city (
    name varchar(255),
    country varchar(255),
    continent continent_type,
    description varchar(255),
    primary key (name, country)
);

DROP TABLE IF EXISTS user_account CASCADE;
create table user_account(
    username varchar(28),
    email varchar(254) check (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    password password_len,
    first_name varchar(128),
    last_name varchar(128),
    profile_pic varchar(255),
    gender gender_type,
    phone_num phone_num_len,
    city varchar(255),
    country varchar(255),
    date_of_birth date,
    date_joined date check (date_joined > date_of_birth),
    description varchar (255),
    primary key (username),
    foreign key (city, country) references city (name, country)
);

DROP TABLE IF EXISTS admin_account CASCADE;
create table admin_account (
    username varchar(28),
    email varchar(254) check (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    password password_len,
    first_name varchar(128),
    last_name varchar(128),
    profile_pic varchar(255),
    gender gender_type,
    phone_num phone_num_len,
    city varchar(255),
    country varchar(255),
    date_of_birth date,
    date_joined date check (date_joined > date_of_birth),
    description varchar (255),
    primary key (username),
    foreign key (city, country) references city (name, country)
);

DROP TABLE IF EXISTS city_rating CASCADE;
create table city_rating (
    username varchar(28),
    city_name varchar(255),
    country varchar(255),
    rating five_level,
    comments varchar(255),
    date_rated date,
    primary key (username, city_name, country),
    foreign key (username) references user_account(username),
    foreign key (city_name, country) references city(name, country)
);

DROP TABLE IF EXISTS user_rating CASCADE;
create table user_rating (
    username_to varchar(28),
    username_from varchar(28),
    type post_type,
    rating five_level,
    comments varchar(255),
    date_rated date,
    primary key (username_to, username_from, type),
    foreign key (username_to) references user_account(username),
    foreign key (username_from) references user_account(username)
);

DROP TABLE IF EXISTS product_post CASCADE;
create table product_post (
    post_id int,
    username varchar(28),
    type post_type,
    post_date date,
    way_of_travelling varchar(28),
    travel_start_date date,
    travel_end_date date,
    primary key (post_id),
    foreign key (username) references user_account(username)
);

INSERT INTO city (name, country, continent, description) VALUES ('toronto', 'canada', 'North America', 'haha');

INSERT INTO user_account (username, email, password, first_name, last_name, 
    profile_pic, gender, phone_num, city, country, date_of_birth, date_joined, description) 
    VALUES ('tcsbears', 'sang.ahn@mail.utoronto.ca', '12345678', 'Sang Jun', 'Ahn', 
        'null', 'm', '6472223333', 'toronto', 'canada', '20130909', '20160909', 'haha' );

