import PageContainer from '@/components/layout/PageContainer'
import { Button, Table, Modal, Form, Input, Spin } from 'ant-design-vue'
import { ColumnsType } from 'ant-design-vue/lib/table'
import { defineComponent } from 'vue'
import { useGroupList, useGroupUpdate, useGroupListColumns } from './hooks'
import './index.less'

export default defineComponent({
  name: 'GroupList',
  setup() {
    const { groupList, getAllGroups, loading, deleteGroup } = useGroupList()
    const {
      infoVisible,
      currentEditRecord,
      handleClickInfo,
      handleResetFields,
      handleUpdateGroupInfo,
      updating,
      validateInfos,
    } = useGroupUpdate()
    const updateGroupInfo = async () => {
      await handleUpdateGroupInfo()
      await getAllGroups()
    }
    const columns = useGroupListColumns({
      onClickInfo: handleClickInfo,
      onClickDelete: deleteGroup,
    })

    return () => {
      return (
        <PageContainer class="group-list" title="分组列表信息">
          <Table
            loading={loading.value}
            size="middle"
            class="group-list__table"
            dataSource={groupList.value}
            columns={columns as ColumnsType}
            rowClassName={(_record, index) =>
              index % 2 === 1 ? 'table-striped' : ''
            }
          />
          <Modal
            v-model={[infoVisible.value, 'visible']}
            title="分组信息"
            confirmLoading={updating.value}
            footer={() => (
              <div>
                <Button onClick={updateGroupInfo} type="primary">
                  确定
                </Button>
                <Button onClick={handleResetFields}>重置</Button>
              </div>
            )}
          >
            <Spin spinning={updating.value}>
              <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                labelAlign="right"
              >
                <Form.Item label="分组名称" {...validateInfos['name']}>
                  <Input
                    allowClear
                    v-model={[currentEditRecord.value.name, 'value']}
                  />
                </Form.Item>
                <Form.Item label="分组描述">
                  <Input
                    allowClear
                    v-model={[currentEditRecord.value.info, 'value']}
                  />
                </Form.Item>
              </Form>
            </Spin>
          </Modal>
        </PageContainer>
        // <div class="group-list">
        //   <div class="group-list__title">分组列表信息</div>
        //   <Table
        //     loading={loading.value}
        //     size="middle"
        //     class="group-list__table"
        //     dataSource={groupList.value}
        //     columns={columns as ColumnsType}
        //     rowClassName={(_record, index) =>
        //       index % 2 === 1 ? 'table-striped' : ''
        //     }
        //   />
        //   <Modal
        //     v-model={[infoVisible.value, 'visible']}
        //     title="分组信息"
        //     confirmLoading={updating.value}
        //     footer={() => (
        //       <div>
        //         <Button onClick={updateGroupInfo} type="primary">
        //           确定
        //         </Button>
        //         <Button onClick={handleResetFields}>重置</Button>
        //       </div>
        //     )}
        //   >
        //     <Spin spinning={updating.value}>
        //       <Form
        //         labelCol={{ span: 4 }}
        //         wrapperCol={{ span: 20 }}
        //         labelAlign="right"
        //       >
        //         <Form.Item label="分组名称" {...validateInfos['name']}>
        //           <Input
        //             allowClear
        //             v-model={[currentEditRecord.value.name, 'value']}
        //           />
        //         </Form.Item>
        //         <Form.Item label="分组描述">
        //           <Input
        //             allowClear
        //             v-model={[currentEditRecord.value.info, 'value']}
        //           />
        //         </Form.Item>
        //       </Form>
        //     </Spin>
        //   </Modal>
        // </div>
      )
    }
  },
})
