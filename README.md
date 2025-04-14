# Montaje del proyecto.

## Requisitos mínimos

Se recomienda realizar la instalación en una distribución de GNU/Linux para un correcto funcionamiento.

- PostgreSQL

  ```bash
  # ArchLinux
  pacman -S postgresql
  ```

  Inizializa la base de datos

  ```bash
  # Linux
  sudo -u postgres initdb -D /var/lib/postgres/data
  sudo -u postgres psql
  ```

  Crea un usuario con su contraseña<br />
  <small>Advertencia: el ejemplo proporcionado a acontinución está hecho con fines de desarrollo, en producción se debe mejorar la seguridad de la contraseña y limitar los permisos de la base de datos.</small>

  ```postgresql
  CREATE USER root WITH PASSWORD 'root';
  CREATE DATABASE erinias OWNER root;
  GRANT ALL PRIVILEGES ON DATABASE erinias TO root;
  \q
  ```

  Consulta la [documentación de PostgreSQL](https://www.postgresql.org/docs/) para una configuración más avanzada.

- Redis
  ```bash
  # ArchLinux
  sudo pacman -S valkey
  ```
- Bun

  ```bash
  # Linux
  curl -fsSL https://bun.sh/install | bash

  # Windows
  powershell -c "irm bun.sh/install.ps1 | iex"
  ```

## Variables de entorno

Existen tres variables de entorno.

- Base de datos<br />
  La configuración de la base de datos se realizará con la configuración realizada en el apartado anterior.

  ```bash
  DATABASE_URL="postgres://usuario:contrasenya@localhost:5432/erinias"
  ```

  Para más información, consulte la [documentación oficial](https://www.npgsql.org/doc/connection-string-parameters.html).

- JWT y Refresh token
  Las claves JWT (JSON Web Token) y refresh son cadenas de cáracteres aleatorias, se recomienda generarlas con el siguiente comando.
  ```bash
  openssl rand -base64 48
  ```
  Se deben generan dos cadenas distintas para cada token.
  ```bash
  JWT_SECRET="CADENA_ALEATORIA"
  REFRESH_SECRET="CADENA_ALEATORIA"
  ```

## Instalación

La instalación se realiza con el gestor de paquetes de Bun con el siguiente comando.

```bash
bun install
```

## Desarrollo

Para iniciar el proyecto en modo desarrollo, se ejecuta el siguiente comando.

```bash
bun dev
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
