DROP DATABASE IF EXISTS sbldb;
CREATE DATABASE sbldb;

USE sbldb;

CREATE TABLE rubrics (
	id INT NOT NULL AUTO_INCREMENT,
	title VARCHAR(255) NOT NULL,
	unique_id VARCHAR(255) NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE category (
	id INT NOT NULL AUTO_INCREMENT,
	rubric_id INT NOT NULL,
	standard VARCHAR(255) NOT NULL,
	level_one MEDIUMTEXT NOT NULL,
	level_two MEDIUMTEXT NOT NULL,
	level_three MEDIUMTEXT NOT NULL,
	level_four MEDIUMTEXT NOT NULL,
	FOREIGN KEY (`rubric_id`) REFERENCES rubrics (`id`),
	PRIMARY KEY(id)
);

CREATE TABLE response (
	id CHAR(36) NOT NULL,
	rubric_id INT NOT NULL,
	FOREIGN KEY (`rubric_id`) REFERENCES rubrics (`id`),
	PRIMARY KEY(id)
);

CREATE TABLE results (
	id INT NOT NULL AUTO_INCREMENT,
	response_id CHAR(36) NOT NULL,
	category_id INT NOT NULL,
	value INT(32),
	FOREIGN KEY(`response_id`) REFERENCES response (`id`),
	FOREIGN KEY(`category_id`) REFERENCES category (`id`),
	PRIMARY KEY(id)
);