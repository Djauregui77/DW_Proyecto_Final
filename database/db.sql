CREATE DATABASE clinica_links;
use database_links;

CREATE table medicos(
    id INT (11) NOT NULL,
    nombre VARCHAR (50) NOT NULL,
    apellidos VARCHAR(50) NOT NULL,
    contrasena VARCHAR (50) NOT NULL
);

ALTER TABLE medicos
    ADD PRYMARY KEY (id);

ALTER TABLE medicos
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;

DESCRIBE medicos;