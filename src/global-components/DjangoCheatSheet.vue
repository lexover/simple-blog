<template>
    <div>
      <table class="table-sticky-header">
        <colgroup>
          <col style="width: 30%">
          <col style="width: 35%">
          <col style="width: 35%">
        </colgroup>
        <thead>
          <th v-for="col in columns" :key="col.id" class="sticky-header"> 
              {{ col }}
          </th>
        </thead>
        <tbody>
            <template v-for="(item, index) in content">
                <tr :key="`item-${index}`">
                    <td colspan="3" class="subtitle">{{ item.title }}</td>
                </tr>
                <template v-for="(row, i) in item.rows">
                  <tr :key="`row-${i}`">
                    <td class="description">
                      {{ row.description }}
                    </td>
                    <td>
                      <pre v-highlightjs class='table-code'><code class="sql">{{ row.sql }}</code></pre>
                    </td>
                    <td>
                      <pre v-highlightjs class='table-code'><code class="python">{{ row.django }}</code></pre>
                    </td>
                  </tr>
                </template>
            </template>
        </tbody>
      </table>
    </div>
</template>

<script>
import { CONTENT } from '../cheat-sheets/django-orm-cheat-sheet'

export default {
  name: "table",
  data () {
    return {
      columns: ['Описание', 'SQL', 'Django'],
      content: CONTENT,
    }
  }
}
</script>

<style scoped>
    pre.table-code {
        padding: 0;
        margin: 0;
        background-color: transparent;
        font-size: 0.75em;
    }
    pre code {
        color: #877865;
        text-shadow: none;
    }
    td {
        vertical-align: top;
        border: none;
        background-color: white;
    }
    th {
        border: none;
    }
    .subtitle {
        background-color: #877865;
        color: white;
        font-size: 0.8em;
        font-weight: 600;
    }
    .description {
        background-color: #f6f8fa;
        color: #877865;
        font-size: .8em;
        font-weight: 600;
        word-wrap: normal;
    }
</style>