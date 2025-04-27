CREATE DATABASE encuestas;

CREATE TYPE tipos_respuesta AS ENUM (
  'ABIERTA',
  'OPCION_MULTIPLE_SELECCION_SIMPLE',
  'OPCION_MULTIPLE_SELECCION_MULTIPLE'
);

CREATE TABLE encuestas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR NOT NULL,
  codigo_respuesta VARCHAR NOT NULL,
  codigo_resultados VARCHAR NOT NULL
);

CREATE TABLE preguntas (
  id SERIAL PRIMARY KEY,
  numero INT NOT NULL,
  texto VARCHAR NOT NULL,
  tipo tipos_respuesta NOT NULL,
  id_encuesta INT NOT NULL REFERENCES encuestas(id)
);

CREATE TABLE opciones (
  id SERIAL PRIMARY KEY,
  texto VARCHAR NOT NULL,
  numero INT NOT NULL,
  id_pregunta INT NOT NULL REFERENCES preguntas(id)
);

CREATE TABLE respuestas (
  id SERIAL PRIMARY KEY,
  id_encuesta INT NOT NULL REFERENCES encuestas(id)
);

CREATE TABLE respuestas_abiertas (
  id SERIAL PRIMARY KEY,
  texto VARCHAR NOT NULL,
  id_pregunta INT NOT NULL REFERENCES preguntas(id),
  id_respuesta INT NOT NULL REFERENCES respuestas(id)
);

CREATE TABLE respuestas_opciones (
  id SERIAL PRIMARY KEY,
  id_respuesta INT NOT NULL REFERENCES respuestas(id),
  id_opcion INT NOT NULL REFERENCES opciones(id)
);