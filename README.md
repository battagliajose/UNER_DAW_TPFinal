<img src="https://secretariaextension.uner.edu.ar/wp-content/uploads/2021/04/logo-original-maschico.png" alt="">

# Tecnicatura Universitaria en Desarrollo Web

## Trabajo Práctico de la materia "Desarrollo de Aplicaciones Web"

### Grupo 'M'

### Integrantes:

- Luis Sanchez
- José Battaglia
- Cristian Seltenreich
- Leonardo Rosas

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

OPENAI_API_KEY= # Completar Key de la API OpenAI
OPENAI_API_ENDPOINT=https://api.openai.com/v1

SMTP_HOST=
SMTP_PORT=
SMTP_USER=test@test.com
SMTP_PASSWORD=pass123
SMTP_SECURESSL=false
```

### Agregar archivo ecosystem.config.js para PM2

```
module.exports = {
  apps: [
    {
      name: 'encuestas',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        CORS_ORIGIN: 'localhost',
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_USER:        # Completar usuario de la BD
        DB_PASSWORD:    # Completar contraseña de la BD
        DB_NAME: 'encuestas',
        DB_LOGGING: 'false',
        DB_LOGGER: 'advanced-console',
        GLOBAL_PREFIX: 'api',
        SWAGGER_HABILITADO: false,
        OPENAI_API_KEY: # Completar Key de la API OpenAI
        OPENAI_API_ENDPOINT: 'https://api.openai.com/v1',
        SMTP_HOST=
        SMTP_PORT=
        SMTP_USER=test@test.com
        SMTP_PASSWORD=pass123
        SMTP_SECURESSL=false
      },
    },
  ],
  time: true,
};
```

## Ejecutar Backend con:

```bash
# Desarrollo
$ npm run start

# Producción - PM2
$ npm run deploy
```

## Ejecutar Frontend con:

```bash
# Desarrollo
$ ng serve

# Producción - Nginx
$ npm run deploy
```

## Swagger

Solo en desarrollo

```bash
http://localhost:3000/api/
```

## Compodoc

```bash
npm run compodoc
```

http://127.0.0.1:8080
