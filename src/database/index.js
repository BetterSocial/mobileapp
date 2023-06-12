import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);
const DB_NAME = 'bettersocial.db';

let db = null;

const getDBConnection = async () => {
  if (db) return Promise.resolve(db);
  db = SQLite.openDatabase(
    {
      name: DB_NAME,
      location: 'default'
    },
    () => {
      console.log('success connecting database');
    },
    (e) => {
      console.log('failed connecting database');
      console.log(e);
      return Promise.reject(e);
    }
  );

  return Promise.resolve(db);
};

const LocalDatabase = {
  getDBConnection
};

export default LocalDatabase;
