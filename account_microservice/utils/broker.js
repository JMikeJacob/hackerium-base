const CONSTANTS = require('./constants');
const kafka = require('kafka-node');

const kafkaClient = new kafka.KafkaClient({
    kafkaHost: 'kafka:9092'
});
const kafkaProducer = new kafka.Producer(kafkaClient, {
    partitionerType: 3
});

const kafkaAccountMicroserviceCommandsConsumerGroup = new kafka.ConsumerGroup({
    kafkaHost: 'kafka:9092',
    groupId: CONSTANTS.CONSUMER_GROUPS.ACCOUNT_MS_COMMANDS_CONSUMER_GROUP,
    partitionerType: ['roundrobin'],
    fromOffset: 'latest',
    commitOffsetsOnFirstJoin: true,
    autoCommit: true,
    onRebalance: (isAlreadyMember, callback) => { callback(); }
}, [CONSTANTS.TOPICS.ACCOUNT_MS_COMMANDS_TOPIC]);

const kafkaAccountMicroserviceEventsConsumerGroup = new kafka.ConsumerGroup({
    kafkaHost: 'kafka:9092',
    groupId: CONSTANTS.CONSUMER_GROUPS.ACCOUNT_MS_EVENTS_CONSUMER_GROUP,
    partitionerType: ['roundrobin'],
    fromOffset: 'latest',
    commitOffsetsOnFirstJoin: true,
    autoCommit: true,
    onRebalance: (isAlreadyMember, callback) => { callback(); }
}, [CONSTANTS.TOPICS.ACCOUNT_MS_EVENTS_TOPIC]);

kafkaProducer.on('ready', () => {
    console.log('WORKING KAFKA');
});
kafkaProducer.on('error', () => {
    console.error('KAFKA ERROR');
});

kafkaAccountMicroserviceCommandsConsumerGroup.on('connect', () => {
    console.log('WORKING KAFKA COMMANDS')
});
kafkaAccountMicroserviceCommandsConsumerGroup.on('error', () => {
    console.error('KAFKA COMMANDS ERROR');
});

kafkaAccountMicroserviceEventsConsumerGroup.on('connect', () => {
    console.log('WORKING KAFKA EVENTS')
});
kafkaAccountMicroserviceEventsConsumerGroup.on('error', () => {
    console.error('KAFKA EVENTS ERROR');
});
kafkaAccountMicroserviceEventsConsumerGroup.on('offsetOutOfRange', (err) => {
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
        kafkaAccountMicroserviceCommandsConsumerGroup.on('message', (message) => {
            console.log(message);
            callback(JSON.parse(message.value));
        });
    },

    subscribeToEvents: (callback) => {
        kafkaAccountMicroserviceEventsConsumerGroup.on('message', (message) => {
            console.log(message);
            callback(JSON.parse(message.value));
        });
    },
}

module.exports = broker;