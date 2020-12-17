---
title: Webstore example
description: Vue.js Django REST Framework webstore example 
link: https://vue-test-webstore.herokuapp.com/
github: https://github.com/lexover/vue-django-webstore-example
languages:
  - Vue.js 
  - Django REST Framework
  - Docker 
---

# Simple Webstore Example App

![Pharmative](https://res.cloudinary.com/dm3m076ji/image/upload/v1608223533/media/lexover_blog/pharmative_2_pak2wf.jpg)

This is a real world webstore (pharmacy) example, including both the frontend and backend. In addition, everything can be packed in a Docker container using Dockerfile in the root of project.

The design of this webstore is based on a free **Bootstrap** template from  [Colorlib](https://colorlib.com). The [Vue.js 2](https://vuejs.org/) was chosen for building the frontend. To implement the realtionship between **Vue.js** and **Bootstrap** used [Bootstrap Vue](https://bootstrap-vue.org). The [Django REST Framework](https://www.django-rest-framework.org/) is used for backend and website administration. Authorization is implemented using JSON Web Tokens for which used [jango-rest-framework-simplejwt](https://github.com/SimpleJWT/django-rest-framework-simplejwt). The [Axios](https://github.com/axios/axios) is used for interaction between the frontend and the backend. All of this can be packaged in [Docker](https://www.docker.com/) container with [Nginx](https://nginx.org/) webserver that communicates with the backend via [uWSGI](https://github.com/unbit/uwsgi).

This example is not preapred for porduction and it does not cover security issues, the CORS mechanism is disabled on backend to allow work with backend and frontend on one computer (in one container). 
