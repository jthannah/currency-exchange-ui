import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { inspect } from '@xstate/inspect'
import Toast, { TYPE } from 'vue-toastification'
import { PluginOptions } from 'vue-toastification/dist/types/types'
import 'vue-toastification/dist/index.css'
import './assets/fonts/inter.css'
import './assets/css/tailwind.css'

// TODO: disable this for production mode
inspect({
  // Open xstate visualizer in a new tab
  iframe: false,
})

const options: PluginOptions = {
  timeout: 5000,
  hideProgressBar: true,
  transition: 'Vue-Toastification__fade',
  toastDefaults: {
    [TYPE.SUCCESS]: {
      toastClassName: 'bg-green-500',
    },
    [TYPE.ERROR]: {
      toastClassName: 'bg-red-600',
    },
    [TYPE.INFO]: {
      toastClassName: 'bg-blue-500',
    },
  },
}

createApp(App).use(router).use(Toast, options).mount('#app')
