/* Replace with your SQL commands *//* Replace with your SQL commands */

DROP PROCEDURE IF EXISTS `addEmployerAccount`;
CREATE PROCEDURE `addEmployerAccount`(
    IN p_userid VARCHAR(255),
	IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_lastname VARCHAR(255),
    IN p_firstname VARCHAR(255),
    IN p_company VARCHAR(255),
    IN p_contact INT(11)
)
BEGIN
	INSERT INTO hackerium_account.recruiters 
	SET user_id = p_userid,
        email = p_email,
		password = p_password,
        company = p_company,
		last_name = p_lastname,
		first_name = p_firstname,
        contact = p_contact,
		type = 'employer',
        offset = 0;
    SELECT LAST_INSERT_ID() AS insertId;
END;

DROP PROCEDURE IF EXISTS `addSeekerAccount`;
CREATE PROCEDURE `addSeekerAccount`(
    IN p_userid VARCHAR(255),
	IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_lastname VARCHAR(255),
    IN p_firstname VARCHAR(255)
)
BEGIN
	INSERT INTO hackerium_account.seeker_accounts 
	SET user_id = p_userid,
        email = p_email,
		password = p_password,
		last_name = p_lastname,
		first_name = p_firstname,
		type = 'seeker',
        offset = 0;
    SELECT LAST_INSERT_ID() AS insertId;
END;

DROP PROCEDURE IF EXISTS `addSeekerTag`;
CREATE PROCEDURE `addSeekerTag`(
    IN p_tagId VARCHAR(255),
	IN p_userId VARCHAR(45),
    IN p_tag VARCHAR(255),
    IN p_tag_type VARCHAR(255)
)
BEGIN
	INSERT INTO hackerium_account.seeker_tags
    SET tag_id = p_tagId,
        user_id = p_userId,
		tag = p_tag,
        tag_type = p_tag_type;
END;

DROP PROCEDURE IF EXISTS `delEmployerAccount`;
CREATE PROCEDURE `delEmployerAccount`(
    IN p_userid VARCHAR(45)
)
BEGIN
	DELETE FROM hackerium_account.recruiters 
    WHERE user_id = p_userid;
END;

DROP PROCEDURE IF EXISTS `deleteSeekerAccount`;
CREATE PROCEDURE `deleteSeekerAccount`(
    IN p_userid VARCHAR(45)
)
BEGIN
	DELETE FROM hackerium_account.seeker_accounts 
    WHERE user_id = p_userid;
END;

DROP PROCEDURE IF EXISTS `delSeekerTag`;
CREATE PROCEDURE `delSeekerTag`(
	IN p_userId VARCHAR(45)
)
BEGIN
	DELETE FROM hackerium_account.seeker_tags
    WHERE NOT tag_type='level' 
          AND user_id = p_userId;
END;

DROP PROCEDURE IF EXISTS `editCompanyProfile`;
CREATE PROCEDURE `editCompanyProfile`(
	IN p_userId VARCHAR(45),
    IN p_company_name VARCHAR(255),
    IN p_contact_no INT(11)
)
BEGIN
	UPDATE hackerium_account.recruiters
    SET company = p_company_name,
		contact = p_contact_no
	WHERE user_id = p_userId;
END;

DROP PROCEDURE IF EXISTS `editEmployerAccount`;
CREATE PROCEDURE `editEmployerAccount`(
	IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_lastname VARCHAR(255),
    IN p_firstname VARCHAR(255),
    IN p_userid VARCHAR(45)
)
BEGIN
	UPDATE hackerium_account.recruiters 
    SET last_name = p_lastname, 
		first_name = p_firstname, 
        email = p_email, 
		password = p_password 
	WHERE user_id = p_userid;
END;

DROP PROCEDURE IF EXISTS `editSeekerAccount`;
CREATE PROCEDURE `editSeekerAccount`(
	IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_lastname VARCHAR(255),
    IN p_firstname VARCHAR(255),
    IN p_userid VARCHAR(45)
)
BEGIN
	UPDATE hackerium_account.seeker_accounts 
    SET last_name = p_lastname, 
		first_name = p_firstname, 
        email = p_email, 
		password = p_password 
	WHERE user_id = p_userid;
END;

DROP PROCEDURE IF EXISTS `editSeekerProfile`;
CREATE PROCEDURE `editSeekerProfile`(
	IN p_tag VARCHAR(255),
	IN p_userid VARCHAR(45)
)
BEGIN
	UPDATE hackerium_account.seeker_tags
    SET tag = p_tag
	WHERE user_id = p_userid
		AND tag_type = 'level';
