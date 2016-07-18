create table city (
    name varchar(255),
    country varchar(255),
    continent continent_type,
    description varchar(255),
    primary key (name, country)
);


create table user_account(
    username varchar(28),
    email varchar(254) ,
    password password_len,
    first_name varchar(128),
    last_name varchar(128),
    profile_pic varchar(255),
    gender gender_type,
    phone_num phone_num_len,
    city varchar(255),
    country varchar(255),
    date_of_birth date,
    date_joined date ,
    description varchar (255),
    primary key (username),
    foreign key (city, country) references city (name, country)
);


create table admin_account (
    username varchar(28),
    email varchar(254) ,
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


INSERT INTO user_account (username, email, password, first_name, last_name, 
profile_pic, gender, phone_num, city, country, date_of_birth, date_joined, description) 
VALUES ('lakefieldLosers', 'scottyang@mail.utoronto.ca', '12345678', 'scott', 'yang', 
    'null', 'm', '6471223333', 'toronto', 'canada', '20110909', '20130909', 'haha' );

INSERT INTO user_account (username, email, password, first_name, last_name, 
    profile_pic, gender, phone_num, city, country, date_of_birth, date_joined, description) 
VALUES ("hahadasfaha", "sangn2@mail.utoronto.ca", "12345678", "a", "b", 
    "null", "m", "123456789", "toronto", "canada", "20130909", "20130909", "a");