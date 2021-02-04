---
date: '2020-02-04'
slug: how-to-run-periodic-tasks-in-celery 
tags:
- celery 
- crontab
- task
- redis
- RabitMQ 
title: Как запускать периодические задачи в Celery
description: Как запускать периодические задачи в Celery 
author: Antonio Di Mariano [translated by Lexover] 
location: Russia 
image: https://res.cloudinary.com/dm3m076ji/image/upload/v1612445983/media/lexover_blog/celery-periodic-tasks_ufg8wn.jpg
meta:
  - name: title
    content: Как запускать периодические задачи в Celery 
  - name: description
    content: Как запускать периодические задачи в Celery 
  - name: keywords
    content: celery, crontab, task, redis
  - name: author
    content: Antonio Di Mariano [translated by Lexover]
  - name: language
    content: Russian 
featured: true
---
Данная статья является переводом статьи [Antonio Di Mariano: How to run periodic tasks in Celery](https://medium.com/@hellbreak/how-to-run-periodic-tasks-in-celery-28e1abf8b458)

Недавно я столкнулся с необходимостью реализовать серию задач (tasks), которые будут запускаться периодически для выполнения некоторых заданий. Такой сценарий хорошо подходит для crontab, но я решил попробовать Celery и использовать Celery Beat.

Прежде всего, давайте кратко рассмотрим, что такое Celery и в чем он хорош.
Celery - это библиотека Python, используемая для обработки трудоемких задач и делегирования их отдельным процессам или распределенным сетевым узлам, чтобы снизить нагрузку на веб-серверы / серверные службы.

Большинство случаев использования показывают, что Celery идеально подходит для веб-проектов.

Я не веб-разработчик, и мой главный интерес - проектирование и разработка того, что обычно называют backend микросервисами. Celery - хорошее решение для запуска заданий по расписанию в микросервисной архитектуре.

Celery использует архитектуру опирающуюся на два основных компонента: Очереди (Queues) и Обработчики (Workers). 
[Очередь (Queue)](https://ru.wikipedia.org/wiki/%D0%9E%D1%87%D0%B5%D1%80%D0%B5%D0%B4%D1%8C_(%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5)) - это структура данных, куда наши задачи (tasks) отправляются и откуда они извлекаются обработчиками (Workers), чтобы быть выполненными.
Задача (task) - некоторый объем кода который мы поручаем выполнить Celery в определенное время или периодически, например, отправка электронного письма или создание отчета в конце месяца.
Здесь следует отметить одну важную деталь: сама Очередь (Queue) не входит в состав библиотеки. Для этой цели должен использоваться внешний брокер сообщений, такой как Redis или RabbitMQ. Использование внешних брокеров сообщений в качестве очереди делает наше приложение надежным и способным управлять поставленными в очередь задачами даже после сбоя нашего приложения.
Celery реализует обработчиков (Workers) с помощью пула выполнения, поэтому количество задач, которые может выполнять каждый обработчики (Worker), зависит от количества процессов в пуле выполнения.
Celery позволяет нам отслеживать, а также настраивать различные правила повторного запуска задач, которые не были выполнены по какой либо причине. В то же время Celery позволяет ограничить количество задач выполняемых одновременно. 
Мы можем использовать Celery для реализации:
* **Периодических задач**: задачи которые нам необходимо выполнить в определенное время или через заданный промежуток. Например создание ежемесячного отчета или периодической проверки ресурсов.
* **3-стороннее асинхронное взаимодействие**: Web-приложение должно обслуживать пользователей, не дожидаясь завершения других действий во время загрузки страницы, таких как отправка e-mail, уведомлений, обновления внутренних компонентов (таких как A/B тестирование либо системное логирование). Здесь Celery выступает 3-й стороной позволяющей реализовать асинхронное взаимодействие между front-end и back-end 
* **Долгосрочные задачи**: задачи, требующие больших затрат ресурсов, при которых пользователю приходится ожидать вычисления результата, например выполнение сложных рабочих процессов (DAG workflow), создание графических элементов, обслуживание мультимедийного контента (видео, аудио).

## Celery Beat

Чтобы добиться асинхронного выполнения перечня запланированных задач, я буду использовать Celery Beat. 

Celery Beat - это планировщик, который через регулярные промежутки времени объявляет задачи, которые будут выполняться рабочими узлами в кластере.
Как сообщает официальный сайт:

>По умолчанию записи берутся из настройки beat_schedule, но также можно использовать настраиваемые хранилища, например, для хранения записей в базе данных SQL.
Вы должны убедиться, что одновременно работает только один планировщик, иначе у вас будут дублирующиеся задачи. Использование централизованного подхода означает, что расписание не нужно синхронизировать, и служба может работать без использования блокировок.


![Celery Architecture](https://res.cloudinary.com/dm3m076ji/image/upload/v1612449449/media/lexover_blog/celery-periodic-tasks_1_b5jg64.png)

Хороший вопрос, который я задал себе перед тем, как пробовать Celery, - зачем мне использовать его? Почему не crontab? 

Ну, во-первых, для того, чтобы использовать службу crond, вам нужно иметь права root'ом вашего  nix-дистрибутива, а иногда данные права отсутствуют. Не говоря уже о том, что я никогда не был большим поклонником использования скрипта crontab в распределенном приложении. Более того, использование внешнего решения для управления задачами позволяет не беспокоиться о том, где будет развернуто приложение, если оно имеет доступ к Celery (каждая среда, которая может запускать Python, также может получить доступ к Celery)

Так что портативность - всегда хороший повод для выбора решения.

## Настройка Celery
Чтобы начать работу с Celery, просто следуйте пошаговым инструкциям в официальной [документации](https://docs.celeryproject.org/en/latest/getting-started/introduction.html).

## Планировщик Celery

Чтобы создавать периодические задачи, нам нужно определить их с помощью параметра beat_scheduler. Celery Beat проверяет параметр beat_scheduler для управления задачами, которые необходимо выполнять по расписанию.
В моем примере я использую Redis в качестве брокера сообщений. Итак, первым делом нужно сообщить Celery, кто является его брокером сообщений.
Давайте создадим файл `task.py`
```python
#tasks.py
from celery import Celery

app = Celery('tasks', broker='redis://localhost:6379/0')
```
Первый аргумент Celery - это имя текущего модуля, задачи в моем примере. Таким образом, имена могут быть автоматически сгенерированы.
Второй аргумент - это ключевое слово брокера, указывающее URL-адрес брокера сообщений.
Допустим, нам нужно проверять наличие заданного задания каждые 10 секунд.
```python
#tasks.py
from celery import Celery
app = Celery('tasks', broker='redis://localhost:6379/0')

@app.task
def check():
    print('I am checking your stuff')

app.conf.beat_schedule = {
    'run-me-every-ten-seconds': {
        'task': 'tasks.check',
        'schedul': 10.0
    }
}
```
Мы говорим beat_schedule запускать функцию check() каждые 10,0 секунд. Функция для запуска идентифицируется <имя модуля>.<имя функции>.

Если мы запустим это с помощью следующей команды:
```sh
celery -A tasks beat --loglevel=INFO
```

В консоли мы увидим несколько строк вывода, которые каждые 10 секунд будут запускать задание tasks.check.

```
celery beat v4.3.0 is starting.
__ — … __ — _
LocalTime -> 2019–10–07 11:52:35
Configuration ->
 . broker -> redis://localhost:6379/0
 . loader -> celery.loaders.app.AppLoader
 . scheduler -> celery.beat.PersistentScheduler
 . db -> celerybeat-schedule
 . logfile -> [stderr]@%INFO
 . maxinterval -> 5.00 minutes (300s)
[2019–10–07 11:52:35,266: INFO/MainProcess] beat: Starting…
[2019–10–07 11:52:45,282: INFO/MainProcess] Scheduler: Sending due task run-me-every-ten-seconds (tasks.check)
[2019–10–07 11:52:55,271: INFO/MainProcess] Scheduler: Sending due task run-me-every-ten-seconds (tasks.check)
[2019–10–07 11:53:05,271: INFO/MainProcess] Scheduler: Sending due task run-me-every-ten-seconds (tasks.check)
[2019–10–07 11:53:15,271: INFO/MainProcess] Scheduler: Sending due task run-me-every-ten-seconds (tasks.check)
[2019–10–07 11:53:25,271: INFO/MainProcess] Scheduler: Sending due task run-me-every-ten-seconds (tasks.check)
```
`tasks.check` запускается каждые 10 секунд, но где он на самом деле выполняется? Как было сказано ранее, Celery использует настроенный брокер сообщений для отправки и получения сообщений, в нашем примере Redis является брокером сообщений.

Celery beat отправляет задачу `tasks.check` в очередь Redis каждые 10 секунд.

## Посмотрим работу обработчика (worker)

Обработчики получают сообщения, извлекая их из очереди. В настоящий момент мы видим, что Celery Beat периодически добавляет задачи в очередь. Мы хотим, чтобы обработчики выполнили задачи.

В другом терминале запускаем нашего обработчика (worker):
```sh
celery -A task worker --loglevel=INFO
```

В консоли при этом мы увидим нечто подобное:
```
[2019–10–07 11:53:17,310: INFO/ForkPoolWorker-8] Task tasks.check[db70d065-b4f6–48f3–8b52–5187090da703] succeeded in 0.00230525199999998s: None
[2019–10–07 11:53:17,312: INFO/MainProcess] Received task: tasks.check[08059687-d0b4–4bab-b824–28f11487c393] 
[2019–10–07 11:53:17,313: INFO/MainProcess] Received task: tasks.check[aa215cac-fca6–4d2e-8ccc-d827a2946280] 
[2019–10–07 11:53:17,312: WARNING/ForkPoolWorker-2] I am checking your stuff
[2019–10–07 11:53:17,314: INFO/ForkPoolWorker-2] Task tasks.check[3cd58782-c592–49e1–8d6f-5955aa843583] succeeded in 0.0018000820000001472s: None
[2019–10–07 11:53:17,315: INFO/MainProcess] Received task: tasks.check[84b5bc2a-f0fc-4d47–9601-ed3651c8fb7c] 
[2019–10–07 11:53:17,316: WARNING/ForkPoolWorker-4] I am checking your stuff
[2019–10–07 11:53:17,316: WARNING/ForkPoolWorker-5] I am checking your stuff
[2019–10–07 11:53:17,317: INFO/ForkPoolWorker-4] Task tasks.check[08059687-d0b4–4bab-b824–28f11487c393] succeeded in 0.002428212999999957s: None
[2019–10–07 11:53:17,318: INFO/ForkPoolWorker-5] Task tasks.check[aa215cac-fca6–4d2e-8ccc-d827a2946280] succeeded in 0.0025583710000001147s: None
```

Как видим, обработчик (worker) получил задачу и вскоре она выполнена. Это простейший пример, но в реальном приложении время выполнения задачи может быть совсем иным.

Celery позволяет нам иметь необходимую конфигурацию в папке. Давайте создадим папку «checker», следующей структуры:

```
- checker
  - __init__.py
  - celery.py
  - celeryconfig.py
  - tasks.py
 ```

Здесь мы видим, как различные параметры конфигурации можно разделить на отдельные файлы. `celery.py` сообщит Celery, где найти файл конфигурации `app.config_from_object` и файл содержащий код задач.

```python
#celery.py
from celery import Celery

app = Celery('checker', include=['checker.tasks'])
app.config_from_object('checker.celeryconfig')
app.conf.beat_schedule = {
    'run-me-every-ten-seconds': {
        'task': 'checker.tasks.check',
        'schedule': 10.0
    }
}
```
```python
# celeryconfig.py
broker_url = 'redis://localhost:6379/0'
task_serializer = 'json'
result_serializer = 'json'
accept_content = ['json']
timezone = 'Europe/Dublin'
enable_utc = True
```
```python
#tasks.py
from checker.celery import app

@app.task
def check():
    print('I am checking your stuff')
```

Итак запустим Celery Beat. Откройте терминал и перейдите на уровень выше только что созданной папки с именем checker.
Для запуска Celery Beat, мы вызываем имя настроенного нами модуля, в нашем случае `checker`:
```sh
celery -A checker beat --loglevel=INFO
```
и в другом терминале запускаем обработчик:

```sh
celery -A checker worker --loglevel=INFO
```
Имейте в виду, что в окружении со значительным трафиком, таком как production, вероятно, было бы лучше запустить несколько обработчиков, чтобы обрабатывать несколько запросов одновременно.

Другой способ работы с запланированной задачей - использовать Crontab Schedules из Celery Вeat. Если нам нужно больше контроля над задачей для выполнения, мы можем использовать:
```python
from celery import Celery
from celery.schedules import crontab

app = Celery('tasks', broker='redis://localhost:6379/0')

app.conf.beat_schedule = {
    # Executes every Monday morning at 7:30 a.m.
    'add-every-monday-morning': {
        'task': 'tasks.add',
        'schedule': crontab(hour=7, minute=30, day_of_week=1),
        'args': (16, 16),
    },
}
```
Предположим у нас есть список пользователей, которым мы хотим еженевно отправлять сообщения с задачами которые необходимо выполнить.
Для начала изменим `celery.py`:
```python
# celery.py

from celery import Celery
from celery.schedules import crontab

app = Celery('checker', include=['checker.tasks'])
app.config_from_object('checker.celeryconfig')
app.conf.beat_schedule = {
    'everyday-task': {
      'task': 'checker.tasks.remember_tasks_to_do',
      'schedule': crontab(hour=7, minute=0)
    }
}
```
Здесь мы указываем Celery запускать `checker.tasks.remember_tasks_to_do` каждый день в 7:00. Измененный tasks.py:
```python
#tasks.py
from checker.celery import app
import json

@app.task
def remember_tasks_to_do():
  file_object = open('employees.json', 'r')
  # Load JSON file data to a list of python dict object.
  employees_list = json.load(file_object)
  for employee in employees_list:
    print(f'Good morning {employee.get("username")}.' + 
          f'This is your list of tasks to do {employee.get("tasks")}')
```
 Исходный код может быть найден на [github](https://github.com/antoniodimariano/celery_periodic_tasks.git)
