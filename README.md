<img src="https://secretariaextension.uner.edu.ar/wp-content/uploads/2021/04/logo-original-maschico.png" alt="">

# Tecnicatura Universitaria en Desarrollo Web

## Trabajo Práctico de Desarrollo de Aplicaciones Web

### Integrantes:

- Luis Sanchez
- José Battaglia
- Cristian Seltenreich
- Leonardo Rosas
- Dalila Forni

### Agregar usuario y password de la base de datos y guardar como .env

```bash
    PORT=3000
    DB_HOST=LOCALHOST
    DB_PORT=5432
    DB_USER=        #completar usuario de la BD
    DB_PASSWORD=    #completar contraseña de la BD
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
