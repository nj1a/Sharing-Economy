DROP SCHEMA IF EXISTS wanderland CASCADE;
CREATE SCHEMA wanderland;

SET SEARCH_PATH TO wanderland;

CREATE DOMAIN five_level AS int CHECK (VALUE BETWEEN 1 AND 5);
CREATE DOMAIN password_len AS varchar(128) CHECK (length(value) >= 8);
CREATE DOMAIN phone_num_len AS varchar(15) CHECK (length(value) >= 1);


CREATE TYPE gender_type AS ENUM ('m', 'f', 'o');
CREATE TYPE post_type AS ENUM ('guide', 'buddy');

DROP TABLE IF EXISTS country CASCADE;
CREATE TABLE country (
    country_id SERIAL,
    country_code varchar(2) NOT NULL default '',
    country_name varchar(100) NOT NULL default '',
    primary key (country_id)
);

DROP TABLE IF EXISTS city CASCADE;
create table city (
    city_id SERIAL,
    country_id int,
    name varchar(255),
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
    post_type post_type,
    post_date date,
    way_of_travelling varchar(28),
    travel_start_date date,
    travel_end_date date,
    from_country int,
    from_city int,
    to_country int,
    to_city int,
    description varchar(255),
    title varchar(80),
    travel_type varchar(80),
    partner_requirement text[],
    primary key (post_id),
    foreign key (user_id) references user_account(user_id),
    foreign key (from_country) references country(country_id),
    foreign key (from_city) references city(city_id),
    foreign key (to_country) references country(country_id),
    foreign key (to_city) references city(city_id),
    foreign key (user_id) references user_account(user_id)
);

DROP TABLE IF EXISTS friendship CASCADE;
create table friendship ( 
    first_user_id int,
    second_user_id int,
    primary key (first_user_id, second_user_id),
    foreign key (first_user_id) references user_account(user_id),
    foreign key (second_user_id) references user_account(user_id)
);

CREATE TABLE country (
id serial,
country_code varchar(2) NOT NULL default '',
country_name varchar(100) NOT NULL default '',
PRIMARY KEY (id)
);






