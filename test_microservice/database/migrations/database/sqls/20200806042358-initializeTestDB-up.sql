/* Replace with your SQL commands *//* Replace with your SQL commands */
  ALTER DATABASE hackerium_test CHARACTER SET utf8 COLLATE utf8_general_ci;
  CREATE TABLE IF NOT EXISTS `hackerium_test`.`tests` (
    `test_id` VARCHAR(45) NOT NULL,
    `test_title` VARCHAR(45) NULL,
    `test_total` INT NOT NULL,
    `test_difficulty` VARCHAR(45) NULL,
    `company_id` VARCHAR(45) NOT NULL,
    `company_name` VARCHAR(45) NOT NULL,
    `test_execution_time` INT(20) NULL,
    `test_file_urls` JSON,
    `test_parameters` JSON,
    `test_boilerplate` LONGTEXT NULL,
    `created_at` BIGINT(20),
    `updated_at` BIGINT(20),
    `offset` INT(11) NULL,
    PRIMARY KEY (`test_id`),
    INDEX (`company_id`)
  );

  CREATE TABLE IF NOT EXISTS `hackerium_test`.`test_scores` (
      `app_test_id` VARCHAR(45) NOT NULL,
      `app_id` VARCHAR(45) NOT NULL,
      `test_id` VARCHAR(45) NOT NULL,
      `user_id` VARCHAR(45) NOT NULL,
      `last_name` VARCHAR(255) NULL,
      `first_name` VARCHAR(255) NULL,
      `job_name` VARCHAR(255) NULL,
      `score` INT NOT NULL,
      `total` INT NOT NULL,
      `duration` INT NOT NULL,
      `status` VARCHAR(45) NULL,
      `date_taken` INT NULL,
      PRIMARY KEY (`app_test_id`)
  );

  CREATE TABLE IF NOT EXISTS `hackerium_test`.`user_inputs` (
      `app_test_id` VARCHAR(45) NOT NULL,
      `app_id` VARCHAR(45) NOT NULL,
      `test_id` VARCHAR(45) NOT NULL,
      `user_id` VARCHAR(45) NOT NULL,
      `last_name` VARCHAR(255) NOT NULL,
      `first_name` VARCHAR(255) NOT NULL,
      `job_name` VARCHAR(255) NULL,
      `score` INT NOT NULL,
      `total` INT NOT NULL,
      `duration` INT NOT NULL,
      `status` VARCHAR(45) NULL,
      `date_taken` INT NULL,
      `user_script` TEXT NULL,
      `test_runs` JSON NULL,
      PRIMARY KEY (`app_test_id`)
  );