
DROP PROCEDURE IF EXISTS `addJobPost`;
CREATE PROCEDURE `addJobPost`(
    IN p_jobid VARCHAR(45),
    IN p_jobname VARCHAR(255),
    IN p_companyname VARCHAR(255),
    IN p_companyid VARCHAR(45),
    IN p_dateposted BIGINT,
    IN p_datedeadline BIGINT,
    IN p_fieldid VARCHAR(45),
    IN p_field VARCHAR(255),
    IN p_typeid VARCHAR(45),
    IN p_type VARCHAR(255),
    IN p_levelid VARCHAR(45),
    IN p_level VARCHAR(255),
    IN p_location VARCHAR(255)
)
BEGIN
	INSERT INTO hackerium_job.job_post
    SET job_id = p_jobid,
        job_name = p_jobname,
		company_name = p_companyname,
        posted_by_id = p_companyid,
        is_open = 'yes',
        date_posted= p_dateposted,
        date_deadline = p_datedeadline,
        field_id = p_fieldid,
        `field` = p_field,
        `type_id` = p_typeid,
        type = p_type,
        level_id = p_levelid,
        level = p_level,
        job_location = p_location,
        offset = 0;
	SELECT LAST_INSERT_ID() AS insertId;
END;

DROP PROCEDURE IF EXISTS `addJobTag`;

CREATE PROCEDURE `addJobTag`(
    IN p_tagid VARCHAR(45),
	IN p_jobid VARCHAR(45),
    IN p_userid VARCHAR(45),
    IN p_tag VARCHAR(255),
    IN p_tag_type VARCHAR(255)
)
BEGIN
	INSERT INTO hackerium_job.job_tags
    SET tag_id = p_tagid,
        job_id = p_jobid,
		posted_by_id = p_userid,
        tag = p_tag,
        tag_type = p_tag_type;
END;

DROP PROCEDURE IF EXISTS `editJobPost`;
CREATE PROCEDURE `editJobPost`(
    IN p_jobname VARCHAR(255),
    IN p_isopen VARCHAR(255),
    IN p_datedeadline BIGINT,
    IN p_jobid VARCHAR(45)
)
BEGIN
	UPDATE hackerium_job.job_post
    SET job_name = p_jobname,
        is_open = p_isopen,
        date_deadline = p_datedeadline
	WHERE job_id = p_jobid;

    UPDATE hackerium_job.applications_seeker_employer_testscores
    SET job_name = p_jobname
    WHERE job_id = p_jobid;
END;

DROP PROCEDURE IF EXISTS `editJobTag`;
CREATE PROCEDURE `editJobTag`(
	IN p_tag VARCHAR(255),
    In p_jobid VARCHAR(45),
    IN p_tag_type VARCHAR(255)
)
BEGIN
	UPDATE hackerium_job.job_tags
    SET tag = p_tag
	WHERE job_id = p_jobid
	  AND tag_type = p_tag_type;
END;

DROP PROCEDURE IF EXISTS `deleteJobPost`;
CREATE PROCEDURE `deleteJobPost`(
    IN p_jobid VARCHAR(45)
)
BEGIN
	DELETE FROM hackerium_job.job_post WHERE job_id = p_jobid;
    
    DELETE FROM hackerium_job.applications WHERE job_id = p_jobid;

    DELETE FROM hackerium_job.applications_seeker_employer_testscores WHERE job_id = p_jobid;

END;

DROP PROCEDURE IF EXISTS `deleteJobTag`;
CREATE PROCEDURE `deleteJobTag`(
	IN p_jobid VARCHAR(45)
)
BEGIN
	DELETE FROM job_tags 
    WHERE job_id = p_jobid 
    AND NOT(tag_type = 'type' OR tag_type='level');
END;


DROP PROCEDURE IF EXISTS `getJobById`;
CREATE PROCEDURE `getJobById`(
	IN p_jobid VARCHAR(45)
)
BEGIN
	SELECT *
    FROM hackerium_job.job_post
    WHERE job_id = p_jobid;
END;

