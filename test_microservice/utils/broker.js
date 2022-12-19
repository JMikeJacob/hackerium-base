const CONSTANTS = require('./constants');
const kafka = require('kafka-node');

const kafkaClient = new kafka.KafkaClient({
    kafkaHost: 'kafka:9092'
});
const kafkaProducer = new kafka.Producer(kafkaClient, {
    partitionerType: 3
});

const kafkaTestMicroserviceCommandsConsumerGroup = new kafka.ConsumerGroup({
    kafkaHost: 'kafka:9092',
    groupId: CONSTANTS.CONSUMER_GROUPS.TEST_MS_COMMANDS_CONSUMER_GROUP,
    partitionerType: ['roundrobin'],
    fromOffset: 'latest',
    commitOffsetsOnFirstJoin: true,
    autoCommit: true,
    onRebalance: (isAlreadyMember, callback) => { callback(); }
}, [CONSTANTS.TOPICS.TEST_MS_COMMANDS_TOPIC]);

const kafkaTestMicroserviceEventsConsumerGroup = new kafka.ConsumerGroup({
    kafkaHost: 'kafka:9092',
    groupId: CONSTANTS.CONSUMER_GROUPS.TEST_MS_EVENTS_CONSUMER_GROUP,
    partitionerType: ['roundrobin'],
    fromOffset: 'latest',
    commitOffsetsOnFirstJoin: true,
    autoCommit: true,
    onRebalance: (isAlreadyMember, callback) => { callback(); }
}, [CONSTANTS.TOPICS.TEST_MS_EVENTS_TOPIC]);

const kafkaTestMicroserviceBoundedContextsConsumerGroup = new kafka.ConsumerGroup({
    kafkaHost: 'kafka:9092',
    groupId: CONSTANTS.CONSUMER_GROUPS.TEST_MS_BOUNDED_CONTEXT_CONSUMER_GROUP,
    partitionerType: ['roundrobin'],
    fromOffset: 'latest',
    commitOffsetsOnFirstJoin: true,
    autoCommit: true,
    onRebalance: (isAlreadyMember, callback) => { callback(); }
}, [CONSTANTS.TOPICS.ACCOUNT_MS_EVENTS_TOPIC]);

const kafkaTestMicroserviceCodeEngineConsumerGroup = new kafka.ConsumerGroup({
    kafkaHost: 'kafka:9092',
    groupId: CONSTANTS.CONSUMER_GROUPS.TEST_MS_CODE_ENGINE_CONSUMER_GROUP,
    partitionerType: ['roundrobin'],
    fromOffset: 'latest',
    commitOffsetsOnFirstJoin: true,
    autoCommit: true,
    onRebalance: (isAlreadyMember, callback) => { callback(); }
}, [CONSTANTS.TOPICS.TEST_MS_CODE_ENGINE_TOPIC]);

const kafkaTestMicroserviceEngineRequestConsumerGroup = new kafka.ConsumerGroup({
    kafkaHost: 'kafka:9092',
    groupId: CONSTANTS.CONSUMER_GROUPS.TEST_MS_ENGINE_REQUEST_CONSUMER_GROUP,
    partitionerType: ['roundrobin'],
    fromOffset: 'latest',
    commitOffsetsOnFirstJoin: true,
    autoCommit: true,
    onRebalance: (isAlreadyMember, callback) => { callback(); }
}, [CONSTANTS.TOPICS.ENGINE_REQUEST_TOPIC]);

kafkaProducer.on('ready', () => {
    console.log('WORKING KAFKA');
});
kafkaProducer.on('error', () => {
    console.error('KAFKA ERROR');
});

kafkaTestMicroserviceCommandsConsumerGroup.on('connect', () => {
    console.log('WORKING KAFKA COMMANDS')
});
kafkaTestMicroserviceCommandsConsumerGroup.on('error', () => {
    console.error('KAFKA COMMANDS ERROR');
});

kafkaTestMicroserviceEventsConsumerGroup.on('connect', () => {
    console.log('WORKING KAFKA EVENTS')
});
kafkaTestMicroserviceEventsConsumerGroup.on('error', () => {
    console.error('KAFKA EVENTS ERROR');
});
kafkaTestMicroserviceEventsConsumerGroup.on('offsetOutOfRange', (err) => {
    console.error(err);
});

const broker = {
    publish: (topic, message, key) => {
        const kafkaPayloads = [
            {topic: topic, messages: JSON.stringify(message), key: key}
        ];

        kafkaProducer.send(kafkaPayloads, (err, data) => {
            if(err) console.error(err);
            else console.log(data);
        });
    },

    subscribeToCommands: (callback) => {
        kafkaTestMicroserviceCommandsConsumerGroup.on('message', (message) => {
            console.log(message);
            callback(JSON.parse(message.value));
        });
    },

    subscribeToEvents: (callback) => {
        kafkaTestMicroserviceEventsConsumerGroup.on('message', (message) => {
            console.log(message);
            callback(JSON.parse(message.value));
        });
    },

    subscribeToBoundedContexts: (callback) => {
        kafkaTestMicroserviceBoundedContextsConsumerGroup.on('message', (message) => {
            console.log(message);
            callback(JSON.parse(message.value));
        });
    },

    subscribeToCodeEngine: (callback) => {
        kafkaTestMicroserviceCodeEngineConsumerGroup.on('message', (message) => {
            if(message) {
                console.log(message);
                if(message.value) {
                    callback(JSON.parse(message.value));
                }
                else {
                    callback('skip');
                }
            }
        });
    },

    subscribeToEngineRequests: (callback) => {
        kafkaTestMicroserviceEngineRequestConsumerGroup.on('message', (message) => {
            console.log(message);
            callback(JSON.parse(message.value));
        });
    }

    // subscribeToCodeEngineEvents: (callback) => {
    //     kafkaTestMicroserviceCodeEngineConsumerGroup.on('message', (message) => {
    //         console.log(message);
    //         callback(JSON.parse(message.value));
    //     })
    // }
}

module.exports = broker;