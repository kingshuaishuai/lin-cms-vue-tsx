import { defineComponent, ref } from 'vue'
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import './App.less'
import { RouterView } from 'vue-router'

const locales = {
  zhCN,
}

export default defineComponent({
  name: 'App',
  mounted() {
    document.getElementById('loader')!.style.display = 'none'
  },
  setup() {
    const locale = ref<keyof typeof locales>('zhCN')
    return () => (
      <ConfigProvider locale={locales[locale.value]}>
        <RouterView></RouterView>
      </ConfigProvider>
    )
  },
})
