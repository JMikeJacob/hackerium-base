/* Replace with your SQL commands */
DROP PROCEDURE IF EXISTS `getTestById`;
CREATE PROCEDURE `getTestById`(
	IN p_testid VARCHAR(45)
)
BEGIN
	SELECT *
    FROM hackerium_test.tests
    WHERE test_id = p_testid;
END;

DROP PROCEDURE IF EXISTS `getTestsApplicant`;
CREATE PROCEDURE `getTestsApplicant`(
    IN p_userId VARCHAR(45)
)
BEGIN
	SELECT test_scores.test_id, 
		   test_scores.user_id, 
           test_scores.score,
           test_scores.date_taken,
           tests.test_title,
           tests.test_difficulty,
           tests.company_name
    FROM hackerium_test.test_scores
    JOIN hackerium_test.test ON test_scores.test_id=tests.test_id
    WHERE user_id = p_userId;
END;

DROP PROCEDURE IF EXISTS `getTestsEmployer`;
CREATE PROCEDURE `getTestsEmployer`(
    IN p_companyId VARCHAR(45)
)
BEGIN
	SELECT * 
    FROM hackerium_test.tests 
    WHERE company_id = p_companyId;
END;

DROP PROCEDURE IF EXISTS `getTestTakers`;
CREATE PROCEDURE `getTestTakers`(
    IN p_testId VARCHAR(45)
)
BEGIN
	SELECT test_scores.test_id, 
		   test_scores.user_id, 
           test_scores.score,
           test_scores.date_taken,
           seeker_accounts.last_name,
           seeker_accounts.first_name
    FROM hackerium_test.test_scores
    JOIN hackerium_test.seeker_accounts ON test_scores.user_id=seeker_accounts.user_id
    WHERE test_id = p_testId;
END;

DROP PROCEDURE IF EXISTS `addTest`;
CREATE PROCEDURE `addTest`(
    IN p_test_id VARCHAR(45),
    IN p_test_title VARCHAR(45),
    IN p_test_total INT,
    IN p_test_difficulty VARCHAR(45),
    IN p_company_id VARCHAR(45),
    IN p_company_name VARCHAR(45),
    IN p_created_at BIGINT(20),
    IN p_test_boilerplate LONGTEXT,
    IN p_test_parameters JSON,
    IN p_test_execution_time INT(20),
    IN p_test_file_urls JSON
)
BEGIN
    INSERT INTO `hackerium_test`.`tests`
    SET test_id = p_test_id,
        test_title = p_test_title,
        test_total = p_test_total,
        test_difficulty = p_test_difficulty,
        company_id = p_company_id,
        company_name = p_company_name,
        test_execution_time = p_test_execution_time,
        test_file_urls = p_test_file_urls,
        test_boilerplate = p_test_boilerplate,
        test_parameters = p_test_parameters,
        created_at = p_created_at,
        updated_at = p_created_at,
        offset = 0;
END;

DROP PROCEDURE IF EXISTS `editTest`;
CREATE PROCEDURE `editTest` (
    IN p_test_id VARCHAR(45),
    IN p_test_title VARCHAR(45),
    IN p_test_total INT,
    IN p_test_difficulty VARCHAR(45),
    IN p_company_id VARCHAR(45),
    IN p_company_name VARCHAR(45),
    IN p_created_at BIGINT(20),
    IN p_test_boilerplate LONGTEXT,
    IN p_test_parameters JSON,
    IN p_test_execution_time INT(20),
    IN p_test_file_urls JSON
)
BEGIN
    UPDATE `hackerium_test`.`tests`
    SET test_title = p_test_title,
        test_total = p_test_total,
        test_difficulty = p_test_difficulty,
        company_id = p_company_id,
        company_name = p_company_name,
        test_execution_time = p_test_execution_time,
        test_file_urls = p_test_file_urls,
        test_boilerplate = p_test_boilerplate,
        test_parameters = p_test_parameters.
        created_at = p_created_at,
        updated_at = p_updated_at,
        offset = 0
    WHERE test_id = p_test_id;
END;

DROP PROCEDURE IF EXISTS `deleteTest`;
CREATE PROCEDURE `deleteTest`(
    IN p_test_id VARCHAR(45)
)
BEGIN
    DELETE FROM `hackerium_test`.`tests`
    WHERE test_id = p_test_id;
END;

DROP PROCEDURE IF EXISTS `getTestsPerPageEmployer`;
CREATE  PROCEDURE `getTestsPerPageEmployer`(
	IN p_order VARCHAR(255),
    IN p_how VARCHAR(255),
    IN p_offset MEDIUMINT,
    IN p_limit MEDIUMINT,
    IN p_companyid VARCHAR(255)
)
BEGIN
    SELECT *
    FROM hackerium_test.tests
    WHERE company_id = p_companyid
    ORDER BY 
		(CASE WHEN p_order = 'created_at' AND p_how = 'desc' THEN created_at END) DESC,
        (CASE WHEN p_order = 'created_at' AND p_how = 'asc' THEN created_at END),
        (CASE WHEN p_order = 'test_title' AND p_how = 'desc' THEN test_title END) DESC,
        (CASE WHEN p_order = 'test_title' AND p_how = 'asc' THEN test_title END)
    LIMIT p_limit OFFSET p_offset;

    SELECT COUNT(*) AS count
    FROM hackerium_test.tests
    WHERE company_id = p_companyid;
END;
