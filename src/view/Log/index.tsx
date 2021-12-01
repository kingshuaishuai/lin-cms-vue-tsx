import PageContainer from '@/components/layout/PageContainer'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Log',
  setup() {
    return () => {
      return <PageContainer title="日志管理"></PageContainer>
    }
  },
})
