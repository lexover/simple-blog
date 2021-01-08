---
title: Простой онлайн магазин
description: Пример простого онлайн магазина реализованного на Vue.js и Django REST Framework
link: https://vue-test-webstore.herokuapp.com/
github: https://github.com/lexover/vue-django-webstore-example
languages:
  - Vue.js 
  - Django REST Framework
  - Docker 
---

# [Пример простого онлайн магазина](https://vue-test-webstore.herokuapp.com/).

![Pharmative](https://res.cloudinary.com/dm3m076ji/image/upload/v1608223533/media/lexover_blog/pharmative_2_pak2wf.jpg)

Учебный пример простого онлайн магазина, включающий front end и back end. Может быть запущен в Docker контейнере.

Дизайн магазина выполнен на основе свободного **Bootstrap** шаблона от  [Colorlib](https://colorlib.com). Front end реализован на [Vue.js 2](https://vuejs.org/) включая Vuex, Vue-route. Для интеграции **Bootstrap** с **Vue.js** использована библиотека [Bootstrap Vue](https://bootstrap-vue.org). 

[Django REST Framework](https://www.django-rest-framework.org/) использован для реализации back-end а также панели администрирования. Система аутентификации пользователя реализована через JSON Web Tokens с использованием библиотеки[jango-rest-framework-simplejwt](https://github.com/SimpleJWT/django-rest-framework-simplejwt). [Axios](https://github.com/axios/axios) используется для взаимодействия front end с back end. Приложение может быть запущено в виде [Docker](https://www.docker.com/) контейнера, который использует [Nginx](https://nginx.org/) в качестве web-сервера и [uWSGI](https://github.com/unbit/uwsgi) в для взаимодействия с Django через WSGI.

Данный не предназначен для production и не охватывает вопросы безопасности, так например механизм CORS намерено выведен для возможности взаимодействия front end и back end на одном компьютере.

Онлайн версию магазина можно посмотреть [здесь](https://vue-test-webstore.herokuapp.com/). При загрузке страницы и данных возникает значительная задержка, т.к. приложение размещено на бесплатном сервере heroku и при первом обращении сервер запускается из "холодного" состояния.