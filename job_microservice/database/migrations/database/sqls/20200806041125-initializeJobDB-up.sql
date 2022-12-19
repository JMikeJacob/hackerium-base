/* Replace with your SQL commands *//* Replace with your SQL commands */

ALTER DATABASE hackerium_job CHARACTER SET utf8 COLLATE utf8_general_ci;

CREATE TABLE IF NOT EXISTS `hackerium_job`.`job_post` (
    `job_id` VARCHAR(45) NOT NULL,
    `job_name` VARCHAR(45) NOT NULL,
    `type_id` VARCHAR(45) NULL,
    `type` VARCHAR(45) NULL,
    `level_id` VARCHAR(45) NULL,
    `level` VARCHAR(45) NULL,
    `field_id` VARCHAR(45) NULL,
    `field` VARCHAR(45) NULL,
    `company_name` VARCHAR(45) NULL,
    `posted_by_id` VARCHAR(45) NOT NULL,
    `is_open` VARCHAR(45) NULL,
    `job_location` VARCHAR(45) NULL,
    `date_posted` INT NULL,
    `date_deadline` INT NULL,
    `offset` INT(11) NULL,
    PRIMARY KEY (`job_id`),
    INDEX company (posted_by_id, date_posted)
    );

/* Replace with your SQL commands *//* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS `hackerium_job`.`applications` (
  `app_id` VARCHAR(45) NOT NULL,
  `user_id` VARCHAR(45) NOT NULL,
  `job_id` VARCHAR(45) NOT NULL,
  `posted_by_id` VARCHAR(45) NOT NULL,
  `status` VARCHAR(45) NULL,
  `test_id` VARCHAR(45) NULL,
  `date_posted` INT NULL,
  `offset` INT(11) NULL,
  PRIMARY KEY (`app_id`),
  INDEX user (user_id, date_posted),
  INDEX company (posted_by_id, date_posted)
  );

CREATE TABLE IF NOT EXISTS `hackerium_job`.`applications_seeker_employer_testscores` (
    `app_id` VARCHAR(45) NOT NULL,
    `user_id` VARCHAR(45) NULL,
    `status` VARCHAR(45) NULL,
    `date_posted` INT NULL,
    `last_name` VARCHAR(45) NULL,
    `first_name` VARCHAR(45) NULL,
    `job_id` VARCHAR(45) NULL,
    `job_name` VARCHAR(45) NULL,
    `posted_by_id` VARCHAR(45) NULL,
    `company_name` VARCHAR(45) NULL,
    `test_id` VARCHAR(45) NULL,
    `test_title` VARCHAR(255) NULL,
    `test_file_urls` JSON,
    `test_parameters` JSON,
    `script` LONGTEXT NULL,
    `test_taken` VARCHAR(45) NULL,
    `test_score` INT NULL,
    `test_total` INT NULL,
    `test_execution_time` INT NULL,
    `test_duration` INT(20) NULL,
    `test_date_taken` BIGINT(20) NULL,
    `test_output` JSON,
    `offset` INT(11) NULL,
    PRIMARY KEY (`app_id`),
    INDEX userid (user_id, date_posted),
    INDEX companyid (posted_by_id, date_posted)
    );


  