const express = require('express');
const path = require('path');
const logger = require('morgan');

require('./utils/config');

require('socket.io');
const factory = require('./utils/factory')();

const broker = require('./utils/broker');
const keyValueStore = require('./utils/keyValueStore');
const eventStore = require('./utils/eventStore');
const readRepository = require('./repository/main.repository')(keyValueStore);
const commandHandler = require('./cqrs/commands/common.command-handler')(broker);
const controller = require('./cqrs/controller/main.controller')(readRepository, commandHandler);
const eventHandler = require('./cqrs/events/common.event-handler')(broker, readRepository, commandHandler);
const boundedContextHandler = require('./cqrs/bounded-contexts/common.bounded-context-handler')(broker);

factory.setBroker(broker);
factory.setCommandHandler(commandHandler);
factory.setController(controller);
factory.setEventHandler(eventHandler);
factory.setBoundedContextHandler(boundedContextHandler);
factory.setReadRepository(readRepository);
factory.setEventStore(eventStore);
factory.setKeyValueStore(keyValueStore);

const indexRouter = require('./routes/index');
require('./utils/engine-request');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const cors = require('cors')

app.use(cors({origin: ["http://localhost:4200"], credentials: true}))

app.use('/', indexRouter);

module.exports = app;
