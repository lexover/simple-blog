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
                info: "Проверка выполняется с помощью system check - это набор статических проверок для проверки проектов Django.\n" +
                "Он обнаруживает распространенные проблемы и дает подсказки, как их устранить. Фреймворк является расширяемым,\n" + 
                "поэтому вы можете легко добавлять свои собственные проверки.",
                command: "django-admin check",
            }, {
                description: "Проверить проложения blog, myapp на наличие потенциальных проблем",
                command: "django-admin check blog myapp",

            }, {
                description: "Проверить проблемы конфигурации связанные с БД.",
                info: "Проверки базы данных не запускаются по умолчанию, поскольку они делают больше,\n" + 
                "чем статический анализ кода, как это делают обычные проверки.\n" + 
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
    },
]