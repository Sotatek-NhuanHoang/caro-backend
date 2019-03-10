import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import PouchDBMemory from 'pouchdb-adapter-memory';


PouchDB.plugin(PouchDBFind);
PouchDB.plugin(PouchDBMemory);


export const getSync = (db, selector = {}) => {
    const a = db.sync(db.REMOTE_DB_URL, {
        live: true,
        retry: true,
        push: true,
        pull: true,
        selector: selector,
    });
    db.compact();

    return a;
};


export const getChanges = (db, selector = {}, callback) => {
    db.changes({
        selector: selector,
        live: true,
        include_docs: true,
    }).on('change', callback);
};


export const createDb = (localDB, adapter = 'memory') => {
    const db =  new PouchDB(localDB, {
        adapter: adapter,
        cache : false,
    });

    db.compact();
    db.setMaxListeners(50);
    db.REMOTE_DB_URL = 'https://caro-couchdb.herokuapp.com/' + localDB;

    return db;
};


export default createDb;
