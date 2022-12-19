const io = require('socket.io')();
const socketIo = {};
socketIo.io = io;

const broker = require('./broker');
const es = require('./eventStore');
const CONSTANTS = require('./constants');

const interviews = {};

io.on('connection', (socket) => {
    console.log('socket connected!');
    socket.on('joinRoom', async (data) => {
        console.log(data);
        let materializedTopic = `${data.aggregate}:${data.aggregateId}`;
        offset = data.offset
        
        socket.join(materializedTopic);

        if(offset) {
            const events = await es.getEventsFromRevision(data.aggregateId, data.aggregate, offset);

            events.forEach((event) => {
                io.to(materializedTopic).emit('event', event);
            });
        }
    });

    socket.on('leaveRoom', (data) => {
        let materializedTopic = `${data.aggregate}:${data.aggregateId}`;

        socket.leave(materializedTopic);
    });
});

broker.subscribeToEvents((event) => {
    let materializedTopic = `${event.aggregate}:${event.streamId}`;
    console.log('socket event received->' + JSON.stringify(event));

    io.to(materializedTopic).emit('event', event);
});

broker.subscribeToCodeEngine((event) => {
    // console.log('code engine event received->' + JSON.stringify(event));
    if(event.action === CONSTANTS.ENGINE.ACTIONS.RESOLVE_TEST_CASE) {
        let materializedTopic = `testRun:${event.payload.testRunId}`;

        io.to(materializedTopic).emit('event', event);
    }
});

module.exports = socketIo;