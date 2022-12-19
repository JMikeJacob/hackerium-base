// const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');
const async = require('async');
const CONSTANTS = require('../../utils/constants');

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
    const __self = this;
    this.broker = broker;
    this.repo = readRepository;
    this.commonCommandHandler = commonCommandHandler;

    this.currentEventHandler = {};

    this.eventQueue = async.queue(async function(event, callback) {
        console.log('event->'+JSON.stringify(event));
    
        const eventHandler = await getEventHandler(event.payload.eventType);
        __self.repo.updateFromEvent(event);
    
        return;
    
        callback();
    }, 1);
    
    this.eventQueue.drain(() => {
        console.log('all events processed!');
    });

    this.broker.subscribeToEvents((event) => {
        console.log('event received!!!');

        __self.eventQueue.push(event, (err) => {
            if(err) console.error(err);
            return;
        });

    });
    
    return this;
}

module.exports = commonEventHandler;