DROP PROCEDURE IF EXISTS `getJobCount`;
CREATE PROCEDURE `getJobCount`()
BEGIN
	SELECT COUNT(*) AS `count`
    FROM hackerium_job.job_post;
END;

DROP PROCEDURE IF EXISTS `getJobCountEmployer`;
CREATE PROCEDURE `getJobCountEmployer`(
	IN p_posted_by_id VARCHAR(45)
)
BEGIN
	SELECT COUNT(*) AS `count`
    FROM hackerium_job.job_post
    WHERE posted_by_id = p_posted_by_id;
END;

DROP PROCEDURE IF EXISTS `getJobCountFilterSearch`;
CREATE PROCEDURE `getJobCountFilterSearch`(
	IN p_jobs VARCHAR(255),
    IN p_search VARCHAR(255)
)
BEGIN
	DECLARE SQLSTATEMENT VARCHAR(255);
    
	SET @SQLSTATEMENT = CONCAT('SELECT COUNT(*) AS count',
						  ' FROM hackerium_job.job_post',
						  ' WHERE job_id IN (', p_jobs, ')',
						  ' (AND company_name LIKE ', p_search,
						  ' OR job_name LIKE ', p_search, ')');
	PREPARE stmt FROM @SQLSTATEMENT;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END;

DROP PROCEDURE IF EXISTS `getJobsPerPage`;
CREATE  PROCEDURE `getJobsPerPage`(
	IN p_order VARCHAR(255),
    IN p_how VARCHAR(255),
    IN p_offset MEDIUMINT,
    IN p_limit MEDIUMINT,
    IN p_field VARCHAR(255),
    IN p_type VARCHAR(255),
    IN p_level VARCHAR(255),
    IN p_search VARCHAR(255)
)
BEGIN
    SELECT *
    FROM hackerium_job.job_post
    WHERE 
        (p_level IS NULL OR FIND_IN_SET(level_id, p_level))
    AND
        (p_type IS NULL OR FIND_IN_SET(type_id, p_type))
    AND
        (p_field IS NULL OR FIND_IN_SET(field_id, p_field))
    AND 
        (p_search IS NULL OR company_name LIKE CONCAT('%',p_search,'%') OR job_name LIKE CONCAT('%',p_search,'%'))
    ORDER BY 
		(CASE WHEN p_order = 'date_posted' AND p_how = 'desc' THEN date_posted END) DESC,
        (CASE WHEN p_order = 'date_posted' AND p_how = 'asc' THEN date_posted END),
        (CASE WHEN p_order = 'date_deadline' AND p_how = 'desc' THEN date_posted END) DESC,
        (CASE WHEN p_order = 'date_deadline' AND p_how = 'asc' THEN date_posted END),
        (CASE WHEN p_order = 'job_name' AND p_how = 'desc' THEN job_name END) DESC,
        (CASE WHEN p_order = 'job_name' AND p_how = 'asc' THEN job_name END)
    LIMIT p_limit OFFSET p_offset;

    SELECT COUNT(*) AS count
    FROM hackerium_job.job_post
    WHERE 
        (p_level IS NULL OR FIND_IN_SET(level_id, p_level))
    AND
        (p_type IS NULL OR FIND_IN_SET(type_id, p_type))
    AND
        (p_field IS NULL OR FIND_IN_SET(field_id, p_field))
    AND 
        (p_search IS NULL OR company_name LIKE CONCAT('%',p_search,'%') OR job_name LIKE CONCAT('%',p_search,'%'));
END;

