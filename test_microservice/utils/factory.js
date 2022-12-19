let _commandHandler = null;
let _eventHandler = null;
let _boundedContextHandler = null;
let _controller = null;
let _broker = null;
let _readRepository = null;
let _keyValueStore = null;
let _eventStore = null;
let _writeRepository = null;

const factory = () => {
    const _self = this;
    
    _self.setCommandHandler = (commandHandler) => {
        _commandHandler = commandHandler;
    };

    _self.setEventHandler = (eventHandler) => {
        _eventHandler = eventHandler;
    };

    _self.setBoundedContextHandler = (boundedContextHandler) => {
        _boundedContextHandler = boundedContextHandler;
    };

    _self.setController = (controller) => {
        _controller = controller;
    };

    _self.setBroker = (broker) => {
        _broker = broker;
    };

    _self.setReadRepository = (readRepository) => {
        _readRepository = readRepository;
    };

    _self.setKeyValueStore = (keyValueStore) => {
        _keyValueStore = keyValueStore;
    };

    _self.setEventStore = (eventStore) => {
        _eventStore = eventStore;
    };

    _self.writeRepository = (writeRepository) => {
        _writeRepository = writeRepository;
    };

    _self.commandHandler = () => {
        return _commandHandler;
    };

    _self.eventHandler = () => {
        return _eventHandler;
    };

    _self.boundedContextHandler = () => {
        return _boundedContextHandler;
    };

    _self.controller = () => {
        return _controller;
    };

    _self.broker = () => {
        return _broker;
    };

    _self.readRepository = () => {
        return _readRepository;
    };

    _self.keyValueStore = () => {
        return _keyValueStore;
    };

    _self.eventStore = () => {
        return _eventStore;
    };

    _self.writeRepository = () => {
        return _writeRepository;
    };

    return _self;
};

module.exports = factory;