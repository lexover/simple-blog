---
date: '2021-02-04'
title: Лендинг Craft Beer
description: Шаблон адаптивного анимированного лендинга без использования сторонних библиотек.
link: https://craft-beer-phi.vercel.app/
github: https://github.com/lexover/craft-beer
languages:
  - JS
  - CSS
  - FlexBox
  - Webpack
  - БЭМ
---

## [Лендинг Craft Beer](https://craft-beer-phi.vercel.app/).

Реализованный на чистом JS лендинг. Для компановки элементов на странице использован Flexbox. Проект реализован с использованием методологии БЭМ. Сборка проекта осуществляется в Webpack с использованием модуля html2bemdecl-loader (по статье на [Хабр](https://habr.com/ru/post/447560/)). 

Так как использование модуля html2bemdecl-loader исключает возможность использовать html-loader и соответственно реализовать автоматическое подключение js-bundle и статических ресурсов указанных в HTML. По этой причине данный проект носит исключительно учебный характер - разобрать преимущества использования методологии БЭМ и принципа сборки а также опыта реализации компоновки страниц исключительно с помощью Flexbox, реализации механизма постраничной прокрутки и использования CSS анимации.

![Craft Beer Desktop](https://res.cloudinary.com/dm3m076ji/image/upload/v1612530104/media/lexover_blog/CraftBeerFull-min_s7lszm.png)