DROP PROCEDURE IF EXISTS `getJobsPerPageEmployer`;
CREATE  PROCEDURE `getJobsPerPageEmployer`(
	IN p_order VARCHAR(255),
    IN p_how VARCHAR(255),
    IN p_offset MEDIUMINT,
    IN p_limit MEDIUMINT,
    IN p_companyid VARCHAR(255)
)
BEGIN
    SELECT *
    FROM hackerium_job.job_post
    WHERE posted_by_id = p_companyid
    ORDER BY 
		(CASE WHEN p_order = 'date_posted' AND p_how = 'desc' THEN date_posted END) DESC,
        (CASE WHEN p_order = 'date_posted' AND p_how = 'asc' THEN date_posted END),
        (CASE WHEN p_order = 'date_deadline' AND p_how = 'desc' THEN date_posted END) DESC,
        (CASE WHEN p_order = 'date_deadline' AND p_how = 'asc' THEN date_posted END),
        (CASE WHEN p_order = 'job_name' AND p_how = 'desc' THEN job_name END) DESC,
        (CASE WHEN p_order = 'job_name' AND p_how = 'asc' THEN job_name END)
    LIMIT p_limit OFFSET p_offset;

    SELECT COUNT(*) AS count
    FROM hackerium_job.job_post
    WHERE posted_by_id = p_companyid;
END;

/* Replace with your SQL commands */
DROP PROCEDURE IF EXISTS `addApplication`;
CREATE PROCEDURE `addApplication`(
    IN p_appid VARCHAR(45),
	IN p_userid VARCHAR(45),
    IN p_jobid VARCHAR(45),
    IN p_posted_by_id VARCHAR(45),
    IN p_date_posted BIGINT,
    IN p_lastname VARCHAR(45),
    IN p_firstname VARCHAR(45),
    IN p_companyname VARCHAR(45),
    IN p_jobname VARCHAR(45)
)
BEGIN
    INSERT INTO hackerium_job.applications
    SET app_id = p_appid,
        user_id = p_userid,
		job_id = p_jobid,
        posted_by_id = p_posted_by_id,
        `status` = 'pending',
        date_posted = p_date_posted;
    INSERT INTO hackerium_job.applications_seeker_employer_testscores
    SET app_id = p_appid,
        user_id = p_userid,
        `status` = 'pending',
        date_posted = p_date_posted,
        last_name = p_lastname,
        first_name = p_firstname,
        job_id = p_jobid,
        job_name = p_jobname,
        posted_by_id = p_posted_by_id,
        company_name = p_companyname,
        test_id = NULL,
        test_title = NULL,
        test_taken = NULL,
        test_score = NULL,
        test_total = NULL,
        test_duration = NULL,
        test_date_taken = NULL;
END;

DROP PROCEDURE IF EXISTS `deleteApplication`;
CREATE PROCEDURE `deleteApplication`(
	IN p_appid VARCHAR(45)
)
BEGIN
    DELETE FROM hackerium_job.applications
    WHERE app_id = p_appid;

    DELETE FROM hackerium_job.applications_seeker_employer_testscores
    WHERE app_id = p_appid;
END;

DROP PROCEDURE IF EXISTS `delApplications`;
CREATE PROCEDURE `delApplications`(
    IN p_jobid VARCHAR(45)
)
BEGIN
	DELETE FROM hackerium_job.applications WHERE job_id = p_jobid;
    
END;

DROP PROCEDURE IF EXISTS `editApplicationStatus`;
CREATE PROCEDURE `editApplicationStatus`(
    IN p_app_id VARCHAR(255),
    IN p_status VARCHAR(255)
)
BEGIN
	UPDATE hackerium_job.applications
    SET `status` = p_status
    WHERE app_id = p_app_id;
    UPDATE hackerium_job.applications_seeker_employer_testscores
    SET `status` = p_status
    WHERE app_id = p_app_id;
END;

DROP PROCEDURE IF EXISTS `addApplicationTest`;
CREATE PROCEDURE `addApplicationTest` (
    IN p_app_id VARCHAR(255),
    IN p_status VARCHAR(255),
    IN p_test_id VARCHAR(255)
)
BEGIN
    UPDATE hackerium_job.applications_seeker_employer_testscores
    SET 
        `status` = p_status,
        `test_id` = p_test_id
    WHERE app_id = p_app_id;
END;

