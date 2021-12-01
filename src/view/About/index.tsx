import PageContainer from '@/components/layout/PageContainer'
import { Layout } from 'ant-design-vue'
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'About',
  setup() {
    return () => {
      return <PageContainer title="林间有风"></PageContainer>
    }
  },
})
