const PouchDB = require('./index');
const db = new PouchDB('https://caro-couchdb.herokuapp.com/matchstatusdb');


module.exports = db;
