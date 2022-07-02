
export const CONTENT = [
    {
        title: 'Установка и подключение PosgreSQL (Ubuntu)',
        rows: [
            {  
                description: "Установка",
                command: "$ sudo apt install postgresql postgresql-contrib",
                code: "shell",
            }, {
                description: "Запуск postgres с переключением на учетную запись postgres на сервере",
                info: "В ходе установки была создана учетную запись пользователя postgres, которая связана с " + 
                "\nиспользуемой по умолчанию ролью Postgres.",
                command: "# С переключением на учетную запись postgres на сервере" +
                "\n$ sudo -i -u postgres\n$ psql" +
                "\n\n# Без переключения на учетную запись postgres" + 
                "\n$ sudo -u postgres psql",
                code: "shell",
            }, {
                description: "Создание новой роли 'test_db' в интерактивном режиме (без входа в postgres)",
                info: "Для аутентификации и авторизации Postgres использует концепцию \"ролей\" по умолчанию" +
                "Роли напоминают обычные учетные записи в Unix, но не делает разичий между пользователями и группами.",
                command: "postgres@serever: ~$ createuser --interactive test_db" + 
                "\n\n# или без входа" +
                "\n$ sudo -u postgres createuser --interactive test_db",
                code: "shell",
            }, {
                description: "Вывести доступные опции для createuser",
                command: "$ man createuser",
                code: "shell",
            }, {
                description: "Создание новой базы данных test_db",
                info: "Для созданной роли по умолчанию Postgres считает что существует база данных с тем же именем, " +
                "к которой роль имеет доступ",
                command: "postgres@serever: ~$ createdb test_db" + 
                "\n\n# или без входа" +
                "\n$ sudo -u postgres creatdb test_db",
                code: "shell",
            }, {
                description: "Открытие командной строки Postgres с новой ролью",
                info: "Для идентификации с новой ролью вам потребуется пользователь Linux с тем же именем, что и имя" +
                "роли и БД. Если у вас нет соответствующего пользователя Linux можно создать его с помощью adduser",
                command: "# Создаем пользователя с именем как роль\n$sudo adduser test_db" + 
                "\n\n# Входим в БД с именем как у роли с новыми правами пользователя" +
                "\n$ sudo -u test_db psql" +
                "\n\n# Входим в БД с именем other_db с новыми правами пользователя" +
                "\n$ sudo -u test_db psql other_db",
                code: "shell",
            }, {
                description: "Подключиться к базе Postgres с именем my_db на хосте 192.168.0.10 порт 5432, " +
                "как пользователь my_user" ,
                info: "Если хост не указан и не задан в переменной окружения PGHOST, используется localhost" 
                + "Если порт не указан и не задан в переменной окружения PGPORT, используется 5432",
                command: "psql -h 192.168.0.10 -p 5432 --username=my_user --dbname=my_db",
                code: "shell",
            }
        ]
    }, {
        title: 'Основные команды psql',
        rows: [
            {  
                description: "Справочник команд psql",
                command: "\\?",
                code: "shell",
            }, {
                description: "Справончик SQL",
                command: "\\help",
                code: "shell",
            }, {
                description: "Выход и программы",
                info: "Также возможно выполнить комбинацию Ctrl+D",
                command: "\\q",
                code: "shell",
            }, {
                description: "подключиться к базе с именем db_name",
                command: "\\connect db_name",
                code: "shell",
            }, {
                description: "Список пользователей",
                command: "\\du",
                code: "shell",
            }, {
                description: "Список таблиц, представлений, последовательностей, прав доступа к ним",
                command: "\\dp (или \\z)",
                code: "shell",
            }, {
                description: "Индексы",
                command: "\\di",
                code: "shell",
            }, {
                description: "Последовательности",
                command: "\\ds",
                code: "shell",
            }, {
                description: "Список таблиц",
                command: "\\dt",
                code: "shell",
            }, {
                description: "Список всех таблиц с описанием",
                command: "\\dt+",
                code: "shell",
            }, {
                description: "Список всех таблиц, содержащих s в имени",
                command: "\\dt *s*",
                code: "shell",
            }, {
                description: "Представления",
                command: "\\dv",
                code: "shell",
            }, {
                description: "Системные таблицы",
                command: "\\dS",
                code: "shell",
            }, {
                description: "Описание таблицы",
                command: "\\d+",
                code: "shell",
            }, {
                description: "Пересылка результатов запроса в файл",
                command: "\\o",
                code: "shell",
            }, {
                description: "Список баз данных",
                command: "\\l",
                code: "shell",
            }, {
                description: "Читать входящие данные из файла",
                command: "\\i",
                code: "shell",
            }, {
                description: "Открывает текущее содержимое буфера запроса в редакторе",
                info: " Если иное не указано в окружении переменной EDITOR, то будет использоваться по умолчанию vi",
                command: "\\e",
                code: "shell",
            }, {
                description: "Описание таблицы с именем table_name",
                command: "\\t \"table_name\"",
                code: "shell",
            }, {
                description: "Запуск команды из внешнего файла, /my/directory/my.sql",
                command: "\\i /my/directory/my.sql",
                code: "shell",
            }, {
                description: "Команда настройки параметров форматирования",
                command: "\\pset",
                code: "shell",
            }, {
                description: "Выводит сообщение",
                command: "\\echo",
                code: "shell",
            }, {
                description: "Выводит список текущих переменных среды",
                command: "\\set",
                code: "shell",
            }, {
                description: "Устанавливает значение переменной среды VAL=x",
                command: "\\set VAL=x",
                code: "shell",
            }, {
                description: "Удаляет значение переменной среды.",
                command: "\\unset VAL",
                code: "shell",
            }
        ]
    }, {
        'title': 'Создание резервных копий',
        rows: [
            {
                description: "Создание бекапа базы mydb, в сжатом виде (tar) c подробным выводом",
                info: "Опции -F {c|t|p} формат файла (custom, tar, plain text); -b включать большие объекты (blob)", 
                command: "pg_dump -h localhost -p 5432 -U someuser -F t -b -v -f mydb.backup mydb",
                code: "shell",
            }, {
                description: "Создание бекапа базы mydb, в виде текстового файла, включая команду создания БД",
                info: "Опции -F {c|t|p} формат файла (custom, tar, plain text); -b включать большие объекты (blob);" + 
                "-C добавить команду для создания БД", 
                command: "pg_dump -h localhost -p 5432 -U someuser -C -F p -b -v -f mydb.backup mydb",
                code: "shell",
            }, {
                description: "Создание бекапа базы mydb, в сжатом виде, с таблицами которые содержат в имени payments",
                info: "Опции -F {c|t|p} формат файла (custom, tar, plain text); -b включать большие объекты (blob);" + 
                "-C добавить команду для создания БД; -t указывает определенные таблицы", 
                command: "pg_dump -h localhost -p 5432 -U someuser -F t -b -v -t *payments* -f payment_tables.backup mydb",
                code: "shell",
            }, {
                description: "Дамп данных только одной, конкретной таблицы.",
                info: "Если нужно создать резервную копию нескольких таблиц, то имена этих таблиц перечисляются с помощью ключа -t для каждой таблицы",
                command: "pg_dump -a -t table_name -f file_name database_name",
                code: "shell",
            }, {
                description: "Создание резервной копии с сжатием в gz",
                info: "",
                command: "pg_dump -h localhost -O -F p -c -U postgres mydb | gzip -c > mydb.gz",
                code: "shell",
            }
        ]
    }, {
        'title': 'Восстановление из резервных копий',
        rows: [
            {
                description: "Восстановление из бекапа в текстовом формате с игнорированием ошибок",
                command: "psql -h localhost -U someuser -d dbname -f mydb.sql",
                code: "shell",
            }, {
                description: "Восстановление из бекапа в текстовом формате с остановкой на первой ошибке",
                command: "psql -h localhost -U someuser —set ON_ERROR_STOP=on -f mydb.sql",
                code: "shell",
            }, {
                description: "Восстановление всего бэкапа из tar-архива с выводом информации о процессе",
                info: "Для восстановления из tar-арихива нам понадобиться сначала создать базу с помощью CREATE DATABASE mydb;" + 
                "\n(если при создании бекапа не была указана опция -C)",
                command: "pg_restore —dbname=mydb —jobs=4 —verbose mydb.backup",
                code: "shell",
            }, {
                description: "Восстановление резервной копии БД, сжатой gz",
                command: "gunzip mydb.gz\npsql -U postgres -d mydb -f mydb",
                code: "shell",
            }
        ]
    }, {
        'title': 'Утилиты Postgres',
        rows: [
            {
                description: "Создание БД",
                command: "createdb",
                code: "shell",
            }, {
                description: "Удаление БД",
                command: "dropdb",
                code: "shell",
            }, {
                description: "Создание роли (пользователя)",
                command: "createuser",
                code: "shell",
            }, {
                description: "Удаление роли (пользователя)",
                command: "dropuser",
                code: "shell",
            }, {
                description: "Программа предназначенная для решения общих задач управления (запуск, останов, настройка параметров и т.д.)",
                command: "pg_ctl",
                code: "shell",
            }, {
                description: "Многопользовательский серверный модуль PostgreSQL (настройка уровней отладки, портов, каталогов данных)",
                command: "postmaster",
                code: "shell",
            }, {
                description: "Создание новых кластеров PostgreSQL",
                command: "initdb",
                code: "shell",
            }, {
                description: "Программа для создания каталогов для вторичного хранения баз данных",
                command: "initlocation",
                code: "shell",
            }, {
                description: "Физическое и аналитическое сопровождение БД",
                command: "vacuumdb",
                code: "shell",
            }, {
                description: "Архивация и восстановление данных",
                command: "pg_dump",
                code: "shell",
            }, {
                description: "Резервное копирование всего кластера PostgreSQL",
                command: "pg_dumpall",
                code: "shell",
            }, {
                description: "Восстановление БД из архивов (.tar, .tar.gz)",
                command: "pg_restore",
                code: "shell",
            }
        ]
    }, {
        'title': 'Работа с Postgres непосредственно из командной строки (shell)',
        rows: [
            {
                description: "Создать таблицу в БД my_db",
                info: "Опция -с (--command) выполняет команду указанную за ней",
                command: "psql -U postgres -d my_db -c \"CREATE TABLE my(some_id serial PRIMARY KEY, some_text text);\"",
                code: "shell",
            }, {
                description: "Выполнить SQL код размещенный в файле my/path/code.sql, все команды за раз",
                info: "Опция -f выполняет команды SQL из указанного файла",
                command: "psql -U postgres -d my_db -f my/path/code.sql",
                code: "shell",
            }, {
                description: "Выполнить SQL код размещенный в файле my/path/code.sql, в пошаговом режиме (подтверждая" + 
                "каждую команду",
                info: "Опция -f выполняет команды SQL из указанного файла, -s пошаговый режим",
                command: "psql -U postgres -d my_db -s -f my/path/code.sql",
                code: "shell",
            }, {
                description: "Выбрать все значения из таблицы my с выводом результата в html-фaйл",
                info: "Опция -с (--command) выполняет команду указанную за ней; -H вывод в формате html," + 
                "-o путь к файлу в который вывести данные",
                command: "psql -d my_db -H -c \"SELECT * FROM my\" -o my.html",
                code: "shell",
            }, {
                description: "Вывести версию Postgres",
                command: "psql -V",
                code: "shell",
            }
        ]
    }, {
        'title': 'Комады SQL для получения информации о состоянии и обслуживания БД',
        rows: [
            {
                description: "Вывести топ 10 самых большших таблиц",
                command: "SELECT\n" +
                "    table_name\n" +
                "    pg_relation_size(quote_ident(table_name)) AS size\n" +
                "FROM information_schema.tables\n" + 
                "WHERE table_schema = 'public'\n" + 
                "ORDER BY size DESC LIMIT 10;"
            }, {
                description: "Вывести размеры таблиц и индексов всех таблиц с именем 'table_*' ткущей БД",
                info: "- `pg_size_pretty(<numeric_value>)` - конвертирет кол-во байт в чиловеческий формат.<br>" +
                "- `pg_database_size(<db_name>)` - возвращает размер базы в байтах.<br>" +
                "- `pg_total_relation_size(<relation_name>)` - возвращает общий размер таблицы и индексов в байтах.<br>" +
                "- `pg_relation_size(<relation_name>)` - возвращает размер связи (table/index) в байтах.<br>" +
                "- `pg_indexes_size(<relation_name>)` - возвращает размер индекса связи в байтах.<br>" +
                "- `current_database()` -возвращает текущую БД на которой выполняется запрос.",
                command: "SELECT current_database() AS database,\n" +
                "pg_size_pretty(total_database_size) AS total_database_size,\n" +
                "schema_name,\n" +
                "table_name,\n" +
                "pg_size_pretty(total_table_size) AS total_table_size,\n" +
                "pg_size_pretty(table_size) AS table_size,\n" + 
                "pg_size_pretty(index_size) AS index_size\n" +
                "FROM ( SELECT table_name,\n" +
                "         table_schema AS schema_name,\n" +
                "         pg_database_size(current_database()) AS total_database_size,\n" +
                "         pg_total_relation_size(table_name) AS total_table_size,\n" +
                "         pg_relation_size(table_name) AS table_size,\n" +
                "         pg_indexes_size(table_name) AS index_size\n" +
                "         FROM information_schema.tables\n" +
                "         WHERE table_schema=current_schema() AND table_name LIKE 'table_%'\n" +
                "         ORDER BY total_table_size\n" +
                "     ) AS sizes;",
                code: "sql",
            }, {
                description: "Получить информацию о всех активных клиентах которые в данный момент подключены к БД",
                command: "SELECT\n" +
                "     pid,\n" +
                "     usename,\n" +
                "     now() - query_start AS duration,\n" +
                "     query,\n" +
                "     state\n" +
                "FROM pg_stats_activity\n" +
                "WHERE (now() - query_start) > interval '5 minutes';\n",
                code: "sql",
            }, {
                description: "Вывести топ 10 самых долговыполняющихся запросов",
                command: "SELECT\n" +
                "    now() - query_start AS duration,\n" +
                "    query\n" +
                "FROM pg_stat_activity\n" +
                "ORDER BY duration DESC LIMIT 10;",
                code: "sql",
            }, {
                description: "Вывести запросы занимающие наибольшее время включая короткие но часто выполняющиеся",
                info: "Выполнение запроса указанного выше в цикле нектороре время позволяет " + 
                "идентифицировать и коротки но часто выполняющиеся запросы.",
                command: "$ while psql -qt -c \"select query now() - query_start as \\\n" +
                "duration from pg_stat_activity\" >> query_stats.txt; \\\n" +
                "do sleep 1; done\n\n" +
                "$ sort query_stats.txt | less\n",
                code: "shell",

            }, {
                description: "Проанализировать план выполнения запроса",
                info: "",
                command: "EXPLAIN ANALYZE\n" +
                "SELECT * FROM my_table WHERE name='Name';",
                code: "sql"
            }
        ]
    }, {
        'title': 'Снижение занимаемого места на диске',
        rows: [
            {
                description: "Удаление старых логов",
                info: "1. Смотрим директорию с логами<br>" +
                "2. Создаем копию последних 100 записей последнего файла postgres-xxx.log<br>" + 
                "3. Перезатираем старый лог (rm не сработает т.к. сервер использует лог)",
                command: "$ ls -lah /var/lib/pgsql/11/data/log\n" +
                "$ tail -100 postgresql-xxx.log > /tmp/log_temp.log\n" +
                "$ cat /dev/null > /var/lib/pgsql/11/data/log/postgresql-xxx.log",
                code: "shell",
            }, {
                description: "Освободить место для послдующих записей (без передаче ОС) в таблице my_table после удаления ненужных записей",
                info: "В обычном режиме, БД не блокируется, а освобожденное место не возвращается ОС а используется для последующих записей." +
                "Данная операция периодически выполняется для всех таблиц если не выключен autovacuum=off",
                command: "VACUUM my_table;",
                code: "sql",
            }, {
                description: "Освободить место с возвращением ОС (БЛОКИРУЕТ БД) в таблице my_table после удаления ненужных записей",
                info: "В данном режиме таблица в БД блокируется до завершения выполнения перации. Освобожденное место возвращается ОС." +
                "Для выполнения операции нужно дополнительное место на диске для создания копии таблицы.",
                command: "VACUUM FULL my_table;",
                code: "sql",
            }
        ]
    }
] 