<img src="https://secretariaextension.uner.edu.ar/wp-content/uploads/2021/04/logo-original-maschico.png" alt="">

# Tecnicatura Universitaria en Desarrollo Web

## Trabajo Práctico de la materia "Desarrollo de Aplicaciones Web"

### Integrantes:

- Luis Sanchez
- José Battaglia
- Cristian Seltenreich
- Leonardo Rosas
- Dalila Forni

### Agregar dependencias

```bash
$ npm install
```

### Agregar archivo .env

```bash
PORT=3000
DB_HOST=LOCALHOST
DB_PORT=5432
DB_USER=        # Completar usuario de la BD
DB_PASSWORD=    # Completar contraseña de la BD
DB_NAME=encuestas
DB_LOGGING=true
DB_LOGGER=advanced-console
GLOBAL_PREFIX=api
SWAGGER_HABILITADO=true
```

## Ejecutar con:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Swagger

```bash
http://localhost:3000/api/
```

## End-Points de prueba

```bash
Get:
http://localhost:3000/v1/encuestas/:id

Post:
http://localhost:3000/v1/encuestas
```
