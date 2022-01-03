---
date: '2021-09-18'
slug: django-orm-cheat-sheet 
tags:
- Django
title: Django ORM
description: Взаимодействие с моделями Django
author: Lexover
location: Russia 
image: https://res.cloudinary.com/dm3m076ji/image/upload/v1613595228/media/lexover_blog/docker-django_k0wuo4.png
meta:
  - name: title
    content: Django ORM
  - name: description
    content: Взаимодействие с моделями Django
  - name: keywords
    content: Django
  - name: author
    content: Lexover
  - name: language
    content: Russian 
featured: true
---

Ниже приведены подсказки по работе с моделями в Django ORM и аналог запроса тех же данных с помощью чистого SQL (диалект Postgre SQL).

>В текущей реализации привязки даны для Django версии 1.8 если мне известно, что в более новой версии Django это не работает или может быть упрощено, об этом будет указано в сноске `*`.

Для начала определим модель с которой будем работать и чтобы не "выдумывать велосипед" возьмем описание из документации [Django](https://docs.djangoproject.com/en/3.2/topics/db/models/) 

<img src="https://res.cloudinary.com/dm3m076ji/image/upload/v1640455735/media/lexover_blog/Django_model_opvisv.png" alt="model" style="display: block; margin: auto;" />

<DjangoCheatSheet/>