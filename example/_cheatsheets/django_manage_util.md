---
date: '2022-01-07'
slug: django-manage-util-cheat-sheet 
tags:
- Django
- Python
title: Утилита django-admin/manage.py 
description: Краткое описание комманд django-admin/manage.py
author: Lexover
location: Russia 
image: https://res.cloudinary.com/dm3m076ji/image/upload/v1641567241/media/lexover_blog/django_dpz7ai.png 
meta:
  - name: title
    content: Шпаргалка утилиты django-admin/manage.py
  - name: description
    content: Краткое описание комманд django-admin/manage.py
  - name: keywords
    content: Django
  - name: author
    content: Lexover
  - name: language
    content: Russian 
featured: true
---

django-admin - консольный интрумент `Django` для выполнения административных задач. Модуль `manage.py` автоматически создается в проекте `Django`, он выполняет задачи аналоичные `django-admin`, но при выполнении устанавливает переменную окружения `DJANGO_SETTINGS_MODULE`, чтобы она указывала на файл `settings.py` вашего проекта. При работе с одним проектом удобнее использовать `manage.py`. При необходимости переключения между различными файлами настроек, используйте `django-admin` c переменной окружения `DJANGO_SETTINGS_MOSULE` или опцией `--settings`.

>В текущей шпаргалке команды приведены для Django версии 1.8.

Чтобы воспользоваться утилитой выполните в командной строке одну из следующих инструкций:
```bash
# Наиболее удбобный вариант использования команды для управления одним проектом
$ manage.py <command> [options]
# Общий формат выполнения команды
$ django-admin <command> [options]
# Вызов команды с укзанием конкретного файла настроек проекта
$ django-admin <command> --settings=my_project.settings [options]
# или через установку переменной окружения
$ DJANGO_SETTINGS_MODULE=my_project.settings django-admin <command> [options]
```

>Большая часть команд принимает список “названий приложений”. “Название приложения” – это название основного пакета приложения. Например, если настройка `INSTALLED_APPS` содержит строку 'mysite.blog', название приложения будет blog.

При необходимости пределить уровень выводимых в консоль `django-admin` уведомлений укажите флаг опцию `--verbosity`:
```bash
django-admin <command> --verbosity 2
```
где `verbosity` может принимать одно из следующих значений:
- 0 - ничего не выводить
- 1 - обычный вывод
- 2 - подробный вывод
- 3 - очень подробный вывод


<DjangoManageCheatSheet/>