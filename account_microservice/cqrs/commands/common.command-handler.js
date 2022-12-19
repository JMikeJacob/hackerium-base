const path = require('path');
const fs = require('fs');
const async = require('async');
const CONSTANTS = require('../../utils/constants');

async function getCommandHandler(commandType) {
    try {
        const commandHandler = await new Promise((resolve, reject) => {
            const handlerDir = `${__dirname}/command-handlers/`;

            const files = fs.readdirSync(handlerDir);
            for(let i = 0; i < files.length; i++) {
                if(path.extname(files[i]) === '.js') {
                    const handler = require(handlerDir+files[i]);
                    if(handler.getCommands().includes(commandType)) {
                        resolve(handler)
                        break;
                    }
                }
            }
        })
        
        return commandHandler;
    } catch(err) {
        console.error(err);
        throw err;
    }
};

const commonCommandHandler = (broker) => {
    const __self = this;
    this.broker = broker;
    this.currentCommandHandler = {};
    this.currentAggregate = {};

    this.commandQueue = async.queue( async function(task, callback) {
        console.log('command->'+JSON.stringify(task));
    
        console.log('test->'+JSON.stringify(task));
    
        const events = await task.commandHandler.performCommand(task.command.payload, task.command.aggregateId);
    
        __self.sendEvents(events, task.command.aggregateId);
        
        task.aggregate.addEvents(events);
    
        task.commandHandler.writeCommands(task.command.command, events);
    
        callback();
    }, 1);
    
    this.commandQueue.drain(() => {
        console.log('all commands processed!');
    });
    
    this.sendEvents = (events, streamId) => {
        //for each event
        //eventHandler.emit(event);
        events.forEach((event) => {
            console.log('sending event');
            broker.publish(CONSTANTS.TOPICS.ACCOUNT_MS_EVENTS_TOPIC, event, streamId);
            // broker.publish(CONSTANTS.TOPICS.MATERIALIZED_TOPIC, event, streamId);
        });
    };
    
    this.sendCommand = async (command) => {
        try {
            const commandHandler = await getCommandHandler(command.commandType);
            const aggregate = await commandHandler.getAggregate(command.aggregateId);
            const currentState = await aggregate.getCurrentState(command.aggregateId);

            //apply commandQueue
            return commandHandler.validate(command.payload, currentState)
                .then((payload) => {
                    //send payload to client
                    __self.currentCommandHandler = commandHandler;
                    __self.currentAggregate = aggregate;
                    this.broker.publish(CONSTANTS.TOPICS.ACCOUNT_MS_COMMANDS_TOPIC, {
                        command: {
                            command: command,
                            payload: command.payload,
                            aggregateId: command.aggregateId
                        }
                    }, command.aggregateId);
                
                    return payload;
                })
                .catch((err) => {
                    //send error to client
                    throw err;
                });

        } catch(err) {
            console.error(err);
        }
        
    }

    this.broker.subscribeToCommands((message) => {
        __self.commandQueue.push({
            command: message.command,
            commandHandler: __self.currentCommandHandler,
            aggregate: __self.currentAggregate
        }, (err) => {
            if(err) console.error(err);
            return;
        })
    });

    return this;
}

module.exports = commonCommandHandler;