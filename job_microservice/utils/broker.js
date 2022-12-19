const CONSTANTS = require('./constants');
const kafka = require('kafka-node');

const kafkaClient = new kafka.KafkaClient({
    kafkaHost: 'kafka:9092'
});
const kafkaProducer = new kafka.Producer(kafkaClient, {
    partitionerType: 3
});

const kafkaJobMicroserviceCommandsConsumerGroup = new kafka.ConsumerGroup({
    host: 'zookeeper:2181',
    kafkaHost: 'kafka:9092',
    groupId: CONSTANTS.CONSUMER_GROUPS.COMMANDS_CONSUMER_GROUP,
    partitionerType: ['roundrobin'],
    fromOffset: 'latest',
    commitOffsetsOnFirstJoin: true,
    autoCommit: true,
    onRebalance: (isAlreadyMember, callback) => { callback(); }
}, [CONSTANTS.TOPICS.JOB_MS_COMMANDS_TOPIC]);

const kafkaJobMicroserviceEventsConsumerGroup = new kafka.ConsumerGroup({
    host: 'zookeeper:2181',
    kafkaHost: 'kafka:9092',
    groupId: CONSTANTS.CONSUMER_GROUPS.EVENTS_CONSUMER_GROUP,
    partitionerType: ['roundrobin'],
    fromOffset: 'latest',
    commitOffsetsOnFirstJoin: true,
    autoCommit: true,
    onRebalance: (isAlreadyMember, callback) => { callback(); }
}, [CONSTANTS.TOPICS.JOB_MS_EVENTS_TOPIC]);

const kafkaJobMicroserviceBoundedContextsConsumerGroup = new kafka.ConsumerGroup({
    host: 'zookeeper:2181',
    kafkaHost: 'kafka:9092',
    groupId: CONSTANTS.CONSUMER_GROUPS.JOB_MS_BOUNDED_CONTEXT_CONSUMER_GROUP,
    partitionerType: ['roundrobin'],
    fromOffset: 'latest',
    commitOffsetsOnFirstJoin: true,
    autoCommit: true,
    onRebalance: (isAlreadyMember, callback) => { callback(); }
}, [CONSTANTS.TOPICS.ACCOUNT_MS_EVENTS_TOPIC]);

const kafkaJobMicroserviceEngineRequestsConsumerGroup = new kafka.ConsumerGroup({
    host: 'zookeeper:2181',
    kafkaHost: 'kafka:9092',
    groupId: CONSTANTS.CONSUMER_GROUPS.JOB_MS_ENGINE_REQUEST_CONSUMER_GROUP,
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

kafkaJobMicroserviceCommandsConsumerGroup.on('connect', () => {
    console.log('WORKING KAFKA COMMANDS')
});
kafkaJobMicroserviceCommandsConsumerGroup.on('error', () => {
    console.error('KAFKA COMMANDS ERROR');
});

kafkaJobMicroserviceEventsConsumerGroup.on('connect', () => {
    console.log('WORKING KAFKA EVENTS')
});
kafkaJobMicroserviceEventsConsumerGroup.on('error', () => {
    console.error('KAFKA EVENTS ERROR');
});
kafkaJobMicroserviceEventsConsumerGroup.on('offsetOutOfRange', (err) => {
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
        kafkaJobMicroserviceCommandsConsumerGroup.on('message', (message) => {
            console.log(message);
            callback(JSON.parse(message.value));
        });
    },

    subscribeToEvents: (callback) => {
        kafkaJobMicroserviceEventsConsumerGroup.on('message', (message) => {
            console.log(message);
            callback(JSON.parse(message.value));
        });
    },

    subscribeToBoundedContexts: (callback) => {
        kafkaJobMicroserviceBoundedContextsConsumerGroup.on('message', (message) => {
            console.log(message);
            callback(JSON.parse(message.value));
        });
    },

    subscribeToEngineRequests: (callback) => {
        kafkaJobMicroserviceEngineRequestsConsumerGroup.on('message', (message) => {
            console.log(message);
            callback(JSON.parse(message.value));
        });
    }
}

module.exports = broker;