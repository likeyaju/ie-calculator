import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import HomePage from './pages/HomePage.vue'
import EfficiencyPage from './pages/EfficiencyPage.vue'
import BottleneckCTPage from './pages/BottleneckCTPage.vue'
import StopwatchPage from './pages/StopwatchPage.vue'
import EnhancedCalculatorPage from './pages/EnhancedCalculatorPage.vue'
import AverageSumPage from './pages/AverageSumPage.vue'
import TimeToolsPage from './pages/TimeToolsPage.vue'
import TimeConversionPage from './pages/TimeConversionPage.vue'
import TimeDifferencePage from './pages/TimeDifferencePage.vue'
import SettingsPage from './pages/SettingsPage.vue'
import WorkSchedulePage from './pages/WorkSchedulePage.vue'
import TimeAddSubtractPage from './pages/TimeAddSubtractPage.vue'
import ProductionToolsPage from './pages/ProductionToolsPage.vue'
import CtToolsPage from './pages/CtToolsPage.vue'
import TargetOutputPage from './pages/TargetOutputPage.vue'
import TheoreticalPeoplePage from './pages/TheoreticalPeoplePage.vue'
import AchievementRatePage from './pages/AchievementRatePage.vue'
import CtCapacityPage from './pages/CtCapacityPage.vue'
import TaktTimePage from './pages/TaktTimePage.vue'
import LineBalancePage from './pages/LineBalancePage.vue'
import { ONLINE_ACCESS_REQUIRED, ONLINE_ACCESS_TOKEN } from './app/appConfig'
import './styles/tokens.css'
import './styles/global.css'
import './styles/responsive.css'
import './styles/bottleneck.css'
import './styles/bottleneck-result.css'
import './styles/stopwatch.css'
import './styles/stopwatch-state.css'
import './styles/stopwatch-return.css'
import './styles/enhanced-calculator.css'
import './styles/calculator-scroll-fix.css'
import './styles/calculator-mobile-controls.css'
import './styles/calculator-one-screen.css'
import './styles/calculator-control-rail.css'
import './styles/average-sum.css'
import './styles/average-input-behavior.css'
import './styles/average-smooth-scroll.css'
import './styles/average-add-area.css'
import './styles/time-tools.css'
import './styles/time-difference.css'
import './styles/settings.css'
import './styles/time-add-subtract.css'
import './styles/business-calculators.css'
import './styles/preferences.css'
import './styles/bottleneck-help.css'
import './styles/calculator-history-actions.css'
import './styles/release-access.css'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: HomePage, meta: { titleKey: 'app.title' } },
    { path: '/efficiency', component: EfficiencyPage, meta: { titleKey: 'efficiency.title' } },
    { path: '/production-tools', component: ProductionToolsPage, meta: { titleKey: 'productionTools.title' } },
    { path: '/target-output', component: TargetOutputPage, meta: { titleKey: 'targetOutput.title' } },
    { path: '/theoretical-people', component: TheoreticalPeoplePage, meta: { titleKey: 'theoreticalPeople.title' } },
    { path: '/achievement-rate', component: AchievementRatePage, meta: { titleKey: 'achievement.title' } },
    { path: '/ct-tools', component: CtToolsPage, meta: { titleKey: 'ctTools.title' } },
    { path: '/ct-capacity', component: CtCapacityPage, meta: { titleKey: 'ctCapacity.title' } },
    { path: '/takt-time', component: TaktTimePage, meta: { titleKey: 'taktTime.title' } },
    { path: '/line-balance', component: LineBalancePage, meta: { titleKey: 'lineBalance.title' } },
    { path: '/bottleneck-ct', component: BottleneckCTPage, meta: { titleKey: 'bottleneck.title' } },
    { path: '/stopwatch', component: StopwatchPage, meta: { titleKey: 'stopwatch.title' } },
    { path: '/enhanced-calculator', component: EnhancedCalculatorPage, meta: { titleKey: 'calculator.title' } },
    { path: '/average-sum', component: AverageSumPage, meta: { titleKey: 'average.title' } },
    { path: '/time-tools', component: TimeToolsPage, meta: { titleKey: 'timeTools.title' } },
    { path: '/time-conversion', component: TimeConversionPage, meta: { titleKey: 'timeConvert.title' } },
    { path: '/time-difference', component: TimeDifferencePage, meta: { titleKey: 'timeDifference.title' } },
    { path: '/settings', component: SettingsPage, meta: { titleKey: 'settings.title' } },
    { path: '/settings/work-schedule', component: WorkSchedulePage, meta: { titleKey: 'settings.modifyTitle' } },
    { path: '/time-add-subtract', component: TimeAddSubtractPage, meta: { titleKey: 'timeAdd.title' } },
  ],
  scrollBehavior: (_to, _from, savedPosition) => savedPosition ?? ({ top: 0 })
})

const accessAllowed = !ONLINE_ACCESS_REQUIRED || new URLSearchParams(window.location.search).get('access') === ONLINE_ACCESS_TOKEN
if (accessAllowed) createApp(App).use(router).mount('#app')
else {
  document.title = 'IE计算器'
  const root = document.querySelector('#app')
  if (root) root.innerHTML = '<main class="access-denied" role="alert"><strong>当前访问链接已失效，请获取新的二维码。</strong></main>'
}
