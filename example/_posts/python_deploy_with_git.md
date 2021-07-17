---
date: '2021-07-17'
slug: python-deploy-with-git
tags:
- Python
- git
title: Непрерывная интеграция Python сервиса с помощью git
description: Пошаговая инструкция как реализовать непрерывную интеграцию Python сервиса с помощью git hooks
author: Lexover
location: Russia 
image: https://res.cloudinary.com/dm3m076ji/image/upload/v1626517783/media/lexover_blog/python_git_e6nwwu.png
meta:
  - name: title
    content: Деплой Python сервиса с помощью git
  - name: description
    content: Пошаговая инструкция как выполнить деплой Python сервиса с помощью git hooks
  - name: keywords
    content: Python, git
  - name: author
    content: Lexover
  - name: language
    content: Russian 
featured: true
---

Данная статья является продолжнием [статьи о создании сервиса на Pyhon](https://lexover.ru/2021/06/27/python-daemon-systemd/). Итак мы реализовали некоторый сервис который запускается и в фоне выполняет некоторые задачи (следит за изменением цен на очредной девайс, ведет незатейливую переписку в Telegram, и т.п.). Мы разместили его на нашем сервере (например на RaspberyPi) где он и выполняет рутинные задачи. Но сервис должен разваться, мы вносим изменения в его код и каждый раз вручную приходится переносить код на наш сервер и выполнять его перезапуск, а кроме того перед запуском нам желательно протестировать новый код, хотелсь бы выполнять всю эту рутину автоматически. Тут мы и приходим к необходимости реализации непрерывной интеграции. Есть множество инструментов призванных упростить данную процедуру такие как [GitLabCI](https://docs.gitlab.com/ee/ci/), [Jenkins](https://www.jenkins.io/), [circleci](https://circleci.com/) и другие. Каждый из них достоен внимания, но мы реализуем наше решение с помощью инструментов `git` и `bash`, обойдя стороной `docker` контейнеры и погрузившись немного в принципы работы той самой непрерывной интеграции.

> Все операции указанные в данной статье выполнялись в окружении Linux Ubuntu 20, с установленным Python 3.8.


### Создаем репозиторий git

Т.к. мы планируем выполнять деплой на удаленный сервер нам потребуется сам удаленный сервер, в качестве которого могут выступить виртуальная машина с установленным Linux на базе debian и Python старше версии 3.6 и ssh, `Raspberry Pi` либо другой компьютер подключенный по локальной сети. 
> В дальнейшем мы считаем удаленный сервер имеет IP: `192.168.0.100`, пользователь ssh локального копьютера `user`, пользователь git на удаленном сервере `git`.

Прежде всего нам потребуется настроить доступ по SSH на стороне сревера. Для авторизации пользователей используем метод `authorized_keys`. На нашем сервере создадим пользователя `git` и каталог *.ssh*:

```bash
sudo adduser git
su git
cd ~
mkdir .ssh && chmod 700 .ssh
touch .ssh/authorized_keys && chmod 600 .ssh/authorized_keys
```

Добавим открытые (`.pub`) ключи разработчика в файл *authorized_keys* пользователя git. Данные ключи должны быть сгенерированы на локальном компьютере (обычно находятся в папке `.ssh`). Данные ключи должны быть скопированы с локального компьютера на сервер например с помощью `scp` (команда выполняется на локальном компьютере):

```bash
scp ~/.ssh/id_rsa.user.pub user@192.168.0.100:/home/user/
```

Добавляем скопированные ключи в *.ssh/autrhorized_keys*:

```bash
cat /home/user/id_rsa.user.pub >> ~/.ssh/authorized_keys
```

Создаем на нашем сервер пустой репозиторий без рабочего каталога `--bare`:

```bash
cd /home/git
mkdir project.git
cd project.git
git init --bare
```

> Вышеуказанные команды должны быть выполнены под пользователем `git` т.е. перед их выполнением должна быть выполнена команда `su git` (если она не была выполнена ранее). Если каталог */home/git* отсутствует следует создать его и установить владельца `git:git`: `sudo mkdir /home/git`, `sudo chown git:git /home/git`

Теперь на локальном компьютере инициализируем репозиторий с проектом, устанавливаем для него только что созданный удаленный репозиторий:

```bash
mkdir porject
cd project
git init
touch README.md
git add README.md
git commit -m 'Initial commit'
git remote add origin git@192.168.0.100:/home/git/project.git
git push origin master
```

Теперь мы можем работать с удаленным репозиторием и отправлять коммиты на наш сервер командой `git push origin`.

### Создаем хук git 

Для того чтобы иметь возможность автоматически развренуть наше приложение на удаленном сервере нам необходимо знать когда произошли изменения в исходных файлах. Для этих целей git предоставляет хуки. Хуки - это файлы скрипты которые храняться в подкаталоге проекта *.git/hooks* имеют определенное имя и запускаются на определенной стадии обработки `push` (в зависимости от имени). Нам потребуется хук post-recieve который вызывается после окончания выполнения операции `push`. 

Создадим данный хук на нашем сервере:

```bash
su git
cd /home/git/project.git/hooks
touch post-receive
vim post-receive
```
со следующим содержимым:

```bash
#!/bin/bash

deploy_path=/home/user/project   # Путь куда будет деплоится проект
repo_path=/home/git/project.git # Путь к нашему репозиторию

# Здесь мы выполняем перехват сообщений деплоя и направляем их в файл deploy.log 
# который будет находится в директории деплоя, так мы можем отслеживать состояние
# деплоя и возникновение ошибок
exec 3>&1 4>&2
trap 'exec 2>&4 1>&3' 0 1 2 3
exec 1>"$deploy_path/deploy.log" 2>&1

# Зачитаем ветку в которую выполняется push и текст сообщения коммита, что позволит
# нам идентифицировать необходимость деплоя. Как в данном случае мы проверяем 
# если ветка `master` и сообщение коммита начинается с `[deploy]` мы производим 
# оперцию деплоя иначе деплой игнорируется (обновляется только код в репозитории)
while read oldrev newrev refname
do
    branch=$(git rev-parse --symbolic --abbrev-ref $refname)
    if [ "master" = "$branch" ]; then
        message=$(git show -s --format=%s)
        if [[ "$message" == "[deploy]"* ]]; then

                echo '############## Update sources ############################'
                # Код из репозитория размещаем в директории deploy_path
                git --work-tree=$deploy_path --git-dir $repo_path checkout -f master

                echo '############## Deploy ####################################'
                # Запускаем скрипт производящий операции деплоя (тестирование,
                # обновление и перезапуск сервиса)
                cd $deploy_path
                # Важно указать sudo т.к. в скрипте deploy.sh мы выполняем команды 
                # с правами sudo, если здесь упуситить sudo получим ошибку.
                sudo ./deploy/deploy.sh
        fi
    fi
done
```
Установим нашему хуку права на выполнение для этого необходимо выйти из пользователя `git` и выполнить `chmod +x`:
```bash 
exit
chmod +x post-receive
```

После того как скрипт `post-recieve` создан на сервере, каждый раз при выполнении `git push origin` он проверит что ветку в которую выполнен push и сообщение коммита и если ветка `master` и текст последнего коммита начинается с `[deploy]` то запустит на выполнение скрипт *deploy.sh* размещенный в директории *deploy* нашего проекта. Таким образом нам осталось реализовать данный скрипт непосредственно в коде нашего проекта *project/deploy/deploys.sh*:

```bash
#!/bin/bash
# Проверяем есть ли виртуальное окружение. Если есть активируем, иначе создаем его.
if [[ -d "venv" ]]; then
    echo 'Venv exists'
    source venv/bin/activate
else
    echo '################# Create venv ##############################'
    python3 -m venv venv
fi

# Добавляем PYTHONPATH наш проект
export PYTHONPATH=${PYTHONPATH}:project

# При необходимости можем установить библитоеки из requirements.txt 
# for line in $(cat requirements.txt)
# do
#     pip install $line
# done

# Так же можем выполнить тестирование перед деплоем
# echo '#################### Run unit tests ##############################'
# pytest project/tests
# test_status=$?
# if [[ $test_status -ne 0 ]]; then
#   echo '################## Tests falied ################################'
#   echo Pytest exited vith code: $test_status
# exit 0
# fi

# Обновляем сервис
echo '#################### Update service ##############################'
sudo systemctl stop test_daemon 
sudo sed "s|DEPLOY_PATH|$(pwd)|g" deploy/test_daemon_template.service > test_daemon.service
sudo mv test_daemon.service /etc/systemd/system/test_daemon.service
sudo systemctl daemon-reload
sudo systemctl start test_daemon 
echo '################### Market analyser started ######################'
```

Теперь остается добавить наш скрипт в visudo, чтобы имень возможность запуска комманд под `sudo` в нем:

```bash
sudo visudo
```
Добавить в конец файла где `git` пользователь от которого выполняются команды, а также указан путь к директории деплоя:

```bash
git      ALL=(ALL) NOPASSWD: /home/project/deploy/deploy.sh
```

> Если требуется указать несколько скриптов который должны запускаться с правами sudo от одного пользователя они указываются через запятые: `git ALL=(ALL) NOPASSWD: /home/script_1.sh, /home/script_2.sh`

### Деплой

Остается разместить исходный код из нашей [предыдущей статьи](https://lexover.ru/2021/06/27/python-daemon-systemd/) в соответствующих директориях и можно деплоить: 
```
project/ 
-- test_daemon.py
-- deploy/
----- deploy.sh
----- test_daemon_template.service
```
В файле *test_daemon_template.service* заменим путь к рабочей директории на шаблон, который будет подменен при деплое:
```ini
[Unit]
Description=Test daemon
After=syslog.target

[Service]
Type=simple
User=user
Group=user
WorkingDirectory=DEPLOY_PATH
ExecStart=DEPLOY_PATH/venv/bin/python test_daemon.py

[Install]
WantedBy=multi-user.target
```

Теперь можем выполнить коммит наших изменений и отправить на деплой на сервере с локального компьютера:
```bash
git add test_daemon.py
git add deploy/deploys.sh
git add deploy/test_datemon_template.service
git commit -m "[deploy] Implemented test_service"
git push origin master
```

Остается подключиться к удаленному серверу через `ssh` и проверить запустился ли наш сервис:
```bash
systemctl -l status test_unit
```
Если сервис не запущен проверяем сообщения в лог файле нашего проекта на сервере:
```bash
tail /home/user/project/deploy.log
```

### Отладка

В нашем коде достаточно много частей которые должны корректно взаимодействовать между собой, но всегда возможны ошибки и необходимо их найти. В нашем случае стоит начать с проверки срабатывания `post-receive` хука. При его запуске в директории которую мы указали в данном файле `deploy_path` должен быть создан файл `deploy.log`. Если после выполнения `push origin master` коммита с сообщением в формате `[deploy] message...` файл не создан, следует проверить имя данного файла, владельца и выставленные права на выполнение:
```bash
ls -l /home/git/project.git/hooks
-rwxr-xr-x 1 git git  736 июл 17 14:37 post-receive
```
Если права выставлены корректно а файл `deploy.log` не создается вероятна проблема с путями либо правами на запись по указанному пути, проверить это можно запустив `post-receive` от имени `git`:
```bash 
cd /home/git/project.git/hooks
su git
./post-receive
exit
```
Если есть ошибка вы увидите сообщение, иначе вывод просто застынет т.к. будет ждать на вводе сообщений которые должны прийти от `git` но т.к. мы запустили его вручную он их не дождется, жмем `ctrl + z` и выходим из процесса.

Если же файл `deploy.log` создается мы можем наблюдать ошибки возникшие в процессе деплоя непосредственно в нем. Чтобы каждый раз не выполнять `git push origin master` при отладке, можем запускать файл `deploy.sh` с правами `git`:
```bash
cd /home/project/deploy/
su git
./deploy.sh
exit
```
Ну и конечный результат выполнения нашего процесса можно смотреть выполнив:
```bash
sudo systemctl status -l test_daemon
```
Если ошибки возникают непосредственно в коде при выполнении вы увидите их вывод.

Вот и вся инструкция самостоятельной реализации процесса непрерывной интеграции. 
