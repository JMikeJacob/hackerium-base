function baseBoundedContextHandler() {

};

baseBoundedContextHandler.prototype.getHandledAggregate = function() {
    return null;
};

baseBoundedContextHandler.prototype.performCopy = function(event, aggregate){
    return Promise.resolve(null);
};

baseBoundedContextHandler.prototype.getAggregate = function(){
    return Promise.resolve(null);
};

module.exports = baseBoundedContextHandler;