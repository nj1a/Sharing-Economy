INSERT INTO country (name) VALUES('Canada');

INSERT INTO city (country_id, name, continent, description) VALUES(1, 'Toronto', 'North America', 'Best City in the world');

INSERT INTO user_account (username, email, password, first_name, last_name,
    profile_pic, gender, phone_num, city_id, country_id, date_of_birth,
    date_joined, description, is_admin)
VALUES('Bob123', 'bob@email.com', 'abcdef123456', 'Bob', 'Martin',
        './pic.png', 'm', 1234567890, 1, 1, '12/12/1980', '12/12/2014', 'Hi, I am Bob', false);
