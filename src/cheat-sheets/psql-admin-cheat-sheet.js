
export const CONTENT = [
    {
        title: 'Установка и подключение PosgreSQL (Ubuntu)',
        rows: [
            {  
                description: "Установка",
                command: "$ sudo apt install postgresql postgresql-contrib",
            }, {
                description: "Запуск postgres с переключением на учетную запись postgres на сервере",
                info: "В ходе установки была создана учетную запись пользователя postgres, которая связана с " + 
                "\nиспользуемой по умолчанию ролью Postgres.",
                command: "# С переключением на учетную запись postgres на сервере" +
                "\n$ sudo -i -u postgres\n$ psql" +
                "\n\n# Без переключения на учетную запись postgres" + 
                "\n$ sudo -u postgres psql",
            }, {
                description: "Создание новой роли 'test_db' в интерактивном режиме (без входа в postgres)",
                info: "Для аутентификации и авторизации Postgres использует концепцию \"ролей\" по умолчанию" +
                "Роли напоминают обычные учетные записи в Unix, но не делает разичий между пользователями и группами.",
                command: "postgres@serever: ~$ createuser --interactive test_db" + 
                "\n\n# или без входа" +
                "\n$ sudo -u postgres createuser --interactive test_db",
            }, {
                description: "Вывести доступные опции для createuser",
                command: "$ man createuser",
            }, {
                description: "Создание новой базы данных test_db",
                info: "Для созданной роли по умолчанию Postgres считает что существует база данных с тем же именем, " +
                "к которой роль имеет доступ",
                command: "postgres@serever: ~$ createdb test_db" + 
                "\n\n# или без входа" +
                "\n$ sudo -u postgres creatdb test_db",
            }, {
                description: "Открытие командной строки Postgres с новой ролью",
                info: "Для идентификации с новой ролью вам потребуется пользователь Linux с тем же именем, что и имя" +
                "роли и БД. Если у вас нет соответствующего пользователя Linux можно создать его с помощью adduser",
                command: "# Создаем пользователя с именем как роль\n$sudo adduser test_db" + 
                "\n\n# Входим в БД с именем как у роли с новыми правами пользователя" +
                "\n$ sudo -u test_db psql" +
                "\n\n# Входим в БД с именем other_db с новыми правами пользователя" +
                "\n$ sudo -u test_db psql other_db",
            }, {
                description: "Подключиться к базе Postgres с именем my_db на хосте 192.168.0.10 порт 5432, " +
                "как пользователь my_user" ,
                info: "Если хост не указан и не задан в переменной окружения PGHOST, используется localhost" 
                + "Если порт не указан и не задан в переменной окружения PGPORT, используется 5432",
                command: "psql -h 192.168.0.10 -p 5432 --username=my_user --dbname=my_db",
            }
        ]
    }, {
        title: 'Основные команды psql',
        rows: [
            {  
                description: "Справочник команд psql",
                command: "\\?",
            }, {
                description: "Справончик SQL",
                command: "\\help",
            }, {
                description: "Выход и программы",
                info: "Также возможно выполнить комбинацию Ctrl+D",
                command: "\\q",
            }, {
                description: "подключиться к базе с именем db_name",
                command: "\\connect db_name",
            }, {
                description: "Список пользователей",
                command: "\\du",
            }, {
                description: "Список таблиц, представлений, последовательностей, прав доступа к ним",
                command: "\\dp (или \\z)",
            }, {
                description: "Индексы",
                command: "\\di",
            }, {
                description: "Последовательности",
                command: "\\ds",
            }, {
                description: "Список таблиц",
                command: "\\dt",
            }, {
                description: "Список всех таблиц с описанием",
                command: "\\dt+",
            }, {
                description: "Список всех таблиц, содержащих s в имени",
                command: "\\dt *s*",
            }, {
                description: "Представления",
                command: "\\dv",
            }, {
                description: "Системные таблицы",
                command: "\\dS",
            }, {
                description: "Описание таблицы",
                command: "\\d+",
            }, {
                description: "Пересылка результатов запроса в файл",
                command: "\\o",
            }, {
                description: "Список баз данных",
                command: "\\l",
            }, {
                description: "Читать входящие данные из файла",
                command: "\\i",
            }, {
                description: "Открывает текущее содержимое буфера запроса в редакторе",
                info: " Если иное не указано в окружении переменной EDITOR, то будет использоваться по умолчанию vi",
                command: "\\e",
            }, {
                description: "Описание таблицы с именем table_name",
                command: "\\t \"table_name\"",
            }, {
                description: "Запуск команды из внешнего файла, /my/directory/my.sql",
                command: "\\i /my/directory/my.sql",
            }, {
                description: "Команда настройки параметров форматирования",
                command: "\\pset",
            }, {
                description: "Выводит сообщение",
                command: "\\echo",
            }, {
                description: "Выводит список текущих переменных среды",
                command: "\\set",
            }, {
                description: "Устанавливает значение переменной среды VAL=x",
                command: "\\set VAL=x",
            }, {
                description: "Удаляет значение переменной среды.",
                command: "\\unset VAL",
            }
        ]
    }, {
        'title': 'Создание резервных копий',
        rows: [
            {
                description: "Создание бекапа базы mydb, в сжатом виде (tar) c подробным выводом",
                info: "Опции -F {c|t|p} формат файла (custom, tar, plain text); -b включать большие объекты (blob)", 
                command: "pg_dump -h localhost -p 5432 -U someuser -F t -b -v -f mydb.backup mydb",
            }, {
                description: "Создание бекапа базы mydb, в виде текстового файла, включая команду создания БД",
                info: "Опции -F {c|t|p} формат файла (custom, tar, plain text); -b включать большие объекты (blob);" + 
                "-C добавить команду для создания БД", 
                command: "pg_dump -h localhost -p 5432 -U someuser -C -F p -b -v -f mydb.backup mydb",
            }, {
                description: "Создание бекапа базы mydb, в сжатом виде, с таблицами которые содержат в имени payments",
                info: "Опции -F {c|t|p} формат файла (custom, tar, plain text); -b включать большие объекты (blob);" + 
                "-C добавить команду для создания БД; -t указывает определенные таблицы", 
                command: "pg_dump -h localhost -p 5432 -U someuser -F t -b -v -t *payments* -f payment_tables.backup mydb",
            }, {
                description: "Дамп данных только одной, конкретной таблицы.",
                info: "Если нужно создать резервную копию нескольких таблиц, то имена этих таблиц перечисляются с помощью ключа -t для каждой таблицы",
                command: "pg_dump -a -t table_name -f file_name database_name",
            }, {
                description: "Создание резервной копии с сжатием в gz",
                info: "",
                command: "pg_dump -h localhost -O -F p -c -U postgres mydb | gzip -c > mydb.gz",
            }
        ]
    }, {
        'title': 'Восстановление из резервных копий',
        rows: [
            {
                description: "Восстановление из бекапа в текстовом формате с игнорированием ошибок",
                command: "psql -h localhost -U someuser -d dbname -f mydb.sql",
            }, {
                description: "Восстановление из бекапа в текстовом формате с остановкой на первой ошибке",
                command: "psql -h localhost -U someuser —set ON_ERROR_STOP=on -f mydb.sql",
            }, {
                description: "Восстановление всего бэкапа из tar-архива с выводом информации о процессе",
                info: "Для восстановления из tar-арихива нам понадобиться сначала создать базу с помощью CREATE DATABASE mydb;" + 
                "\n(если при создании бекапа не была указана опция -C)",
                command: "pg_restore —dbname=mydb —jobs=4 —verbose mydb.backup",
            }, {
                description: "Восстановление резервной копии БД, сжатой gz",
                command: "gunzip mydb.gz\npsql -U postgres -d mydb -f mydb",
            }
        ]
    }, {
        'title': 'Утилиты Postgres',
        rows: [
            {
                description: "Создание БД",
                command: "createdb",
            }, {
                description: "Удаление БД",
                command: "dropdb",
            }, {
                description: "Создание роли (пользователя)",
                command: "createuser",
            }, {
                description: "Удаление роли (пользователя)",
                command: "dropuser",
            }, {
                description: "Программа предназначенная для решения общих задач управления (запуск, останов, настройка параметров и т.д.)",
                command: "pg_ctl",
            }, {
                description: "Многопользовательский серверный модуль PostgreSQL (настройка уровней отладки, портов, каталогов данных)",
                command: "postmaster",
            }, {
                description: "Создание новых кластеров PostgreSQL",
                command: "initdb",
            }, {
                description: "Программа для создания каталогов для вторичного хранения баз данных",
                command: "initlocation",
            }, {
                description: "Физическое и аналитическое сопровождение БД",
                command: "vacuumdb",
            }, {
                description: "Архивация и восстановление данных",
                command: "pg_dump",
            }, {
                description: "Резервное копирование всего кластера PostgreSQL",
                command: "pg_dumpall",
            }, {
                description: "Восстановление БД из архивов (.tar, .tar.gz)",
                command: "pg_restore",
            }
        ]
    }, {
        'title': 'Работа с Postgres непосредственно из командной строки (shell)',
        rows: [
            {
                description: "Создать таблицу в БД my_db",
                info: "Опция -с (--command) выполняет команду указанную за ней",
                command: "psql -U postgres -d my_db -c \"CREATE TABLE my(some_id serial PRIMARY KEY, some_text text);\"",
            }, {
                description: "Выполнить SQL код размещенный в файле my/path/code.sql, все команды за раз",
                info: "Опция -f выполняет команды SQL из указанного файла",
                command: "psql -U postgres -d my_db -f my/path/code.sql",
            }, {
                description: "Выполнить SQL код размещенный в файле my/path/code.sql, в пошаговом режиме (подтверждая" + 
                "каждую команду",
                info: "Опция -f выполняет команды SQL из указанного файла, -s пошаговый режим",
                command: "psql -U postgres -d my_db -s -f my/path/code.sql",
            }, {
                description: "Выбрать все значения из таблицы my с выводом результата в html-фaйл",
                info: "Опция -с (--command) выполняет команду указанную за ней; -H вывод в формате html," + 
                "-o путь к файлу в который вывести данные",
                command: "psql -d my_db -H -c \"SELECT * FROM my\" -o my.html",
            }, {
                description: "Вывести версию Postgres",
                command: "psql -V",
            }
        ]
    }
] 