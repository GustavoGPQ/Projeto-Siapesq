DROP DATABASE projeto;

CREATE DATABASE projeto;

USE projeto;


CREATE TABLE usuarios(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    senha VARCHAR(100) NOT NULL,
    telefone VARCHAR(100) NOT NULL
);

CREATE TABLE hidro(
    id INT PRIMARY KEY,
    iduser INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    FOREIGN KEY (iduser) REFERENCES usuarios(id)
);


CREATE TABLE hidrocord(
    id INT PRIMARY KEY AUTO_INCREMENT,
    hidroid INT NOT NULL,
    latitude VARCHAR(1000),
    longitude VARCHAR(1000),
    FOREIGN KEY (hidroid) REFERENCES hidro(id)
);