DROP PROCEDURE IF EXISTS `updateApplicationTestCode`;
CREATE PROCEDURE `updateApplicationTestCode`(
    IN p_app_id VARCHAR(255),
    IN p_script LONGTEXT,
    IN p_test_title VARCHAR(255),
    IN p_test_file_urls JSON,
    IN p_test_parameters JSON,
    IN p_test_duration INT(20),
    IN p_test_date_taken BIGINT(20),
    IN p_status VARCHAR(255),
    IN p_test_execution_time INT(20)
)
BEGIN
    UPDATE hackerium_job.applications_seeker_employer_testscores
    SET
        `status` = p_status,
        script = p_script,
        test_title = p_test_title,
        test_file_urls = p_test_file_urls,
        test_parameters = p_test_parameters,
        test_duration = p_test_duration,
        test_date_taken = p_test_date_taken,
        test_execution_time = p_test_execution_time
    WHERE app_id = p_app_id;
END;

DROP PROCEDURE IF EXISTS `updateApplicationTestResults`;
CREATE PROCEDURE `updateApplicationTestResults`(
    IN p_app_id VARCHAR(255),
    IN p_test_output JSON,
    IN p_test_score INT,
    IN p_status VARCHAR(255)
)
BEGIN
    UPDATE hackerium_job.applications_seeker_employer_testscores
    SET
        `status` = p_status,
        test_output = p_test_output,
        test_score = p_test_score
    WHERE app_id = p_app_id;
END;

DROP PROCEDURE IF EXISTS `getApplication`;
CREATE PROCEDURE `getApplication`(
	IN p_jobid VARCHAR(45),
    IN p_userid VARCHAR(45),
    IN p_appid VARCHAR(45)
)
BEGIN
	SELECT *
    FROM hackerium_job.applications
    WHERE job_id = p_jobid
	  AND user_id = p_userid;
END;

DROP PROCEDURE IF EXISTS `getApplicationCount`;
CREATE PROCEDURE `getApplicationCount`(
	IN p_posted_by_id VARCHAR(45)
)
BEGIN
	SELECT COUNT(*) AS count
    FROM hackerium_job.applications
    WHERE posted_by_id = p_posted_by_id;
END;

DROP PROCEDURE IF EXISTS `getApplicationCountSeeker`;
CREATE PROCEDURE `getApplicationCountSeeker`(
	IN p_userid VARCHAR(45)
)
BEGIN
	SELECT COUNT(*) AS count
    FROM hackerium_job.applications
    WHERE user_id = p_userid;
END;

DROP PROCEDURE IF EXISTS `getApplicationsForJob`;
CREATE PROCEDURE `getApplicationsForJob`(
	IN p_jobid VARCHAR(45)
)
BEGIN
	SELECT *
    FROM hackerium_job.applications
    WHERE job_id = p_jobid
    ORDER BY date_applied DESC;
END;

DROP PROCEDURE IF EXISTS `getApplicationsPerPageEmployer`;
CREATE PROCEDURE `getApplicationsPerPageEmployer`(
    IN p_order VARCHAR(255),
    IN p_how VARCHAR(255),
    IN p_offset MEDIUMINT,
    IN p_limit MEDIUMINT,
    IN p_companyid VARCHAR(45)
    -- IN p_userid VARCHAR(45)
)
BEGIN
	SELECT *
    FROM hackerium_job.applications_seeker_employer_testscores
    WHERE 
        posted_by_id = p_companyid
		-- (CASE WHEN p_companyid IS NOT NULL THEN posted_by_id = p_companyid
		-- 	  WHEN p_userid IS NOT NULL THEN user_id = p_userid
		-- END)
    ORDER BY p_order DESC
		-- (CASE WHEN p_order = 'date_posted' AND p_how = 'desc' THEN date_posted END) DESC,
        -- (CASE WHEN p_order = 'date_posted' AND p_how = 'asc' THEN date_posted END),
        -- (CASE WHEN p_order = 'last_name' AND p_how = 'desc' THEN last_name END) DESC,
        -- (CASE WHEN p_order = 'last_name' AND p_how = 'asc' THEN last_name END),
        -- (CASE WHEN p_order = 'status' AND p_how = 'desc' THEN `status` END) DESC,
        -- (CASE WHEN p_order = 'status' AND p_how = 'asc' THEN `status` END),
        -- (CASE WHEN p_order = 'job_name' AND p_how = 'desc' THEN job_name END) DESC,
        -- (CASE WHEN p_order = 'job_name' AND p_how = 'asc' THEN job_name END)
    LIMIT p_limit OFFSET p_offset;

    SELECT COUNT(*) AS count
    FROM hackerium_job.applications_seeker_employer_testscores
    WHERE posted_by_id = p_companyid;
        -- CASE WHEN p_companyid IS NOT NULL THEN posted_by_id = p_companyid
		-- 	 WHEN p_userid IS NOT NULL THEN user_id = p_userid
    -- END;
