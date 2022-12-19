const CONSTANTS = require('./constants');
const kafka = require('kafka-node');

const kafkaClient = new kafka.KafkaClient({
    kafkaHost: 'kafka:9092'
});
const kafkaProducer = new kafka.Producer(kafkaClient, {
    partitionerType: 3
});

const kafkaEventsConsumerGroup = new kafka.ConsumerGroup({
    kafkaHost: 'kafka:9092',
    groupId: CONSTANTS.CONSUMER_GROUPS.EVENTS_CONSUMER_GROUP,
    partitionerType: ['roundrobin'],
    fromOffset: 'latest',
    commitOffsetsOnFirstJoin: true,
    autoCommit: true,
    onRebalance: (isAlreadyMember, callback) => { callback(); }
}, [CONSTANTS.TOPICS.ACCOUNT_MS_EVENTS_TOPIC, CONSTANTS.TOPICS.JOB_MS_EVENTS_TOPIC, CONSTANTS.TOPICS.TEST_MS_EVENTS_TOPIC]);

const kafkaTestMicroserviceCodeEngineConsumerGroup = new kafka.ConsumerGroup({
    kafkaHost: 'kafka:9092',
    groupId: CONSTANTS.CONSUMER_GROUPS.PUSH_MS_CODE_ENGINE_CONSUMER_GROUP,
    partitionerType: ['roundrobin'],
    fromOffset: 'latest',
    commitOffsetsOnFirstJoin: true,
    autoCommit: true,
    onRebalance: (isAlreadyMember, callback) => { callback(); }
}, [CONSTANTS.TOPICS.TEST_MS_CODE_ENGINE_TOPIC]);

kafkaProducer.on('ready', () => {
    console.log('WORKING KAFKA');
});
kafkaProducer.on('error', () => {
    console.error('KAFKA ERROR');
});

kafkaEventsConsumerGroup.on('connect', () => {
    console.log('WORKING KAFKA EVENTS')
});
kafkaEventsConsumerGroup.on('error', () => {
    console.error('KAFKA EVENTS ERROR');
});
kafkaEventsConsumerGroup.on('offsetOutOfRange', (err) => {
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

    subscribeToEvents: (callback) => {
        kafkaEventsConsumerGroup.on('message', (message) => {
            console.log(message);
            callback(JSON.parse(message.value));
        });
    },

    subscribeToCodeEngine: (callback) => {
        kafkaTestMicroserviceCodeEngineConsumerGroup.on('message', (message) => {
            console.log(message);
            callback(JSON.parse(message.value));
        })
    }
}

module.exports = broker;