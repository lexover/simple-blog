export const CONTENT = [
    {
        title: 'Управление данными CREATE, INSERT, UPDATE, DELETE',
        rows: [
            {  
                description: "Создать таблицу Blog",
                sql: "CREATE TABLE Blog (\n\tid SERIAL PRIMARY KEY DEFAULT,\n\tname VARCHAR(100) NOT NULL,\n\ttagline TEXT NOT NULL)",
                django: "class Blog(models.Model):\n\tname = models.CharField(max_length=100)\n\ttagline = models.TextField()"
            }, {
                description: "Добавить запись в таблицу Blog",
                sql: "INSERT INTO Blog (name, tagline)\nVALUES (\n\t'Beatles Blog', \n\t'All the latest Beatles news.')",
                django: "Blog.object.create(\n\tname='Beatles Blog', \n\ttagline='All the latest Beatles news.')\n" +
                "\n# или:\n\n" +
                "b = Blog(\n\tname='Beatles Blog',\n\ttagline='All the latest Beatles news.')\nb.save()"
            }, {
                description: "Обновить запись в таблице Blog. Заменить tagline для записи с id=1",
                sql: "UPDATE Blog \nSET tagline='Changed tagline' \nWHERE id=1",
                django: "Blog.objects.filter(pk=1).update(\n\ttagline='Changed tagline')\n" +
                "\n# или:\n\n" +
                "b = Blog.objects.get(pk=1)\nb.tagline = 'Changed tagline'\nb.save()"
            }, {
                description: "Удалить запись в таблице Blog с идентификатором id=3",
                sql: "DELETE FROM blog WHERE id=3",
                django: "Blog.objects.filter(pk=3).delete()"
            }, {
                description: "Создать связь один-ко-многим. Создать статью в блоге с названием 'Cheddar Talk'",
                sql: "INSERT INTO entry (blog, theadline ...) \nVALUES (\n\t(SELECT id FROM blog\n\t\tWHERE name='Cheddar Talk'), \n\t'Headline'...)",
                django: "b = Blog.objects.get(name='Cheddar Talk')\nentry.blog = cheese_blog\nEntry.object.create(blog=b, headline=...)"
            }, {
                description: "Создать связь многие-ко-многим (M2M). Joe и John - установить как авторов статьи блога.",
                sql: "INSERT INTO entry (headline, body_text ... )\n\tVALUES ('Headline', ‘My text’ ...)\n" +
                "INSERT IGNORE INTO author (name)\n\tVALUES ('Joe')\n" +
                "SET @author_id = RETURNING id\n" +
                "INSERT INTO entry_author (entry_id, author_id)\n\tVALUES (entry_id, authour_id)\n" +
                "INSERT IGNORE INTO author (name)\n\tVALUES ('John')\n" +
                "SET @author_id = RETURNING id",
                django: "entry = Entry.objects.get(pk=1)\n" +
                "joe = Author.objects.create(name='Joe')\n" +
                "john = Author.objects.create(name='John')\n" +
                "entry.authors.add(joe, john)"
            }, {

            }
        ]

    }, {
        title: 'Выполнение запросов к БД SELECT',
        rows: [
            {  
                description: "Получить все записи таблицы Entry",
                sql: "SELECT * FROM entry",
                django: "Entry.objects.all()"
            }, {  
                description: "Получить записи таблицы Entry с датой публикации с 05.11.2020 и заголовком Hello",
                sql: "SELECT * FROM entry \nWHERE pub_date > 2020-11-05\n\tAND hedline = 'Hello'",
                django: "Entry.objects.filter(\n\tpub_date__gt=datetime.data(2020, 11, 05), \n\theadline='Hello')\n" +
                "\n# или: \n\n" +
                "Entry.objects.filter(\n\tpub_date__gt=datetime.data(2020, 11, 05))\n\t.filter(headline='Hello')"
            }, {  
                description: "Получить записи таблицы Entry исключая записи в которых дата публикции больше 05.11.2020 и заголовок Hello",
                sql: "SELECT * FROM entry \nWHERE NOT (pub_date > 2020-11-05\n\tAND hedline = 'Hello')",
                django: "Entry.objects.exclude(\n\tpub_date__gt=datetime.data(2020, 11, 05),\n\theadline='Hello')"
            },{  
                description: "Получить записи таблицы Entry исключая записи с датой публикции больше 05.11.2020 и записи с заголовком Hello",
                sql: "SELECT * FROM entry \nWHERE NOT pub_date > 2020-11-05\n\tAND NOT hedline = ‘Hello’",
                django: "Entry.objects.exclude(\n\tpub_date__gt=datetime.data(2020, 11, 05)\n\t).exclude(headline='Hello')"
            },{  
                description: "Получить записи таблицы Entry упорядоченные по дате публицкации в нисходящем порядке (от большей даты к меньшей)" + 
                "и по заголовку в прямом (возрастающем) порядке, для значений с 2005 годом публикации",
                sql: "SELECT * FROM entry \nORDER BY pub_date DESC, headdline ASC",
                django: "Entry.objects.filter(pub_date__year=2005).order_by('-pub_date', 'headline')" 
            },{  
                description: "Отсортировать значения в слючайном порядке (запрос может быть медленным и сильно нагружать БД)",
                sql: "SELECT * FROM entry \nWHERE random() < 0.01",
                django: "Entry.objects.order_by('?')"
                
            },{  
                description: "Исключить в запросе дублирующиеся записи (по всем полям)",
                sql: "SELECT * FROM entry DISTINCT",
                django: "Entry.objects.distinct()"
            },{  
                description: "Исключить в запросе дублирующиеся записи по полям автора и даты публикции (работает только для PostgreSQL",
                info: "Если вы указываете поля, вы должны " + 
                "определить и order_by() для QuerySet, и поля в order_by() должны начинаться с полей указанных в distinct(), в том же порядке. " +
                "Например, SELECT DISTINCT ON (a) возвращает вам первую запись для каждого уникального значения колонки a. Если вы не определите " + 
                "сортировку, будут возвращены случайные записи для каждого уникального значения.",
                sql: "SELECT * FROM entry DISTINCT ON author, pub_date",
                django: "Entry.objects.order_by('author', 'pub_date').distinct('author', 'pub_date')"
            }, {
                description: "Получить количество записей в БД отвечающему запросу",
                sql: "SELECT COUNT(*) FROM entry\nWHERE headline WHERE headline LIKE '%Lennon%'",
                django: "Entry.objects.filter(headline__contains='Lennon).count()"
            }
        ]
    }, {
        title: 'Функции агрегации',
        rows: [
            {  
                description: "Количество статей в таблице Entry",
                sql: "SELECT COUNT (*) FROM entry",
                django: "Entry.objects.count()"
            }, {  
                description: "Количество авторов статей",
                sql: "SELECT COUNT(id) AS total FROM Author",
                info: "Агрегаты игнорируют значения NULL. Значение вернется в виде словаря в котором по имени поля 'total' будет найденное значение",
                django: "from django.db.models import Count\nAuthor.objects.aggregate(total=Count('id'))"
            }, {  
                description: "Посчитать количество статей соответствующих по рейтингу",
                sql: "SELECT \n\trating, \n\tCOUNT(id) AS total \nFROM entry \nGROUP BY rating",
                info: "Порядок важен: невозможность вызова values до annotate не приведет к агрегированным результатам. Значение вернется в виде [{'rating': 1, 'total': 10}, ...] ",
                django: "Entry.objects.values('rating')\n\t.annotate(total=Count('id'))"
            },{  
                description: "Посчитать количество статей соответствующих по рейтингу, отсортировав значения по количеству статей",
                sql: "SELECT \n\trating, \n\tCOUNT(id) AS total \nFROM entry\nGROUP BY rating\nORDER BY total",
                info: "Чтобы выполнить сортировку после агрегации, можно использовать oreder_by в любом месте запроса",
                django: "Entry.objects.values('rating')\n\t.annotate(total=Count('id'))\n\t.order_by('total')"
            },{  
                description: "Получить количество статей в таблицы Entry упорядоченные по дате публицкации в нисходящем порядке (от большей даты к меньшей)" + 
                "и по заголовку в прямом (возрастающем) порядке, для значений с 2005 годом публикации",
                sql: "SELECT * FROM entry \nORDER BY \n\tpub_date DESC, \n\theaddline ASC",
                django: "Entry.objects.filter(pub_date__year=2005).order_by('-pub_date', 'headline')" 
            },{  
                description: "Получить количество статей по рейтингу и дату последней публикции",
                sql: "SELECT \n\trating, \n\tCOUNT(id) AS total, \n\tMAX(pub_date) AS last \nFROM entry \nGROUP BY rating",
                django: "Entry.objects.values('rating').annotate(\n\ttotal=Count('id'),\n\tlast=Max('pub_date'))"
                
            },{  
                description: "Получить количество статей сгруппированных по рейтингу и количеству комментариев",
                sql: "SELECT \n\trating, \n\tnumber_of_comments, \n\tCOUNT(id) AS total \nFROM entry \nGROUP BY rating, number_of_comments",
                django: "Entry.objects.values('rating', 'number_of_comments')\n\t.annotate(total=Count('id'))"
            },{  
                description: "Получить количество публикций по годам",
                info: "Для получения года от даты использован lookup <field>__year, результатом кот. является dict с именем ключа pub_date__year",
                sql: "SELECT \n\tEXTRACT('year' FROM pub_date), \n\tCOUNT(id) AS total \nFROM entry \nGROUP BY EXTRACT('year' FROM pub_date)",
                django: "Entry.objects.values('pub_date__year')\n\t.annotate(total=Count('id'))"
            }, {
                description: "Количество статей изменененных с момента публикции", 
                info: "Сначала используется annotate для построения выражения и помечается как ключ GROUP BY, ссылаясь на выражение через mod_since_pub в следующем вызове values().",
                sql: "SELECT \n\tmod_date > pub_date AS mod_since_pub,\n\tCOUNT (id) AS total\nFROM Entry\nGROUP BY mod_date > pub_date",
                django: "from django.db.models import ExpressionWrapper, Q, F, BooleanField\nEntry.objects.annotate(\n\tmod_since_pub=ExpressionWrapper(\n\t\t" + 
                "Q(mod_date__gt=F('pub_date')),\n\t\toutput_field=BooleanField()))\n.values('mod_since_pub')\n.annotate(total=Count('id')\n.values('mod_since_pub', 'total')"
            }, {
                description: "Посчитать количество статей с рейтингом ниже 3-х и более 3-х опубликованных в 2020 г.",
                info: "Используется условное агрегирование, когда агрегируется часть группы.",
                sql: "SELECT\n\tEXTRACT('year' FROM pub_date),\n\tCOUNT (id) FILTER(\n\t\tWHERE rating < 3\n\t\t)AS low_rating_total,\n\tCOUNT (id) FILTER (\n\t\tWHERE rating > 3\n\t" +
                     ") AS high_rating_total\nFROM Entry\nGROUP BY\n\tEXTRACT ('year' FROM pub_date)",
                django: "from django.db.models import F, Q\n\nEntry.objects.values('pub_date__year)\n.annotate(\n\tlow_rating_total=(\n\t\tCount('id', filter=Q(rating__lt=3))\n\t),\n\t" +
                        "high_rating_total=(\n\t\tCount('id', filter=Q(rating__gt=3))\n\t),\n)"
            }, {
                description: "Найти годы в которых количество публикций превысило 100 шт",
                info: "Фильтр по аннотированному итоговому полю total добавляет прдложение HAVING в SQL",
                sql: "SELECT \n\tEXTRACT('year' FROM pub_date), \n\tCOUNT(id) AS total\nFROM Entry\nGROUP BY EXTRACT('year' FROM pub_date)\nHAVING COUNT(id) > 100",
                django: "Entry.objects.annotate(pub_year=F('pub_date__year'))\n.values('pub_year')\n.annotate(total=Count('id'))\n.filter(total__gt=100))"
            }, {
                description: "Сколько уникальных имен авторов (исключая одни и те же имена) являются сотрудниками",
                info: "Чтобы исключить дубликаты имен из подсчета в Count исплоьзуется параметр distinct=True",
                sql: "SELECT \n\tis_staff, \n\tCOUNT(id) AS total, \n\tCOUNT (DISTINCT name) AS unique_names \nFROM Author \nGROUP BY is_staff",
                django: "Author.objects.values('is_staff')\n.annotate(\n\ttotal=Count('id'),\n\tunique_names=Count('name', distinct=True),\n))"
            }, {
                description: "Каков процент уникальных имен по сотрудникам/внешним пользователям",
                info: "Первый annotate() определяет совокупные поля. Второй annotate() использует статистическую функцию для создания выражения",
                sql: "SELECT\n\tis_staff,\n\tCOUNT(id) AS total,\n\tCOUNT(DISTINCT name) AS unique_names,\n\t(COUNT(DISTINCT name)::float\n\t\t" +
                "/ COUNT(id)::float) AS pct_unique_names\nFROM Author GROUP BY is_staff",
                django: "from django.db.models import FloatField\nfrom django.db.models.functions import Cast\n\n Author.objects.values('is_staff')\n" +
                ".annotate(\n\ttotal=Count('id'),\n\tunique_names=(Count('name', distinct=True))\n.annotate(\n\tpct_unique_names=(\n\t\t" +
                "Cast('unique_names', FloatField())\n\t\t/ Cast('total', FloatField())\n))"
            }, {
                description: "Посчитать количество статей в каждом из блогов",
                sql: "SELECT\n\tb.name,\n\tCOUNT(e.id) AS total\nFROM Entry a\nJOIN Blog b ON b.id = e.blog_id\nGROUP BY b.name",
                django: "Entry.objects.values('blog__name')\n.annotate(total=Count('id'))"
            }, {
                description: "Посчитать для каждого пользователя в скольких статьях он является автором/соавтором",
                sql: "SELECT\n\ta.id,\n\tCOUNT (e.author_id) AS authors\nFROM\n\tAuthor a\n\tLEFT OUTER JOIN Entry e ON (\n\t\t" +
                "a.id = e.author_id\n\t)\nGROUP BY a.id",
                django: "Author.objects.annotate(authors=Count('entries'))\n.values('id', 'authors')"
            }
        ]
    }, {
        title: 'Операторы фильтрации (селекторы)',
        rows: [
            {  
                description: "Точное совпадение",
                info: "Если передано значение None оно будет интерпретировано как SQL NULL.\n",
                sql: "SELECT ... WHERE id = 14;\nSELECT ... WHERE id IS NULL;",
                django: "Entry.objects.get(id__exact=14)\n"+
                "#или\n"+ 
                "Entry.objects.get(id__exact=14)\n" +
                "Entry.objects.get(id__exact=None)"
            }, {
                description: "Регистронезависимое точное совпадение ",
                info: "Если передано значение None оно будет интерпретировано как SQL NULL",
                sql: "SELECT ... WHERE name ILIKE 'beatles blog';\nSELECT ... WHERE name IS NULL;",
                django: "Blog.objects.get(name__iexact='beatles blog')\nBlog.objects.get(name__iexact=None)"
            }, {
                description: "Проверка на вхождение.",
                info: "SQLite не поддерживает регистрозависимый оператор LIKE; contains работает так же как и icontains для SQLite.",
                sql: "SELECT * WHERE headline LIKE '%Lennon%';",
                django: "Entry.objects.get(headline__contains='Lennon')"
            }, {
                description: "Регистронезависимая проверка на вхождение.",
                sql: "SELECT ... WHERE headline ILIKE '%Lennon%';",
                django: "Entry.objects.get(headline__icontains='Lennon')"
            }, {
                description: "Проверка на вхождение в список значений.",
                sql: "SELECT * WHERE id IN (1, 3, 4);",
                django: "Entry.objects.filter(id__in=[1, 3, 4])"
            }, {
                description: "Проверка на вхождение в список значений из другого QuerySet",
                info: "Будьте осторожны при использовании вложенных запросов и учитывайте производительность вышей базы данных " + 
                "(если сомневаетесь, протестируйте его!). Некоторые типы баз данных, особенно MySQL, не очень хорошо оптимизируют " + 
                "вложенные запросы. В таком случае более эффективно получить список значений первым запросом и передать в другой",
                sql: "SELECT ... \nWHERE blog.id IN (\n\tSELECT id FROM ... \n\tWHERE NAME LIKE '%Cheddar%')",
                django: "inner_qs = Blog.objects.filter(name__contains='Cheddar')\nentries = Entry.objects.filter(blog__in=inner_qs)"
            }, {
                description: "Проверка на вхождение в список значений из другого QuerySet (оптимизированный запрос через список значений)",
                info: "Если запрос через другой QuerySet не эффективен поробуйте реализовать данный.",
                sql: "SELECT ... \nWHERE blog.id IN (\n\tSELECT id FROM ... \n\tWHERE NAME LIKE '%Cheddar%')",
                django: "values = Blog.objects.filter(\n\tname__contains='Cheddar').values_list('pk', flat=True)\n" +
                "entries = Entry.objects.filter(blog__in=list(values))"
            }, {
                description: "Проверка на вхождение в список значений через values",
                info: "Передавая в QuerySet, который является результат вызова values() или values_list(), как аргумент для фильтра __in, " +
                "вы должны быть уверенным, что результат содержит данные только одного поля",
                sql: "SELECT ... \nWHERE blog.id IN (\n\tSELECT id FROM ... \n\tWHERE NAME LIKE '%Cheddar%')",
                django: "inner_qs = Blog.objects.filter(name__contains='Ch').values('name')\nentries = Entry.objects.filter(blog__name__in=inner_qs)" 
            }, {
                description: "Значения NULL",
                sql: "SELECT ... WHERE pub_date IS NULL;",
                django: "Entry.objects.filter(pub_date__isnull=True)"
            }, {
                description: "Значения не NULL",
                sql: "SELECT ... WHERE pub_date IS NOT NULL;",
                django: "Entry.objects.filter(pub_date__isnull=False)"
            }, {
                description: "Больше",
                sql: "SELECT ... WHERE id > 4;",
                django: "Entry.objects.filter(id__gt=4)"
            }, {
                description: "Больше или равно",
                sql: "SELECT ... WHERE id >= 4;",
                django: "Entry.objects.filter(id__gte=4)"
            }, {
                description: "Меньше",
                sql: "SELECT ... WHERE id < 4;",
                django: "Entry.objects.filter(id__lt=4)"
            }, {
                description: "Проверка начинается ли поле с указанного значения.",
                info: "SQLite не поддерживает регистрозависимый оператор LIKE; contains работает так же как и icontains для SQLite.",
                sql: "SELECT ... WHERE headline LIKE 'Will%';",
                django: "Entry.objects.filter(headline__startswith='Will')"
            }, {
                description: "Регистронезависимая проверка начинается ли поле с указанного значения.",
                sql: "SELECT ... WHERE headline ILIKE 'Will%';",
                django: "Entry.objects.filter(headline__istartswith='will')"
            }, {
                description: "Проверка заканчивается ли поле указанным значением.",
                info: "SQLite не поддерживает регистрозависимый оператор LIKE; contains работает так же как и icontains для SQLite.",
                sql: "SELECT ... WHERE headline LIKE '%cats';",
                django: "Entry.objects.filter(headline__endswith='cats')"
            }, {
                description: "Регистронезависимая проверка заканчивается ли поле указанным значением.",
                sql: "SELECT ... WHERE headline ILIKE '%will'",
                django: "Entry.objects.filter(headline__iendswith='will')"
            },  {
                description: "Проверка на вхождение в диапазон (включающий).",
                info: "Вы можете использовать range там же, где можно использовать BETWEEN в SQL — для дат, чисел и даже строк.",
                sql: "SELECT ... \nWHERE pub_date \n\tBETWEEN '2005-01-01' and '2005-03-31';",
                django: "import datetime\nstart_date = datetime.date(2005, 1, 1)\nend_date = datetime.date(2005, 3, 31)\n" +
                "Entry.objects.filter(pub_date__range=(start_date, end_date))"
            }, {
                description: "Преобразовать в дату поле даты и времени",
                info: "При USE_TZ равном True, значение поля будет преобразовано в текущий часовой пояс.",
                sql: "",
                django: "Entry.objects.filter(pub_date__date=datetime.date(2005, 1, 1))\nEntry.objects.filter(pub_date__date__gt=datetime.date(2005, 1, 1))"
            }, {
                description: "Проверка года для полей date/datetime",
                info: "При USE_TZ равном True, значение поля будет преобразовано в текущий часовой пояс.",
                sql: "SELECT ... \nWHERE pub_date \n\tBETWEEN '2005-01-01' AND '2005-12-31';\nSELECT ... WHERE pub_date >= '2005-01-01';",
                django: "Entry.objects.filter(pub_date__year=2005)\nEntry.objects.filter(pub_date__year__gte=2005)"
            }, {
                description: "Проверка месяца для полей date/datetime",
                info: "При USE_TZ равном True, значение поля будет преобразовано в текущий часовой пояс.",
                sql: "SELECT ... \nWHERE EXTRACT('month' FROM pub_date) = '12';\nSELECT ... \nWHERE EXTRACT('month' FROM pub_date) >= '6';",
                django: "Entry.objects.filter(pub_date__month=12)\nEntry.objects.filter(pub_date__month__gte=6)"
            }, {
                description: "Проверка дня месяца для полей date/datetime",
                info: "При USE_TZ равном True, значение поля будет преобразовано в текущий часовой пояс.",
                sql: "SELECT ... \nWHERE EXTRACT('day' FROM pub_date) = '3';\nSELECT ... \nWHERE EXTRACT('day' FROM pub_date) >= '3';",
                django: "Entry.objects.filter(pub_date__day=3)\nEntry.objects.filter(pub_date__day__gte=3)"
            }, {
                description: "Проверка дня недели для полей date/datetime (1-воскресенье, 7-суббота)",
                info: "При USE_TZ равном True, значение поля будет преобразовано в текущий часовой пояс.",
                sql: "",
                django: "Entry.objects.filter(pub_date__week_day=2)\nEntry.objects.filter(pub_date__week_day__gte=2)"
            }, {
                description: "Проверка часа для полей datetime (от 0 до 23)",
                info: "При USE_TZ равном True, значение поля будет преобразовано в текущий часовой пояс.",
                sql: "SELECT ... \nWHERE EXTRACT('hour' FROM timestamp) = '23';\nSELECT ... \nWHERE EXTRACT('hour' FROM time) = '5';\n" + 
                "SELECT ... \nWHERE EXTRACT('hour' FROM timestamp) >= '12';",
                django: "Event.objects.filter(timestamp__hour=23)\nEvent.objects.filter(time__hour=5)\nEvent.objects.filter(timestamp__hour__gte=12)"
            }, {
                description: "Проверка минуты для полей datetime (от 0 до 59)",
                info: "При USE_TZ равном True, значение поля будет преобразовано в текущий часовой пояс.",
                sql: "SELECT ... \nWHERE EXTRACT('minute' FROM timestamp) = '29';\nSELECT ...\nWHERE EXTRACT('minute' FROM time) = '46';\n" +
                "SELECT ... \nWHERE EXTRACT('minute' FROM timestamp) >= '29';",
                django: "Event.objects.filter(timestamp__minute=29)\nEvent.objects.filter(time__minute=46)\nEvent.objects.filter(timestamp__minute__gte=29)"
            },  {
                description: "Проверка секунды для полей datetime (от 0 до 59)",
                info: "При USE_TZ равном True, значение поля будет преобразовано в текущий часовой пояс.",
                sql: "SELECT ... \nWHERE EXTRACT('second' FROM timestamp) = '29';\nSELECT ... \nWHERE EXTRACT('second' FROM time) = '46';\n" +
                "SELECT ... \nWHERE EXTRACT('second' FROM timestamp) >= '29';",
                django: "Event.objects.filter(timestamp__second=29)\nEvent.objects.filter(time__second=46)\nEvent.objects.filter(timestamp__second__gte=29)"
            }, 
        ]
    }
]