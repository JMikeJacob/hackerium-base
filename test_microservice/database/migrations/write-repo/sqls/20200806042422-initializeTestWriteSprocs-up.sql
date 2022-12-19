-- SEEKER VALIDATIONS
DROP PROCEDURE IF EXISTS `validateCompanyId`;
CREATE PROCEDURE `validateCompanyId`(
    IN p_user_id VARCHAR(255)
)
BEGIN
    SELECT *
    FROM `test_write`.`company`
    WHERE user_id = p_user_id;
END;