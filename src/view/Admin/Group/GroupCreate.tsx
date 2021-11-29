import PageContainer from '@/components/layout/PageContainer'
import AdminModel from '@/model/Admin'
import { AllPermissions } from '@/utils/types'
import { Form, Input, Button, message, Spin } from 'ant-design-vue'
import { useForm } from 'ant-design-vue/lib/form'
import { ValidationRule } from 'ant-design-vue/lib/form/Form'
import { defineComponent, onBeforeMount, reactive, ref } from 'vue'
import GroupPermission from './GroupPermission'
import { useCreateGroup } from './hooks'

export default defineComponent({
  name: 'GroupCreate',
  setup() {
    const {
      groupInfo,
      loading,
      permissionGetting,
      validateInfos,
      allPermissions,
      handleReset,
      handleCreateGroup,
    } = useCreateGroup()
    return () => {
      return (
        <PageContainer class="group-create" title="新建分组信息">
          <Spin spinning={loading.value}>
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              colon={false}
              class="group-create__form"
            >
              <Form.Item label="分组名称" {...validateInfos['name']}>
                <Input v-model={[groupInfo.value.name, 'value']}></Input>
              </Form.Item>
              <Form.Item label="分组描述">
                <Input v-model={[groupInfo.value.info, 'value']}></Input>
              </Form.Item>
              <Form.Item label="分配权限">
                <GroupPermission
                  selected={groupInfo.value.selected}
                  allPermissions={allPermissions.value}
                  loading={permissionGetting.value}
                />
              </Form.Item>
              <Form.Item label=" ">
                <Button onClick={handleCreateGroup} type="primary">
                  保存
                </Button>
                <Button onClick={handleReset} style={{ marginLeft: '10px' }}>
                  重置
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </PageContainer>
      )
    }
  },
})
