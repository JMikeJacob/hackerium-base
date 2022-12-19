const knex = require('knex')({
    client: process.env.KNEX_CLIENT,
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.EVENTSTORE_DB
    }
});

module.exports = {
    getEvents: async (streamId, aggregate, context) => {
        try {
            const results = await knex.raw('CALL getEvents(?, ?, ?)', [streamId, aggregate, context]);
            return {events: results[0][0]};
        } catch(err) {
            console.error(err);
            throw err;
        }
    },

    getEventsFromRevision: async(streamId, aggregate, revision, context) => {
        try {
            const result_events = await knex.raw('CALL getEventsFromRevision(?, ?, ?, ?)', [
                streamId, 
                revision,
                aggregate,
                context
            ]);
    
            return {
                streamId: streamId,
                events: result_events[0][0] || [],
                latestRevision: (result_events[0][0][result_events[0][0].length-1] || {revision: revision}).revision
            }
        } catch(err) {
            console.error(err);
            throw err;
        }
    },

    addEvents: async (streamId, events) => {
        try {
            const query = await new Promise((resolve) => {
                let q = `INSERT INTO ${process.env.EVENTSTORE_DB}.events VALUES `;
                for(let i = 0; i < events.length; i++) {
                    q += `('${events[i].eventId}', '${streamId}', '${JSON.stringify(events[i].payload)}'`
                      +  `, ${events[i].revision}, ${events[i].timestamp}, '${events[i].aggregate}', '${events[i].context}')`;
                }
                resolve(q);
            });
            
            const results = await knex.raw(query);

            return results;
        } catch(err) {
            console.error(err);
            throw err;
        }
    },

    getSnapshot: async (streamId, aggregate, context) => {
        try {
            let snapshot = {
                streamId: streamId,
                data: {},
                revision: -1
            };
    
            const result_snapshot = await knex.raw('CALL getSnapshot(?, ?, ?)', [streamId, aggregate, context]);
    
            if(result_snapshot[0][0][0]) {
                snapshot.streamId = result_snapshot[0][0][0].stream_id || streamId
                snapshot.data = JSON.parse(result_snapshot[0][0][0].data || '{}');
                snapshot.revision = result_snapshot[0][0][0].revision || -1
            }
    
            return snapshot;
        } catch(err) {
            console.error(err);
            throw err;
        }
    },

    getFromSnapshot: async (streamId, aggregate, context) => {
        try {
            let snapshot = {
                streamId: streamId,
                data: {},
                revision: -1
            };
    
            const result_snapshot = await knex.raw('CALL getSnapshot(?, ?, ?)', [streamId, aggregate, context]);
    
            if(result_snapshot[0][0][0]) {
                snapshot.streamId = result_snapshot[0][0][0].stream_id || streamId
                snapshot.data = JSON.parse(result_snapshot[0][0][0].data || '{}');
                snapshot.revision = result_snapshot[0][0][0].revision || -1
            }
    
            const result_events = await knex.raw('CALL getEventsFromRevision(?, ?, ?, ?)', [
                streamId, 
                snapshot.revision,
                aggregate,
                context
            ]);
    
            return {
                streamId: streamId,
                snapshot: snapshot,
                events: result_events[0][0] || [],
                latestRevision: (result_events[0][0][result_events[0][0].length-1] || snapshot).revision
            }
        } catch(err) {
            console.error(err);
            throw err;
        }
    },

    addSnapshot: async (streamId, data, revision, aggregate, context) => {
        try {
            const results = await knex.raw('CALL addSnapshot(?,?,?,?,?)', [
                streamId,
                JSON.stringify(data),
                revision,
                aggregate,
                context
            ]);
    
            return results;
        } catch(err) {
            console.error(err);
            throw err;
        }
    }
}