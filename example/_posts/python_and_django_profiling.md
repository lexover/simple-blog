---
date: '2021-05-03'
slug: python_profiling
tags:
- Python 
title: Профилирование приложений Python
description: Разбираемся с инструментами профилирования приложенй на Python. 
author: Lexover 
location: Russia 
image: https://res.cloudinary.com/dm3m076ji/image/upload/v1620132334/media/lexover_blog/python_profile_b6a3xc.png
meta:
  - name: title
    content: Профилирование приложений Python.
  - name: description
    content:  Разбираемся с инструментами профилирования приложенй на Python.
  - name: keywords
    content: python, profiling
  - name: author
    content: Lexover 
  - name: language
    content: Russian 
featured: true
---
При разработке приложений периодически у разработчиков возникает вопрос - по какой причине реализованный код работает медленно, и где теряетсются драгоценные время и ресурсы? Здесь на помощь приходят инструменты профилирования. В текущем посте рассмотрим возможности профилирования приложений реализованных на Python с помощью различных инструментов профилирования, а также рассмотрим средства позволяющие строить графическое представление результатов профилирования и создавать отчеты.

## Профилирование как понятие 

Для выявления мест где приложение растрачивает ресурсы нам потребуется следующая информация:

- порядок выполнения кода (какие функции в каком порядке вызываются);
- количество вызовов отдельных фрагментов кода (функций/процедур/методов и т.п.);
- время затрачиваемое на выполнение отдельного фрагмента кода (функции/метода/процедуры и т.п.);

Имея вышеуказанную информацию мы можем выявить узкие места в нашем проекте, и сконцентрировшись на отдельном фрагменте кода выполнить его рефакторинг для повышения эффективности выполнения приложения в целом. 

