
DROP PROCEDURE IF EXISTS `getHash`;
CREATE PROCEDURE `getHash`(
    IN p_key VARCHAR(255)
)
BEGIN 
    SELECT hash_value
    FROM account_kvs.hashes
    WHERE `hash_key` = p_key
    ORDER BY created_at DESC LIMIT 1;
END;

DROP PROCEDURE IF EXISTS `putHash`;
-- CREATE PROCEDURE `putHash`(
--     IN p_key VARCHAR(255),
--     IN p_value JSON
-- )
-- BEGIN 
--     INSERT INTO account_kvs.hashes
--     VALUES(p_key, p_value, UNIX_TIMESTAMP());
-- END;
CREATE PROCEDURE `putHash`(
    IN p_key VARCHAR(255),
    IN p_value JSON
)
BEGIN 
	DECLARE hashkey VARCHAR(255) DEFAULT NULL;
	DECLARE json_keys JSON DEFAULT NULL;
    DECLARE i INT DEFAULT 0;
            
    SELECT hash_key INTO hashkey FROM account_kvs.hashes WHERE hash_key = p_key;
    
    IF hashkey IS NULL THEN
		INSERT INTO account_kvs.hashes
		VALUES(p_key, p_value, UNIX_TIMESTAMP());
	ELSE
		SELECT JSON_KEYS(p_value) INTO json_keys;
		WHILE i < JSON_LENGTH(json_keys) DO
			SET hashkey = JSON_EXTRACT(json_keys, CONCAT('$[',i,']'));
			UPDATE hashes 
            SET hash_value = JSON_SET(hash_value, CONCAT('$.', hashkey), JSON_EXTRACT(p_value, CONCAT('$.', hashkey)))
            WHERE hash_key = p_key;
			SET i = i + 1;
        END WHILE;
    END IF;
END;

DROP PROCEDURE IF EXISTS `deleteHash`;
CREATE PROCEDURE `deleteHash`(
    IN p_key VARCHAR(255)
)
BEGIN
    DELETE FROM account_kvs.hashes
    WHERE `hash_key` = p_key;
END;

DROP PROCEDURE IF EXISTS `getSortedSet`;
CREATE PROCEDURE `getSortedSet`(
    IN p_key VARCHAR(255)
)
BEGIN
    SELECT hashes.hash_value
    FROM account_kvs.sorted_sets
    JOIN account_kvs.hashes ON sorted_sets.key = hashes.hash_key
    WHERE sorted_sets.sorted_set_key = p_key
    ORDER BY sorted_sets.score;
END;