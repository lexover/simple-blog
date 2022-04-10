export const CONTENT = [
    {
        title: 'Установка и создание базового объекта BeautifulSoup',
        rows: [
            {  
                description: "Установка BS4",
                command: "pip install beautifulsoup4",
                result: "",
            }, {  
                description: "Установка парсера html('html.parser')",
                command: "# установлен по умолчанию",
                result: "Не такой быстрый как lxml, менее точный чем html5lib",
                info: "При конструировании объекта задается тип парсера, который разбирает html",
            }, {  
                description: "Установка парсера lxml ('lxml') (рекомендуемый как самый быстрый)",
                command: "pip install lxml\n# или\napt-get install python-lxml",
                result: "Очень быстрый, достаточно точный, но является зависимым от внешней C библиотеки.",
                info: "При конструировании объекта задается тип парсера, который разбирает html",
            }, {  
                description: "Установка парсера html5lib ('html5lib')",
                command: "pip install html5lib \n# или \napt-get install python-html5lib",
                result: "Очень медленный но самый точный. Зависит от внешней библиотеки на Python",
                info: "При конструировании объекта задается тип парсера, который разбирает html",
            }, {  
                description: "Создание объекта soup из строки html_string, для дальнейшей работы с html",
                command: "from bs4 import BeautifulSoup" +
                         "\nsoup = BeautifulSoup(html_string, 'html.parser)",
                result: "",
                info: "Первым параметром BS4 передается строка или буфер с текстом HTML, вторым тип парсера (см. выше)",
            }, {  
                description: "Создание объекта soup из файла index.html для дальнейшей работы",
                command: "from bs4 import BeautifulSoup" +
                         "\nwith open('index.html') as fp:" + 
                         "\n\tsoup = BeautifulSoup(fp, 'lxml')",
                result: "",
                info: "Первым делом документ конвертируется в Unicode, а HTML-мнемоники конвертируются в символы Unicode" +
                      "Затем Beautiful Soup анализирует документ, используя лучший из доступных парсеров. В данном случае 'lxml'",
            }, {  
                description: "Вывести html в читабельном виде",
                command: "print(soup.prettify())" +
                         "\nwith open('index.html') as fp:" + 
                         "\n\tsoup = BeautifulSoup(fp, 'lxml')",
                result: "",
                info: "Первым делом документ конвертируется в Unicode, а HTML-мнемоники конвертируются в символы Unicode" +
                      "Затем Beautiful Soup анализирует документ, используя лучший из доступных парсеров. В данном случае 'lxml'",
            }
        ]
    }, {
        title: 'Навигация',
        rows: [
            {  
                description: "Поулчить значение из тега head",
                command: "soup.head",
                result: "<head><title>The Dormouse's story</title></head>",
                info: "",
            }, {  
                description: "Получить значение теэга тега b внутри body",
                command: "soup.body.b",
                result: "<b>The Dormouse's story</b>",
                info: "",
            }, {  
                description: "Получить первый встреченный элемент с тэгом <a>",
                command: "soup.a или soup.find('a')",
                result: '<a class="sister" href="http://example.com/elsie" id="link1">Elsie</a>',
                info: "",
            }, {  
                description: "Получить список всех элементов с тэгом <a>",
                command: "soup.find_all('a')",
                result: '[<a class="sister" href="http://example.com/elsie" id="link1">Elsie</a>,' +
                        '\n <a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>,' +
                        '\n <a class="sister" href="http://example.com/tillie" id="link3">Tillie</a>]',
                info: "",
            }, {  
                description: "Поулчить список всех дочерних элементов внутри тэга <head>",
                command: "head_tag = soup.head" +
                         "\nHead_tag.contents",
                result: "[<title>The Dormouse's story</title>]",
                info: "Учитывает только прямых наследников указанного тэга.",
            }, {  
                description: "Итерироваться по всем дочерним элементам внутри title_tag",
                command: "for child in soup.head.children:\n\tprint(child)",
                result: "<title>The Dormouse's story</title>",
                info: "Создает генератор, в который итерируется по содержимому всех тэгов. Учитывает " +
                      "только прямых наследников указанного тэга.",
            }, {  
                description: "Перебрать все элементы title_tag рекурсивно, заходя внутрь.",
                command: "for child in soup.head.descendants:\n\tprint(child)",
                result: "<title>The Dormouse's story</title>\nThe Dormouse's story",
                info: "Атрибут .descendants позволяет рекурсивно перебирать все дочерние элементы тега: " + 
                      "его непосредственные дочерние элементы, дочерние элементы его непосредственных " +
                      "дочерних элементов и т. д.",
            }, {  
                description: "Итерирваться по всем предкам певого элемента <a> выводя имена тэгов предков",
                command: "for parent in soup.a.parents:\n\tprint(parent.name)",
                result: "p\nBody\nHtml\n[document]",
                info: "",
            }, {  
                description: "Получить следующий элемент находящийся на том же уровне",
                command: "soup.a.next_sibling",
                result: ",\\n",
                info: "Т.к. следом за первым элементом <a> следует ',\\n' то выводятся именно " + 
                      "данные символы, а уже следующим элментом станет следующий тэг <a>",
            }, {  
                description: "Получить предыдущий элемент находящийся на том же уровне",
                command: "soup.find_all('a')[-1].previous_sibling",
                result: "and\\n",
                info: "Т.к. перед за последним элементом <a> следует 'and\\n' то выводятся " + 
                      "именно данные символы, а уже следующим элментом станет предыдущий тэг <a>",
            }, {  
                description: "Итерирваться по всем элементам на уровне первого тэга <a> в прямом направлении",
                command: "for sibling in soup.a.next_siblings:\n\tprint(repr(sibling))",
                result: ',\\n' + 
                '\n<a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>' + 
                '\nand\\n' + 
                '<a class="sister" href="http://example.com/tillie" id="link3">Tillie</a>' +
                '\n; and they lived at the bottom of a well.',
                info: "",
            }, {  
                description: 'Итерирваться по всем элементам на уровне тэга <a id="link3"> в обратном направлении',
                command: 'for sibling in soup.find(id="link3").previous_siblings:\n\tprint(repr(sibling))',
                result: ' and\\n' + 
                '\n<a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>' +
                '\n,\\n' + 
                '\n<a class="sister" href="http://example.com/elsie" id="link1">Elsie</a>' + 
                '\nOnce upon a time there were three little sisters; and their names were\\n',
                info: "",
            }, {  
                description: "Получить следующий элемент первого тэга <p> с заходом внутрь элемента",
                command: "soup.p.next_element",
                result: "<b>The Dormouse's story</b>",
                info: "Вызов next_element в отличии от next_sibling заходит итеративно внутрь элемента пока " + 
                      "не переберет все внутренние элементы, после переходит на следующий элемент на томже уровне и т. д.", 
            }, {  
                description: "Получить предыдущий элемент первого тэга <p> с заходом внутрь элемента",
                command: "soup.p.previous_element",
                result: "\\n",
                info: "Вызов previous_element в отличии от previous_sibling заходит итеративно внутрь элемента " + 
                      "пока не переберет все внутренние элементы, после переходит на следующий элемент на томже уровне и т. д.", 
            }, {  
                description: "Итерироваться по всем элементам на уровне <a id='link3'> с заходом внутрь элементов.",
                command: 'last_a_tag = soup.find("a", id="link3")\n\tfor element in last_a_tag.next_elements:\n\tprint(repr(element))',
                result: 'Tillie' + 
                        '\n;\\nand they lived at the bottom of a well.' +
                        '\n\\n' + 
                        '\n<p class="story">...</p>' + 
                        '...' + 
                        '\n\\n',
                info: "", 
            },
        ]
    }, {
        title: 'Получение значений из выбранного тэга',
        rows: [
            {  
                description: "Получить имя выборанного тэга",
                command: "soup.head.name",
                result: '"head"',
                info: "У каждого тэга есть имя. Если вы измените имя тэга это будет отражено в разметке",
            }, {  
                description: "Получить текст содержащийся внутри тэга <head> ислкючая все теги.",
                command: "soup.head.get_text()",
                result: '"The Dormouse\'s story"',
                info: "Удаляет все значения внутри <> отставляя весь текст внутри всех дочерних элементов",
            }, {  
                description: "Внутри тега только один наследник получить его содержимое включая значение тэга",
                command: "soup.title.contents",
                result: "[<title>The Dormouse's story</title>]",
                info: "",
            }, {  
                description: "Внутри тега только один наследник получить его содержимое без значение тэга",
                command: "soup.title.string",
                result: '"The Dormouse\'s story"',
            }, {  
                description: "Получить аттрибут 'id' первого тэга <a>",
                command: "soup.a['id']",
                result: "'link_1'",
                info: "У тега может быть любое количество атрибутов, вы можете получить доступ к атрибутам тега, обращаясь с тегом как со словарем",
            }, {  
                description: "Получить все аттрибуты первого тэга <a>",
                command: "soup.a.attrs",
                result: "{'href': 'http://example.com/elsie', 'class': ['sister'], 'id': 'link1'}",
                info: "attrs возвращает словарь со всеми атрибутами тэга, при этом " + 
                      "значения многозначных атрибутов (class, rel, rev, accept-charset, headers, accesskey) возвращаются в виде списка.",
            }
        ]
    }, {
        title: 'Поиск по дереву',
        rows: [
            {  
                description: "Найти все тэги <a>",
                command: "soup.find_all('a')",
                result: '[<a class="sister" href="http://example.com/elsie" id="link1"><span>Elsie</span></a>,' +
                        '\n<a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>,' + 
                        '\n<a class="sister" href="http://example.com/tillie" id="link3">Tillie</a>]',
                info: "У каждого тэга есть имя. Если вы измените имя тэга это будет отражено в разметке",
            }, {  
                description: "Найти все тэги соответствующие регулярному выражению ^t.*$",
                command: "import re\nsoup.find_all(re.compile('^t.*$'))",
                result: "[<title>The Dormouse's story</title>]",
                info: "Если вы передадите объект с регулярным выражением, Beautiful Soup отфильтрует результаты в " + 
                      "соответствии с этим регулярным выражением, используя его метод search()",
            }, {  
                description: "Найти все тэги <a> или <title>",
                command: "soup.title.contents",
                result: '[<title>The Dormouse\'s story</title>,'+
                        '\n<a class="sister" href="http://example.com/elsie" id="link1"><span>Elsie</span></a>,' +
                        '\n<a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>,' + 
                        '\n<a class="sister" href="http://example.com/tillie" id="link3">Tillie</a>]',
                info: "Если вы передадите список, Beautiful Soup разрешит совпадение строк с любым элементом из этого списка",
            }, {  
                description: "Найти тэги содержащие атрибут class и дочерний тэг <b>",
                command: "def has_class_but_no_id(tag):\n\treturn tag.has_attr('class') and tag.b" +
                         "\nsoup.find_all(has_class_but_no_id)",
                result: '[<p class="title"><b>The Dormouse\'s story</b></p>]',
                info: "Если поиск сложный можно передать на вход fild_all функцию. Функция должна вернуть True, " + 
                      "если аргумент подходит, и False, если нет."
            }, {  
                description: "Найти тэги с атрибутом id=\"link2\"",
                command: "soup.find_all(id='link2')",
                result: '[<a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>]',
                info: "Если find_all переданы именованые аргументы, он ищет по соответствию значения атрибута с именем аргумента",
            }, {  
                description: "Найти тэги с атрибутом href соотвествующим регулярному выражению 'elsie$'",
                command: "import re\nsoup.find_all(href=re.compile('elsie$'))",
                result: '[<a class="sister" href="http://example.com/elsie" id="link1"><span>Elsie</span></a>]',
                info: "Для фильтрации по атрибуту может использоваться строка, регулярное выражение, список, функция или значение True.",
            }, {  
                description: "Найти тэги с атрибутом href соотвествующим регулярному выражению 'elsie$' и атрибутом id=\"link1\"",
                command: "import re\nsoup.find_all(href=re.compile('elsie$'), id=\"link1\")",
                result: '[<a class="sister" href="http://example.com/elsie" id="link1"><span>Elsie</span></a>]',
                info: "Вы можете отфильтровать несколько атрибутов одновременно, передав более одного именованного аргумента",
            }, {  
                description: "Найти все тэги атрибут id которых имеет какое либо значение",
                command: "soup.find_all(id=True)",
                result: '[<a class="sister" href="http://example.com/elsie" id="link1"><span>Elsie</span></a>,' +
                        '\n<a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>,' + 
                        '\n<a class="sister" href="http://example.com/tillie" id="link3">Tillie</a>]',
                info: "Для фильтрации по атрибуту может использоваться строка, регулярное выражение, список, функция или значение True",
            }, {
                description: "Найти все тэги в которых атрибут data-name=\"value\"",
                command: "data_soup = BeautifulSoup('<div data-foo=\"value\">foo!</div>')" + 
                         "\ndata_soup.find_all(attrs={\"data-foo\": \"value\"})",
                result: '[<div data-foo="value">foo!</div>]',
                info: "Некоторые атрибуты, такие как атрибуты data-* в HTML 5, имеют имена, которые нельзя использовать в " + 
                "качестве имен именованных аргументов. Вы можете использовать эти атрибуты в поиске, поместив их в словарь " +
                "и передав словарь в find_all() как аргумент attrs"
            }, {
                description: "Найти все тэги с классом class=\"title\"",
                command: "soup.find_all(class_='title')",
                result: '[<p class="title"><b>The Dormouse\'s story</b></p>]',
                info: "Имя атрибута CSS, \"class\", является зарезервированным словом в Python по этой причине с версии 4.1.2 " + 
                "используется аргумент class_" 
            }, {
                description: "Найти все тэги с классом class=\"title\"",
                command: "soup.find_all(class_='title')",
                result: '[<p class="title"><b>The Dormouse\'s story</b></p>]',
                info: "Имя атрибута CSS, \"class\", является зарезервированным словом в Python по этой причине с версии 4.1.2 " + 
                "используется аргумент class_. В более старых версиях следует использовать attrs={'class': 'title'}" 
            }, {
                description: "Найти все тэги <p> с классом class=\"title active\"",
                command: "soup.select(\"p.title.active\")",
                result: '',
                info: 'Если вы хотите искать теги, которые соответствуют двум или более классам CSS, следует использовать селектор CSS',
            }, {
                description: "Найти содержимое содержащее 'Elsie'",
                command: "soup.find_all(string=\"Elsie\")",
                result: "['Elsie']",
                info: "С помощью string вы можете искать строки вместо тегов. Как и в случае с name и именованными аргументами, " + 
                "передаваться может строка, регулярное выражение, список, функция или значения True. " + 
                "Аргумент string — это новое в Beautiful Soup 4.4.0. В ранних версиях он назывался text",
            }, {
                description: "Найти теги <a> содержащие текст 'Elsie'",
                command: "soup.find_all(\"a\", string=\"Elsie\")",
                result: '[<a class="sister" href="http://example.com/elsie" id="link1"><span>Elsie</span></a>]',
                info: "Аргумент string — это новое в Beautiful Soup 4.4.0. В ранних версиях он назывался text"
            }, {
                description: "Найти 2 первых тега <a>",
                command: "soup.find_all(\"a\", limit=2)",
                result: '[<a class="sister" href="http://example.com/elsie" id="link1"><span>Elsie</span></a>,' +
                        '\n<a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>]',
                info: "Если вам не нужны все результаты можно ограничить их количество первыми найденными, " +
                "передав параметр limit. Это работает подобно ключевому слову LIMIT в SQL" 
            }, {
                description: "Найти все элементы <title> на уровне html (без рекурсии)",
                command: "soup.find_all(\"title\", recursive=False)",
                result: '[]',
                info: "По умолчанию BS проверяет всех потомков, дочерние элементы, дочерние дочерних и т.д. " +
                "Если указать recursive=False то поиск ведется только в непосредсвенных потомках элементов."
            }
        ]
    },
]