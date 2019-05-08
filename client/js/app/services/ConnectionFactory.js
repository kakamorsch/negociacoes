var ConnectionFactory = (function() {
  const store = ["negociacoes"];
  const version = 4;
  const dbName = "aluraframe";

  let connection = null;
  let close = null;

  return class ConnectionFactory {
    constructor() {
      throw new Error("Nao eh possivel criar instancias de ConnectionFactory");
    }
    static getConnection() {
      return new Promise((resolve, reject) => {
        let openRequest = window.indexedDB.open(dbName, version);
        openRequest.onupgradeneeded = e => {
          this._createStores(e.target.result);
        };
        openRequest.onsuccess = e => {
          if (!connection) {
            connection = e.target.result;
            close = connection.close.bind(connection);
            connection.close = function() {
              throw new Error("Voce nao pode fechar diretamente a conexao");
            };
          }
          resolve(connection);
        };
        openRequest.onerror = e => {
          console.log("Ocorreu um erro ao realizar a conexao");
          reject(e.target.error.name);
        };
      });
    }
    static _createStores(connection) {
      store.forEach(store => {
        if (connection.objectStoreNames.contains(store))
          connection.deleteObjectStore(store);

        connection.createObjectStore(store, { autoIncrement: true });
      });
    }
    static closeConnection() {
      if (connection) {
        close();
        connection = null;
      }
    }
  };
})();
