import PageContainer from '@/components/layout/PageContainer'
import AdminModel from '@/model/Admin'
import { AllPermissions, PermissionGroupInfo } from '@/utils/types'
import { Button, Checkbox, message, Spin } from 'ant-design-vue'
import { CheckboxOptionType } from 'ant-design-vue/es/checkbox/Group'
import { defineComponent, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import './index.less'

export default defineComponent({
  name: 'GroupEdit',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const allPermissions = ref<AllPermissions>({})
    const groupInfo = ref<PermissionGroupInfo>()
    const loading = ref(false)
    const selected = ref<{
      [key: string]: {
        checkedList: number[]
        checkAll: boolean
        total: number
      }
    }>({})
    const handleUpdatePermissions = async () => {
      const currentPermissions = Object.values(selected.value)
        .map((item) => item.checkedList)
        .flat()
      const addPermissions = currentPermissions.filter(
        (item) => !permissionsCache.includes(item),
      )
      const deletedPermissions = permissionsCache.filter(
        (item) => !currentPermissions.includes(item),
      )
      loading.value = true
      try {
        if (addPermissions.length > 0) {
          await AdminModel.dispatchPermissions({
            group_id: groupInfo.value!.id,
            permission_ids: addPermissions,
          })
        }
        if (deletedPermissions.length > 0) {
          await AdminModel.removePermissions({
            group_id: groupInfo.value!.id,
            permission_ids: deletedPermissions,
          })
        }
        message.success('权限修改成功')
        permissionsCache = currentPermissions
        loading.value = false
      } catch (err) {
        loading.value = false
      }
    }
    let permissionsCache: number[] = []
    onBeforeMount(async () => {
      loading.value = true
      try {
        const result = await Promise.all([
          AdminModel.getAllPermissions(),
          AdminModel.getOneGroup(route.query['id'] as string),
        ])
        allPermissions.value = result[0]
        groupInfo.value = result[1]
        selected.value = {}
        permissionsCache = []
        Object.keys(result[0]).map((k) => {
          selected.value[k] = {
            checkAll: false,
            checkedList: [],
            total: result[0][k].length,
          }
        })
        result[1].permissions.forEach((item) => {
          permissionsCache.push(item.id)
          selected.value[item.module].checkedList.push(item.id)
        })
        loading.value = false
      } catch (err) {
        loading.value = false
      }
    })
    return () => {
      return (
        <PageContainer title="编辑分组权限">
          <Spin spinning={loading.value}>
            {Object.entries(allPermissions.value).map(
              ([moduleName, module]) => {
                const options: CheckboxOptionType[] = module.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))
                const moduleSelected = selected.value[moduleName]
                moduleSelected.checkAll =
                  moduleSelected.checkedList.length === moduleSelected.total
                return (
                  <div class="permission-module">
                    <div class="permission-module__title">
                      <Checkbox
                        indeterminate={
                          moduleSelected.checkedList.length > 0 &&
                          moduleSelected.checkedList.length !==
                            moduleSelected.total
                        }
                        v-model={[moduleSelected.checkAll, 'checked']}
                        onChange={(e) => {
                          if (
                            moduleSelected.checkedList.length <
                            moduleSelected.total
                          ) {
                            moduleSelected.checkedList = module.map(
                              (item) => item.id,
                            )
                          } else {
                            moduleSelected.checkedList = []
                          }
                        }}
                      >
                        {moduleName}
                      </Checkbox>
                    </div>
                    <div class="permission-module__list">
                      <Checkbox.Group
                        v-model={[moduleSelected.checkedList, 'value']}
                        options={options}
                      ></Checkbox.Group>
                    </div>
                  </div>
                )
              },
            )}
          </Spin>
          <div
            style={{
              marginTop: '30px',
            }}
          >
            <Button
              loading={loading.value}
              onClick={handleUpdatePermissions}
              type="primary"
            >
              确定
            </Button>
            <Button
              style={{
                marginLeft: '12px',
              }}
              onClick={() => {
                router.push({
                  path: '/admin/group/list',
                })
              }}
              disabled={loading.value}
            >
              返回
            </Button>
          </div>
        </PageContainer>
      )
    }
  },
})
