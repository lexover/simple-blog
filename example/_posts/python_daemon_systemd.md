---
date: '2021-06-27'
slug: python-daemon-with-systemd 
tags:
- Python 
title: Создание демона Python с использованием Systemd 
description: Пошаговая инструкция по созданию демона Python в linux окружении с Systemd
author: Lexover
location: Russia 
image: https://res.cloudinary.com/dm3m076ji/image/upload/v1613066459/media/lexover_blog/ptyhon-threading_p1dvni.png
meta:
  - name: title
    content: Создание демона Python с использованием Systemd 
  - name: description
    content: Пошаговая инструкция по созданию демона Python в linux окружении с Systemd
  - name: keywords
    content: Python, Systemd
  - name: author
    content: Lexover
  - name: language
    content: Russian 
featured: true
---
Недавно у меня возникла задача создать демон (фоновое приложение) реализованный на Python в системе Linux использующей `Systemd`. В поисках современного решения и родилась данная статья. Ранее для реализации демона выполнялась "демонизация" приложения Python, зачастую с помощью библиотеки [python-daemon](https://pagure.io/python-daemon/). Даже была создана спецификация [pep-3143](https://www.python.org/dev/peps/pep-3143/) для реализации демонов. Но на текущий момент времени с использованием `Systemd` нет необходимости демонизировать наше Python приложение, достаточно корректно описать его запуск в юните. Для начала рассмотрим как работает `Systemd`.

> Все операции указанные в данной статье выполнялись в окружении Linux Ubuntu 20, с установленным Python 3.8.

### Systemd Unit

**Systemd** позволяет запустить сервисы находящиеся в его конфигурации. Конфигукация состоит из юнитов, отдельных файлов расположенных в следующих каталогах:
- */usr/lib/systemd/system/* - юниты из установленных пакетов, такие как nginx, postgreee и др.
- */run/systemd/system* - юниты созданные в runtime
- */etc/systemd/system* - юиниты, созданные администратором, в основном пользовательские юниты должны храниться здесь.

Для создания юнита нам необходимо описать 3 секции: \[Unit\], \[Service\], \[Install\]
Основные переменные блока \[Unit\]:

```ini
[Unit]
Descripiton=Unit Descripion
After=syslog.target  
After=network.target  
After=nginx.service  
After=mysql.service
Requires=mysql.service
Wants=redis.service
```
где:
- **Description** - описание юнита
- **After** - указывает, что юнит должен быть запущен после группы указанных сервисов
- **Requires** - узказывает, что для запуска юнита требуется запущенный сервис  `mysql`,  запуск нашего сервиса выполняется паралллельно с требуемым (`mysql`), если требуемый не указан в `After`
- **Wants** - описательная переменная, показывающая, что для запуска сервиса желателен запущенный сервис `redis`

```ini
[Service]
Type=simple
PIDFile=/var/lib/service.pid
WorkingDirectory=/var/www/myapp
User=user
Group=user
Environment=STAGE_ENV=production
OOMScoreAdjust=-100
ExecStart=/my_venv/bin/python my_app.py --start
ExecStop=/my_venv/bin/python my_app.py --stop
ExecReload=/my_venv/bin/python my_app.py --restart
TimeoutSec=300
Restart=always
```

где:
- **Type** - тип запуска: **simple** (по умолчанию) запускает службу незамедлительно при этом процесс не должен разветвляться, не подходит если другие службы зависят от очередности при запуске данной службы; **forking** - служба запускается однократно и процесс разветвляется с завершением родительского процесса; другие типы можно рассмотреть по ссылке ниже.
- **PIDFile** - позволяет задать место нахождения `pid` файла
- **WorkingDirectory** - указывает рабочий каталог приложения, если указан то `ExecStart|Stop|Reload` запускаются из этого каталога, т.е. `my_app.py` станет `/var/www/myapp/my_app.py`
- **User, Group** - соответственно пользователь и группа под которыми будет запущен сервис.
-  **Environment** - переменные окружения
-  **OOOMSCoreAdjust** - запрет на `kill` сервиса вследствие нехватки памяти и срабатывания механизма ООМ: -1000 полный запрет, -100 понижает вероятность.
-  **ExecStart|Stop|Reload** - команды запуска, останова, перезагрузки сервиса, команда должна использовать абсолютный путь к исполняемому файлу.
-  **Timeout** - время ожидания systemd отработки команд `Start|Stop` в сек.
-  **Restart** - перезапуск сервиса если он упадет.

```ini
[Install]
WantedBy=multi-user.target
```

где:
- **WantedBy** - уровень запуска нашего сервиса, `mulit-user.target` или `runlevel3.target` соответствует `runlevel=3` "Многопользовательский режим без графики"

Размещаем данный файл с указанными секциями в директории */etc/systemd/sysmtem/<имя_сервиса>.service*

Проверяем его статус:
```bash
systemctl -l status test_unit
```

Разрешаем его запуск:
```bash
systemd enable test_unit
```

Запускаем наш сервис
```bash
systemctl start test_unit
```

При внесении изменений в наш сервис перегружаем его:
```bash
systemctl daemon-reload
```

[Более подробная документация Systemd на Русском](https://wiki.archlinux.org/title/Systemd_(%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9))

### Python приложение

Разобрав как работает `Systemd` можем приступить к созданию нашего сервиса. Для ознакомления создадим приложение `Python` которое будет выводить сообщения в `log` файл `test_daemon.py`:

```python
import time
import argparse
import logging

logger = logging.getLogger('test_daemon')
logger.setLevel(logging.INFO)
formatstr = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
formatter = logging.Formatter(formatstr)

def do_something():
	"""
	Здесь мы только лишь пишем сообщение в Log, но можем реализовать
	абсолютно любые задачи выполняемые в фоне.
	"""
    while True:
        logger.info("this is an INFO message")
        time.sleep(5)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Example daemon in Python")
	# Мы можем заменить default или запускать приложение с указанием нахождения 
	# log файла, через параметр -l /путь_к_файлу/файл.log
    parser.add_argument('-l', '--log-file', default='/home/user/test_daemon.log')
    args = parser.parse_args()

    fh = logging.FileHandler(args.log_file)
    fh.setLevel(logging.INFO)
    fh.setFormatter(formatter)
    logger.addHandler(fh)
    
    do_something()
```

Проверим работоспособность нашего скрипта:
```bash
python test_daemon.py 
```

Проверим что log-файл создан и в него пишутся сообщения:
```bash
tail -f /home/user/test_daemon.log
```

Теперь создадим юнит `Systemd` для запуска демона. В директории */etc/systemd/system* файл *test_daemon.service* с содержанием:
```ini
[Unit]
Description=Test daemon
After=syslog.target

[Service]
Type=simple
User=user
Group=user
WorkingDirectory=/home/user/
ExecStart=/usr/bin/python3 test_daemon.py

[Install]
WantedBy=multi-user.target
```

В данном юните следует изменить пользователя и группу `User`, `Group` на вашего пользователя. Также указать в качестве рабочего каталога `WorkingDirectory` абсолютный путь к директории где находится файл *test_daemon.py*.
> В случае использования `venv` в параметре ExecStart следует указать путь к `python` внутри `venv`, т.е. заменть */usr/bin/python3* на *<путь_к_venv>/venv/bin/python* 

Проверяем статус нашего сервиса:
```bash
systemctl -l status test_daemon
```

Разрешаем его запуск:
```bash
systemd enable test_daemon
```

Запускаем наш сервис
```bash
systemctl start test_daemon
```

Проверим отображение данных в логе:
```bash
tail -f /home/user/test_daemon.log
```

Наш демон заработал, но осталась не решенной еще одна задача. Зачастую при остановке нашего демона требуется выполнить каие либо задачи (сохранить состояние приложения, отправить уведомление, выполнить очистку данных и т.п.), но на текущий момент при останове наш демон просто закрывается.

### Обработка сигналов завершения

В стандартной библиотеке Pyhton реализован модуль `sygnal` позволяющий обрабатывать сигналы UNIX-based операционной системы. Полный перечень сигналов можно посмотреть по команде:
```bash
kill - l
```

Демон `Systemd` при выполнении операции останова демона отправляет изначально сигнал `15 (SIGTERM)` - нормальный останов процесса. По умолчанию если в течение 30 сек. не будет получен сигнал выхода приложения будет отправлен сигнал жесткого завершения процесса `9 (SIGKILL)`. 

Таким образом в нашем приложении необходимо предусмотреть обработчик сигнала `15 (SIGTERM)`, как результат наш скрипт `test_daemon.py` примет следующий вид:

```python
import time
import argparse
import logging
import sys
import signal

logger = logging.getLogger('test_daemon')
logger.setLevel(logging.INFO)
formatstr = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
formatter = logging.Formatter(formatstr)

def terminate(signalNumber, frame):
	"""
	Здесь мы можем обработать завершение нашего приложения
	Главное не забыть в конце выполнить выход sys.exit()
	"""
    logger.info(f'Recieved {signalNumber}')
    sys.exit()

def do_something():
	"""
	Здесь мы только лишь пишем сообщение в Log, но можем реализовать
	абсолютно любые задачи выполняемые в фоне.
	"""
    while True:
        logger.info("this is an INFO message")
        time.sleep(5)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Example daemon in Python")
	# Мы можем заменить default или запускать приложение с указанием нахождения 
	# log файла, через параметр -l /путь_к_файлу/файл.log
    parser.add_argument('-l', '--log-file', default='/home/user/test_daemon.log')
    args = parser.parse_args()
	
	signal.signal(signal.SIGTERM, terminate)

    fh = logging.FileHandler(args.log_file)
    fh.setLevel(logging.INFO)
    fh.setFormatter(formatter)
    logger.addHandler(fh)
    
    do_something()
```

> Хорошая [статья о работе signals на английском](https://stackabuse.com/handling-unix-signals-in-python)

Теперь при останове нашего демона:
```bash
systemctl start test_daemon
```

Мы увидим в лог файле сообщение *Recieved 15*
```
2021-06-27 15:06:48,024 - test_daemon - INFO - this is an INFO message
2021-06-27 15:06:53,029 - test_daemon - INFO - this is an INFO message
2021-06-27 15:06:56,971 - test_daemon - INFO - Recieved 15
```

Таким образом мы создали шаблон демона который в дальнейшем может быть использован для решения реальных фоновых задач.