INSERT INTO country VALUES (default, 'AF', 'Afghanistan');
INSERT INTO country VALUES (default, 'AL', 'Albania');
INSERT INTO country VALUES (default, 'DZ', 'Algeria');
INSERT INTO country VALUES (default, 'DS', 'American Samoa');
INSERT INTO country VALUES (default, 'AD', 'Andorra');
INSERT INTO country VALUES (default, 'AO', 'Angola');
INSERT INTO country VALUES (default, 'AI', 'Anguilla');
INSERT INTO country VALUES (default, 'AQ', 'Antarctica');
INSERT INTO country VALUES (default, 'AG', 'Antigua and Barbuda');
INSERT INTO country VALUES (default, 'AR', 'Argentina');
INSERT INTO country VALUES (default, 'AM', 'Armenia');
INSERT INTO country VALUES (default, 'AW', 'Aruba');
INSERT INTO country VALUES (default, 'AU', 'Australia');
INSERT INTO country VALUES (default, 'AT', 'Austria');
INSERT INTO country VALUES (default, 'AZ', 'Azerbaijan');
INSERT INTO country VALUES (default, 'BS', 'Bahamas');
INSERT INTO country VALUES (default, 'BH', 'Bahrain');
INSERT INTO country VALUES (default, 'BD', 'Bangladesh');
INSERT INTO country VALUES (default, 'BB', 'Barbados');
INSERT INTO country VALUES (default, 'BY', 'Belarus');
INSERT INTO country VALUES (default, 'BE', 'Belgium');
INSERT INTO country VALUES (default, 'BZ', 'Belize');
INSERT INTO country VALUES (default, 'BJ', 'Benin');
INSERT INTO country VALUES (default, 'BM', 'Bermuda');
INSERT INTO country VALUES (default, 'BT', 'Bhutan');
INSERT INTO country VALUES (default, 'BO', 'Bolivia');
INSERT INTO country VALUES (default, 'BA', 'Bosnia and Herzegovina');
INSERT INTO country VALUES (default, 'BW', 'Botswana');
INSERT INTO country VALUES (default, 'BV', 'Bouvet Island');
INSERT INTO country VALUES (default, 'BR', 'Brazil');
INSERT INTO country VALUES (default, 'IO', 'British Indian Ocean Territory');
INSERT INTO country VALUES (default, 'BN', 'Brunei Darussalam');
INSERT INTO country VALUES (default, 'BG', 'Bulgaria');
INSERT INTO country VALUES (default, 'BF', 'Burkina Faso');
INSERT INTO country VALUES (default, 'BI', 'Burundi');
INSERT INTO country VALUES (default, 'KH', 'Cambodia');
INSERT INTO country VALUES (default, 'CM', 'Cameroon');
INSERT INTO country VALUES (default, 'CA', 'Canada');
INSERT INTO country VALUES (default, 'CV', 'Cape Verde');
INSERT INTO country VALUES (default, 'KY', 'Cayman Islands');
INSERT INTO country VALUES (default, 'CF', 'Central African Republic');
INSERT INTO country VALUES (default, 'TD', 'Chad');
INSERT INTO country VALUES (default, 'CL', 'Chile');
INSERT INTO country VALUES (default, 'CN', 'China');
INSERT INTO country VALUES (default, 'CX', 'Christmas Island');
INSERT INTO country VALUES (default, 'CC', 'Cocos (Keeling) Islands');
INSERT INTO country VALUES (default, 'CO', 'Colombia');
INSERT INTO country VALUES (default, 'KM', 'Comoros');
INSERT INTO country VALUES (default, 'CG', 'Congo');
INSERT INTO country VALUES (default, 'CK', 'Cook Islands');
INSERT INTO country VALUES (default, 'CR', 'Costa Rica');
INSERT INTO country VALUES (default, 'HR', 'Croatia (Hrvatska)');
INSERT INTO country VALUES (default, 'CU', 'Cuba');
INSERT INTO country VALUES (default, 'CY', 'Cyprus');
INSERT INTO country VALUES (default, 'CZ', 'Czech Republic');
INSERT INTO country VALUES (default, 'DK', 'Denmark');
INSERT INTO country VALUES (default, 'DJ', 'Djibouti');
INSERT INTO country VALUES (default, 'DM', 'Dominica');
INSERT INTO country VALUES (default, 'DO', 'Dominican Republic');
INSERT INTO country VALUES (default, 'TP', 'East Timor');
INSERT INTO country VALUES (default, 'EC', 'Ecuador');
INSERT INTO country VALUES (default, 'EG', 'Egypt');
INSERT INTO country VALUES (default, 'SV', 'El Salvador');
INSERT INTO country VALUES (default, 'GQ', 'Equatorial Guinea');
INSERT INTO country VALUES (default, 'ER', 'Eritrea');
INSERT INTO country VALUES (default, 'EE', 'Estonia');
INSERT INTO country VALUES (default, 'ET', 'Ethiopia');
INSERT INTO country VALUES (default, 'FK', 'Falkland Islands (Malvinas)');
INSERT INTO country VALUES (default, 'FO', 'Faroe Islands');
INSERT INTO country VALUES (default, 'FJ', 'Fiji');
INSERT INTO country VALUES (default, 'FI', 'Finland');
INSERT INTO country VALUES (default, 'FR', 'France');
INSERT INTO country VALUES (default, 'FX', 'France, Metropolitan');
INSERT INTO country VALUES (default, 'GF', 'French Guiana');
INSERT INTO country VALUES (default, 'PF', 'French Polynesia');
INSERT INTO country VALUES (default, 'TF', 'French Southern Territories');
INSERT INTO country VALUES (default, 'GA', 'Gabon');
INSERT INTO country VALUES (default, 'GM', 'Gambia');
INSERT INTO country VALUES (default, 'GE', 'Georgia');
INSERT INTO country VALUES (default, 'DE', 'Germany');
INSERT INTO country VALUES (default, 'GH', 'Ghana');
INSERT INTO country VALUES (default, 'GI', 'Gibraltar');
INSERT INTO country VALUES (default, 'GK', 'Guernsey');
INSERT INTO country VALUES (default, 'GR', 'Greece');
INSERT INTO country VALUES (default, 'GL', 'Greenland');
INSERT INTO country VALUES (default, 'GD', 'Grenada');
INSERT INTO country VALUES (default, 'GP', 'Guadeloupe');
INSERT INTO country VALUES (default, 'GU', 'Guam');
INSERT INTO country VALUES (default, 'GT', 'Guatemala');
INSERT INTO country VALUES (default, 'GN', 'Guinea');
INSERT INTO country VALUES (default, 'GW', 'Guinea-Bissau');
INSERT INTO country VALUES (default, 'GY', 'Guyana');
INSERT INTO country VALUES (default, 'HT', 'Haiti');
INSERT INTO country VALUES (default, 'HM', 'Heard and Mc Donald Islands');
INSERT INTO country VALUES (default, 'HN', 'Honduras');
INSERT INTO country VALUES (default, 'HK', 'Hong Kong');
INSERT INTO country VALUES (default, 'HU', 'Hungary');
INSERT INTO country VALUES (default, 'IS', 'Iceland');
INSERT INTO country VALUES (default, 'IN', 'India');
INSERT INTO country VALUES (default, 'IM', 'Isle of Man');
INSERT INTO country VALUES (default, 'ID', 'Indonesia');
INSERT INTO country VALUES (default, 'IR', 'Iran (Islamic Republic of)');
INSERT INTO country VALUES (default, 'IQ', 'Iraq');
INSERT INTO country VALUES (default, 'IE', 'Ireland');
INSERT INTO country VALUES (default, 'IL', 'Israel');
INSERT INTO country VALUES (default, 'IT', 'Italy');
INSERT INTO country VALUES (default, 'CI', 'Ivory Coast');
INSERT INTO country VALUES (default, 'JE', 'Jersey');
INSERT INTO country VALUES (default, 'JM', 'Jamaica');
INSERT INTO country VALUES (default, 'JP', 'Japan');
INSERT INTO country VALUES (default, 'JO', 'Jordan');
INSERT INTO country VALUES (default, 'KZ', 'Kazakhstan');
INSERT INTO country VALUES (default, 'KE', 'Kenya');
INSERT INTO country VALUES (default, 'KI', 'Kiribati');
INSERT INTO country VALUES (default, 'KP', 'Korea, Democratic People''s Republic of');
INSERT INTO country VALUES (default, 'KR', 'Korea, Republic of');
INSERT INTO country VALUES (default, 'XK', 'Kosovo');
INSERT INTO country VALUES (default, 'KW', 'Kuwait');
INSERT INTO country VALUES (default, 'KG', 'Kyrgyzstan');
INSERT INTO country VALUES (default, 'LA', 'Lao People''s Democratic Republic');
INSERT INTO country VALUES (default, 'LV', 'Latvia');
INSERT INTO country VALUES (default, 'LB', 'Lebanon');
INSERT INTO country VALUES (default, 'LS', 'Lesotho');
INSERT INTO country VALUES (default, 'LR', 'Liberia');
INSERT INTO country VALUES (default, 'LY', 'Libyan Arab Jamahiriya');
INSERT INTO country VALUES (default, 'LI', 'Liechtenstein');
INSERT INTO country VALUES (default, 'LT', 'Lithuania');
INSERT INTO country VALUES (default, 'LU', 'Luxembourg');
INSERT INTO country VALUES (default, 'MO', 'Macau');
INSERT INTO country VALUES (default, 'MK', 'Macedonia');
INSERT INTO country VALUES (default, 'MG', 'Madagascar');
INSERT INTO country VALUES (default, 'MW', 'Malawi');
INSERT INTO country VALUES (default, 'MY', 'Malaysia');
INSERT INTO country VALUES (default, 'MV', 'Maldives');
INSERT INTO country VALUES (default, 'ML', 'Mali');
INSERT INTO country VALUES (default, 'MT', 'Malta');
INSERT INTO country VALUES (default, 'MH', 'Marshall Islands');
INSERT INTO country VALUES (default, 'MQ', 'Martinique');
INSERT INTO country VALUES (default, 'MR', 'Mauritania');
INSERT INTO country VALUES (default, 'MU', 'Mauritius');
INSERT INTO country VALUES (default, 'TY', 'Mayotte');
INSERT INTO country VALUES (default, 'MX', 'Mexico');
INSERT INTO country VALUES (default, 'FM', 'Micronesia, Federated States of');
INSERT INTO country VALUES (default, 'MD', 'Moldova, Republic of');
INSERT INTO country VALUES (default, 'MC', 'Monaco');
INSERT INTO country VALUES (default, 'MN', 'Mongolia');
INSERT INTO country VALUES (default, 'ME', 'Montenegro');
INSERT INTO country VALUES (default, 'MS', 'Montserrat');
INSERT INTO country VALUES (default, 'MA', 'Morocco');
INSERT INTO country VALUES (default, 'MZ', 'Mozambique');
INSERT INTO country VALUES (default, 'MM', 'Myanmar');
INSERT INTO country VALUES (default, 'NA', 'Namibia');
INSERT INTO country VALUES (default, 'NR', 'Nauru');
INSERT INTO country VALUES (default, 'NP', 'Nepal');
INSERT INTO country VALUES (default, 'NL', 'Netherlands');
INSERT INTO country VALUES (default, 'AN', 'Netherlands Antilles');
INSERT INTO country VALUES (default, 'NC', 'New Caledonia');
INSERT INTO country VALUES (default, 'NZ', 'New Zealand');
INSERT INTO country VALUES (default, 'NI', 'Nicaragua');
INSERT INTO country VALUES (default, 'NE', 'Niger');
INSERT INTO country VALUES (default, 'NG', 'Nigeria');
INSERT INTO country VALUES (default, 'NU', 'Niue');
INSERT INTO country VALUES (default, 'NF', 'Norfolk Island');
INSERT INTO country VALUES (default, 'MP', 'Northern Mariana Islands');
INSERT INTO country VALUES (default, 'NO', 'Norway');
INSERT INTO country VALUES (default, 'OM', 'Oman');
INSERT INTO country VALUES (default, 'PK', 'Pakistan');
INSERT INTO country VALUES (default, 'PW', 'Palau');
INSERT INTO country VALUES (default, 'PS', 'Palestine');
INSERT INTO country VALUES (default, 'PA', 'Panama');
INSERT INTO country VALUES (default, 'PG', 'Papua New Guinea');
INSERT INTO country VALUES (default, 'PY', 'Paraguay');
INSERT INTO country VALUES (default, 'PE', 'Peru');
INSERT INTO country VALUES (default, 'PH', 'Philippines');
INSERT INTO country VALUES (default, 'PN', 'Pitcairn');
INSERT INTO country VALUES (default, 'PL', 'Poland');
INSERT INTO country VALUES (default, 'PT', 'Portugal');
INSERT INTO country VALUES (default, 'PR', 'Puerto Rico');
INSERT INTO country VALUES (default, 'QA', 'Qatar');
INSERT INTO country VALUES (default, 'RE', 'Reunion');
INSERT INTO country VALUES (default, 'RO', 'Romania');
INSERT INTO country VALUES (default, 'RU', 'Russian Federation');
INSERT INTO country VALUES (default, 'RW', 'Rwanda');
INSERT INTO country VALUES (default, 'KN', 'Saint Kitts and Nevis');
INSERT INTO country VALUES (default, 'LC', 'Saint Lucia');
INSERT INTO country VALUES (default, 'VC', 'Saint Vincent and the Grenadines');
INSERT INTO country VALUES (default, 'WS', 'Samoa');
INSERT INTO country VALUES (default, 'SM', 'San Marino');
INSERT INTO country VALUES (default, 'ST', 'Sao Tome and Principe');
INSERT INTO country VALUES (default, 'SA', 'Saudi Arabia');
INSERT INTO country VALUES (default, 'SN', 'Senegal');
INSERT INTO country VALUES (default, 'RS', 'Serbia');
INSERT INTO country VALUES (default, 'SC', 'Seychelles');
INSERT INTO country VALUES (default, 'SL', 'Sierra Leone');
INSERT INTO country VALUES (default, 'SG', 'Singapore');
INSERT INTO country VALUES (default, 'SK', 'Slovakia');
INSERT INTO country VALUES (default, 'SI', 'Slovenia');
INSERT INTO country VALUES (default, 'SB', 'Solomon Islands');
INSERT INTO country VALUES (default, 'SO', 'Somalia');
INSERT INTO country VALUES (default, 'ZA', 'South Africa');
INSERT INTO country VALUES (default, 'GS', 'South Georgia South Sandwich Islands');
INSERT INTO country VALUES (default, 'ES', 'Spain');
INSERT INTO country VALUES (default, 'LK', 'Sri Lanka');
INSERT INTO country VALUES (default, 'SH', 'St. Helena');
INSERT INTO country VALUES (default, 'PM', 'St. Pierre and Miquelon');
INSERT INTO country VALUES (default, 'SD', 'Sudan');
INSERT INTO country VALUES (default, 'SR', 'Suriname');
INSERT INTO country VALUES (default, 'SJ', 'Svalbard and Jan Mayen Islands');
INSERT INTO country VALUES (default, 'SZ', 'Swaziland');
INSERT INTO country VALUES (default, 'SE', 'Sweden');
INSERT INTO country VALUES (default, 'CH', 'Switzerland');
INSERT INTO country VALUES (default, 'SY', 'Syrian Arab Republic');
INSERT INTO country VALUES (default, 'TW', 'Taiwan');
INSERT INTO country VALUES (default, 'TJ', 'Tajikistan');
INSERT INTO country VALUES (default, 'TZ', 'Tanzania, United Republic of');
INSERT INTO country VALUES (default, 'TH', 'Thailand');
INSERT INTO country VALUES (default, 'TG', 'Togo');
INSERT INTO country VALUES (default, 'TK', 'Tokelau');
INSERT INTO country VALUES (default, 'TO', 'Tonga');
INSERT INTO country VALUES (default, 'TT', 'Trinidad and Tobago');
INSERT INTO country VALUES (default, 'TN', 'Tunisia');
INSERT INTO country VALUES (default, 'TR', 'Turkey');
INSERT INTO country VALUES (default, 'TM', 'Turkmenistan');
INSERT INTO country VALUES (default, 'TC', 'Turks and Caicos Islands');
INSERT INTO country VALUES (default, 'TV', 'Tuvalu');
INSERT INTO country VALUES (default, 'UG', 'Uganda');
INSERT INTO country VALUES (default, 'UA', 'Ukraine');
INSERT INTO country VALUES (default, 'AE', 'United Arab Emirates');
INSERT INTO country VALUES (default, 'GB', 'United Kingdom');
INSERT INTO country VALUES (default, 'US', 'United States');
INSERT INTO country VALUES (default, 'UM', 'United States minor outlying islands');
INSERT INTO country VALUES (default, 'UY', 'Uruguay');
INSERT INTO country VALUES (default, 'UZ', 'Uzbekistan');
INSERT INTO country VALUES (default, 'VU', 'Vanuatu');
INSERT INTO country VALUES (default, 'VA', 'Vatican City State');
INSERT INTO country VALUES (default, 'VE', 'Venezuela');
INSERT INTO country VALUES (default, 'VN', 'Vietnam');
INSERT INTO country VALUES (default, 'VG', 'Virgin Islands (British)');
INSERT INTO country VALUES (default, 'VI', 'Virgin Islands (U.S.)');
INSERT INTO country VALUES (default, 'WF', 'Wallis and Futuna Islands');
INSERT INTO country VALUES (default, 'EH', 'Western Sahara');
INSERT INTO country VALUES (default, 'YE', 'Yemen');
INSERT INTO country VALUES (default, 'YU', 'Yugoslavia');
INSERT INTO country VALUES (default, 'ZR', 'Zaire');
INSERT INTO country VALUES (default, 'ZM', 'Zambia');
INSERT INTO country VALUES (default, 'ZW', 'Zimbabwe');


