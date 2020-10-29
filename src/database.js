const mysql = require('mysql');
const { promisify }  = require('util');
const {database} = require ('./keys');

const pool = mysql.createPool(database);
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('La conexión con la base de datos fue cerrada');
        }

        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Verificación de cantidad de conexiones');
        }

        if (err.code === 'ECONNREFUSED') {
            console.error('Nuestra conexión fue rechazada');
        }
    }
    if (connection) connection.release();
        console.log('Conexión exitosa con la base de datos');
        return;
});

pool.query = promisify(pool.query);
module.exports = pool;