END;

DROP PROCEDURE IF EXISTS `getAllCompanies`;
CREATE PROCEDURE `getAllCompanies`()
BEGIN
	SELECT *
    FROM hackerium_account.company_profile;
END;

DROP PROCEDURE IF EXISTS `getAllEmployers`;
CREATE PROCEDURE `getAllEmployers`()
BEGIN
	SELECT *
    FROM hackerium_account.recruiters;
END;

DROP PROCEDURE IF EXISTS `getAllSeekers`;
CREATE PROCEDURE `getAllSeekers`()
BEGIN
	SELECT *
    FROM hackerium_account.seeker_accounts;
END;

DROP PROCEDURE IF EXISTS `getCompaniesPerPage`;
CREATE PROCEDURE `getCompaniesPerPage`(
	IN p_order VARCHAR(255),
    IN p_how VARCHAR(255),
    IN p_offset BIGINT,
    IN p_limit MEDIUMINT
)
BEGIN
    SELECT *
    FROM hackerium_account.recruiters
    ORDER BY 
		(CASE WHEN p_order = 'date_posted' AND p_how = 'desc' THEN date_posted END) DESC,
        (CASE WHEN p_order = 'date_posted' AND p_how = 'asc' THEN date_posted END),
        (CASE WHEN p_order = 'last_name' AND p_how = 'desc' THEN last_name END) DESC,
        (CASE WHEN p_order = 'last_name' AND p_how = 'asc' THEN last_name END),
        (CASE WHEN p_order = 'status' AND p_how = 'desc' THEN `status` END) DESC,
        (CASE WHEN p_order = 'status' AND p_how = 'asc' THEN `status` END),
        (CASE WHEN p_order = 'job_name' AND p_how = 'desc' THEN job_name END) DESC,
        (CASE WHEN p_order = 'job_name' AND p_how = 'asc' THEN job_name END)
    LIMIT p_limit OFFSET p_offset;
END;

DROP PROCEDURE IF EXISTS `getCompanyCount`;
CREATE PROCEDURE `getCompanyCount`()
BEGIN
	SELECT COUNT(*) AS `count`
    FROM hackerium_account.recruiters;
END;

DROP PROCEDURE IF EXISTS `getEmployerById`;
CREATE PROCEDURE `getEmployerById`(
	IN p_userid VARCHAR(45)
)
BEGIN
	SELECT *
    FROM hackerium_account.recruiters
    WHERE user_id = p_userid;
END;

DROP PROCEDURE IF EXISTS `getEmployerLogin`;
CREATE PROCEDURE `getEmployerLogin`(
	IN p_email VARCHAR(255),
    IN p_password VARCHAR(255)
)
BEGIN
	SELECT * FROM hackerium_account.recruiters
    WHERE email = p_email
    AND password = p_password;
END;

DROP PROCEDURE IF EXISTS `getCompanyByName`;
CREATE PROCEDURE `getCompanyByName` (
	IN p_company VARCHAR(255)
)
BEGIN
	SELECT company
    FROM hackerium_account.recruiters
    WHERE company = p_company;
END;

DROP PROCEDURE IF EXISTS `getSeekerById`;
CREATE PROCEDURE `getSeekerById`(
	IN p_userid VARCHAR(45)
)
BEGIN
	SELECT *
    FROM hackerium_account.seeker_accounts
    WHERE user_id = p_userid;
END;

DROP PROCEDURE IF EXISTS `getSeekerByEmail`;
CREATE PROCEDURE `getSeekerByEmail`(
	IN p_email VARCHAR(45)
)
BEGIN
	SELECT email
    FROM hackerium_account.seeker_accounts
    WHERE email = p_email;
END;

DROP PROCEDURE IF EXISTS `getSeekerLogin`;
CREATE PROCEDURE `getSeekerLogin`(
	IN p_email VARCHAR(255),
    IN p_password VARCHAR(255)
)
BEGIN
	SELECT * FROM hackerium_account.seeker_accounts
    WHERE email = p_email
    AND password = p_password;
END;

DROP PROCEDURE IF EXISTS `getSeekerProfile`;
CREATE PROCEDURE `getSeekerProfile`(
	IN p_userid VARCHAR(45)
)
BEGIN
	SELECT *
    FROM hackerium_account.seeker_accounts
	JOIN hackerium_account.seeker_profile 
	ON seeker_accounts.user_id = seeker_profile.user_id
    WHERE seeker_accounts.user_id = p_userid;
END;
