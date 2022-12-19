// const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');
const async = require('async');
const CONSTANTS = require('../../utils/constants');

// async.queue
const eventQueue = async.queue(function(task, callback) {
    console.log(task)
    task.func();
    callback();
}, 1);

async function getEventHandler(eventType) {
    try {
        const eventHandler = await new Promise((resolve, reject) => {
            const handlerDir = `${__dirname}/event-handlers/`;

            const files = fs.readdirSync(handlerDir);
            for(let i = 0; i < files.length; i++) {
                if(path.extname(files[i]) === '.js') {
                    const handler = require(handlerDir+files[i]);
                    if(handler.getEvents().includes(eventType)) {
                        resolve(handler)
                        break;
                    }
                }
            }
        })
        
        return eventHandler;
    } catch(err) {
        console.error(err);
        throw err;
    }
};

const commonEventHandler = (broker, readRepository, commonCommandHandler) => {
    const _self = this;
    this.broker = broker;
    this.repo = readRepository;
    this.commonCommandHandler = commonCommandHandler;

    this.broker.subscribeToEvents((event) => {
        console.log('event received!!!');
        eventQueue.push({func: async function(callback) {
            const eventHandler = await getEventHandler(event.payload.eventType);
            _self.repo.updateFromEvent(event);
            
            const commands = eventHandler.performEvent(event);
            
        }});
    });
    
    return this;
}

module.exports = commonEventHandler;