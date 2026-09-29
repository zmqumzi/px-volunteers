import DefaultTheme from 'vitepress/theme-without-fonts'
import Layout from './Layout.vue'
import HomePage from './components/HomePage.vue'
import TrainingIndex from './components/TrainingIndex.vue'
import ResourceList from './components/ResourceList.vue'
import AboutPage from './components/AboutPage.vue'
import DownloadLink from './components/DownloadLink.vue'
import ServiceFlow from './components/ServiceFlow.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
    app.component('TrainingIndex', TrainingIndex)
    app.component('ResourceList', ResourceList)
    app.component('AboutPage', AboutPage)
    app.component('DownloadLink', DownloadLink)
    app.component('ServiceFlow', ServiceFlow)
  }
}
