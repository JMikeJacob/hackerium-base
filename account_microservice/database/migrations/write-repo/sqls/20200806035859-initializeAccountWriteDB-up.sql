/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS `account_write`.`seeker` (
    `email` VARCHAR(255),
    `user_id` VARCHAR(255),
    `aggregate_id` VARCHAR(255),
    PRIMARY KEY (`email`),
    INDEX (`user_id`)
);

CREATE TABLE IF NOT EXISTS `account_write`.`company` (
    `email` VARCHAR(255),
    `company` VARCHAR(255),
    `user_id` VARCHAR(255),
    `aggregate_id` VARCHAR(255),
    PRIMARY KEY (`email`, `company`),
    INDEX (`user_id`)
);