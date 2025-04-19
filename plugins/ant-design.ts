// plugins/ant-design.ts

import Antd from 'ant-design-vue'
import * as Icons from '@ant-design/icons-vue'

export default defineNuxtPlugin((nuxtApp) => {
  // Регистрируем иконки
  for (const [name, icon] of Object.entries(Icons)) {
    if (typeof icon === 'object' && 'install' in icon) {
      nuxtApp.vueApp.component(name, icon)
    }
  }

  // Подключаем библиотеку
  nuxtApp.vueApp.use(Antd)
})
