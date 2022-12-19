const path = require('path');
const fs = require('fs');
const async = require('async');
const CONSTANTS = require('../../utils/constants');

// async.queue
const boundedContextQueue = async.queue(async function(event, callback) {
    try {
        const boundedContextHandler = await getBoundedContextHandler(event.aggregate);

        if(boundedContextHandler) {
            const aggregate = await boundedContextHandler.getAggregate();

            boundedContextHandler.performCopy(event, aggregate);
        }
    } catch(err) {
        console.error(err);
    }
}, 1);


async function getBoundedContextHandler(aggregateType) {
    try {
        const boundedContextHandler = await new Promise((resolve, reject) => {
            const handlerDir = `${__dirname}/bounded-context-handlers/`;

            const files = fs.readdirSync(handlerDir);
            for(let i = 0; i < files.length; i++) {
                if(path.extname(files[i]) === '.js') {
                    const handler = require(handlerDir+files[i]);
                    if(handler.getHandledAggregate().includes(aggregateType)) {
                        resolve(handler)
                        break;
                    }
                }
            }
        })
        
        return boundedContextHandler;
    } catch(err) {
        console.error(err);
        throw err;
    }
};

const boundedContextHandler = (broker) => {
    this.broker = broker;

    broker.subscribeToBoundedContexts((event) => {
        console.log('bounded context event received!!!')
        boundedContextQueue.push(event, (err) => {
            if(err) console.error(err);
            return;
        })
    });

    return this;
}

module.exports = boundedContextHandler;