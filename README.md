# Montaje del Proyecto

## Requisitos mínimos

Se recomienda realizar la instalación en una distribución de **GNU/Linux** o en un **WSL (Windows Subsystem for Linux)** para un correcto funcionamiento.

### PostgreSQL

Para instalar PostgreSQL, sigue las instrucciones según tu distribución.

#### ArchLinux:
```bash
pacman -S postgresql
```

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

#### Fedora:
```bash
sudo dnf install postgresql-server postgresql-contrib
```

#### CentOS/RHEL:
```bash
sudo yum install postgresql-server postgresql-contrib
```

### Inicializar la base de datos:

#### **Ubuntu/Debian**:
En estas distribuciones, PostgreSQL se inicializa automáticamente al instalarlo.

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

Accede a PostgreSQL con el usuario `postgres`:

```bash
sudo -u postgres psql
```

Luego, crea un usuario y una base de datos:

```postgresql
CREATE USER root WITH PASSWORD 'root';
CREATE DATABASE erinias OWNER root;
GRANT ALL PRIVILEGES ON DATABASE erinias TO root;
\q
```

#### **ArchLinux, Fedora, CentOS/RHEL**:
Para estas distribuciones, es necesario inicializar PostgreSQL manualmente si no lo has hecho aún:

```bash
sudo -u postgres initdb -D /var/lib/postgresql/data
```

Inicia el servicio de PostgreSQL y habilítalo para que se inicie automáticamente:

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

Accede a PostgreSQL con el usuario `postgres`:

```bash
sudo -u postgres psql
```

Luego, crea un usuario y una base de datos:

```postgresql
CREATE USER root WITH PASSWORD 'root';
CREATE DATABASE erinias OWNER root;
GRANT ALL PRIVILEGES ON DATABASE erinias TO root;
\q
```

Consulta la [documentación de PostgreSQL](https://www.postgresql.org/docs/) para una configuración más avanzada.

---

### Redis

Para instalar Redis, sigue las instrucciones según tu distribución.

#### ArchLinux:
```bash
sudo pacman -S redis
```

#### Ubuntu/Debian:
```bash
sudo apt install redis-server
```

#### Fedora:
```bash
sudo dnf install redis
```

#### CentOS/RHEL:
```bash
sudo yum install redis
```

---

### Bun

#### Linux (todas las distribuciones):
```bash
# Instalar Bun
curl -fsSL https://bun.sh/install | bash
```

---

## Variables de entorno

Existen tres variables de entorno que debes configurar.

- **Base de datos**  
  La configuración de la base de datos se realizará con la configuración realizada en el apartado anterior.

  ```bash
  DATABASE_URL="postgres://root:root@localhost:5432/erinias"
  ```

  Para más información, consulta la [documentación oficial de PostgreSQL](https://www.npgsql.org/doc/connection-string-parameters.html).

- **JWT y Refresh secret**  
  Las claves JWT (JSON Web Token) y refresh son cadenas de caracteres aleatorias. Se recomienda generarlas con el siguiente comando:

  ```bash
  openssl rand -base64 48
  ```

  Se deben generar dos cadenas distintas, una para cada token:

  ```bash
  JWT_SECRET="CADENA_ALEATORIA"
  REFRESH_SECRET="CADENA_ALEATORIA"
  ```

---

## Instalación

La instalación se realiza con el gestor de paquetes **Bun** con el siguiente comando:

```bash
bun install
```

Luego, debes crear las tablas usando los esquemas realizados con **DrizzleORM**:

```bash
bun run db:push
```

---

## Desarrollo

Para iniciar el proyecto en modo desarrollo, ejecuta el siguiente comando:
https://github.com/FiloSottile/mkcert
```bash
bun dev
```

---

## Building

Para crear una versión de producción de tu aplicación:

```bash
npm run build
```

Puedes previsualizar la construcción de producción con:

```bash
npm run preview
```

> Para desplegar tu aplicación, es posible que necesites instalar un [adaptador](https://svelte.dev/docs/kit/adapters) para tu entorno de destino.

---

### Notas adicionales

Si estás utilizando **WSL** (Windows Subsystem for Linux), asegúrate de seguir las instrucciones correspondientes para instalar PostgreSQL, Redis y Bun en tu entorno Linux dentro de Windows. Ten en cuenta que algunas configuraciones pueden variar dependiendo de la versión de WSL y los subsistemas que estés utilizando.