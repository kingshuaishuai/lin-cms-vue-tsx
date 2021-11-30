import PageContainer from '@/components/layout/PageContainer'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UserList',
  setup() {
    return () => {
      return <PageContainer title="用户列表"></PageContainer>
    }
  },
})
