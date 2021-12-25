---
date: '2021-09-18'
slug: django-orm-cheat-sheet 
tags:
- Django
title: Django ORM cheat sheet 
description: Краткие подсказки по Django 
author: Lexover
location: Russia 
image: https://res.cloudinary.com/dm3m076ji/image/upload/v1613595228/media/lexover_blog/docker-django_k0wuo4.png
meta:
  - name: title
    content: Django ORM cheat sheet
  - name: description
    content: Краткие подсказки по Django ORM
  - name: keywords
    content: Django
  - name: author
    content: Lexover
  - name: language
    content: Russian 
featured: true
---

Зачастую бэкенд разработчик хорошо занают и понимают `SQL`. Работая при этом с несколькими `ORM` мы периодически путаемся и пытаемся вспомнить каже реализовать ту или иную конструкцию `SQL` в фреймворке с которым работаем в текущий момент. По этой причине возникла идея создать небольшой cheat-sheet который покажет пример реализации `SQL` кода в `Django ORM`.

>В текущей реализации привязки даны для Django версии 1.8 если мне известно, что в более новой версии Django это не работает или может быть упрощено, об этом будет указано в сноске `*`.

Для начала определим модель с которой будем работать и чтобы не "выдумывать велосипед" возьмем описание из документации [Django](https://docs.djangoproject.com/en/3.2/topics/db/models/) 

<img src="https://res.cloudinary.com/dm3m076ji/image/upload/v1640455735/media/lexover_blog/Django_model_opvisv.png" alt="model" style="display: block; margin: auto;" />

<DjangoCheatSheet/>