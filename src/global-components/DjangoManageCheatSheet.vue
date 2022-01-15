<template>
    <div>
      <b-form-select v-model="selected" :options="sections"/>
      <table>
        <colgroup>
          <col style="width: 50%">
          <col style="width: 50%">
        </colgroup>
        <thead>
          <th v-for="col in columns" :key="col"> 
              {{ col }}
          </th>
        </thead>
        <tbody>
            <template v-for="(item, index) in filtered">
                <tr :key="`item-${index}`">
                    <td colspan="2" class="subtitle">{{ item.title }}</td>
                </tr>
                <template v-for="(row, i) in item.rows">
                  <tr :key="`row-${index}-${i}`">
                    <td class="description">
                      {{ row.description }}
                      <span v-if="row.info">
                        <i class="info el-icon-info" v-b-tooltip.hover.topright.html :title="row.info"/>
                      </span>
                    </td>
                    <td>
                      <pre v-highlightjs="row.command" class='table-code'><code class="shell"></code></pre>
                    </td>
                  </tr>
                </template>
            </template>
        </tbody>
      </table>
    </div>
</template>

<script>
import { CONTENT } from '../cheat-sheets/django-manage-cheat-sheet'

export default {
  name: "DjangoManageCheatSheet",
  data () {
    return {
      columns: ['Описание', 'Команда'],
      content: CONTENT,
      selected: null,
    }
  },
  computed: {
    sections() {
      let i = 0
      const sections = this.content.map((x) => { return {value: i++, text: x.title}; })
      return [{value: null, text: 'Все'}, ...sections]
    },
    filtered() {
      if (this.selected === null) {
        return this.content
      } else {
        return [this.content[parseInt(this.selected)]]
      }
    }
  },
}
</script>

<style>
    .custom-select:focus {
      border-color: #877865;
      box-shadow: 0 0 0 .2rem rgba(135,120,101,.25);
    }
    .arrow::before {
      border-top-color: #877865;
    }
    .tooltip-inner {
      max-width: 350px;
      background-color: #877865;
    }
</style>

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
        background: #877865;
        color: white;
    }
    .subtitle {
        background-color: #b1aaa1;
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
    .info {
      cursor: pointer;
    }
</style>