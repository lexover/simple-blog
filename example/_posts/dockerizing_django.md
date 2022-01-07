---
date: '2021-02-17'
slug: dockerizing-django-with-postres-guniconr-nginx
tags:
- Docker
- Django
- Python
title: Докеризация Django c PostrgeSQL, Gunicorn и Nginx.
description: Пошаговая инструкция по настройке запуска Django в связке PostrgeSQL, Gunicorn, Nginx на Docker.
author: Michael Herman (translated by Lexover)
location: Russia 
image: https://res.cloudinary.com/dm3m076ji/image/upload/v1613595228/media/lexover_blog/docker-django_k0wuo4.png
meta:
  - name: title
    content: Докеризация Django c PostrgeSQL, Gunicorn и Nginx.
  - name: description
    content: Пошаговая инструкция по настройке запуска Django в связке PostrgeSQL, Gunicorn, Nginx на Docker.
  - name: keywords
    content: Docker, Docker-compose, Django, PostgreSQL, Gunicorn, Nginx
  - name: author
    content: Michael Herman (translated by Lexover)
  - name: language
    content: Russian 
featured: true
---
Перевод статьи [Michael Herman: Dockerizing Django with Postgres, Gunicorn, and Nginx](https://testdriven.io/blog/dockerizing-django-with-postgres-gunicorn-and-nginx/). 

Это пошаговое руководство, в котором подробно описано, как настроить Django в связке с PostgreSQL для работы в контейнере Docker. Для производственных сред мы добавим Nginx и Gunicorn. Мы также рассмотрим, как обслуживать статические и мультимедийные файлы Django через Nginx.

>Серия статей о Django на Docker:
>1. [Dockerizing Django with Postgres, Gunicorn, and Nginx](https://testdriven.io/blog/dockerizing-django-with-postgres-gunicorn-and-nginx/)
>2. [Securing a Containerized Django Application with Let's Encrypt](https://testdriven.io/blog/django-lets-encrypt/)
>3. [Deploying Django to AWS with Docker and Let's encrypt](https://testdriven.io/blog/django-docker-https-aws/)

## Настройка проекта
Создадим новый каталог с проектом Django:
```sh
$ mkdir django-on-docker && cd django-on-docker
$ mkdir app && cd app
$ python3.8 -m venv env
$ source env/bin/activate
(env)$ pip install django==3.0.7
(env)$ django-admin.py startproject hello_django .
(env)$ python manage.py migrate
(env)$ python manage.py runserver
```
Перейдите в браузере по адресу `http://localhost:8000/`, чтобы просмотреть проверить работоспособность Django. Завершите работу сервера и выйдите из виртуальной среды после завершения. Теперь у нас есть простой проект Django, с которым можно работать.

Создайте файл requirements.txt в каталоге app и добавьте Django в зависимости:
```sh
Django==3.0.7
```
Поскольку мы перейдем к Postgres, удалите файл db.sqlite3 из каталога "app".

Каталог вашего проекта должен выглядеть так:
```
└── app
    ├── hello_django
    │   ├── __init__.py
    │   ├── asgi.py
    │   ├── settings.py
    │   ├── urls.py
    │   └── wsgi.py
    ├── manage.py
    └── requirements.txt
```

## Docker

Установите [Docker](https://docs.docker.com/install/), если он еще не установлен у вас, затем добавьте файл `Dockerfile` в директорию `"app"` со следующим содержимым:
```dockerfile
# app/Dockerfile

# pull official base image
FROM python:3.8.3-alpine

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# copy project
COPY . .
```

Итак, мы начали с [образа Docker](https://hub.docker.com/_/python/) на базе [Alpine](https://github.com/gliderlabs/docker-alpine) для Python 3.8.3. Затем мы устанавливаем [рабочий каталог](https://docs.docker.com/engine/reference/builder/#workdir) вместе с двумя переменными среды:
1. `PYTHONDONTWRITEBYTECODE`: запрещает Python запись `pyc` файлов на диск (эквивалент [опции](https://docs.python.org/3/using/cmdline.html#id1) `python -B')
2. `PYTHONUNBUFFERED`: запрещает Python выполнять вывод stdout и stderr (эквивалент [опции](https://docs.python.org/3/using/cmdline.html#cmdoption-u) `python -u`)

Наконец, мы обновили Pip, скопировали файл requirements.txt, установили зависимости и скопировали сам проект Django.

>Просмотрите [Docker для разработчиков Python](https://mherman.org/presentations/dockercon-2018), чтобы узнать больше о структурировании файлов Docker, а также о некоторых передовых методах настройки Docker для разработки на основе Python.

Затем добавьте файл *docker-compose.yml* в корень проекта:
```yaml
# docker-compose.yml
version: '3.7'

services:
  web:
    build: ./app
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - ./app/:/usr/src/app/
    ports:
      - 8000:8000
    env_file:
      - ./.env.dev
```
>Информация о Compose файле и том как это работает можно почитать [здесь](https://docs.docker.com/compose/compose-file/).

Обновите переменные `SECRET_KEY`, `DEBUG` и `ALLOWED_HOSTS` в *settings.py*:

```python
SECRET_KEY = os.environ.get("SECRET_KEY")

DEBUG = int(os.environ.get("DEBUG", default=0))

# 'DJANGO_ALLOWED_HOSTS' should be a single string of hosts with a space between each.
# For example: 'DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]'
ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS").split(" ")
```

Затем создайте файл *.env.dev* в корне проекта для хранения переменных среды для разработки:
```sh
DEBUG=1
SECRET_KEY=foo
DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]
```
Создайте образ:
```sh
$ docker-compose build
```
Как только образ будет создан запустите контейнер:
```
$ docker-compose up -d
```

Снова перейдите в браузере по адресу `http://localhost:8000/`, чтобы проверить работоспособность созданного образа (должен быть отображен экран приветствия).

>Если что-то пошло не так и экран приветствия не отображен, проверьте лог-файлы на наличие ошибок: `docker-compose logs -f`

## PostgreSQL

Чтобы настроить PostgreSQL, нам нужно добавить новый сервис в файл *docker-compose.yml*, обновить настройки Django и установить [Psycopg2](http://initd.org/psycopg/).

Для начала добавим новый сервис с именем `db` в файл *docker-compose.yml*:
```yaml
# docker-compose.yml
version: '3.7'

services:
  web:
    build: ./app
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - ./app/:/usr/src/app/
    ports:
      - 8000:8000
    env_file:
      - ./.env.dev
    depends_on:
      - db
  db:
    image: postgres:12.0-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    environment:
      - POSTGRES_USER=hello_django
      - POSTGRES_PASSWORD=hello_django
      - POSTGRES_DB=hello_django_dev

volumes:
  postgres_data:
```
Чтобы сохранить данные по завершению работы контейнера, мы настроили volume. Эта конфигурация привяжет postgres_data к каталогу "/var/lib/postgresql/data/" в контейнере.

Мы также добавили переменную окружения, чтобы задать имя для базы данных по умолчанию и установить имя пользователя и пароль.

>Для получения дополнительной информации просмотрите раздел «Переменные среды» на странице [Postgres Docker Hub](https://hub.docker.com/_/postgres).

Нам также понадобятся некоторые новые переменные окружения для веб-службы, поэтому отредактируйте *.env.dev* следующим образом:

```sh
DEBUG=1
SECRET_KEY=foo
DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]
SQL_ENGINE=django.db.backends.postgresql
SQL_DATABASE=hello_django_dev
SQL_USER=hello_django
SQL_PASSWORD=hello_django
SQL_HOST=db
SQL_PORT=5432
```

Update the `DATABASES` dict in *settings.py*:

```python
# settings.py

DATABASES = {
    "default": {
        "ENGINE": os.environ.get("SQL_ENGINE", "django.db.backends.sqlite3"),
        "NAME": os.environ.get("SQL_DATABASE", os.path.join(BASE_DIR, "db.sqlite3")),
        "USER": os.environ.get("SQL_USER", "user"),
        "PASSWORD": os.environ.get("SQL_PASSWORD", "password"),
        "HOST": os.environ.get("SQL_HOST", "localhost"),
        "PORT": os.environ.get("SQL_PORT", "5432"),
    }
}
```

Теперь база данных настроена с помощью переменных окружения которые мы определили в файле *.env.dev*, обратите внимание на значения по умолчанию.

Обновите *Dockerfile*, чтобы установить соответствующие пакеты, необходимые для `Psycopg2`:
```dockerfile
# Dockerfile

# pull official base image
FROM python:3.8.3-alpine

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# copy project
COPY . .
```

Добавьте Psycopg2 в *requirements.txt*:
```
Django==3.0.7
psycopg2-binary==2.8.5
```

>Ознакомьтесь с [GitHub Issue](https://github.com/psycopg/psycopg2/issues/684) для получения дополнительной информации об установке Psycopg2 в образ Docker на базе Alpine.

Создайте новый образ и запустите два контейнера:

```sh
$ docker-compose up -d --build
```

Запустите миграцию:
```sh
$ docker-compose exec web python manage.py migrate --noinput
```

>Получили следующую ошибку?
>
>```django.db.utils.OperationalError: FATAL:  database "hello_django_dev" does not exist```
>
>Запустите команду `docker-compose down -v`, чтобы удалить тома вместе с контейнерами. Затем заново соберите образы, запустите контейнеры и примените миграции.

Убедитесь, что таблицы Django по умолчанию созданы:

```
$ docker-compose exec db psql --username=hello_django --dbname=hello_django_dev

psql (12.0)
Type "help" for help.

hello_django_dev=# \l
                                          List of databases
       Name       |    Owner     | Encoding |  Collate   |   Ctype    |       Access privileges
------------------+--------------+----------+------------+------------+-------------------------------
 hello_django_dev | hello_django | UTF8     | en_US.utf8 | en_US.utf8 |
 postgres         | hello_django | UTF8     | en_US.utf8 | en_US.utf8 |
 template0        | hello_django | UTF8     | en_US.utf8 | en_US.utf8 | =c/hello_django              +
                  |              |          |            |            | hello_django=CTc/hello_django
 template1        | hello_django | UTF8     | en_US.utf8 | en_US.utf8 | =c/hello_django              +
                  |              |          |            |            | hello_django=CTc/hello_django
(4 rows)

hello_django_dev=# \c hello_django_dev
You are now connected to database "hello_django_dev" as user "hello_django".

hello_django_dev=# \dt
                     List of relations
 Schema |            Name            | Type  |    Owner
--------+----------------------------+-------+--------------
 public | auth_group                 | table | hello_django
 public | auth_group_permissions     | table | hello_django
 public | auth_permission            | table | hello_django
 public | auth_user                  | table | hello_django
 public | auth_user_groups           | table | hello_django
 public | auth_user_user_permissions | table | hello_django
 public | django_admin_log           | table | hello_django
 public | django_content_type        | table | hello_django
 public | django_migrations          | table | hello_django
 public | django_session             | table | hello_django
(10 rows)

hello_django_dev=# \q
```

Вы можете проверить, что том был создан, запустив:

```sh
$ docker volume inspect django-on-docker_postgres_data
```

Вы должны увидеть что-то похожее на:
```json
[
    {
        "CreatedAt": "2020-06-13T18:43:56Z",
        "Driver": "local",
        "Labels": {
            "com.docker.compose.project": "django-on-docker",
            "com.docker.compose.version": "1.25.4",
            "com.docker.compose.volume": "postgres_data"
        },
        "Mountpoint": "/var/lib/docker/volumes/django-on-docker_postgres_data/_data",
        "Name": "django-on-docker_postgres_data",
        "Options": null,
        "Scope": "local"
    }
]
```
Затем добавьте файл *entrypoint.sh* в каталог "app", чтобы проверить работоспособность Postgres перед применением миграции и запуском сервера разработки Django:

```sh
# app/entrypoint.sh

#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

python manage.py flush --no-input
python manage.py migrate

exec "$@"
```
Обновите права доступа к файлу локально:

```sh
$ chmod +x app/entrypoint.sh
```

Затем обновите файл *Dockerfile*, чтобы скопировать файл *entrypoint.sh* и запустить его как команду [entrypoint](https://docs.docker.com/engine/reference/builder/#entrypoint) Docker:
```dockerfile
# Dockerfile

# pull official base image
FROM python:3.8.3-alpine

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# copy entrypoint.sh
COPY ./entrypoint.sh .

# copy project
COPY . .

# run entrypoint.sh
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
```

Добавьте переменную окружения `DATABASE` в *.env.dev*:
```
DEBUG=1
SECRET_KEY=foo
DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]
SQL_ENGINE=django.db.backends.postgresql
SQL_DATABASE=hello_django_dev
SQL_USER=hello_django
SQL_PASSWORD=hello_django
SQL_HOST=db
SQL_PORT=5432
DATABASE=postgres
```

Проверьте сборку снова:

1. Пересобирите образы.
2. Запустите контейнеры
3. Проверьте вывод в браузере http://localhost:8000/

**Примечание**

Во-первых, несмотря на добавление Postgres, мы все еще можем создать независимый образ Docker для Django, если для переменной среды `DATABASE` не задано значение `postgres`. Для тестирования создайте новый образ, а затем запустите новый контейнер:

```sh
$ docker build -f ./app/Dockerfile -t hello_django:latest ./app
$ docker run -d \
    -p 8006:8000 \
    -e "SECRET_KEY=please_change_me" -e "DEBUG=1" -e "DJANGO_ALLOWED_HOSTS=*" \
    hello_django python /usr/src/app/manage.py runserver 0.0.0.0:8000
```

Вы должны увидеть страницу приветствия по адресу http://localhost:8006.

Во-вторых, вы можете закомментировать команды очистки базы данных и миграции в сценарии *entrypoint.sh*, чтобы они не запускались при каждом запуске или перезапуске контейнера:

```sh
# entrypoint.sh

#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

# python manage.py flush --no-input
# python manage.py migrate

exec "$@"
```
Вместо этого вы можете запускать их вручную после того, как контейнеры запустятся, например:

```sh
$ docker-compose exec web python manage.py flush --no-input
$ docker-compose exec web python manage.py migrate
```

## Gunicorn

Двигаясь дальше, для создания production окружения давайте добавим Gunicorn, сервер WSGI production уровня, в файл *requirements.txt*:
```
Django==3.0.7
gunicorn==20.0.4
psycopg2-binary==2.8.5
```

>Хотите узнать о WSGI и Gunicorn? Прочтите главу [WSGI](https://testdriven.io/courses/python-web-framework/wsgi/) из курса [Создание собственной веб-инфраструктуры Python](https://testdriven.io/courses/python-web-framework/).

Поскольку мы по-прежнему хотим использовать встроенный сервер Django в разработке, создайте новый файл набора с именем *docker-compose.prod.yml* для продакшн:
```yaml
#docker-compose.prod.yml

version: '3.7'

services:
  web:
    build: ./app
    command: gunicorn hello_django.wsgi:application --bind 0.0.0.0:8000
    ports:
      - 8000:8000
    env_file:
      - ./.env.prod
    depends_on:
      - db
  db:
    image: postgres:12.0-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    env_file:
      - ./.env.prod.db

volumes:
  postgres_data:
```
>Если у вас несколько сред, вы можете использовать файл конфигурации [docker-compose.override.yml](https://docs.docker.com/compose/extends/). При таком подходе вы должны добавить свою базовую конфигурацию в файл *docker-compose.yml*, а затем использовать файл *docker-compose.override.yml* для переопределения этих параметров конфигурации в зависимости от среды.

Обратите внимание на значение по умолчанию для `сommand`. Мы используем Gunicorn, а не сервер разработки Django. Мы также удалили том из сервиса `web`, поскольку он нам не нужен в рабочей среде. Наконец, мы используем отдельные файлы переменных окружения для обеих служб, которые будут передаваться в контейнер во время выполнения.

*.env.prod*
```
DEBUG=0
SECRET_KEY=change_me
DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]
SQL_ENGINE=django.db.backends.postgresql
SQL_DATABASE=hello_django_prod
SQL_USER=hello_django
SQL_PASSWORD=hello_django
SQL_HOST=db
SQL_PORT=5432
DATABASE=postgres
```

*.env.prod.db*
```
POSTGRES_USER=hello_django
POSTGRES_PASSWORD=hello_django
POSTGRES_DB=hello_django_prod
```

Добавьте два файла в корень проекта. Вероятно, вы захотите сохранить их вне системы контроля версий, поэтому добавьте их в файл *.gitignore*.

Удалите контейнеры разработки и связанные тома (флаг `-v`):
```sh
$ docker-compose down -v
```

Затем создайте рабочие образы и запустите контейнеры:

```sh
$ docker-compose -f docker-compose.prod.yml up -d --build
```

Убедитесь, что база данных `hello_django_prod` была создана вместе с таблицами Django по умолчанию. Протестируйте страницу администратора по адресу http://localhost:8000/admin. Статические файлы больше не загружаются. Это ожидаемо, поскольку режим отладки (Debug) отключен. Скоро мы это исправим.

>И снова, если что-то пошло не так и экран приветствия не отображен, проверьте лог-файлы на наличие ошибок: `docker-compose -f docker-compose.prod.yml logs -f`

## Production Dockerfile

Вы заметили, что мы все еще запускаем команду [flush](https://docs.djangoproject.com/en/2.2/ref/django-admin/#flush) (которая очищает базу данных) и переносим команды при каждом запуске контейнера? Это нормально при разработке, но давайте создадим новый файл точки входа для продакшн.

*entrypoint.prod.sh*
```sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

exec "$@"
```

Обновите права доступа к файлу локально:
```sh
$ chmod +x app/entrypoint.prod.sh
```

Чтобы использовать этот файл, создайте новый Dockerfile с именем *Dockerfile.prod* для использования с продакшн сборками:

```dockerfile
# Dockerfile.prod

###########
# BUILDER #
###########

# pull official base image
FROM python:3.8.3-alpine as builder

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev

# lint
RUN pip install --upgrade pip
RUN pip install flake8
COPY . .
RUN flake8 --ignore=E501,F401 .

# install dependencies
COPY ./requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /usr/src/app/wheels -r requirements.txt


#########
# FINAL #
#########

# pull official base image
FROM python:3.8.3-alpine

# create directory for the app user
RUN mkdir -p /home/app

# create the app user
RUN addgroup -S app && adduser -S app -G app

# create the appropriate directories
ENV HOME=/home/app
ENV APP_HOME=/home/app/web
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

# install dependencies
RUN apk update && apk add libpq
COPY --from=builder /usr/src/app/wheels /wheels
COPY --from=builder /usr/src/app/requirements.txt .
RUN pip install --no-cache /wheels/*

# copy entrypoint-prod.sh
COPY ./entrypoint.prod.sh $APP_HOME

# copy project
COPY . $APP_HOME

# chown all the files to the app user
RUN chown -R app:app $APP_HOME

# change to the app user
USER app

# run entrypoint.prod.sh
ENTRYPOINT ["/home/app/web/entrypoint.prod.sh"]
```

Здесь мы использовали многоступенчатую сборку Docker, чтобы уменьшить размер окончательного образа. По сути, `builder` - это временный образ, который используется для создания wheel пакетов Python. Затем wheel пакеты копируются в продакшн образ, а образ `builder` удаляется.

>Вы можете пойти дальше в [многоэтапном подходе к сборке](https://stackoverflow.com/a/53101932/1799408) и использовать один Dockerfile вместо создания двух Dockerfile. Подумайте о плюсах и минусах использования этого подхода для двух разных файлов.

Вы заметили, что мы создали пользователя без полномочий root? По умолчанию Docker запускает контейнерные процессы как root внутри контейнера. Это плохая практика, поскольку злоумышленники могут получить root-доступ к хосту Docker, если им удастся выйти за пределы контейнера. Если вы являетесь пользователем root в контейнере, вы будете меть права root и на хосте.

Обновите сервис `web` в файле `docker-compose.prod.yml` для сборки с помощью `Dockerfile.prod`:
```yaml
web:
  build:
    context: ./app
    dockerfile: Dockerfile.prod
  command: gunicorn hello_django.wsgi:application --bind 0.0.0.0:8000
  ports:
    - 8000:8000
  env_file:
    - ./.env.prod
  depends_on:
    - db
```
Опробуте изменения:
```sh
$ docker-compose -f docker-compose.prod.yml down -v
$ docker-compose -f docker-compose.prod.yml up -d --build
$ docker-compose -f docker-compose.prod.yml exec web python manage.py migrate --noinput
```

## Nginx

Следующим этапом, давайте добавим в этот микс Nginx, который будет действовать как [реверс прокси-сервер](https://www.nginx.com/resources/glossary/reverse-proxy-server/) для Gunicorn с целью обработки клиентских запросов, а также обслуживания статических файлов.

Добавьте сервис `nginx` в файл *docker-compose.prod.yml*

```yaml
  build: ./nginx
  ports:
    - 1337:80
  depends_on:
    - web
```
Затем в корне локального проекта создайте следующие файлы и папки:

```
└── nginx
    ├── Dockerfile
    └── nginx.conf
```

*Dockerfile*

```dockerfile
FROM nginx:1.19.0-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
```

*nginx.conf*

```
upstream hello_django {
    server web:8000;
}

server {

    listen 80;

    location / {
        proxy_pass http://hello_django;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_redirect off;
    }

}
```

>Ознакомьтесь с разделом [Использование NGINX и NGINX Plus в качестве шлюза приложений с uWSGI и Django](https://docs.nginx.com/nginx/admin-guide/web-server/app-gateway-uwsgi-django/) для получения дополнительной информации о настройке Nginx для работы с Django.

Затем обновите сервис `web` в *docker-compose.prod.yml*, заменив `ports` на `expose`:

```yaml
web:
  build:
    context: ./app
    dockerfile: Dockerfile.prod
  command: gunicorn hello_django.wsgi:application --bind 0.0.0.0:8000
  expose:
    - 8000
  env_file:
    - ./.env.prod
  depends_on:
    - db
```

Теперь порт 8000 доступен для других служб Docker только изнутри. Порт больше не будет публиковаться на хост-машине.

>Чтобы узнать больше о `ports` и `expose`, просмотрите этот [вопрос на Stack Overflow](https://stackoverflow.com/questions/40801772/what-is-the-difference-between-docker-compose-ports-vs-expose).

Протестируйте обновленную сборку:
```sh
$ docker-compose -f docker-compose.prod.yml down -v
$ docker-compose -f docker-compose.prod.yml up -d --build
$ docker-compose -f docker-compose.prod.yml exec web python manage.py migrate --noinput
```

Убедитесь, что приложение запущено и работает по адресу http://localhost:1337.

Структура вашего проекта должна теперь выглядеть следующим образом:
```
├── .env.dev
├── .env.prod
├── .env.prod.db
├── .gitignore
├── app
│   ├── Dockerfile
│   ├── Dockerfile.prod
│   ├── entrypoint.prod.sh
│   ├── entrypoint.sh
│   ├── hello_django
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── manage.py
│   └── requirements.txt
├── docker-compose.prod.yml
├── docker-compose.yml
└── nginx
    ├── Dockerfile
    └── nginx.conf
```

Когда закончите остановите контенеры:
```sh
$ docker-compose -f docker-compose.prod.yml down -v
```

Поскольку Gunicorn является сервером приложений, он не отвечает за публикацию статических файлов. Итак, каким образом опубликовать статические и мультимедийные файлы в текущей конфигурации?

## Статические файлы

Обновите *settings.py*
```python
STATIC_URL = "/staticfiles/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
```

### Режим разработки (development)

Теперь любой запрос к http://localhost:8000/staticfiles/* загружать статику из каталога "staticfiles".

Чтобы проверить, сначала заново соберите образы и запустите новые контейнеры в обычном порядке. Убедитесь, что статические файлы загружаются при обращении по адресу http://localhost:8000/admin.

### Продакшн (production)

Для продакшн сборки добавьте том в сервисы `web` и `nginx` в *docker-compose.prod.yml*, чтобы каждый контейнер имел общий каталог с именем "staticfiles":
```yaml
version: '3.7'

services:
  web:
    build:
      context: ./app
      dockerfile: Dockerfile.prod
    command: gunicorn hello_django.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - static_volume:/home/app/web/staticfiles
    expose:
      - 8000
    env_file:
      - ./.env.prod
    depends_on:
      - db
  db:
    image: postgres:12.0-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    env_file:
      - ./.env.prod.db
  nginx:
    build: ./nginx
    volumes:
      - static_volume:/home/app/web/staticfiles
    ports:
      - 1337:80
    depends_on:
      - web

volumes:
  postgres_data:
  static_volume:
```

Нам также потребуется создать директорию "/home/app/web/staticfiles" в *Dockerfile.prod*
```dockerfile
...

# create the appropriate directories
ENV HOME=/home/app
ENV APP_HOME=/home/app/web
RUN mkdir $APP_HOME
RUN mkdir $APP_HOME/staticfiles
WORKDIR $APP_HOME

...
```

Зачем это нужно?

Docker Compose обычно монтирует именованные тома как root. И поскольку мы используем пользователя без полномочий root, мы получим ошибку отказа доступа при запуске команды `collectstatic`, если каталог еще не существует.

Чтобы обойти это, вы можете:

1. Создать папку в Dockerfile ([источник](https://github.com/docker/compose/issues/3270#issuecomment-206214034))
2. Изменить права доступа к каталогу после его монтирования ([источник](https://stackoverflow.com/a/40510068/1799408))

Мы использовали первое.

Затем обновите конфигурацию Nginx для маршрутизации и обработки запросов статических файловов по пути "staticfiles":

```
upstream hello_django {
    server web:8000;
}

server {

    listen 80;

    location / {
        proxy_pass http://hello_django;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_redirect off;
    }

    location /staticfiles/ {
        alias /home/app/web/staticfiles/;
    }

}
```

Сверните контейнеры:

```
$ docker-compose down -v
```

Протестируйте:

```sh
$ docker-compose -f docker-compose.prod.yml up -d --build
$ docker-compose -f docker-compose.prod.yml exec web python manage.py migrate --noinput
$ docker-compose -f docker-compose.prod.yml exec web python manage.py collectstatic --no-input --clear
```

Опять же, запросы к http://localhost:1337/staticfiles/* будут возвращать файлы из каталога "staticfiles".

Перейдите по адресу http://localhost:1337/admin и убедитесь, что статические ресурсы загружаются правильно.

Вы также можете проверить в журналах - через `docker-compose -f docker-compose.prod.yml logs -f` - что запросы к статическим файлам успешно обслуживаются через Nginx:
```
nginx_1  | 172.31.0.1 - - [13/Jun/2020:20:35:47 +0000] "GET /admin/ HTTP/1.1" 302 0 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36" "-"
nginx_1  | 172.31.0.1 - - [13/Jun/2020:20:35:47 +0000] "GET /admin/login/?next=/admin/ HTTP/1.1" 200 1928 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36" "-"
nginx_1  | 172.31.0.1 - - [13/Jun/2020:20:35:47 +0000] "GET /staticfiles/admin/css/base.css HTTP/1.1" 304 0 "http://localhost:1337/admin/login/?next=/admin/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36" "-"
nginx_1  | 172.31.0.1 - - [13/Jun/2020:20:35:47 +0000] "GET /staticfiles/admin/css/login.css HTTP/1.1" 304 0 "http://localhost:1337/admin/login/?next=/admin/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36" "-"
nginx_1  | 172.31.0.1 - - [13/Jun/2020:20:35:47 +0000] "GET /staticfiles/admin/css/responsive.css HTTP/1.1" 304 0 "http://localhost:1337/admin/login/?next=/admin/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36" "-"
nginx_1  | 172.31.0.1 - - [13/Jun/2020:20:35:47 +0000] "GET /staticfiles/admin/css/fonts.css HTTP/1.1" 304 0 "http://localhost:1337/admin/login/?next=/admin/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36" "-"
nginx_1  | 172.31.0.1 - - [13/Jun/2020:20:35:47 +0000] "GET /staticfiles/admin/fonts/Roboto-Regular-webfont.woff HTTP/1.1" 304 0 "http://localhost:1337/staticfiles/admin/css/fonts.css" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36" "-"
nginx_1  | 172.31.0.1 - - [13/Jun/2020:20:35:47 +0000] "GET /staticfiles/admin/fonts/Roboto-Light-webfont.woff HTTP/1.1" 304 0 "http://localhost:1337/staticfiles/admin/css/fonts.css" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36" "-"
```

Когда закончите остановите контейнеры:
```sh
$ docker-compose -f docker-compose.prod.yml down -v
```

## Медиа файлы

Чтобы проверить работу с медиафайлами, начните с создания нового приложения Django:

```sh
$ docker-compose up -d --build
$ docker-compose exec web python manage.py startapp upload
```

Добавьте новое приложение в список `INSTALLED_APPS` в *settings.py*:
```python
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "upload",
]
```

*app/upload/views.py:*

```python
from django.shortcuts import render
from django.core.files.storage import FileSystemStorage


def image_upload(request):
    if request.method == "POST" and request.FILES["image_file"]:
        image_file = request.FILES["image_file"]
        fs = FileSystemStorage()
        filename = fs.save(image_file.name, image_file)
        image_url = fs.url(filename)
        print(image_url)
        return render(request, "upload.html", {
            "image_url": image_url
        })
    return render(request, "upload.html")
```

Добавьте каталог "templates" в каталог "app/upload", а затем добавьте новый шаблон с именем *upload.html*:

```html
{% block content %}

  <form action="{% url "upload" %}" method="post" enctype="multipart/form-data">
    {% csrf_token %}
    <input type="file" name="image_file">
    <input type="submit" value="submit" />
  </form>

  {% if image_url %}
    <p>File uploaded at: <a href="{{ image_url }}">{{ image_url }}</a></p>
  {% endif %}

{% endblock %}
```

*app/hello_django/urls.py:*

```python
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from upload.views import image_upload

urlpatterns = [
    path("", image_upload, name="upload"),
    path("admin/", admin.site.urls),
]

if bool(settings.DEBUG):
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

*app/hello_django/settings.py:*

```python
MEDIA_URL = "/mediafiles/"
MEDIA_ROOT = os.path.join(BASE_DIR, "mediafiles")
```

### Режим разработки (development)

Протестируйте:

```sh
$ docker-compose up -d --build
```

Вы должны иметь возможность загрузить изображение по адресу http://localhost:8000/, а затем просмотреть изображение по адресу http://localhost:8000/mediafiles/IMAGE_FILE_NAME.

### Продакшн (production)

Для продакшн добавтье другие тома в службы `web` и `nginx`:

```yaml
version: '3.7'

services:
  web:
    build:
      context: ./app
      dockerfile: Dockerfile.prod
    command: gunicorn hello_django.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - static_volume:/home/app/web/staticfiles
      - media_volume:/home/app/web/mediafiles
    expose:
      - 8000
    env_file:
      - ./.env.prod
    depends_on:
      - db
  db:
    image: postgres:12.0-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    env_file:
      - ./.env.prod.db
  nginx:
    build: ./nginx
    volumes:
      - static_volume:/home/app/web/staticfiles
      - media_volume:/home/app/web/mediafiles
    ports:
      - 1337:80
    depends_on:
      - web

volumes:
  postgres_data:
  static_volume:
  media_volume:
```

Создайте папку «/home/app/web/mediafiles» в *Dockerfile.prod*:

```dockerfile
...

# create the appropriate directories
ENV HOME=/home/app
ENV APP_HOME=/home/app/web
RUN mkdir $APP_HOME
RUN mkdir $APP_HOME/staticfiles
RUN mkdir $APP_HOME/mediafiles
WORKDIR $APP_HOME

...
```

Снова обновите конфигурацию Nginx:

```
upstream hello_django {
    server web:8000;
}

server {

    listen 80;

    location / {
        proxy_pass http://hello_django;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_redirect off;
    }

    location /staticfiles/ {
        alias /home/app/web/staticfiles/;
    }

    location /mediafiles/ {
        alias /home/app/web/mediafiles/;
    }

}
```

Пересобреите контейнеры:

```sh
$ docker-compose down -v

$ docker-compose -f docker-compose.prod.yml up -d --build
$ docker-compose -f docker-compose.prod.yml exec web python manage.py migrate --noinput
$ docker-compose -f docker-compose.prod.yml exec web python manage.py collectstatic --no-input --clear
```

Проверьте работоспособность еще раз:

1. Загрузите изображение по адресу http://localhost:1337/.
2. Затем просмотрите изображение по адресу http://localhost:1337/mediafiles/IMAGE_FILE_NAME.

>Если вы видите ошибку `413 Request Entity Too Large`, вам необходимо [увеличить максимально разрешенный размер тела запроса клиента](https://stackoverflow.com/a/28476755/1799408) в секции `server` или `location` конфигурации Nginx.
>
>Пример:
>
>```
>location / {
>    proxy_pass http://hello_django;
>    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
>    proxy_set_header Host $host;
>    proxy_redirect off;
>    client_max_body_size 100M;
>}

## Заключение

В этом руководстве мы рассмотрели, как поместить веб-приложение Django в контейнер с помощью Postgres для разработки. Мы также создали готовый к работе файл Docker Compose, который добавляет Gunicorn и Nginx в микс для обработки статических и мультимедийных файлов. Теперь вы можете протестировать продакшн сборку локально.

Что касается фактического развертывания в производственной среде, вы, вероятно, захотите использовать:

1. Полностью управляемую службу базы данных, такую как [RDS](https://aws.amazon.com/rds/) или [Cloud SQL](https://cloud.google.com/sql/), вместо управления собственным экземпляром Postgres внутри контейнера.
2. Пользователь без полномочий root для служб `db` и `nginx`

Вы можете найти код в репозитории [django-on-docker](https://github.com/testdrivenio/django-on-docker).

> [Здесь](https://github.com/testdrivenio/django-on-docker/releases/tag/pipenv) также доступна более старая версия кода Pipenv.

Спасибо за чтение!