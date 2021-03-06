import PageContainer from '@/components/layout/PageContainer'
import { Button, Space } from 'ant-design-vue'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import GroupPermission from './GroupPermission'
import { useUpdatePermission } from './hooks'
import './index.less'

export default defineComponent({
  name: 'GroupEdit',
  setup() {
    const { selected, allPermissions, loading, handleUpdatePermissions } =
      useUpdatePermission()
    const router = useRouter()
    return () => {
      return (
        <PageContainer title="编辑分组权限">
          <GroupPermission
            selected={selected.value}
            allPermissions={{ ...allPermissions.value }}
            loading={loading.value}
          />
          <div
            style={{
              marginTop: '30px',
            }}
          >
            <Space>
              <Button
                loading={loading.value}
                onClick={handleUpdatePermissions}
                type="primary"
              >
                确定
              </Button>
              <Button
                onClick={() => {
                  router.push({
                    path: '/admin/group/list',
                  })
                }}
                disabled={loading.value}
              >
                返回
              </Button>
            </Space>
          </div>
        </PageContainer>
      )
    }
  },
})
