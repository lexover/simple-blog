---
date: '2022-04-10'
slug: bs4-cheatsheet 
tags:
- BeautifulSoup
title: Шпаргалка Beautiful Soup 4 
description: Краткая шпаргалка по работе с Beautiful Soup 4
author: Lexover
location: Russia 
image: https://res.cloudinary.com/dm3m076ji/image/upload/v1649598336/media/lexover_blog/BS4_dzzkjk.png 
meta:
  - name: title
    content: Шпаргалка Beautiful Soup 4 
  - name: description
    content: Краткая шпаргалка по работе с Beautiful Soup 4 
  - name: keywords
    content: BeautifulSoup
  - name: author
    content: Lexover
  - name: language
    content: Russian 
featured: true
---

Ниже приведена краткая шпрагалка по работе с Beatutiful Soup 4.

>В текущей реализации код опробован на Beautiful Soup версии 4.9, но т.к. основные команды базовые, то большинство из них исправно работает в более старых и новых версиях. Если мне известны, особенности работы комманды в других версиях, об этом будет указано в сноске `*`.

Базовый html к которому выполняются запросы взят из официальной документации [Beautiful Soup 4](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)

```python
<html><head><title>The Dormouse's story</title></head>
<body>
<p class="title"><b>The Dormouse's story</b></p>

<p class="story">Once upon a time there were three little sisters; and their names were
<a href="http://example.com/elsie" class="sister" id="link1">Elsie</a>,
<a href="http://example.com/lacie" class="sister" id="link2">Lacie</a> and
<a href="http://example.com/tillie" class="sister" id="link3">Tillie</a>;
and they lived at the bottom of a well.</p>

<p class="story">...</p>
```

<Bs4CheatSheet style="margin-top: 1em;"/>