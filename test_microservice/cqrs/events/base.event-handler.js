function baseEventHandler() {

};

baseEventHandler.prototype.performEvent = function(payload){
    return Promise.resolve(null);
};

baseEventHandler.prototype.getEvents = function(){
    return null;
};

module.exports = baseEventHandler;