DROP PROCEDURE IF EXISTS `getEvents`;
CREATE PROCEDURE `getEvents`(
    IN p_stream_id VARCHAR(255),
    IN p_aggregate VARCHAR(255),
    IN p_context VARCHAR(255)
)
BEGIN
    SELECT *
    FROM test_eventstore.events
    WHERE stream_id = p_stream_id AND aggregate = p_aggregate AND context = p_context
    ORDER BY revision ASC;
END;

DROP PROCEDURE IF EXISTS `getEventsFromRevision`;
CREATE PROCEDURE `getEventsFromRevision`(
    IN p_stream_id VARCHAR(255),
    IN p_revision INT,
    IN p_aggregate VARCHAR(255),
    IN p_context VARCHAR(255)
)
BEGIN
    SELECT *
    FROM test_eventstore.events
    WHERE stream_id = p_stream_id AND aggregate = p_aggregate AND context = p_context AND revision > p_revision
    ORDER BY revision ASC;
END;

DROP PROCEDURE IF EXISTS `getSnapshot`;
CREATE PROCEDURE `getSnapshot`(
    IN p_stream_id VARCHAR(255),
    IN p_aggregate VARCHAR(255),
    IN p_context VARCHAR(255)

)
BEGIN
    SELECT *
    FROM test_eventstore.snapshots
    WHERE stream_id = p_stream_id AND aggregate = p_aggregate AND context = p_context
    ORDER BY revision DESC;
END;

DROP PROCEDURE IF EXISTS `addSnapshot`;
CREATE PROCEDURE `addSnapshot`(
    IN p_stream_id VARCHAR(255),
    IN p_data JSON,
    IN p_revision INT,
    IN p_aggregate VARCHAR(255),
    IN p_context VARCHAR(255)
)
BEGIN
    INSERT INTO test_eventstore.snapshots
    VALUES (p_stream_id, p_data, p_revision, p_aggregate, p_context);
END;