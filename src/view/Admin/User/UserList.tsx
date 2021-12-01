import { LModal } from '@/components/base/LModel'
import PageContainer from '@/components/layout/PageContainer'
import { tableStriped } from '@/utils/utils'
import {
  Table,
  TableColumnsType,
  Select,
  Modal,
  Form,
  Input,
  Checkbox,
  Tabs,
  Button,
  Space,
  Spin,
} from 'ant-design-vue'
import { CheckboxOptionType } from 'ant-design-vue/lib/checkbox/Group'
import { defineComponent } from 'vue'
import { useUserList, useUserListColumns, useUserEditModal } from './hooks'
import './index.less'

export default defineComponent({
  name: 'UserList',
  setup() {
    const {
      loading,
      tableData,
      selectGroupId,
      groupOptions,
      getUsers,
      deleteUser,
    } = useUserList()

    const {
      // about modal visible
      infoVisible,
      updating,
      handleEdit,
      // about user info form
      userBaseInfo,
      userInfoForm,
      handleResetUserInfoFrom,
      handleUpdateUserInfo,
      // about password form
      passwordModel,
      passwordForm,
      handleResetPasswordForm,
      handleChangePassword,
    } = useUserEditModal()

    const columns = useUserListColumns({
      onEdit: handleEdit,
      onDelete: (record) => {
        LModal.confirm({
          content: '此操作将永久删除该用户, 是否继续?',
          onOk: () => {
            deleteUser(record)
          },
        })
      },
    })

    return () => {
      return (
        <PageContainer
          title={() => (
            <div class="user-list__title">
              <span>用户列表</span>
              <Select
                v-model={[selectGroupId.value, 'value']}
                style={{ width: '200px' }}
                options={groupOptions.value || []}
                showSearch
                allowClear
                filterOption={(input, option) => {
                  return (option?.label as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }}
                placeholder="请选择分组"
                onChange={() => {
                  getUsers({
                    count: tableData.value.count,
                    page: 0,
                    group_id: selectGroupId.value,
                  })
                }}
              />
            </div>
          )}
        >
          <Table
            loading={loading.value}
            size="middle"
            class="bordered-ant-table"
            rowClassName={tableStriped}
            dataSource={tableData.value.items}
            columns={columns as TableColumnsType}
            onChange={(pagination) => {
              getUsers({
                page:
                  typeof pagination.current === 'number'
                    ? pagination.current - 1
                    : 0,
                count: tableData.value.count,
                group_id: selectGroupId.value,
              })
            }}
            pagination={{
              total: tableData.value.total,
              pageSize: tableData.value.count,
              current: tableData.value.page + 1,
            }}
          ></Table>
          <Modal
            wrapClassName="user-list__update-model"
            v-model={[infoVisible.value, 'visible']}
            title="用户信息"
            footer=""
            confirmLoading={true}
          >
            <Spin spinning={updating.value}>
              <Tabs>
                <Tabs.TabPane key="CHANG_INFO" tab="修改信息">
                  <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    colon={false}
                  >
                    <Form.Item label="用户名">
                      <Input
                        disabled
                        v-model={[userBaseInfo.value.username, 'value']}
                      />
                    </Form.Item>
                    <Form.Item
                      label="邮箱"
                      {...userInfoForm.validateInfos['email']}
                    >
                      <Input v-model={[userBaseInfo.value.email, 'value']} />
                    </Form.Item>
                    <Form.Item label="选择分组">
                      <Checkbox.Group
                        class="permission-group-checkbox-group"
                        options={groupOptions.value as CheckboxOptionType[]}
                        v-model={[userBaseInfo.value.group_ids, 'value']}
                      ></Checkbox.Group>
                    </Form.Item>
                    <Form.Item label=" ">
                      <Space>
                        <Button
                          onClick={async () => {
                            await handleUpdateUserInfo()
                            getUsers({
                              count: tableData.value.count,
                              page: tableData.value.page,
                              group_id: selectGroupId.value,
                            })
                          }}
                          type="primary"
                        >
                          确定
                        </Button>
                        <Button onClick={handleResetUserInfoFrom}>重置</Button>
                      </Space>
                    </Form.Item>
                  </Form>
                </Tabs.TabPane>
                <Tabs.TabPane key="CHANGE_PASS" tab="修改密码">
                  <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    colon={false}
                  >
                    <Form.Item
                      label="密码"
                      {...passwordForm.validateInfos['new_password']}
                    >
                      <Input.Password
                        v-model={[passwordModel.value.new_password, 'value']}
                      />
                    </Form.Item>
                    <Form.Item
                      label="确认密码"
                      {...passwordForm.validateInfos['confirm_password']}
                    >
                      <Input.Password
                        v-model={[
                          passwordModel.value.confirm_password,
                          'value',
                        ]}
                      />
                    </Form.Item>
                    <Form.Item label=" ">
                      <Space>
                        <Button type="primary" onClick={handleChangePassword}>
                          确定
                        </Button>
                        <Button onClick={handleResetPasswordForm}>重置</Button>
                      </Space>
                    </Form.Item>
                  </Form>
                </Tabs.TabPane>
              </Tabs>
            </Spin>
          </Modal>
        </PageContainer>
      )
    }
  },
})
