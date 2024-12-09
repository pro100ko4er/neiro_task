create TABLE user(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    password VARCHAR(255),
    credits INTEGER,
    verifyed BOOLEAN,
    pass_code INTEGER,
    role VARCHAR(255)
);


create TABLE messages(
    id SERIAL PRIMARY KEY,
    text VARCHAR,
    time VARCHAR(255),
    type VARCHAR(255),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES user (id)
)

create TABLE token(
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    refreshToken VARCHAR(255),
    deviceId VARCHAR(255),
    device VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user (id)
)