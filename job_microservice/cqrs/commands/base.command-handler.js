function baseCommandHandler() {

};

baseCommandHandler.prototype.getAggregate = function(payload) {
    return Promise.resolve(null);
};

baseCommandHandler.prototype.validate = function(payload, aggregate) {
    return Promise.resolve(null);
};

baseCommandHandler.prototype.performCommand = function(payload){
    return Promise.resolve(null);
};

baseCommandHandler.prototype.getCommands = function(){
    return null;
};

baseCommandHandler.prototype.writeCommands = function (command, events) {
    //what to save in the write model db
    //writeRepo.saveSeeker(?,?)
    return Promise.resolve(null);
}

module.exports = baseCommandHandler;