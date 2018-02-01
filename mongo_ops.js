const assert = require('assert');

exports.insertDocument = (db, document, collection, callback) => {
    collection.insert(document, (err, result) => {
        assert.equal(err, null);
        callback(result);
    });
};

exports.findDocument = (db, query, collection, callback) => {
    collection.find(query).toArray((err, doc) => {
        assert.equal(err, null);
        callback(doc);        
    });
};