END;

DROP PROCEDURE IF EXISTS `getApplicationsPerPageSeeker`;
CREATE PROCEDURE `getApplicationsPerPageSeeker`(
    IN p_order VARCHAR(255),
    IN p_how VARCHAR(255),
    IN p_offset MEDIUMINT,
    IN p_limit MEDIUMINT,
    -- IN p_companyid VARCHAR(45),
    IN p_userid VARCHAR(45)
)
BEGIN
	SELECT *
    FROM hackerium_job.applications_seeker_employer_testscores
    WHERE 
        user_id = p_userid
		-- (CASE WHEN p_companyid IS NOT NULL THEN posted_by_id = p_companyid
		-- 	  WHEN p_userid IS NOT NULL THEN user_id = p_userid
		-- END)
    ORDER BY p_order DESC
		-- (CASE WHEN p_order = 'date_posted' AND p_how = 'desc' THEN date_posted END) DESC,
        -- (CASE WHEN p_order = 'date_posted' AND p_how = 'asc' THEN date_posted END),
        -- (CASE WHEN p_order = 'last_name' AND p_how = 'desc' THEN last_name END) DESC,
        -- (CASE WHEN p_order = 'last_name' AND p_how = 'asc' THEN last_name END),
        -- (CASE WHEN p_order = 'status' AND p_how = 'desc' THEN `status` END) DESC,
        -- (CASE WHEN p_order = 'status' AND p_how = 'asc' THEN `status` END),
        -- (CASE WHEN p_order = 'job_name' AND p_how = 'desc' THEN job_name END) DESC,
        -- (CASE WHEN p_order = 'job_name' AND p_how = 'asc' THEN job_name END)
    LIMIT p_limit OFFSET p_offset;

    SELECT COUNT(*) AS count
    FROM hackerium_job.applications_seeker_employer_testscores
    WHERE user_id = p_userid;
        -- CASE WHEN p_companyid IS NOT NULL THEN posted_by_id = p_companyid
		-- 	 WHEN p_userid IS NOT NULL THEN user_id = p_userid
    -- END;
END;

DROP PROCEDURE IF EXISTS `getApplicationStatusById`;
CREATE PROCEDURE `getApplicationStatusById`(
	IN p_appid VARCHAR(45)
)
BEGIN
    SELECT `status`
    FROM hackerium_job.applications
    WHERE app_id = p_appid;
END;

DROP PROCEDURE IF EXISTS `verifyIfApplied`;
CREATE PROCEDURE `verifyIfApplied`(
	IN p_userid VARCHAR(45),
    IN p_jobid VARCHAR(45)
)
BEGIN
    SELECT *
    FROM hackerium_job.applications
    WHERE job_id = p_jobid AND user_id = p_userid;
END;

DROP PROCEDURE IF EXISTS `verifyJobStatus`;
CREATE PROCEDURE `verifyJobStatus`(
    IN p_jobid VARCHAR(45)
)
BEGIN
    SELECT is_open
    FROM hackerium_job.job_post
    WHERE job_id = p_jobid;
END;

DROP PROCEDURE IF EXISTS `getApplicationTestResultById`;
CREATE PROCEDURE `getApplicationTestResultById`(
    IN p_appid VARCHAR(255)
)
BEGIN
    SELECT *
    FROM hackerium_job.applications_seeker_employer_testscores
    WHERE app_id = p_appid;
END;