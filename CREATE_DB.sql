DROP DATABASE IF EXISTS sbldb;
CREATE DATABASE sbldb;

USE sbldb;

CREATE TABLE rubrics (
	id INT NOT NULL AUTO_INCREMENT,
	unique_id VARCHAR(255) NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE category (
	id INT NOT NULL AUTO_INCREMENT,
	rubric_id INT NOT NULL,
	FOREIGN KEY (`rubric_id`) REFERENCES rubrics (`id`),
	PRIMARY KEY(id)
);

CREATE TABLE response (
	id INT NOT NULL AUTO_INCREMENT,
	rubric_id INT NOT NULL,
	FOREIGN KEY (`rubric_id`) REFERENCES rubrics (`id`),
	PRIMARY KEY(id)
);

CREATE TABLE results (
	id INT NOT NULL AUTO_INCREMENT,
	response_id INT NOT NULL,
	category_id INT NOT NULL,
	value INT(32),
	FOREIGN KEY(`response_id`) REFERENCES response (`id`),
	FOREIGN KEY(`category_id`) REFERENCES category (`id`),
	PRIMARY KEY(id)
);