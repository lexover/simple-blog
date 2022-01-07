---
date: '2020-12-21'
slug: vue-leaflet 
tags:
- vue.js 
title: Интерактивная карта в Vue.js. 
description: Создание интерактивной карты в Vue.js c Leaflet.
author: Lexover 
location: Russia 
image: https://res.cloudinary.com/dm3m076ji/image/upload/v1607885315/media/lexover_blog/vue-leaflet_hpvyxa.png
meta:
  - name: title
    content: Интерактивная карта в Vue.js. 
  - name: description
    content: Создание интерактивной карты в Vue.js c Leaflet.
  - name: keywords
    content: vue.js, leaflet, vue-leaflet
  - name: author
    content: Lexover 
  - name: language
    content: Russian 
featured: true
---

Есть задача разместить в приложении Vue.js интерактивную карту OpenStreet. Чем мы и займемся. Для работы нам потребуется установленный Vue.js. Библиотека для отображения карт, в качестве которой мы используем JS библиотеку [Leaflet](https://leafletjs.com/index.html). И сервис с которого мы будем получать карты для отображения, в качестве которого мы используем [Mapbox](https://www.mapbox.com/).

А теперь обо всем по порядку:

Создадим проект vue с помощью vue-cli.

```bash
vue create vue-leaflet
cd vue-leaflet
```

При установке укажем Default Vue3 (можно Vue2 все будет работать также). Далее установим библиотеку leaflet:

```bash
npm install leaflet
```

В директории src удалим созданные стартовые файлы: 

```bash
rm src/assets/logo.png
rm src/components/HelloWorld.vue
rm src/App.vue
```

Создадим новый App.vue файл со следующим содержимым:

```html
<template>
  <map-component/> 
</template>

<script>
import MapComponent from './components/MapComponent.vue'

export default {
  name: 'App',
  components: {
    MapComponent 
  }
}
</script>
```
Отображение карты будем выполнять в отдельном компоненте MapComponent. В папке src/components создадим файл MapComponent.vue. Все дальнейшие операции будем производить в данном фале. Для начала создадим секцию *template* в которой зададим блок *div* с идентификатором mapContainer к которому будет привязана наша карта:

```html
<template>
    <div id="mapContainer"/>
</template>
```
Создадим секцию style в которой установим размеры нашей карты по ширине и высоте окна:

```html
<style scoped>
#mapContainer {
    cursor: default;
    width: 100vw;
    height: 100vh;
}
</style>
```
Теперь перейдем к JS. После того как наш компонент будет смонтирован нам необходимо привязать карту к блоку *div* с идентификатором *mapContainer* для этих целей создадим метод *initMap()* который вызовем в хуке Vue *mount()*. В данном методе мы создадим объект карты *L.map* с привязкой к блоку по идентификатору и установим координаты центра карты для отображения. Далее создадим слой отображения карт *L.tileLayer* который будет взаимодействовать с Mapbox API. При работе с данным API выполняется аутентификация пользователя по токену который должен быть указан в поле *accessToken: "..."*. 

Для получения токена следует пройти на [Mapbox](https://account.mapbox.com/auth/signin/) и создать пользователя. На странице своего аккаунта вы найдете Default public token. Скопируйте его и вставьте в соответствующую секцию кода должно получиться:
```js
accessToken: "pk.dfgagafgsfg...sfgsfgsfgsfg", ...
```
В итоге содержимое файла MapComponent.vue должно выглядеть следующим образом:
```html
<template>
    <div id="mapContainer"/>
</template>

<script>
import L from 'leaflet'  //Импортируем библиотеку leaflet
import 'leaflet/dist/leaflet.css' //Импортируем CSS, без него не заработает

export default {
  name: 'MapComponent',
  data () {
    return {
      centerCoordinates: [51.505, -0.09],
      map: null,
      tileLayer: null
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      this.map = L.map('mapContainer').setView(this.centerCoordinates, 13);
      this.tileLayer = L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          attribution: 'Map data (c) <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: "mapbox/satellite-v9",
          accessToken:"Токен с Mapbox",
        }
      );
      this.tileLayer.addTo(this.map);
    },
  },
}
</script>

<style scoped>
#mapContainer {
  cursor: default;
  width: 100vw;
  height: 100vh;
}
</style>
```

После этого можно запускать наше приложение и увидеть карту в действии:
```bash
npm run serve
```
Немного расширим возможности нашей карты дополнив возможностью устанавливать метки на карте. Для этого нам нужно привязать обработчик события щелчка на компоненте к созданию метки в указанных координатах. Создадим метод  *mapClick(event)* который свяжем в хуке *mount()* с событием *click* карты. При генерации событий leaflet дополняет их дополнительными [свойствами](https://leafletjs.com/reference-1.7.1.html#event) одно из которых *latlng* содержит географические координаты точки в которой находился указатель мыши на момент создания. Его мы и  используем для установки маркера. Код секции script следующий:

```html
<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
// Импортирует изображение маркера чтобы оно было корректно установлено
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;

export default {
  name: 'MapComponent',
  data () {
    return {
      centerCoordinates: [51.505, -0.09],
      map: null,
      tileLayer: null
    }
  },
  mounted() {
    this.initMap();
    this.map.on('click', (event) => {
      this.mapClick(event);
    })
  },
  methods: {
    initMap() {
      this.map = L.map('mapContainer').setView(this.centerCoordinates, 13);
      this.tileLayer = L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          attribution: 'Map data (c) <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: "mapbox/satellite-v9",
          accessToken:"Токен с Mapbox",
        }
      );
      this.tileLayer.addTo(this.map);
    },
    mapClick(event) {
      this.createMarker(event.latlng);
    },
    createMarker(latlng) {
      L.marker(latlng).addTo(this.map);
    },
  },
}
</script>
```
Здесь также дополнительно выполнен импорт изображений маркера и привязка их в качестве иконки по умолчанию, для устранения ошибки возникающей при вызове Leaflet из компонента Vue. Теперь можно запустить код и создать метки на карте.

Данная статья описывает первые шаги непосредственной привязки Leaflet в компоненте Vue примеры работы с Leaflet можно смотреть в [документации Leaflet](https://leafletjs.com/examples.html). Также существует библиотека [vue-leaflet](https://github.com/vue-leaflet/Vue2Leaflet) которая значительно упрощает работу с leaflet в Vue проектах, но на момент написания статьи стабильная версия была для Vue2. Также при необходимости нанесения дополнительных графических элементов на картах стоит рассмотреть библиотеку [Leaflet.draw](https://github.com/Leaflet/Leaflet.draw).