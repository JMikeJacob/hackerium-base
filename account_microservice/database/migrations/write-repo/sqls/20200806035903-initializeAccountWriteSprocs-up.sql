-- SEEKER VALIDATIONS
DROP PROCEDURE IF EXISTS `validateSeekerEmail`;
CREATE PROCEDURE `validateSeekerEmail`(
    IN p_email VARCHAR(255)
)
BEGIN
    SELECT *
    FROM `account_write`.`seeker`
    WHERE email = p_email;
END;

DROP PROCEDURE IF EXISTS `validateSeekerId`;
CREATE PROCEDURE `validateSeekerId`(
    IN p_user_id VARCHAR(255)
)
BEGIN
    SELECT *
    FROM `account_write`.`seeker`
    WHERE user_id = p_user_id;
END;

DROP PROCEDURE IF EXISTS `addSeekerValidations`;
CREATE PROCEDURE `addSeekerValidations`(
    IN p_email VARCHAR(255),
    IN p_user_id VARCHAR(255),
    IN p_aggregate_id VARCHAR(255)
)
BEGIN
    DELETE FROM `account_write`.`seeker` WHERE user_id = p_user_id;

    INSERT INTO `account_write`.`seeker`
    VALUES(p_email, p_user_id, p_aggregate_id);
END;

DROP PROCEDURE IF EXISTS `deleteSeekerValidations`;
CREATE PROCEDURE `deleteSeekerValidations`(
    IN p_user_id VARCHAR(255)
)
BEGIN
    DELETE FROM `account_write`.`seeker`
    WHERE user_id = p_user_id;
END;

-- COMPANY VALIDATIONS

DROP PROCEDURE IF EXISTS `validateCompanyEmailAndName`;
CREATE PROCEDURE `validateCompanyEmailAndName`(
    IN p_email VARCHAR(255),
    IN p_company VARCHAR(255)
)
BEGIN
    SELECT * FROM `account_write`.`company` WHERE `email` = p_email
    UNION
    SELECT * FROM `account_write`.`company` WHERE `company` = p_company;
END;

DROP PROCEDURE IF EXISTS `validateCompanyId`;
CREATE PROCEDURE `validateCompanyId`(
    IN p_user_id VARCHAR(255)
)
BEGIN
    SELECT *
    FROM `account_write`.`company`
    WHERE user_id = p_user_id;
END;

DROP PROCEDURE IF EXISTS `addCompanyValidations`;
CREATE PROCEDURE `addCompanyValidations`(
    IN p_email VARCHAR(255),
    IN p_company VARCHAR(255),
    IN p_user_id VARCHAR(255),
    IN p_aggregate_id VARCHAR(255)
)
BEGIN
    DELETE FROM `account_write`.`company`
    WHERE user_id = p_user_id;

    INSERT INTO `account_write`.`company`
    VALUES(p_email, p_company, p_user_id, p_aggregate_id);
END;

DROP PROCEDURE IF EXISTS `updateCompanyEmail`;
CREATE PROCEDURE `updateCompanyEmail`(
    IN p_email VARCHAR(255),
    IN p_aggregate_id VARCHAR(255)
)
BEGIN
    UPDATE `account_write`.`company`
    SET email = p_email
    WHERE aggregate_id = p_aggregate_id;
END;

DROP PROCEDURE IF EXISTS `updateCompanyName`;
CREATE PROCEDURE `updateCompanyName`(
    IN p_company VARCHAR(255),
    IN p_aggregate_id VARCHAR(255)
)
BEGIN
    UPDATE `account_write`.`company`
    SET company = p_company
    WHERE aggregate_id = p_aggregate_id;
END;

DROP PROCEDURE IF EXISTS `deleteCompanyValidations`;
CREATE PROCEDURE `deleteCompanyValidations`(
    IN p_user_id VARCHAR(255)
)
BEGIN
    DELETE FROM `account_write`.`company`
    WHERE user_id = p_user_id;
END;