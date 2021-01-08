---
date: '2021-01-06'
slug: vue-d3 
tags:
- vue.js 
- d3 
title: Построение графиков в Vue.js с использованием D3.js. 
description: Построение графиков в Vue.js с использованием D3.js.
author: Lexover 
location: Russia 
image: https://res.cloudinary.com/dm3m076ji/image/upload/v1609921594/media/lexover_blog/vue-d3_iropqk.png
meta:
  - name: title
    content: Построение графиков в Vue.js с использованием D3.js.
  - name: description
    content: С помощью D3.js создадим компонент Vue.js для отображения графика "японских свечей".
  - name: keywords
    content: vue.js, d3.js, candlestick, plot
  - name: author
    content: Lexover 
  - name: language
    content: Russian 
featured: true
---
D3.js - библиотека для построения динамической интерактивной визуализации данных, используя SVG, HTML5 и CSS. D3 - сокращение Data-Driven Documents, что в переводе на русский - "документ управляемый данными". Нам предстоит создать компонент Vue.js, который будет динамически отображать данные в виде графика "японских свечей", при этом следует учесть, что как D3.js так и Vue.js выполняют манипуляции элементами DOM и для корректной работы их в связке следует принять решение о распределении обязанностей между ними. 

Для реализации проекта нам потребуются: [Node.js](https://nodejs.org/) версии выше 10. Установленный [Vue CLI](https://cli.vuejs.org/guide/installation.html). 

Создадим проект d3js-project:
```bash
vue create d3js-project
```
Из предложенных вариантов выберем Default (Vue 3 Preview):
![Vue.js 3 install](https://res.cloudinary.com/dm3m076ji/image/upload/v1609923674/media/lexover_blog/vue3_install_arrxlv.png)

В директории ```src``` удалим созданные стартовые файлы: 

```bash
rm src/assets/logo.png
rm src/components/HelloWorld.vue
```

Содержимое ```src/App.vue``` заменим на следующее:

```html
<template>
  <div class="main-block">
    <!-- Компонент графика который принимает данные data -->
    <candlestick-component :data="canlestickData"/>
    <div class="main-block__button">
      <!-- Кнопка обновления данных -->
      <button @click="updateData">Обновить данные</button>
    </div>
  </div>
</template>

<script>
// Импорт компонента данных
import CandlestickComponent from './components/CandlestickComponent.vue'

export default {
  name: 'App',
  components: {
    CandlestickComponent,
  },
  data(){
    return {
      // Данные для графика
      canlestickData: [] 
    }
  },
  created() {
    // После создания компонента App 
    // вызовем метод для обновления данных
    this.updateData();
  },
  methods: { 
    // Данный метод генерирует данные для графика.
    updateData() {
      const data = []
      // Создадим 30 баров для отображения на графике.
      for (let i=1; i<31; i++) {
        // День до 10 числа должен начинаться с 0 (01, 02...) 
        const day = (i < 10) ? `0${i}` : i;
        // Значения цены открытия и закрытия - случайная величина от 100 до 120
        const close = Math.round(100 + Math.random() * 20);
        const open = Math.round(100 + Math.random() * 20);
        // Значения максимума бара - до 5% выше максимального значения цены откр/закр.
        const high = Math.round(Math.max(close, open) + Math.random() * 5);
        // Значения максимума бара - до 5% ниже минимального значения цены откр/закр.
        const low = Math.round(Math.min(close, open) - Math.random() * 5);
        data.push({date: `2020-01-${day}`, open, high, low, close})
      }
      // Присваиваем новые значения динамической переменной.
      this.canlestickData = data;
    },
  }
}
</script>

<style>
/*Эта часть остается без изменений*/
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```
Здесь мы создали компонент ```App``` который содержит данные для построения графика в списке ```candlestickData```, подключает компонент ```CandlestickComponent.vue``` (мы создадим его далее) и передает ему данные: ```  <candlestick-component :data="canlestickData"/> ```. Данные генерируются в методе ```updateData``` который вызывается в при создании компонента в хуке ```created()``` а также по нажатию кнопки "Обновить данные".

В директории ```src/components``` создадим компонент с именем ```CandlestickComponent.vue``` со следующим содержимым:
```html
<template>
  <div class="container">
    <!-- Таблица для отображения данных переданных в компонент -->
    <table class="table">
      <thead>
        <th>Date</th>
        <th>Open</th>
        <th>High</th>
        <th>Low</th>
        <th>Close</th>
      </thead>
      <tr v-for="row in data" :key="row.date">
        <td>{{ row.date }}</td>
        <td>{{ row.open }}</td>
        <td>{{ row.high }}</td>
        <td>{{ row.low }}</td>
        <td>{{ row.close }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'CandlestickComponent',
  props: {
    data: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
  /* Используем css grid для размещения таблицы и графика */
  .container{
    display: grid;
    grid-template-columns: 70% 30%;
  }
  @media screen and (max-width: 800px) {
    .container{
      display: grid;
      grid-template-columns: 100%;
    }
  }
}
</style>
```
Проверим, что наши данные генерируются и отображаются корректно:
```bash
npm run serve
```
В браузере открываем ```localhost:8080``` и на странице должен быть отображенa таблица сгенерированных данных:

![Таблица данных](https://res.cloudinary.com/dm3m076ji/image/upload/v1609936256/media/lexover_blog/d3-vue_1_xshkun.png)

Нажмите на кнопку "Обновить данные" данные в таблице должны измениться. В дальнейшем все изменения будем выполнять исключительно в файле компонента нашего графика ```CandlestickComponent.vue```.

Теперь можем приступить к созданию графика. Для начала установим D3.js и пакет для отображения осей:
```bash
npm install d3
npm install d3-axis
```

При реализации графика мы должны учесть ряд требований, а именно:

* при изменении данных график должен автоматически быть перерисован с учетом новых данных;
* при изменении размеров графика, он должен автоматически масштабироваться;
* возможность влиять на внешний вид графика через стили CSS.

Используя Vue мы получаем возможность создать шаблон графика в секции ```<template>```, разбив его на логические компоненты, такие как ось абсцисс, ось ординат, поле графика. 

Чтобы иметь возможность управлять внешним видом графика через CSS мы создадим соответствующие классы для его элементов. Обилие классов в реальных проектах может привести к конфликтам имен, чего можно избежать, используя инкапсуляцию стилей Vue - scoped или module. Т.к. нам необходимо передавать имена классов в D3.js единственным выбором для нас является module. В теге ```style``` добавляем атрибут ```module```. Это включит режим CSS-модулей в css-loader, и полученный индентификатор объекта класса будет внедрен в компонент как вычисляемое свойство с именем $style. Теперь использование класса в шаблоне будет выглядеть следующим образом: ```<тег :class="$style.имя_класса">```, при этом мы можем получить доступ к классу в JavaScript ```this.$style.имя_класса```.

Секция ```template``` нашего компонента ```CandlestickComponent.vue``` будет выглядеть следующим образом:
```html
<template>
  <div :class="$style.container">
    <!-- Компонент SVG на котором будем отображать график -->
    <!-- ViewBox устанавливаем как реактивное свойство для-->
    <!-- динамического изменения размеров графика         --> 
    <svg :class="$style.candlestick" :viewBox="viewBox">
      <!-- В данной группе будет отображена шкала X -->
      <g :class="$style.candlestick__xAxis"></g>
      <!-- В данной группе будет отображена шкала Y -->
      <g :class="$style.candlestick__yAxis"></g>
      <!-- В данной группе будет отображен сам график -->
      <g :class="$style.candlestick__plot"></g>
    </svg>
    <!-- Таблица для отображения данных переданных в компонент -->
    <table :class="$style.table">
      <thead>
        <th>Date</th>
        <th>Open</th>
        <th>High</th>
        <th>Low</th>
        <th>Close</th>
      </thead>
      <tr v-for="row in data" :key="row.date">
        <td>{{ formatDate( row.date) }}</td>
        <td>{{ row.open }}</td>
        <td>{{ row.high }}</td>
        <td>{{ row.low }}</td>
        <td>{{ row.close }}</td>
      </tr>
    </table>
  </div>
</template>
```
Секция ```style```:
```html
<style module>
  /* Используем css grid для размещения таблицы и графика */
  .container{
    display: grid;
    grid-template-columns: 70% 30%;
  }
  @media screen and (max-width: 800px) {
    .container{
      display: grid;
      grid-template-columns: 100%;
    }
  }
  .candlestick__plot {
    margin: 25px;
  }
</style>
```
В секции ```script``` импортируем модуль d3 и укажем поля props, которые получает наш компонент. Среди них обязательное поле data с данными для построения нашего графика, размеры нашего компонента и отступы со значениями по умолчанию:
```js
import * as d3 from 'd3';
export default {
  name: 'CandlestickComponent',
  props: {
    data: {  
      type: Array,
      required: true,
    },
    height: { 
      type: Number,
      default: 270
    },
    width: {
      type: Number,
      default: 500
    },
    margin: {
      type: Object,
      default: () => ({top: 20, right: 20, bottom: 30, left: 40})
    }
  },
}
```
Для того чтобы иметь возможность динамически масштабировать SVG компонент мы задаем ему вычисляемое свойство ViewBox, которое обновляется при изменений свойств ширины и высоты графика. Также создадим вычисляемые свойства для компонентов шкал D3, которые трансформируют реальные значения (domain) в координаты графика (range). 
```js
export default {
  name: 'CandlestickComponent',
  props: 
  ...

  computed: {
    // C ViewBox размеры svg будут динамически изменяться.
    viewBox() {
      return `0 0 ${this.width} ${this.height}`;
    },
    // Вычисляемое свойство шкалы d3 изменяется при изменении значений размеров и отступов
    xScale() {
      // Для оси абцисс используем шкалу времени
      return d3.scaleUtc()
          // Доменные значения - минимум/максимум(ф-ция extent) столбца date  
         .domain(d3.extent(this.data, d => d.date))
          // Шкала в координатах графика.
         .range([this.margin.left, this.width - this.margin.right]);
    },
    yScale() {
      // Для оси ординат испольузем линейную шкалу
      return d3.scaleLinear()
         // Доменные значения - минимум мин цены, максимум наибольшей цены. 
         // Значение минимума умножено на 0.9, чтобы немного приподнять график.
         .domain([d3.min(this.data, d => d.low) * 0.9, d3.max(this.data, d => d.high)]).nice()
         // Шкала в координатах графика. 
         .range([this.height - this.margin.bottom, this.margin.top]);
    },
  },
```
Чтобы построить график "японских свечей" для каждой свечи нам нужно нарисовать 2 вертикальные линии. Одна линия тонкая от минимума до максимума цены - тень свечи. Вторая широкая отражающая разницу цен открытия и закрытия - тело свечи. Кроме того тело свечи изменяет цвет в зависимости от разницы цены открытия и закрытия, при этом цвет и толщину тела свечи зададим в соответствующем стиле CSS. Для того чтобы отобразить свечи на графике создадим метод ```drawCandlestcick(x, y)``` принимающий на входе вычисляемые свойства шкал xScale и yScale соответственно. В данном методе по классу мы находим группу, внутри которой будут созданы свечи ```d3.select(`g.${this.$style.candlestick__plot}`)```. 

**При использовании режима style module, важно чтобы класс (в данном случае .candlestick__plot) был определен в секции ```<style>```. В ином случае данный класс не будет определен и d3 не сможет найти соответствующий тег.** 

Далее устанавливаем данные и для каждого элемента данных создаем группу представляющую отдельную свечу ```join(g)``` смещая ее по шкале x используя атрибут ```transform```. Внутри каждой группы создаем тень свечи в виде линии со свойствами указанными в классе ```candlestick__plot__candle_shadow```. Далее создаем тело свечи применяя класс ```candlestick__plot__candle_body_down``` или ```candlestick__plot__candle_body_up``` в соответствии с направлением цены. Дополним секцию ```script``` и ```style```:
```html
<script>
...
export default {
  ...
  // После монтирования компонента CandlestickComponent отображаем график
  mounted () {
    this.plot();
  },
  // После создания компонента запускаем наблюдение за данными, 
  // при их изменении перерисовываем график 
  created() {
    this.$watch('data', () => {
      this.plot();
    });
  },
  methods: {
    // Метод который создаст график
    plot() {
      // Получаем шкалы
      const x = this.xScale;
      const y = this.yScale;
      // Перерисовываем график 
      this.drawCandlesticks(x, y);
    },
    // Метод отрисовывающий свечи 
    drawCandlesticks(x, y) {
      // Находим график в DOM 
      const g = d3.select(`g.${this.$style.candlestick__plot}`)
        .selectAll("g")
        // Присоединяем данные
        .data(this.data)
        // Для каждого элемента данных создаем группу
        // для отображения свечи 
        .join("g")
          // Каждая последующая свеча смещается по графику 
          // в соответствии с датой, для смещения от оси ординат (+10)
          .attr("transform", d => `translate(${x(d.date) + 10}, 0)`);
      
      // Создаем тени свечи по данным мин/макс цены 
      g.append("line")
        .attr("y1", d => y(d.low))
        .attr("y2", d => y(d.high))
        // Задаем класс тени свечи
        .classed(this.$style.candlestick__plot__candle_shadow, true)

      // Создаем тело свечи по данным цены откр/закр.
      g.append("line")
        .attr("y1", d => y(d.open))
        .attr("y2", d => y(d.close))
        // Задаем ширину тела свечи
        .classed(this.$style.candlestick__plot__candle_body, true)
        // Выполняем окрашивание по признаку роста цены 
        .classed(this.$style.candlestick__plot__candle_body_down, d => d.open > d.close)
        .classed(this.$style.candlestick__plot__candle_body_up, d => d.open < d.close);
    },
  }
}
</script>

<style module>
  /* Используем css grid для размещения таблицы и графика */
  .container{
    display: grid;
    grid-template-columns: 70% 30%;
  }
  @media screen and (max-width: 800px) {
    .container{
      display: grid;
      grid-template-columns: 100%;
    }
  }
  .candlestick__plot {
    margin: 25px;
  }
  .candlestick__plot__candle_shadow {
    stroke: gray;
    stroke-width: 1;
  }
  .candlestick__plot__candle_body {
    stroke: gray;
    stroke-width: 7;
  }
  .candlestick__plot__candle_body_up {
    stroke: green;
  }
  .candlestick__plot__candle_body_down {
    stroke: red;
  }
</style>
```
Теперь можно запустить наше приложение:
```
npm run serve
```
И в браузере должен отобразиться график:

![График без осей](https://res.cloudinary.com/dm3m076ji/image/upload/v1610091102/media/lexover_blog/d3-vue_2_nhpwri.png)

У данного графика есть ряд недостатков - он не обновляется динамически и на нем отсутствуют оси. Чем мы и займемся далее. 

Для того чтобы динамически обновлять график нам необходимо отслеживать изменение данных data. И при каждом изменении перерисовывать свечи. Но прежде чем рисовать свечи с новыми данными необходимо удалить старые. Соответственно нам нужно создать дополнительный метод, который бы удалял старые свечи с графика ```clear()``` и выполнять его вызов в методе ```plot()``` перед вызовом ```drawCandlesticks()```:
```js
methods: {
    // Преобразует даты для корректного отображения в таблице
    formatDate(date) {
      const date_ru = new Intl.DateTimeFormat('ru');
      return date_ru.format(date);
    },
    // Метод который создаст график
    plot() {
      // Получаем шкалы
      const x = this.xScale;
      const y = this.yScale;
      // Очищаем данные отображенные на графике
      this.clear();
      Перерисовываем график с новыми данными
      this.drawCandlesticks(x, y);
    },
    // Метод который удаляет свечи с графика
    clear(){
      // Выбираем непосредственно график
      d3.select(`g.${this.$style.candlestick__plot}`)
        // Удаляем все его дочерние элементы 
        .selectAll("*").remove()
    },
    ...
}
```
Для слежения за изменениями данных data создадим хук ```created()```. В нем организуем наблюдение за свойством ```data``` и при его изменении вызовем метод ```plot()```:

```js
 ... 
mounted () {
  this.plot();
},
// После создания компонента запускаем наблюдение за данными, 
// при их изменении перерисовываем график 
created() {
  this.$watch('data', () => {
    this.plot();
  });
},
...
``` 
Теперь график динамически обновляет свои значения, что можно проверить нажатием на кнопку "Обновить данные" данные обновятся вместе с графиком. Осталось добавить оси, для чего создадим методы ```setXAxis(x)``` и ```setYAxis(y)``` и выполним их вызов в методе plot(), не забывая добавить соответствующие классы в секции ```style```. Итоговое содержимое файла CandlestickComponent.vue должно выглядеть следующим образом:

```html
<template>
  <div :class="$style.container">
    <!-- Компонент SVG на котором будем отображать график -->
    <!-- ViewBox устанавливаем как реактивное свойство для-->
    <!-- динамического изменения размеров графика         --> 
    <svg :class="$style.candlestick" :viewBox="viewBox">
      <!-- В данной группе будет отображена шкала X -->
      <g :class="$style.candlestick__xAxis"></g>
      <!-- В данной группе будет отображена шкала Y -->
      <g :class="$style.candlestick__yAxis"></g>
      <!-- В данной группе будет отображен сам график -->
      <g :class="$style.candlestick__plot"></g>
    </svg>
    <!-- Таблица для отображения данных переданных в компонент -->
    <table :class="$style.table">
      <thead>
        <th>Date</th>
        <th>Open</th>
        <th>High</th>
        <th>Low</th>
        <th>Close</th>
      </thead>
      <tr v-for="row in data" :key="row.date">
        <td>{{ formatDate( row.date) }}</td>
        <td>{{ row.open }}</td>
        <td>{{ row.high }}</td>
        <td>{{ row.low }}</td>
        <td>{{ row.close }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import * as d3 from 'd3';
export default {
  name: 'CandlestickComponent',
  props: {
    data: {  
      type: Array,
      required: true,
    },
    height: { 
      type: Number,
      default: 270
    },
    width: {
      type: Number,
      default: 500
    },
    margin: {
      type: Object,
      default: () => ({top: 20, right: 20, bottom: 30, left: 40})
    }
  },
  computed: {
    // C динамическим ViewBox размеры svg будут динамически изменяться.
    viewBox() {
      return `0 0 ${this.width} ${this.height}`;
    },
    // Компонент шкалы d3 изменяется при изменении значений размеров и отступов
    xScale() {
      // Для оси абцисс используем шкалу времени
      return d3.scaleUtc()
                // Доменные значения - минимум/максимум(ф-ция extent) столбца date 
               .domain(d3.extent(this.data, d => d.date))
                // Шкала в координатах графика.
               .range([this.margin.left, this.width - this.margin.right]);
    },
    yScale() {
      // Для оси ординат испольузем линейную шкалу
      return d3.scaleLinear()
               // Доменные значения - минимум мин цены, максимум наибольшей цены. 
               // Значение минимума умножено на 0.9, чтобы немного приподнять график.
               .domain([d3.min(this.data, d => d.low) * 0.9, 
                        d3.max(this.data, d => d.high)]).nice()
               // Шкала в координатах графика. 
               .range([this.height - this.margin.bottom, this.margin.top]);
    },
  },
  // После монтирования компонента CandlestickComponent отображаем график
  mounted () {
    this.plot();
  },
  // После создания компонента запускаем наблюдение за данными, 
  // при их изменении перерисовываем график 
  created() {
    this.$watch('data', () => {
      this.plot();
    });
  },

  methods: {
    // Преобразует даты для корректного отображения в таблице
    formatDate(date) {
      const date_ru = new Intl.DateTimeFormat('ru');
      return date_ru.format(date);
    },
    // Метод который создаст график
    plot() {
      // Получаем шкалы
      const x = this.xScale;
      const y = this.yScale;
      // Создаем оси абцисс и ординат
      this.setXAxis(x);
      this.setYAxis(y);
      // Очищаем данные отображенные на графике
      this.clear();
      // Перерисовываем график с новыми данными
      this.drawCandlesticks(x, y);
    },
    // Метод который удаляет свечи с графика
    clear(){
      // Выбираем непосредственно график
      d3.select(`g.${this.$style.candlestick__plot}`)
        // Удаляем все его дочерние элементы 
        .selectAll("*").remove()
    },
    // Метод отрисовывающий свечи 
    drawCandlesticks(x, y) {
      // Находим график в DOM 
      const g = d3.select(`g.${this.$style.candlestick__plot}`)
        .selectAll("g")
        // Присоединяем данные
        .data(this.data)
        // Для каждого элемента данных создаем группу
        // для отображения свечи 
        .join("g")
          // Каждая последующая свеча смещается по графику 
          // в соответствии с датой, для смещения от оси ординат (+10)
          .attr("transform", d => `translate(${x(d.date) + 10}, 0)`);
      
      // Создаем тени свечи по данным мин/макс цены 
      g.append("line")
        .attr("y1", d => y(d.low))
        .attr("y2", d => y(d.high))
        // Задаем класс тени свечи
        .classed(this.$style.candlestick__plot__candle_shadow, true)

      // Создаем тело свечи по данным цены откр/закр.
      g.append("line")
        .attr("y1", d => y(d.open))
        .attr("y2", d => y(d.close))
        // Задаем ширину тела свечи
        .classed(this.$style.candlestick__plot__candle_body, true)
        // Выполняем окрашивание по признаку роста цены 
        .classed(this.$style.candlestick__plot__candle_body_down, d => d.open > d.close)
        .classed(this.$style.candlestick__plot__candle_body_up, d => d.open < d.close);
    },
    // Данный метод устанавливает шкалу оси абцисс
    setXAxis(x) {
      const xAxis = g => g
        // Смещаем шкалу вниз на высоту графика - отступ.
        .attr("transform", `translate(0, ${this.height - this.margin.bottom})`)
        // Зададим количество значений по оси, скрыв внешние отметки.
        .call(d3.axisBottom(x).ticks(4).tickSizeOuter(0))
      // Установим шкалу в группу, вызвав метод сall(xAxis)
      d3.select(`g.${this.$style.candlestick__xAxis}`)
        .call(xAxis);
    },
    setYAxis(y) {
      const yAxis = g => g
        // Смещаем шкалу вправо чтобы были видны значения 
        .attr("transform", `translate(${this.margin.left},0)`)
        .call(d3.axisLeft(y))
      d3.select(`g.${this.$style.candlestick__yAxis}`)
        .call(yAxis);
    }
  }
}
</script>

<style module>
  /* Используем css grid для размещения таблицы и графика */
  .container{
    display: grid;
    grid-template-columns: 70% 30%;
  }
  @media screen and (max-width: 800px) {
    .container{
      display: grid;
      grid-template-columns: 100%;
    }
  }
  .candlestick__plot {
    margin: 25px;
  }
  .candlestick__xAxis {
    font-weight: normal;
  }
  .candlestick__yAxis {
    font-weight: normal;
  }
  .candlestick__plot__candle_shadow {
    stroke: gray;
    stroke-width: 1;
  }
  .candlestick__plot__candle_body {
    stroke: gray;
    stroke-width: 7;
  }
  .candlestick__plot__candle_body_up {
    stroke: green;
  }
  .candlestick__plot__candle_body_down {
    stroke: red;
  }
</style>
```
Таким образом, мы создали компонент Vue который позволяет строить динамически обновляемый график, внешний вид которого может быть настроен с помощью стилей CSS. 
Данный график может быть улучшен путем реализации оси абсцисс d3.scaleBand и динамического изменения ширины тела свечи, добавлением всплывающего поля с данными свечи при наведении на нее мыши, добавлением сетки и т.д. Но данный функционал выходит за рамки данной статьи. Пример реализации на чистом d3.js вы можете посмотреть на сайте [Observable](https://observablehq.com/@d3/candlestick-chart).
