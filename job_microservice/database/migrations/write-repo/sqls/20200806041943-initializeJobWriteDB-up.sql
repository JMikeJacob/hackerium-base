/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS `job_write`.`job` (
    `job_id` VARCHAR(255),
    `company_id` VARCHAR(255),
    `aggregate_id` VARCHAR(255),
    PRIMARY KEY (`job_id`),
    INDEX (`company_id`)
);

/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS `job_write`.`seeker` (
    `email` VARCHAR(255),
    `user_id` VARCHAR(255),
    `aggregate_id` VARCHAR(255),
    PRIMARY KEY (`email`),
    INDEX (`user_id`)
);

CREATE TABLE IF NOT EXISTS `job_write`.`company` (
    `email` VARCHAR(255),
    `company` VARCHAR(255),
    `user_id` VARCHAR(255),
    `aggregate_id` VARCHAR(255),
    PRIMARY KEY (`email`, `company`),
    INDEX (`user_id`)
);

CREATE TABLE IF NOT EXISTS `job_write`.`job` (
    `job_id` VARCHAR(255),
    `company_id` VARCHAR(255),
    `aggregate_id` VARCHAR(255),
    PRIMARY KEY (`job_id`),
    INDEX (`company_id`)
);

CREATE TABLE IF NOT EXISTS `job_write`.`applications` (
    `aggregate_id` VARCHAR(255),
    `job_id` VARCHAR(255),
    `user_id` VARCHAR(255),
    PRIMARY KEY(`aggregate_id`),
    INDEX(`job_id`, `user_id`)
)