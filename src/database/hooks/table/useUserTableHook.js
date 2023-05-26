import useLocalDatabaseHook from '../useLocalDatabaseHook';

const useUserTableHook = () => {
  const {localDb: db} = useLocalDatabaseHook();

  /**
   *
   * @param {import('react-native-sqlite-storage').SQLiteDatabase} db
   */
  const getAllUser = async () => {
    const query = 'SELECT * FROM users';
    try {
      const response = await db.executeSql(query);
      const results = response[0];
      const rows = results.rows.raw();
      return rows;
    } catch (e) {
      console.log('error getalluser');
      console.log(e);
      return [];
    }
  };

  const addUser = async (user) => {
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

    try {
      await db.executeSql(query, [user.name, user.email, user.password]);
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  return {
    isDbReady: !!db,
    addUser,
    getAllUser
  };
};

export default useUserTableHook;
