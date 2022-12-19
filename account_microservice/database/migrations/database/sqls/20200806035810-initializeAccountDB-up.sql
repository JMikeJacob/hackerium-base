/* Replace with your SQL commands *//* Replace with your SQL commands */
CREATE DATABASE IF NOT EXISTS `hackerium_account`;


CREATE TABLE IF NOT EXISTS `hackerium_account`.`seeker_accounts` (
  `user_id` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NULL,
  `first_name` VARCHAR(45) NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `type` VARCHAR(45) NULL,
  `offset` INT(11) NULL,
  PRIMARY KEY (`user_id`),
  INDEX `login` (email, password)
);

CREATE TABLE IF NOT EXISTS `hackerium_account`.`recruiters` (
  `user_id` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `company` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NULL,
  `first_name` VARCHAR(45) NULL,
  `contact` INT(11) NULL,
  `type` VARCHAR(45) NULL,
  `company_pic_url` VARCHAR(500) NULL,
  `offset` INT(11) NULL,
  PRIMARY KEY (`user_id`),
  INDEX `login` (email, password),
  INDEX `company` (company)
  );

CREATE TABLE IF NOT EXISTS `hackerium_account`.`seeker_tags` (
  `user_id` VARCHAR(45) NOT NULL,
  `tag` VARCHAR(45) NULL,
  `tag_type` VARCHAR(45) NULL,
  PRIMARY KEY (`user_id`)
);