> Профиль - набор статистических данных который описывает как часто и долго выполнялись различные части программы. ([The Python Profilers](https://docs.python.org/3.6/library/profile.html#module-profile)) 


## Инструменты профилирования Pyhton

### cProfile и profile
Python имеет встроенные инструменты для выполнения профилирования, которые находятся в модулях `cProfile` и `profile`. Данные модули позволяют получить статистику, которая в дальнейшем может быть преобразована в отчет с помощью модуля `pstats` или других инструментов. Модуль `cProfiles` реализован как Си расширение с невысоким оверхедом и рекомендован для использования как основной. Официальная документация здесь: [The Python Profilers](https://docs.python.org/3.6/library/profile.html#module-profile).

Создадим небольшое приложение Python в котором осуществляется вызов нескольких функций и вывод сообщений в консоль разместим код в модуле *test.py*
```python
def print_message(message):
    print(message)

def range_output(external_step, internal_steps_number):
    for internal_step in range(internal_steps_number):
        print_message(f'[{external_step}: {internal_step}]')

def main():
    for i in range(3):
        range_output(external_step=i, internal_steps_number=2)

if __name__ == '__main__':
  main()
```
Выполним профилирование данного кода с помощью `cProfile`:
```sh
python -m cProfile test.py
[0: 0]
[0: 1]
[1: 0]
[1: 1]
[2: 0]
[2: 1]
         19 function calls in 0.000 seconds

   Ordered by: standard name

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
        1    0.000    0.000    0.000    0.000 test.py:10(main)
        1    0.000    0.000    0.000    0.000 test.py:3(<module>)
        6    0.000    0.000    0.000    0.000 test.py:3(print_message)
        3    0.000    0.000    0.000    0.000 test.py:6(range_output)
        1    0.000    0.000    0.000    0.000 {built-in method builtins.exec}
        6    0.000    0.000    0.000    0.000 {built-in method builtins.print}
        1    0.000    0.000    0.000    0.000 {method 'disable' of '_lsprof.Profiler' objects}
```
В результате мы получили интересующую нас информацию: 
- ncalls - количество вызовов функции; 
- tottime - общее время затраченное в данной функции (без учета времени затраченного на вызовы подфункций);
- percall - время затраченное на 1 вызов функции (tottime / ncalls);
- cumtime - общее время затраченное в данной функции, включая время затраченное на вызов всех подфункций (от вызвова до выхода). Данная величина верна и для рекурсивных функций;
- percall - время затраченное на 1 вызов функции (cumtime / ncalls);
- filename:lineno(function) - соответсвенно <имя файла>:<№ строки>(<имя функции>)

Также мы можем созадть файл в формате `pstats` для использования в качестве данных инструментов построения графических отчетов (рассмотрены далее), что реализуется череез флаг `-o` с указаинием имени файла с расширением `.pstats` например *cprofile_output.pstats*:
```sh
python -m cProfile -o cprofile_output.pstats test.py
```


### Yappi

Библиотека [Yappi](https://github.com/sumerc/yappi) ("Yet Another Python Profiler") - обладает более широким функционалом, чем встроенные средства Python. `Yappi` реализованная как Си библиотека - является быстрой, позволяет выполнить профилирование многопоточных приложений, приложений использующих [asyncio](https://github.com/sumerc/yappi/blob/master/doc/coroutine-profiling.md) и [gevent](https://github.com/sumerc/yappi/blob/master/doc/greenlet-profiling.md), позволяет вывести результаты в формате [callgind](http://valgrind.org/docs/manual/cl-format.html) и [pstat](http://docs.python.org/3.4/library/profile.html#pstats.Stats), в результататы работы профилировщика могут отображать [Wall time](https://en.wikipedia.org/wiki/Elapsed_real_time) или [CPU Time](http://en.wikipedia.org/wiki/CPU_time) и могут быть агрегированы из разных сеансов. Кроме того при использовании PyCharm профилировщик Yappi используется в данной IDE по умолчанию.

Установка `Yappi` осуществляется следующим образом:
```sh
pip install yappi
```

Теперь немного изменим наш код, чтобы `Yappi` мог выполнить его анализ и собрать статистику в форматах `pstat` и `callgrind`:

```python
import yappi

def print_message(message):
    print(message)

def range_output(external_step, internal_steps_number):
    for internal_step in range(internal_steps_number):
        print_message(f'[{external_step}: {internal_step}]')

def main():
    for i in range(3):
        range_output(external_step=i, internal_steps_number=2)

if __name__ == '__main__':
    yappi.start()  # Здесь начинается наблюдение за выполняемым кодом
    main()
    func_stats = yappi.get_func_stats()  # Собираем статистику выполненных функций
    func_stats.print_all()  # Выведем в консоль собранную статистику
    func_stats.save('yappi_output.pstats', 'PSTAT')  # Сохраняем в формате pstat 
    func_stats.save('yappi_output.callgrind', 'CALLGRIND')  # Сохраняем в формате callgrind
    yappi.stop()  # Останавливаем наблюдение
    yappi.clear_stats()  # Очищаем статистику
```

Выполнение данного кода создаст файл *output.pstats* который может быть обработан с помощью ранее рассмотренного `gprof2dot`, и файл *output.callgrind* в формате callgrind (как использовать рассмотрим ниже) и выведет результаты профилирования в консоль:
```sh
python test.py

Clock type: CPU
Ordered by: totaltime, desc

name                                  ncall  tsub      ttot      tavg      
..ver/MarketAnalyser/test.py:10 main  1      0.000017  0.000141  0.000141
..ketAnalyser/test.py:6 range_output  3      0.000029  0.000125  0.000042
..etAnalyser/test.py:3 print_message  6      0.000028  0.000095  0.000016
```
Здесь отображается:
- Clock type: CPU - указывает, что показанная статистика времени профилирования извлекается с использованием тактовой частоты ЦП. Это означает, что отображается фактическое время процессора, затраченное на функцию.
- Ordered by: totaltime, desc - показывает параметр по которому выполнена сортировка и ее порядок, в нашем случае сортировка выполнена по итоговому времени (totalitme) в порядке убывания
- name - полное уникальное имя вызываемой функции
- ncall - количество вызовов функции
- tsub - общее время, затраченноей функцией, без дополнительных вызовов
- ttot - общее время, затраченное функцией, включая вспомогательные вызовы
- tavg - среднее время, затраченноей функцией, включая вспомогательные вызовы.

Главное преимущество `yappi` - это реализация профилирования в многопоточных приложениях и корутинах. Более подробную информацию и примеры реализации можно посомтреть на [GitHub странице проекта](https://github.com/sumerc/yappi).


## Построение отчетов по результатам профилироваяния

Информация полученная с помощью вышеуказанных средств профилирования весьма полезна, но вывод ее не очень удобен для анализа, особенное в случае с реальным приложением где количество фрагментов кода и их вызовов будет огромным. По этой причине зачастую требуется помощь дополнительных инструментов позволяющих в графическом виде проанализировать данную информацию.

### gprof2dot
Библиотека [gprof2dot](https://github.com/jrfonseca/gprof2dot), позволяет преобразовать вывод результатов профилирования в формате pstat преобразовать в удобный график вызовов функций который для итогового приложения может выглядесть следюущим образом (график со страницы [проекта](https://github.com/jrfonseca/gprof2dot)):

![gprof2dot_output](https://github.com/jrfonseca/gprof2dot/blob/master/sample.png?raw=true)

`gprof2dot` для построения графики испоьлзует библиотеку `graphviz`. Для установки в ОС Linux необходимо выполнить следующие команды:
```sh
sudo apt install graphviz
pip install gprof2dot
```

Теперь отобразим графики вызовов, созданные нами ранее с помощью `gprof2dot` которые будут сохранены в формате `png`:
```sh
gprof2dot -f pstats cprofile_output.pstats | dot -Tpng -o cprofile_output.png
gprof2dot -f pstats yappi_output.pstats | dot -Tpng -o yappi_output.png
```
Откроем изображение *cprofile_output.png*:

![gprof2dot_output](https://res.cloudinary.com/dm3m076ji/image/upload/v1620111040/media/lexover_blog/profiling_output_ge6kik.png)

Здесь мы наглядно видим что *86.21%* времени выполнения заняло выполнение функции `range_output` и данный метод был вызван 3 раза и за это время он 6 раз вызвал метод `print_message`. Таким образом с помощью gprof2dot можно строить удобные графические представления для профилирования.

Граф полученные в результате работы `yappi` выглядит несколько короче по причине того что запись ведется с момента указанного в коде:

![gprof2dot_output_yappi](https://res.cloudinary.com/dm3m076ji/image/upload/v1620117004/media/lexover_blog/profiling_output_yappi_ysgmth.png)

Здесь аналогично с примером cProfile мы видим граф вызовов функций с начала записи `yappi.start()` до завершения `yappi.stop()`. 

Как мы видим инструмент `gprof2dot` позволяет нам строить графические представления последовательностей вызовов функций нашего приложения с указанием количества вызовов и затрачиваемых ресурсов. Но `Yappi` позволяет кроме того выполнить вывод результатов профилирования в формате [Valgrind который называется callgrind](http://valgrind.org/docs/manual/cl-format.html). Соответственно данный формат может быть открыт сторонними приложениями умеющими работать с ними одним их таких является `KCachegrind`.

### KCachegrind

Cоздав файл в формате callgrind мы можем использовать продвинутые средства для просмотра результатов профилирования `[KCachegrind](https://github.com/KDE/kcachegrind). В среде Debian она может быть установлена:

```sh
sudo apt install kcachegrind
```
После установки, запускем приложение kcachegrind и открываем созданный нами файл *outpul.callgrind* и получаем подробнейший интерактивный отчет:

![kcachegrind](https://res.cloudinary.com/dm3m076ji/image/upload/v1620126821/media/lexover_blog/profiling_kcachegrind_mys18j.png)

### PyCharm Profilе

Также если вы используете в работе IDE PyCharm Pro, данная IDE по умолчанию использует `Yappi` как профайлер и имеет встроенные средства для графического отображения результатов профилирования и запустив профилирование в IDE мы получаем отчет в виде таблицы и графического представления:

![pychamr_profile_table](https://res.cloudinary.com/dm3m076ji/image/upload/v1620129711/media/lexover_blog/profiling_pycarm_1_xakdyb.png)

![pycharm_profile_graph](https://res.cloudinary.com/dm3m076ji/image/upload/v1620129711/media/lexover_blog/profiling_pycarm_2_zczvhl.png)

# Выводы 

Для Python реализовано множество инструментов позволяющих выполнить профилирование кода и выявить узкие места. В данном посте охвчена лишь небольшая их часть. Хотелось бы отметить интересные библиотеки не охваченные текущей статьей:
- [Pyinstrument](https://github.com/joerick/pyinstrument), которая имеет встроенные средства профилирования для проектов Django и Flask;
- [Pyflame](https://pyflame.readthedocs.io/en/latest/) - статический профайлер для Python созданный Uber и позволяющий строить впечатляющие графики для сложных приложений.

