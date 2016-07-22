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

DROP TABLE IF EXISTS country CASCADE;
CREATE TABLE country (
    country_id SERIAL,
    name varchar(255),
    primary key (country_id)
);

DROP TABLE IF EXISTS city CASCADE;
create table city (
    city_id SERIAL,
    country_id int,
    name varchar(255),
    continent continent_type,
    description varchar(255),
    primary key (city_id),
    foreign key (country_id) references country(country_id)
);


DROP TABLE IF EXISTS user_account CASCADE;
create table user_account(
    user_id SERIAL,
    username varchar(28),
    email varchar(254) check (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    password password_len,
    first_name varchar(128),
    last_name varchar(128),
    profile_pic varchar(255),
    gender gender_type,
    phone_num phone_num_len,
    city_id int,
    country_id int,
    date_of_birth date,
    date_joined date check (date_joined > date_of_birth),
    description varchar (255),
    is_admin boolean,
    primary key (user_id),
    foreign key (city_id) references city (city_id),
    foreign key (country_id) references country (country_id),
    UNIQUE(username),
    UNIQUE(email)
);


DROP view IF EXISTS admin_account CASCADE;
create view admin_account as
    select * from user_account where is_admin = TRUE;

DROP TABLE IF EXISTS city_rating CASCADE;
create table city_rating (
    city_id SERIAL,
    user_id int,
    country_id int,
    rating five_level,
    comments varchar(255),
    date_rated date,
    primary key (user_id, city_id, country_id),
    foreign key (user_id) references user_account(user_id),
    foreign key (city_id) references city (city_id),
    foreign key (country_id) references country (country_id)
);

DROP TABLE IF EXISTS user_rating CASCADE;
create table user_rating (
    username_to_id int,
    username_from_id int,
    type post_type,
    rating five_level,
    comments varchar(255),
    date_rated date,
    primary key (username_to_id, username_from_id, type),
    foreign key (username_to_id) references user_account(user_id),
    foreign key (username_from_id) references user_account(user_id)
);

DROP TABLE IF EXISTS product_post CASCADE;
create table product_post (
    post_id SERIAL,
    user_id int,
    type post_type,
    post_date date,
    way_of_travelling varchar(28),
    travel_start_date date,
    travel_end_date date,
    primary key (post_id),
    foreign key (user_id) references user_account(user_id)
);
