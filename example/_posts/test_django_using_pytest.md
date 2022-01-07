---
date: '2021-03-07'
slug: test-django-with-pytest
tags:
- Django 
- Python
- test
title: Тестируем Django с pytest.
description: Рассмотрим как выполнять тестирование Django приложения с pytest и дополнительные инструменты упрощающие данную задачу.
author: Lexover 
location: Russia 
image: https://res.cloudinary.com/dm3m076ji/image/upload/v1615214685/media/lexover_blog/pytest_djnango_mqmrpr.png
meta:
  - name: title
    content: Тестируем Django с pytest.
  - name: description
    content: Рассмотрим как выполнять тестирование Django приложения с pytest и дополнительные инструменты упрощающие данную задачу.
  - name: keywords
    content: Django, pytest
  - name: author
    content: Lexover 
  - name: language
    content: Russian 
featured: true
---
В текущем посте мы рассмотрим как производится тестирование приложения Django с помощью фреймворка pytest, рассмотрим механизмы тестирования, дополнительные модули и плагины, которые значительно упрощают данный процесс, позволяют выполнить параллельный запуск тестов, проанализировать покрытие кода тестами.

Данная статья основана на великолепной статье Дмитрия Чувардинского [Testing Your Django App With Pytest](https://djangostars.com/blog/django-pytest-testing/).

## Преимущества и недостатки pytest перед unittest

Прежде всего давайте рассмотрим зачем нам использовать pytest, а не остановится на стандартном, встроенном в Python модуле тестирования unittest. 

### Преимущества pytest

- Не зависит от API, меньше дублирующего кода, просто реализуйте тесты как функции с assert;
- Использует стандартный assert (не требуется помнить конструкции вроде `self.assert...`);
- Предоставляет подробный отчет. С цветной подсветкой и возможностью настройки с помощью дополнительных модулей;
- Динамические фикстуры с возможностью вызова как автоматически, так и для конкретных тестов;
- Дополнительные возможности фикстур (автоматическое использование, возвращаемые значения, финализаторы, области видимости, объект request, вложенные фикстуры и т.д.);
- Автоматическое обнаружение модулей и функций тестирования;
- Параметризация тестов, т.е запуск одного и того же теста с различными наборами параметров.
- Метки, позволяющие отмечать тесты как неуспешные, игнорируемые, объединять тесты к группы чтобы можно было запускать их по имени;
- Огромное количество плагинов позволяющих расширить возможности системы тестирования, и еще больше упростить написание тестов;
- Обратная совместимость с тестами написанными на unittest и nose. Таким образом если есть тесты реализованные на unittest или nose их не потребуется переписывать.

### Недостатки использования pytest:

- Требует отдельной установки модуля. Но данный недостаток может быть одновременно и преимуществом, т.к. отсутствует зависимость от версии Python. Если требуется использовать новые инструменты pytest достаточно обновить версию модуля;
- Отсутствует дополнительный уровень вложенности, что создает некоторые неудобства в случае когда одна и та же функция может иметь несколько testcase'ов (частично решается с помощью плагина [pytest-describe](https://pypi.org/project/pytest-describe/#description).

## Установка pytest

Pytest устанавливается как обычный pip пакет:
```sh
pip install pytest
```

## Фикстуры pytest

Фикстуры в pytest - функции выполняемые в начале и в конце выполнения каждого отдельного теста, подобно setUp и tearDown в unittest. Фикстуры используются для создания данных конфигурации, установки соединения и отключения от базы данных, вызова дополнительных операций и т.д.
Для фикстур могут быть заданы области видимости (scope) определяющие когда выполняется код приведенный в фикстуре. Данный параметр может иметь следующие значения:
- function - фикстура уничтожается по завершению теста, данное значение используется по умолчанию;
- class - фикстура уничтожается после выполнения последнего теста в классе;
- module - фикстура уничтожается после выполнения последнего теста в модуле;
- package - фикстура уничтожается после выполнения последнего теста в пакете;
- session - фикстура уничтожается после завершения тестовой сессии.
Кроме того фикстура может быть создана с использованием оператора yield таким образом предоставляя доступ к выполнению кода перед вызовом теста и после его выполнения, аналогично setUp и tearDown в одном флаконе.

Пример создания фикстур:
```python
import pytest

@pytest.fixture
def function_scope_fixture():
  print('Фикстура выполняется для каждого теста")
  return 'function_scope'

@pytest.fixture(scope='class')
def class_scope_fixture():
  print('Фикстура выполняется для класса тестов")
  return 'class_scope'

@pytest.fixture
def setup_teardown_fixture():
  # Код выполняемый до начала теста
  yield 'some_data' # Передача управления тесту.
  # Код выполняемый после выполнения теста
```
Для использования фикстуры достаточно передать фикстуру в качестве параметра функции тестирования:
```python
def test_function(function_scope_fixture):
  assert function_scope_fixture == 'function_scope'
```

Фикстура также может быть передана в качестве параметра для другой фикстуры расширяющей ее функционал:
```python
@pytest.fixture
def extend_fixture(function_scope_fixture):
  return f'{function_scope_fixture}_extended'
```

## Маркеры pytest

Маркеры позволяют добавить метаданные к функционалу тестов такие как:
- skip - всегда пропускать данную функцию тестирования;
- skipif - пропускать тест при определенном условии;
- xfail - используется чтобы обозначить что ожидается провал данного теста.

```python
import pytest

@pytest.mark.skip(reason='не готов для тестирования')
def test_skipped():
  pass

@pytest.mark.skipif(sys.version_info < (3, 7), reason='Требует Python 3.7 и выше')
def test_function():
  # some code

@pytest.mark.xfail
def test_failed():
  return 1/0

```

Кроме того в файле `pytest.ini` могут быть заданы пользовательские маркеры:

*pytest.ini*
```ini
[pytest]
markers = 
  database: database tests marker
  failed: failed tests marker
```
Для запуска отмеченных тестов используется флаг `-m` причем параметры запуска тестов могут быть заданы логическим выражением с использованием `or`, `not`, `and`:
```sh
python -m "database and not failed" --strict-markers
```

## Параметризация тестов

Параметризация позволяет запустить один и тот же тест с различным набором параметров и реализована в pytest как маркер: `@pytest.mark.parametrize` далее в строке задается перечень используемых полей через запятую, а за ним список в котором в кортежах указывается отдельный набор параметров который будет применен при каждом запуске теста. Тема параметризации в pytest довольна обширна и выходит за рамки данного поста ознакомится с ней можно в официальной [документации pytest](https://docs.pytest.org/en/stable/parametrize.html). Простой пример использования параметризации:

```python
import pytest

@pytest.mark.parametrize("test_input,expected", [("3+5", 8), ("2+4", 6), ("6*9", 42)])
def test_eval(test_input, expected):
    assert eval(test_input) == expected
```

## Настройка pytest для проекта Django

Для упрощения процесса тестирования Django приложения был разработан плагин [pytest-django](https://pytest-django.readthedocs.io/en/latest/) предоставляющий набор инструментов для тестирования приложений и проектов Django. Установка данного плагина выполняется следующим образом:
```sh
pip install pytest-django
```
Далее необходимо указать в качестве параметра `DJANGO_SETTINGS_MODULE` путь к `settings` и сделать ваши тесты доступными для обнаружения в файле `pytest.ini` в корне проекта:

*pytest.ini*
```ini
# -- FILE: pytest.ini (or tox.ini)
[pytest]
DJANGO_SETTINGS_MODULE = your_project.settings
# -- recommended but optional:
python_files = tests.py test_*.py *_tests.py
```
После чего запуск тестов станет доступен по команде pytest:
```sh
pytest #запуск всех тестов
pytest path # запуск тестов находящихся по пути path
pytest test_some_function.py # запуск всех тестов в модуле test_some_function
pytest test_some_function.py::test_one # запуск функции test_one в модуле test_some_function
```
Использование `pytest` напрямую дает следующие преимущества по отношению к использованию `manage.py`:
- сокращает объем кода, нет необходимости импортировать unittest, создавать классы с методами. Достаточно просто реализовать обычные функции выполняющие тестирование;
- Позволяет управлять зависимостями с помощью фикстур;
- Позволяет запускать несколько процессов, чтобы увеличить скорость;
- Использовать дополнительные плагины доступные для pytest;
- Лего переключаться, существующие unittest тесты доступны для выполнения без какой либо модификации.

## Тестирование Django с pytest

**Фикстуры для подключения к БД**

После установки `pytest-django` нам становятся доступны вспомогательные фикстуры [Django helpers](https://pytest-django.readthedocs.io/en/latest/helpers.html#helpers).
Фикстура **django_db** предоставляет доступ к тестовой БД Django. Каждый тест будет запущен в отдельной транзакции которая будет возвращена к исходному состоянию в конце теста. Обычно в тестах используется именно данная фикстура. При необходимости использовать транзакции следует указать параметр transaction=True, если требуется использовать транзакции с возможностью сброса автоматически инкрементированных значений используется параметр reset_sequences=True.
```python
import pytest
from django.contrib.auth.models import User

@pytest.mark.django_db
def test_user_create():
  User.objects.create_user('user', 'user@mail.com', 'password')
  assert User.objects.count() == 1
```
Также имеются фикстуры для доступа к БД имеющие специальное назначение `db`, `transactional_db`, `django_db_reset_sequences`.

**Фикстура Client**

Для обращения к представлению Django используется встроенная pytest-django фикстура `client`, для доступа с правами суперпользователя используется фикстура `admin_client`:
```python
import pytest
from django.urls import reverse

@pytest.mark.django_db
def test_view_unauthorized(client):
   url = reverse('home')
   response = client.get(url)
   assert response.status_code == 401

@pytest.mark.django_db
def test_view_as_admin(admin_client):
   url = reverse('home')
   response = admin_client.get(url)
   assert response.status_code == 200
```

**Фикстура для создания пользователя**

Для создания пользователя мы используем следующую фикстуру:
```python
import uuid
import pytest

@pytest.fixture
def test_password():
   return 'strong-test-pass'
  
@pytest.fixture
def create_user(db, django_user_model, test_password):
   def make_user(**kwargs):
       kwargs['password'] = test_password
       if 'username' not in kwargs:
           kwargs['username'] = str(uuid.uuid4())
       return django_user_model.objects.create_user(**kwargs)
   return make_user
```
Т.к. фикстура pytest не может принимать аргументы, создана функция `create_user` передающая дополнительные аргументы в `make_user`.

Использование данной фикстуры может выглядеть следующим образом:
```python
import pytest
from django.urls import reverse

@pytest.mark.django_db
def test_user_detail(client, create_user):
   user = create_user(username='someone')
   url = reverse('user-detail-view', kwargs={'pk': user.pk})
   response = client.get(url)
   assert response.status_code == 200
   assert 'someone' in response.content

@pytest.mark.django_db
def test_superuser_detail(client, create_user):
   admin_user = create_user(
       username='custom-admin-name',
       is_staff=True, is_superuser=True
   )
   url = reverse(
       'superuser-detail-view', kwargs={'pk': admin_user.pk}
   )
   response = client.get(url)
   assert response.status_code == 200
   assert 'custom-admin-name' in response.content
```

**Клиент с автоматическим входом**

Создадим фикстуру для выполнения автоматическохо входа в систему (auto login):

```python
import pytest

@pytest.fixture
def auto_login_user(db, client, create_user, test_password):
   def make_auto_login(user=None):
       if user is None:
           user = create_user()
       client.login(username=user.username, password=test_password)
       return client, user
   return make_auto_login
```
Данная фикстура получает пользователя в качестве параметра либо создает нового и выполняет вход. В конце возвращает клиент и пользователя для последующих действий.

Использование данной фикстуры для тестирования:
```python
import pytest
from django.urls import reverse

@pytest.mark.django_db
def test_auth_view(auto_login_user):
   client, user = auto_login_user()
   url = reverse('auth-url')
   response = client.get(url)
   assert response.status_code == 200
```

**Тестирование Mail Outbox**

Для тестирования исходящей почты pytest-django имеет встроенную фикстуру `mailoutbox`:
```python
import pytest
from django.urls import reverse

@pytest.mark.django_db
def test_send_report(auto_login_user, mailoutbox):
   client, user = auto_login_user()
   url = reverse('send-report-url')
   response = client.post(url)
   assert response.status_code == 201
   assert len(mailoutbox) == 1
   mail = mailoutbox[0]
   assert mail.subject == f'Report to {user.email}'
   assert list(mail.to) == [user.email]
```
Для тестирования мы используем созданную ранее `auto_login_user` фикстуру и встроенную `mailoutbox` фикстуру.

Подводя итог преимуществам подхода, продемонстрированного выше: pytest учит нас, как легко настроить наши тесты, чтобы мы могли больше сосредоточиться на тестировании основных функций.

## Тестирование Django REST Framework с pytest

**API Client**

Прежде всего создадим фикстуру для API Client REST фреймворка:
```python
import pytest

@pytest.fixture
def api_client():
   from rest_framework.test import APIClient
   return APIClient()
```
Теперь у нас есть `api_client` для наших тестов:
```python
import pytest
from django.urls import reverse

@pytest.mark.django_db
def test_unauthorized_request(api_client):
   url = reverse('need-token-url')
   response = api_client.get(url)
   assert response.status_code == 401
```

**Получение и создание Token**

Для авторизации нашего пользователя API обычно используется токен. Создадим фикстуру для получения либо создания токена ля пользователя:
```python
import pytest
from rest_framework.authtoken.models import Token

@pytest.fixture
def get_or_create_token(db, create_user):
   user = create_user()
   token, _ = Token.objects.get_or_create(user=user)
   return token
```
метод `get_or_create` использует `create_user` фикстуру которая создана выше. Теперь можем реализовать тест с авторизацией:
```python
import pytest
from django.urls import reverse

@pytest.mark.django_db
def test_unauthorized_request(api_client, get_or_create_token):
   url = reverse('need-token-url')
   token = get_or_create_token()
   api_client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
   response = api_client.get(url)
   assert response.status_code == 200
```

**Автоматическая аутентификация**

API клиент позволяет выполнять аутинтификацию в автоматическом режиме. Для того чтобы выполнить код с заданными правами и по завершению его восстановить права мы можем использовать `yield`:
```python
import pytest

@pytest.fixture
def api_client_with_credentials(
   db, create_user, api_client
):
   user = create_user()
   api_client.force_authenticate(user=user)
   yield api_client
   api_client.force_authenticate(user=None)
```
Тест с авторизацией станет проще:
```python
import pytest
from django.urls import reverse

@pytest.mark.django_db
def test_unauthorized_request(api_client, get_or_create_token):
   url = reverse('need-token-url')
   response = api_client_with_credentials.get(url)
   assert response.status_code == 200
```

**Проверка валидации данных с Pytest.parametrize**

Если требуется запустить один и тот же тест с различными параметрами мы можем использовать параметризацию тестов `pytest.mark.parametrize`:
```python
import pytest

@pytest.mark.django_db
@pytest.mark.parametrize(
   'email, password, status_code', [
       (None, None, 400),
       (None, 'strong_pass', 400),
       ('user@example.com', None, 400),
       ('user@example.com', 'invalid_pass', 400),
       ('user@example.com, 'strong_pass', 201),
   ]
)
def test_login_data_validation(
   email, password, status_code, api_client
):
   url = reverse('login-url')
   data = {
       'email': email,
       'password': password
   }
   response = api_client.post(url, data=data)
   assert response.status_code == status_code
```

**Использование pytest-mock**

При проведении тестирования периодически нам приходится тестировать функционал который зависит от внешних связей (обращение к сетевым ресурсам, файловой системе и т.п.). Для тестирования взаимодействия с такими объектами используются Mock-объекты, которые позволяют верунть ожидаемые значения и произвести тестирование без сложных зависимостей. Python предлагает для этих целей unittes.mock модуль, который может быть использован в pytest. Но существует пакет [pytest-mock](https://pypi.org/project/pytest-mock/) который позволяет упростить работу с unittest.mock объектами. Он дополняет функционал pytest встроенной фикстурой `mocker` через который мы можем создавать `mock` объекты. 

Установка пакета осуществляется через pip:

```sh
pip install pytest-mock
```

Предположим наше приложение использует внешний сервис, для получения некоторых данных:
```python
from rest_framework.views import APIView
from rest_framework.response import Response
from .external import ThirdPartyService

class DataLoader(APIView):
   ...
def get(self, request, format=None):
       data = ThirdPartyService.get_data(id=request.id)
       return Response(data)
```
Нам необхоимо проестировать его без фактического обращения к сервису, для этого мы можем использовать `mock.patch` как декоратор в тесте python:
```python
import pytest

@pytest.mark.django_db
def test_send_new_event_service_called(api_client, mocker):
  mocker.patch('service.ThirdPartyService.get_data')
   response = api_client.get('get_data', id=1)
   assert response.status_code == 201
   service.ThirdPartyService.get_data.assert_called_with(id=1)
```

## Полезные библиотеки для тестирования с pytest

### Создание моделей с помощью FactorBoy

При тестировании приложений Django мы постоянно имеем дело с моделями и их данными и для выполнения тестирования нам необходимо создавать модели с данными. Мы можем производить данные операции вручную либо с помощью фикстур. Но это приводит к дополнительным затратам ресрусов, приводи к большому объему кода, особенно если модель имеет множество внешних зависимостей таких как `ForeignKey`, `ManyToMany` поля и т.д. Здесь нам на помощь приходят `фабрики` - решения позволяющие тестировать наши данные наиболее удобным способом. Такие как [Factory Boy](https://factoryboy.readthedocs.io/en/stable/) или [Model Bakery](https://pypi.org/project/model-bakery/) мы данном посте мы рассмотрим Factory Boy.

Установка как обычно через pip:
```sh
pip install pytest-factoryboy
```
Для того чтобы воспользоваться Фабрикой нам необходимо создать фабрику для генерации данных в файле *tests/factories.py*:
```python
import factory
from django.contrib.auth.models import User, Group


class UserFactory(factory.DjangoModelFactory):
  class Meta:
       model = User

   username = factory.Sequence(lambda n: f'JohnDoe_{n}')
   email = factory.Sequence(lambda n: f'JohnDoe_{n}@mail.com')
   password = factory.PostGenerationMethodCall(
       'set_password', 'pass'
   )

   @factory.post_generation
   def has_default_group(self, create, extracted, **kwargs):
       if not create:
           return
       if extracted:
           default_group, _ = Group.objects.get_or_create(
               name='group'
           )
           self.groups.add(default_group)
```

После чего фабрика должна быть зарегистрирована в файле *tests/conftest.py*:
```python
from pytest_factoryboy import register
from factories import UserFactory

register(UserFactory)  # имя фикстуры будет в snakecase виде: user_factory
```

Тестирование модли *tests/test_models.py*:
```python
import pytest

@pytest.mark.django_db
def test_user_user_factory(user_factory):
   user = user_factory(has_default_group=True)
   assert user.username == 'JohnDoe_0'
   assert user.email == 'JohnDoe_0@mail.com'
   assert user.check_password('pass')
   assert user.groups.count() == 1
```

### Параллельный запуск тестов.

Процесс тестирования может быть значительно ускорен, с помощью плагина [pytest-xdist](https://pypi.org/project/pytest-xdist/), который позволяет запускать тесты параллельно. 
Установка плагина:
```sh
pip install pytest-xdist
```
Запуск тестов в на нескольких процессорах/ядрах:
```sh
pytest -n <кол-во_процессов>
```
 >- Избегайте операций вывода и stdout в тестах, т.к. они снижают скорость выполнения тестов;
>
>- Если тесты вызываются с помощью xdist, pytest-django создает отдельную тестовую базу данных для каждого процесса. Каждой тестовой базе данных будет присвоен суффикс (что-то вроде gw0, gw1) для сопоставления с процессом xdist. Если имя вашей базы данных установлено на foo, тестовая база данных с xdist будет test_foo_gw0, test_foo_gw1 и т.д.

### Анализ покрытия кода тестами

Для анализа покрытия кода тестами следует воспользоваться плагином [pytest-cov](https://pypi.org/project/pytest-cov/).

Установка плагина:
```sh
pip install pytest-cov
```
Запуск нализа покрытия кода тестами и вывод отчета:
```sh
pytest --cov tests
```

## Настройка тестирования в pytest.ini

Простой пример *pytest.ini* для Django проекта:
```ini
[pytest]
DJANGO_SETTINGS_MODULE = yourproject.settings
python_files = tests.py test_*.py *_tests.py
addopts = -p no:warnings --strict-markers --no-migrations --reuse-db
norecursedirs = venv old_tests
markers =
   custom_mark: some information of your mark
   slow: another one slow tes
```
Здесь:
- DJANGO_SETTINGS_MODULE - путь к файлу с настройкми Django проекта, который используется pytest для создания фикстур взаимодействующих с БД и др.
- addopts - добавляет аргументы командной строки чтобы не приходилось их вводить вручную при каждом запуске. Здесь определены:

  - --p no:warnings - отключить предупреждения
  - --strict-markers - отмечать как ошибки опечатки и дублирование в маркерах функций
  - --no-migrations отключает миграции Django и создаст базу данных, проверив все модели. Это может быть быстрее, если в настройке базы данных нужно выполнить несколько миграций
  - --reuse-db повторно использует тестовую базу данных между тестовыми запусками. Это обеспечивает намного более быстрое время запуска для тестов

>- reuse-db: запускать тесты с помощью pytest; при первом запуске будет создана тестовая база данных. При последующих запусках будет использоваться эта-же БД.
>
>-create-db: принудительно воссаздовать тестовую БД при каждом запуске.
- norecursedirs - устанавливает исключение исключение шаблонов базовых имен каталогов при рекурсии для обнаружения тестов. Это сообщает pytest не просматривать каталоги `venv` и `old_testsdirectory`.
>Паттерны по умолчанию: '. *', 'Build', 'dist', 'CVS', '_darcs', '{arch}', '* .egg', 'venv'
- markers - перечень дополнительных маркеров, которые в дальнейшем могут быть использованы в тестах.

На этом все, надеюсь данная статья была полезна и вы используете в своих Django проектах pytest.