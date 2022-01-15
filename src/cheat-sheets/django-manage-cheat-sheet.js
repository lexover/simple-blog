export const CONTENT = [
    {
        title: 'Помощь и версия Django',
        rows: [
            {  
                description: "Отобразить помощь и список доступных комманд",
                command: "django-admin help",
            }, {
                description: "Обтобразить список доступных комманд",
                command: "django-admin help --commands",
            }, {
                description: "Обтобразить описание команды command и список доступных опций",
                command: "django-admin help command",
            }, {
                description: "Отобразить текущую версию Django",
                info: "Вывод соответствует формату описанному в PEP 386",
                command: "django-admin version",
            } 
        ]
    }, {
        title: 'Основные команды',
        rows: [
            {  
                description: "Создать проект myproject в директории /home/myproject",
                command: "django-admin startproject myproject /home/myproject",
            }, {
                description: "Создать проект myproject в текущей директории с указанием файла пользовательского шаблона /home/proj_template",
                info: "В template указывается путь или URL к директории с файлом шаблона приложения или путь к сжатому файлу " + 
                "(.tar.gz, .tar.bz2, .tgz, .tbz, .zip), содержащему файлы шаблона проекта.",
                command: "django-admin startproject --template=/home/proj_template myproject .",
            }, {
                description: "Создать проект myproject в текущей директории с указанием файла пользовательского шаблона размещенного на github",
                info: "В template указывается путь или URL к директории с файлом шаблона проекта или путь к сжатому файлу " + 
                "(.tar.gz, .tar.bz2, .tgz, .tbz, .zip), содержащему файлы шаблона приложения.",
                command: "django-admin startproject --template=https://github.com/user/master.zip myproject .",
            }, {
                description: "Создать приложение myapp в директории /home/myproject/myapp с указанием файла пользовательского шаблона размещенного на github",
                info: "В template указывается путь или URL к директории с файлом шаблона приложения или путь к сжатому файлу " + 
                "(.tar.gz, .tar.bz2, .tgz, .tbz, .zip), содержащему файлы шаблона приложения.",
                command: "django-admin startapp --template=https://github.com/user/master.zip my_app /home/myproject/myapp",
            }, {
                description: "Запустить интерактивный сеанс python",
                command: "django-admin shell",
            }, {
                description: "Запустить интерактивный сеанс python в оболочке bpyhon (доступны ipython,bpython,python)",
                info: "По умолчанию Django использует IPython или bpython, если установлен любой из них. Если необходимо принудительно использовать " + 
                "'простой' режим используйте опцию --interface python",
                command: "django-admin --interface bpython shell",
            }, {
                description: "Выполнить команду которая выведет версию Python в оболочке",
                command: 'django-admin shell --command="import django; print(django.__version__)"',
            }, {
                description: "Запустить web-сервер разработки с IP-адресом 1.2.3.4 на порту 7000",
                info: "НЕ ИСПОЛЬЗУЙТЕ ЭТОТ СЕРВЕР В ПРОИЗВОДСТВЕННЫХ УСЛОВИЯХ. Если не переданы IP адрес и порт будут использованы 127.0.0.1:8000. " + 
                "По умолчанию сервер разработки не обслуживает статические файлы для вашего сайта (такие как CSS файлы, изображения, вещи под MEDIA_URL и так далее)", 
                command: 'django-admin runserver 1.2.3.4:7000',
            }
        ]
    }, {
        title: 'Миграции',
        rows: [
            {  
                description: "Создать новые миграции на основе изменений в моделях для всех приложений.",
                info: 'Миграции, их связь с приложениями и многое другое подробно рассматривается в ' + 
                '<a href="https://django.fun/docs/django/ru/2.2/topics/migrations/">документации</a>', 
                command: "manage.py makemigrations",
            }, {
                description: "Создать новые миграции на основе изменений в моделях для приложений blog и forum",
                info: 'Предоставление одного или нескольких имен приложений в качестве аргументов ограничит' +
                'создаваемые миграции указанными приложениями и любыми необходимыми зависимостями (например, таблицей на другом конце ForeignKey)', 
                command: "manage.py makemigrations blog forum",
            }, {
                description: "Создать в каталоге мигарций приложения app пустую миграцию для последующего ручного редактирования с именем migration_102",
                info: "Опцию --empty испозуйте толькое если хорошо знаете как работют миграции в Django. Опция --name позволяет присвоить имя миграции вместо его генерации.",
                command: "manage.py makemigrations --empty --name=migration_102 app",
            }, {
                description: "Вывести все действия, которые будут выполнять создаваемые миграции, не создавая файл с миграцией.",
                info: "Если дополнительно указать --verbosity 3, будет выведено содержимое файлов миграций, которые будут созданы.",
                command: "manage.py makemigrations --dry-run",
            }, {
                description: "Выполнить объединение конфликтующих миграций",
                info: "Опция --noinput позволяет отключить запрос на ввод пользователя при мерже миграций.",
                command: "manage.py makemigrations --merge --noinput",
            }, {
                description: "Синхронизировать состояние БД с текущим состоянием моделей и миграций для всех приложений",
                info: "В отличии от syncdb эта команда не пытается создать супер-пользователя, если такой не существует " + 
                "(подразумевается, что вы используете django.contrib.auth). Для этого используйте команду createsuperuser.",
                command: "manage.py migrate",
            }, {
                description: "Синхронизировать состояние БД с меткой MyDatabase c текущим состоянием моделей и миграций для всех приложений",
                command: "manage.py migrate --database=MyDatabase",
            }, {
                description: "Синхронизировать состояние БД с текущим состоянием моделей приложения blog до миграций migration_10 (включая ее)",
                info: " Приводит базу данных к состоянию, которые было бы после завершения указанной миграции, но последующие миграции не выполнены. " + 
                "Обратите внимание, это может привести к отмене миграций, если были выполнены миграции, которые следуют после указанной вами. " + 
                "Используйте zero, чтобы отменить все миграции для приложения.",
                command: "manage.py migrate blog migration_10",
            }, {
                description: "Пометить текущие миграции как выполненные не трогая БД (без выполнения SQL запросов)",
                info: "Опция --fake предназначена для опытных пользователей, которые хотят явно указать состояние миграций после применения изменений вручную." + 
                "Будьте осторожны, использование --fake может “сломать” автоматическое применение миграций.",
                command: "manage.py migrate --fake",
            }, {
                description: "Объединить миграции приложения blog от начальной до миграции last_migration включая ее",
                info: "Полученные объединенные миграции могут существовать параллельно с начальными. <br>" +
                "По умолчанию Django пытается оптимизировать операции в миграциях, чтобы уменьшить размер файла. Опция --no-optimize позволяет отключить такое поведение.",
                command: "manage.py squashmigrations blog last_migration",
            }
        ]
    }, {
        title: 'Администрирование (команды доступны только если установлена система авторизации django.contrib.auth)',
        rows: [
            {  
                description: "Создать суперпользователя root с email: root@example.example",
                info: "При запуске через консоль команда потребует ввести пароль. Если выполнить команду программно, " + 
                "будет создан пользователь без пароля, он не сможет авторизоваться, пока не будет установлен пароль для него.",
                command: "django-admin createsuperuser --username=root --email=root@example.example",
            }, {
                description: "Изменить пароль пользователя my_user",
                command: "django-admin changepassword my_user"
            }
        ]
    }, {
        title: 'Генерация данных (статические файлы, перевод)',
        rows: [
            {  
                description: "Собрать статические файлы в STATIC_ROOT",
                info: "Поиск файлов осуществляется с помощью параметра enabled finders. По умолчанию поиск производится во всех местах, " +
                "определенных в STATICFILES_DIRS и в каталоге приложений 'static', указанном параметром INSTALLED_APPS.",
                command: "manage.py collectstatic"
            }, {
                description: "Собрать статические файлы с предварительной очисткой STATIC_ROOT",
                info: "При последующих запусках collectstatic (если STATIC_ROOT не пуст) файлы копируются, только если их измененная временная метка больше, " +
                "чем временная метка файла в STATIC_ROOT. Поэтому, если вы удаляете приложение из INSTALLED_APPS, целесообразно использовать опцию " + 
                "collectstatic --clear, чтобы удалить устаревшие статические файлы",
                command: "manage.py collectstatic --clear"
            }, {
                description: "Создать файл переводимых сообщений (*.po) в conf/locale для всех языков",
                info: "Анализирует все файлы в текущем каталоге и парсит строки, которые помечены для перевода. Создает (или обновляет) " + 
                "файл переводимых сообщений в conf/locale (в каталоге проекта) или каталоге переводов (для проекта или приложения).",
                command: "manage.py makemessages --all"
            }, {
                description: "Создать файл переводимых сообщений (*.po) в conf/locale для немецкого языка (de) обрабатывая файлы с расширением xhtml, html",
                info: "С помощью опции --extension или -e можно указать список расширений файлов, которые будут обрабатываться командой (по умолчанию: ”.html”, ”.txt”)." + 
                "Можно указать несколько расширений через запятую, или указав опцию -e или –extension несколько раз",
                command: "manage.py makemessages --locale=de --extension=xhtml,html"
            }, {
                description: "Скомпилировать файлы переводимых сообщений (*.po) в файлы (*.mo) для использования с gettext с целью локализации проекта для немецкого локаль (de_DE)",
                info: "Если опция --locale или -l не укзана будут обработаны все локали. Опция --exclude или -x поволяет исключить локали из обработки.",
                command: "manage.py compilemessages --locale=de_DE"
            }, {
                description: "Создать в БД таблицу, которая будет исползоваться соответствующим бэкендом кеша.",
                info: "Опция --database позволяет указать базу данных, в которой будет создана таблица, если она не укзаана Django возьмет данную информацию из файла настроек.",
                command: "manage.py createcachetable"
            }
        ]
    }, {
        title: 'Работа с базой данных',
        rows: [
            {  
                description: "Запустить оболочку для БД с параметрами указанными в настройках проекта (ENGINE, USER, PASSWORD и т.д.)",
                info: "--database=<db_name> позволяет указать БД для которой открыть оболочку, если не указано используется БД default.<br>" +
                "Эта команда подразумевает, что клиент находится в PATH системы, и запуск клиента в консоли (psql, mysql, sqlite3) работает",
                command: "django-admin dbshell",
            }, {
                description: "Создать дамп всех моделей приложений auth и blog в файл db_dump.json",
                info: 'Если имя приложения не указано, будет создан дамп всех установленных приложений.' + 
                'Команда выводит все данные в стандартный вывод если не указана опция -o, --output.' + 
                'Если указан уровень --verbosity больше 1 будет выведен прогресс выполнения.',
                command: "django-admin dumpdata auth blog > db_dump.json\n'или\ndjango-admin dumpdata -o=db_dump.json --verbosity=1 auth blog"
            }, {
                description: "Создать дамп всех моделей проекта исключив приложение auth модель blog.Entry",
                command: "django-admin dumpdata -o=db_dump.json --exclude=auth --exclude=blog.Entry"
            }, {
                description: "Создать дамп db_dump.xml модели User приложения auth в формате xml.",
                info: 'По умолчанию dumpdata выводит данные в формете json но доступны также xml, yaml',
                command: "django-admin dumpdata -o=db_dump.xml --format=xml auth.User"
            }, {
                description: "Создать дамп модели User приложения auth, используя базовый менеджер и выводя только объекты с первичным ключем 1, 2, 3",
                info: 'dumpdata использует менеджер по умолчанию в модели для выбора записей для дампа, если необходимо получить все записи спользуя базовый ' +
                'менеджер используйте опцию -a, --all.<br>Опция --pks доступна только при выводе одной модели.',
                command: "django-admin dumpdata -o=db_dump.json --all --pks=1,2,3 auth.User"
            }, {
                description: "Загрузить дамп (фикстуру) из файла db_dump.json расположенного в каталоге проекта",
                info: 'Django ищет фикстуры:<br>1. В каталоге fixtures приложений<br>2.В каталогах указанных в настройке FIXTURE_DIRS<br>' +
                '<br>3. По пути в названии фикстуры<br>Если не указано расширение фикстуры Django будет искать фикстуру всех возможных типов.',
                command: "django-admin loaddata db_dump.json"
            }, {
                description: "Загрузить дамп (фикстуру) из файла в приложении auth по пути fixtures/foo/bar/db_dump.json",
                info: 'Поиск при указании пути осущствляется по относительному пути <приложение>/fixtures/...<br>' +
                'Если указана настройка FIXTURE_DIRS=dirname - dirname/...',
                command: "django-admin loaddata foo/bar/db_dump"
            }, {
                description: "Загрузить сжатую текстуру db_dump.json.zip из каталога fixtrures приложения auth",
                info: 'Фикстуры могут быть сжаты в zip, gz или bz2 архив, но имя должно содержать оригинальное расширение например dump.xml.gz.<br>' +
                'По умолчанию фикстуры ищутся во всех приложениях. Опция --app позволяет указать конкретное приложение.',
                command: "django-admin loaddata --app=auth db_dump.json"
            }, {
                description: "У вас есть несколько БД нужно загрузить фикстуру db_dump.json в БД master",
                info: 'Вы можете добавить идентификатор базы данных в название фикстуры в текущем случае следует переименовать файл db_dump.json -> db_dump.master.json.',
                command: "django-admin loaddata db_dump.master.json"
            }, {
                description: "Удалить все данные из БД запустить post-sychronization обработчики и закгрузить начальные данные из фикстур",
                info: 'Опция --no-initial-data позволяет отключить загрузку начальных данных из "initial_data" фикстур',
                command: "django-admin flush"
            }
        ]
    }, {
        title: 'Тестирование',
        rows: [
            {  
                description: "Запустить все тесты проекта",
                info: "Поиск тестов основан на поиске тестов библиотеки unittest. По умолчанию тесты ищутся во всех файлах 'test*.py' в текущем каталоге.", 
                command: "manage.py test",
            }, {
                description: "Запустить тесты в пакете articles останавливая при первой ошибке",
                command: "manage.py test --failfast articles",
            }, {
                description: "Запустить тесты в пакете articles с сохранением состояния БД",
                info: "Позволяет пропустить этапы создания и удаления базы данных, что позволяет ускорить выполнение тестов. " + 
                "Если тестовая база данных не существует, она будет создана при первом запуске и использоваться при последующих.",
                command: "manage.py test --keepdb articles",
            }, {
                description: "Запустить тесты в пакете articles с сортировкой тестов в обратном порядке",
                info: "Может помочь при отладке тестов, которые не полностью изолированы и приводят к изменению окружения. Для этой опции сохранена группировка по классу.",
                command: "manage.py test --reverse articles",
            }, {
                description: "Запустить тесты в пакете articles логированием SQL для упавших тестов",
                info: "Если --verbosity выше 2, будет логгированы запросы и успешно выполненных тестов.",
                command: "manage.py test --debug-sql articles",
            }, {
                description: "Запустить тесты начинющиеся с 'tests_'",
                info: "",
                command: 'manage.py test --pattern="tests_*.py"',
            }, {
                description: "Запустить сервер для разработки с использованием данных из фикстур fixture_1, fixture_2",
                info: "Данный сервер не определяет изменения в Python файлах (как это делает команда runserver). Однако, он отслеживает изменения в шаблонах.",
                command: 'django-admin testserver fixture_1 fixture_2',
            }, {
                description: "Запустить сервер для разработки с использованием данных из фикстуры my_data.json на порту 7000 IP-адреса 192.168.0.1",
                info: "Данный сервер не определяет изменения в Python файлах (как это делает команда runserver). Однако, он отслеживает изменения в шаблонах.",
                command: 'django-admin testserver --addrport 192.168.0.1:7000 my_data.json',
            } 
        ]
    }, {
        title: 'Выявление потенциальных проблем',
        rows: [
            {  
                description: "Проверить проект на наличие потенциальных проблем",
                info: "Проверка выполняется с помощью system check - это набор статических проверок для проверки проектов Django.<br>" +
                "Он обнаруживает распространенные проблемы и дает подсказки, как их устранить. Фреймворк является расширяемым,<br>" + 
                "поэтому вы можете легко добавлять свои собственные проверки.",
                command: "django-admin check",
            }, {
                description: "Проверить проложения blog, myapp на наличие потенциальных проблем",
                command: "django-admin check blog myapp",

            }, {
                description: "Проверить проблемы конфигурации связанные с БД.",
                info: "Проверки базы данных не запускаются по умолчанию, поскольку они делают больше,<br>" + 
                "чем статический анализ кода, как это делают обычные проверки.<br>" + 
                "Они запускаются только командой migrate или если вы укажете тег database при вызове команды check.",
                command: "django-admin check --tag database",
            }, {
                description: "Вывести список доступных тэгов, которые могут быть переданы с опцией --tag",
                command: "django-admin check --list-tags",
            }, {
                description: "В вашей локальной среде разработки, выполнить проверки уместные в настройках развертывания.",
                info: "Поскольку локальный модуль настроек разработки может не иметь многих продуктовых настроек" + 
                "указываем файл продуктовых настроек. Также можно запустить проверку непосредственно при развертывании," + 
                "или можно сделать данную проверку частью интеграционных тестов убрав опцию --settings",
                command: "django-admin check --deploy --settings=production_settings",
            }, {
                description: "Выполнить проверку приложения myapp с выходом с ненулевым статусом при уровне WARNING.",
                info: "Доступны следующие уровни: CRITICAL, ERROR, WARNING, INFO, DEBUG",
                command: "django-admin check --fail-level=WARNING myapp",
            }, {
                description: "Проверить отправку писем. Отправить тестовое письмо на user@example.com",
                command: "django-admin sendtestemail user@example.com",
            }, {
                description: "Проверить отправку писем. Отправить тестовое письмо администраторам перечисленным в ADMINS",
                info: "Также возможно оправить менеджерам перечисленным в MANAGERS с использованием опции --managers",
                command: "django-admin sendtestemail --admins",
            }, {
                description: "Отобразить разницу между текущими настройками и настройками Django по умолчанию.",
                info: 'Настройки, которые не указаны в настройках по умолчанию, выводятся с "###" в конце. ' + 
                'Например, в настройках по умолчанию не указан ROOT_URLCONF, и в выводе diffsettings, к ROOT_URLCONF будет добавлен "###" в конце.',
                command: "django-admin diffsettings"
            }
        ]
    }
]