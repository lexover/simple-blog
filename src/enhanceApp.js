import ElementUI from 'element-ui'
import Translation from '@theme/plugins/Translation'
import VueHightlightJS from 'vue-highlightjs'
import { BootstrapVue } from 'bootstrap-vue'
import 'element-ui/lib/theme-chalk/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'highlight.js/styles/default.css'
import sql from 'highlight.js/lib/languages/sql'
import python from 'highlight.js/lib/languages/python'

export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData, // site metadata
}) => {
  Vue.use(ElementUI)
  Vue.use(Translation)
  Vue.use(BootstrapVue)
  Vue.use(VueHightlightJS, {
    languages: {
      sql,
      python,
    }
  })
}