INSERT INTO city VALUES(default, 1, 'New York', 'Best City in the world');
INSERT INTO city VALUES(default, 2, 'Osaka',  'Best City in the world');
INSERT INTO city VALUES(default, 3, 'Mumbai', 'Best City in the world');
INSERT INTO city VALUES(default, 4, 'Delhi', 'Best City in the world');
INSERT INTO city VALUES(default, 1, 'Lagos', 'Best City in the world');
INSERT INTO city VALUES(default, 2, 'Cairo', 'Best City in the world');
INSERT INTO city VALUES(default, 3, 'Paris', 'Best City in the world');
INSERT INTO city VALUES(default, 10, 'London', 'Best City in the world');
INSERT INTO city VALUES(default, 2, 'Beijing', 'Best City in the world');
INSERT INTO city VALUES(default, 32, 'Karachi', 'Best City in the world');
INSERT INTO city VALUES(default, 33, 'Moscow', 'Best City in the world');
INSERT INTO city VALUES(default, 23, 'Tehran', 'Best City in the world');
INSERT INTO city VALUES(default, 24, 'Lima', 'Best City in the world');
INSERT INTO city VALUES(default, 15, 'Seoul', 'Best City in the world');
INSERT INTO city VALUES(default, 13, 'Delhi', 'Best City in the world');
INSERT INTO city VALUES(default, 50, 'Los Angeles', 'Best City in the world');
INSERT INTO city VALUES(default, 100, 'Chicago', 'Best City in the world');
INSERT INTO city VALUES(default, 123, 'Miami', 'Best City in the world');
INSERT INTO city VALUES(default, 89, 'Madrid', 'Best City in the world');
INSERT INTO city VALUES(default, 78, 'Singapore', 'Best City in the world');
INSERT INTO city VALUES(default, 9, 'Detroit', 'Best City in the world');
INSERT INTO city VALUES(default, 34, 'Washington', 'Best City in the world');
INSERT INTO city VALUES(default, 67, 'Kolkata', 'Best City in the world');
INSERT INTO city VALUES(default, 56, 'Shanghai', 'Best City in the world');
INSERT INTO city VALUES(default, 34, 'Essen', 'Best City in the world');
INSERT INTO city VALUES(default, 54, 'Bogota', 'Best City in the world');
INSERT INTO city VALUES(default, 69, 'Chennai', 'Best City in the world');
INSERT INTO city VALUES(default, 25, 'Lahore', 'Best City in the world');
INSERT INTO city VALUES(default, 94, 'Philadelphia', 'Best City in the world');
INSERT INTO city VALUES(default, 66, 'Houston', 'Best City in the world');
INSERT INTO city VALUES(default, 47, 'Sydney', 'Best City in the world');
INSERT INTO city VALUES(default, 45, 'Berlin', 'Best City in the world');
INSERT INTO city VALUES(default, 88, 'San Franciso', 'Best City in the world');
INSERT INTO city VALUES(default, 111, 'Melbourne', 'Best City in the world');
INSERT INTO city VALUES(default, 124, 'Cape Town', 'Best City in the world');
INSERT INTO city VALUES(default, 49, 'Rome', 'Best City in the world');
INSERT INTO city VALUES(default, 72, 'Ankara', 'Best City in the world');
INSERT INTO city VALUES(default, 75, 'Durban', 'Best City in the world');
INSERT INTO city VALUES(default, 90, 'Porto Alegre', 'Best City in the world');


