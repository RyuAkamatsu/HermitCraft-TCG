import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('db.hctcgDb');

db.exec(
    [{ sql: 'PRAGMA foreign_keys = ON;', args: [] }],
    false,
    () => console.log('Foreign keys turned on')
);

db.transaction(tx => {
    tx.executeSql(
        'CREATE TABLE IF NOT EXISTS cards' +
        ' (id TEXT PRIMARY KEY,' +
        ' name TEXT, ' +
        ' cardType TEXT, ' +
        ' itemType TEXT,' +
        ' rarity TEXT, ' +
        ' description TEXT, ' +
        ' health INTEGER, ' +
        ' primaryAttackName TEXT, ' +
        ' primaryAttackCost TEXT, ' +
        ' primaryAttackValue INTEGER, ' +
        ' primaryAttackDescription TEXT, ' +
        ' secondaryAttackName TEXT, ' +
        ' secondaryAttackCost TEXT,' +
        ' secondaryAttackValue INTEGER, ' +
        ' secondaryAttackDescription TEXT, ' +
        ' tags TEXT, ' +
        ' errata TEXT, ' +
        ' numberOwned INTEGER, ' +
        ' lastModified INTEGER)'
    );
});

db.transaction(tx => {
    tx.executeSql(
        'CREATE TABLE IF NOT EXISTS myDecks' +
        ' (id INTEGER PRIMARY KEY AUTOINCREMENT,' +
        ' name TEXT,' +
        ' tags TEXT)'
    );
});

db.transaction(tx => {
    tx.executeSql(
        'CREATE TABLE IF NOT EXISTS deckCards' +
        ' (id INTEGER PRIMARY KEY AUTOINCREMENT,' +
        ' deckId INTEGER NOT NULL REFERENCES myDecks(id),' +
        ' cardId TEXT NOT NULL REFERENCES cards(id),' +
        ' cardQuantity INTEGER DEFAULT 1)'
    );
});

db.transaction(tx => {
    tx.executeSql(
        'CREATE TABLE IF NOT EXISTS myCollection' +
        ' (id INTEGER PRIMARY KEY AUTOINCREMENT,' +
        ' cardId TEXT NOT NULL REFERENCES cards(id),' +
        ' cardQuantity INTEGER DEFAULT 0)'
    );
});

const executeTransaction = async (sqlQuery: string, args: (any)[]) => new Promise<any>((resolve, reject) => {
    db.transaction(
        tx => {
            tx.executeSql(
                sqlQuery,
                args,
                (t: any, success: any) => { resolve(success); },
                (t, error) => { reject(error); return false; }
            );
        },
    );
});

export { db, executeTransaction };
