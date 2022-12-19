const io = require('socket.io')();
const socketIo = {};
socketIo.io = io;

const factory = require('./factory')();

const commandHandler = factory.commandHandler();
const repo = factory.readRepository();
const CONSTANTS = require('./constants');
const helper = require('./helper');

let interviewIds = {};

io.on('connection', (socket) => {
    console.log(`socket ${socket }connected!`)
//special instructions for entering a CodePair
    let previousRoom;
    const safeJoin = currentRoom => {
        console.log('yolo');
        if(previousRoom) socket.leave(previousRoom);
        socket.join(currentRoom);
        previousRoom = currentRoom;
    }

    socket.on('joinInterview', interview => {
        console.log('interview->'+ JSON.stringify(interview));
        safeJoin(interview.id);
        if(!interviewIds[interview.id]) {
            interviewIds[interview.id] = interview.id;
            commandHandler.sendCommand({
                commandType: CONSTANTS.COMMANDS.SAVE_INTERVIEW_SCRIPT,
                aggregateId: interview.id,
                payload: {
                    interviewId: `interview:${interview.id}`,
                    interviewScript: helper.stringifyScript(interview.script)
                }
            });
        }
    })

    socket.on('editInterview', interview => {
        console.log(interview);
        //send edit command
        commandHandler.sendCommand({
            commandType: CONSTANTS.COMMANDS.SAVE_INTERVIEW_SCRIPT,
            aggregateId: interview.id,
            payload: {
                interviewId: `interview:${interview.id}`,
                interviewScript: helper.stringifyScript(interview.script)
            }
        });
        // socket.to(interview.id).emit('interview', interview );
    })

    socket.on('getInterview', interviewId => {
        // console.log(interviews[interviewId])
        // socket.to(interviewId).emit('interview', interviews[interviewId]);
    })

    socket.on('leaveInterview', interviewId => {
        if(!io.sockets.adapter.rooms[interviewId]) {
            delete interviewIds[interviewId];
            //send delete command
        }
        // console.log(interviews);
    })

    socket.on('disconnect', () => {
        if(previousRoom) {
            console.log(io.sockets.adapter.rooms[previousRoom]);

            if(!io.sockets.adapter.rooms[previousRoom]) {
                //send delete command
                delete interviewIds[previousRoom];
            }
        }
    })
})

module.exports = socketIo;