INSERT INTO user_account VALUES(default, 'Bob123', 'bob@email.com', 'abasg23456', 'Bob', 'Martin',
        'm', 123456789, 1, 1, '12/12/1980', '12/12/2014', 'Hi, I am Bob', false);
INSERT INTO user_account VALUES(default, 'Alice123', 'alice@email.com', 'abasg23456', 'Alice', 'Martin',
        'm', 123456789, 1, 1, '12/12/1980', '12/12/2014', 'Hi, I am Bob', false);
INSERT INTO user_account VALUES(default, 'Mike123', 'mike@email.com', 'abasg23456', 'Mike', 'Martin',
        'm', 123456789, 1, 1, '12/12/1980', '12/12/2014', 'Hi, I am Bob', false);
INSERT INTO user_account VALUES(default, 'Penny123', 'penny@email.com', 'abasg23456', 'Penny', 'Martin',
        'm', 123456789, 1, 1, '12/12/1980', '12/12/2014', 'Hi, I am Bob', false);
INSERT INTO user_account VALUES(default, 'Ken123', 'ken@email.com', 'abasg23456', 'Ken', 'Martin',
        'm', 123456789, 1, 1, '12/12/1980', '12/12/2014', 'Hi, I am Bob', false);
INSERT INTO user_account VALUES(default, 'Mose123', 'mose@email.com', 'abasg23456', 'Mose', 'Martin',
        'm', 123456789, 1, 1, '12/12/1980', '12/12/2014', 'Hi, I am Bob', false);
