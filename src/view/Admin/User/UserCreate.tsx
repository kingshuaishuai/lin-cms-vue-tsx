import PageContainer from '@/components/layout/PageContainer'
import { defineComponent } from 'vue'
import { Checkbox, Form, Input, Button, Spin, Space } from 'ant-design-vue'
import { useCreateUserForm } from './hooks'
import './index.less'

export default defineComponent({
  name: 'UserCreate',
  setup() {
    const {
      loading,
      userInfo,
      validateInfos,
      handleReset,
      handleCreateUser,
      groupOptions,
    } = useCreateUserForm()
    return () => (
      <PageContainer class="user-create" title="新建用户">
        <Spin spinning={loading.value}>
          <Form
            class="user-create__form"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            colon={false}
          >
            <Form.Item label="用户名" {...validateInfos['username']}>
              <Input v-model={[userInfo.value.username, 'value']} />
            </Form.Item>
            <Form.Item label="邮箱" {...validateInfos['email']}>
              <Input v-model={[userInfo.value.email, 'value']} />
            </Form.Item>
            <Form.Item label="密码" {...validateInfos['password']}>
              <Input.Password
                v-model={[userInfo.value.password, 'value']}
                {...{ autocomplete: 'new-password' }}
              />
            </Form.Item>
            <Form.Item label="确认密码" {...validateInfos['confirm_password']}>
              <Input.Password
                v-model={[userInfo.value.confirm_password, 'value']}
              />
            </Form.Item>
            <Form.Item label="选择分组">
              <Checkbox.Group
                class="permission-group-checkbox-group"
                v-model={[userInfo.value.group_ids, 'value']}
                options={groupOptions.value || []}
              ></Checkbox.Group>
            </Form.Item>
            <Form.Item label=" ">
              <Space>
                <Button onClick={handleCreateUser} type="primary">
                  保存
                </Button>
                <Button onClick={handleReset}>重置</Button>
              </Space>
            </Form.Item>
          </Form>
        </Spin>
      </PageContainer>
    )
  },
})
