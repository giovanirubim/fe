CREATE DATABASE IF NOT EXISTS mydb;

CREATE TABLE IF NOT EXISTS mydb.User (
	id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(45) NOT NULL,
	password VARCHAR(45) NOT NULL,
	PRIMARY KEY (id),
	UNIQUE INDEX id_UNIQUE (id ASC),
	UNIQUE INDEX name_UNIQUE (name ASC)
);