INSERT INTO user_account VALUES(default, 'Karen123', 'karen@email.com', 'abasg23456', 'Karen', 'Martin',
        'm', 123456789, 1, 1, '12/12/1980', '12/12/2014', 'Hi, I am Bob', false);
INSERT INTO user_account VALUES(default, 'Carol123', 'carol@email.com', 'abasg23456', 'Carol', 'Martin',
        'm', 123456789, 1, 1, '12/12/1980', '12/12/2014', 'Hi, I am Bob', false);
INSERT INTO user_account VALUES(default, 'Lacy123', 'laren@email.com', 'abasg23456', 'Carol', 'Martin',
        'm', 123456789, 1, 1, '12/12/1980', '12/12/2014', 'Hi, I am Bob', false);
INSERT INTO user_account VALUES(default, 'Catherin123', 'catherin@email.com', 'abasg23456', 'Carol', 'Martin',
        'm', 123456789, 1, 1, '12/12/1980', '12/12/2014', 'Hi, I am Bob', false);


INSERT INTO product_post VALUES(default, 1, 'guide', '2014-04-01', 'by plane', '2014-10-02', '2014-10-14');
INSERT INTO product_post VALUES(default, 2, 'guide', '2014-05-02', 'by train', '2014-11-11', '2014-11-04');
INSERT INTO product_post VALUES(default, 3, 'guide', '2014-05-03', 'by plane', '2014-12-01', '2015-01-01');
INSERT INTO product_post VALUES(default, 4, 'buddy', '2014-06-04', 'by plane', '2015-01-01', '2014-01-23');
INSERT INTO product_post VALUES(default, 5, 'guide', '2014-07-05', 'by foot', '2015-02-23', '2014-04-05');
INSERT INTO product_post VALUES(default, 6, 'buddy', '2014-08-06', 'by ferry', '2015-05-01', '2014-06-21');
INSERT INTO product_post VALUES(default, 7, 'guide', '2014-09-07', 'by ferry', '2015-06-03', '2014-08-17');
INSERT INTO product_post VALUES(default, 8, 'buddy', '2015-04-08', 'by plane', '2015-08-30', '2015-09-01');
INSERT INTO product_post VALUES(default, 9, 'guide', '2015-05-09', 'by train', '2015-09-01', '2015-09-18');
INSERT INTO product_post VALUES(default, 10, 'guide', '2015-11-10', 'by plane', '2015-12-25', '2016-01-13');


INSERT INTO friendship VALUES(1, 1);
INSERT INTO friendship VALUES(1, 2);
INSERT INTO friendship VALUES(1, 3);
INSERT INTO friendship VALUES(1, 4);
INSERT INTO friendship VALUES(1, 5);
INSERT INTO friendship VALUES(1, 6);
INSERT INTO friendship VALUES(1, 7);
INSERT INTO friendship VALUES(1, 8);
INSERT INTO friendship VALUES(1, 9);
INSERT INTO friendship VALUES(2, 1);
INSERT INTO friendship VALUES(2, 2);
INSERT INTO friendship VALUES(2, 3);
INSERT INTO friendship VALUES(2, 4);
INSERT INTO friendship VALUES(2, 5);
INSERT INTO friendship VALUES(3, 1);
INSERT INTO friendship VALUES(4, 6);
INSERT INTO friendship VALUES(6, 5);

