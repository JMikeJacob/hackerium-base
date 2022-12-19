CREATE TABLE IF NOT EXISTS `test_eventstore`.`events` (
  `event_id` VARCHAR(255),
  `stream_id` VARCHAR(255),
  `payload` JSON,
  `revision` INT,
  `timestamp` BIGINT(20),
  `aggregate` VARCHAR(255),
  `context` VARCHAR(255),
  INDEX event_stream (`stream_id`, `aggregate`, `context`, `revision`),
  INDEX event_id (`event_id`)
);

CREATE TABLE IF NOT EXISTS `test_eventstore`.`snapshots` (
  `stream_id` VARCHAR(255),
  `data` JSON,
  `revision` INT,
  `aggregate` VARCHAR(255),
  `context` VARCHAR(255),
  INDEX stream (`stream_id`, `aggregate`, `context`, `revision`)
);