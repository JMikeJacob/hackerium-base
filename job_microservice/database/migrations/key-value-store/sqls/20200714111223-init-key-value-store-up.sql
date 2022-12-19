CREATE TABLE IF NOT EXISTS `job_kvs`.`hashes` (
  `hash_key` VARCHAR(255),
  `hash_value` JSON,
  `created_at` INT,
  PRIMARY KEY(`hash_key`)
);

CREATE TABLE IF NOT EXISTS `job_kvs`.`sorted_sets` (
  `sorted_set_key` VARCHAR(255),
  `key` VARCHAR(255),
  `score` INT,
  INDEX (sorted_set_key, `key`)
);