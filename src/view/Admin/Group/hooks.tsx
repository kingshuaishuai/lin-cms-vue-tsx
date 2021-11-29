import AdminModel from '@/model/Admin'
import type {
  AllPermissions,
  PermissionGroupInfo,
  PermissionGroupItem,
  PermissionGroupList,
} from '@/utils/types'
import { Button, message } from 'ant-design-vue'
import { useForm } from 'ant-design-vue/lib/form'
import { ValidationRule } from 'ant-design-vue/lib/form/Form'
import { ColumnsType } from 'ant-design-vue/lib/table'
import { onBeforeMount, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LModal } from '@/components/base/LModel'

export function useGroupList() {
  const loading = ref(false)
  const groupList = ref<PermissionGroupList>()
  async function getAllGroups() {
    try {
      loading.value = true
      groupList.value = await AdminModel.getAllGroups()
      loading.value = false
    } catch (err) {
      loading.value = false
      throw err
    }
  }

  async function deleteGroup(id: number) {
    const deleting = ref(false)
    LModal.confirm({
      content: '此操作将永久删除该分组, 是否继续?',
      onOk: async () => {
        try {
          deleting.value = true
          await AdminModel.deleteOneGroup(id)
          deleting.value = false
          await getAllGroups()
        } catch (err) {
          deleting.value = false
        }
      },
      okButtonProps: {
        loading: deleting.value,
      },
      cancelButtonProps: {
        disabled: deleting.value,
      },
    })
  }

  onBeforeMount(() => {
    getAllGroups()
  })

  return {
    loading,
    groupList,
    getAllGroups,
    deleteGroup,
  }
}

export function useGroupUpdate() {
  let originRecord: PermissionGroupItem
  const infoVisible = ref(false)
  const currentEditRecord = ref<PermissionGroupItem>({
    id: -1,
    name: '',
    info: '',
  })
  const rules: {
    [key: string]: ValidationRule | ValidationRule[]
  } = reactive({
    name: [{ required: true, message: '请输入分组名称', trigger: 'change' }],
  })
  const form = useForm(currentEditRecord, rules)
  const { validateInfos } = form

  const updating = ref(false)

  const handleClickInfo = (record: PermissionGroupItem) => {
    infoVisible.value = true
    originRecord = record
    currentEditRecord.value = {
      ...record,
    }
  }
  const handleResetFields = () => {
    form.resetFields(originRecord)
  }
  const handleUpdateGroupInfo = async () => {
    updating.value = true
    try {
      await form.validate()
      form.clearValidate(['name'])
      const res = await AdminModel.updateOneGroup(currentEditRecord.value)
      message.success(res.message)
      infoVisible.value = false
      updating.value = false
    } catch (err) {
      updating.value = false
      console.error(err)
      throw err
    }
  }

  return {
    infoVisible,
    currentEditRecord,
    validateInfos,
    updating,
    handleClickInfo,
    handleResetFields,
    handleUpdateGroupInfo,
  }
}

export function useGroupListColumns(options: {
  onClickInfo: (record: PermissionGroupItem) => void
  onClickDelete: (id: number) => void
}) {
  const router = useRouter()
  const goToGroupEditPage = (groupId: number) => {
    router.push({ path: '/admin/group/edit', query: { id: groupId } })
  }
  const columns: ColumnsType<PermissionGroupItem> = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '信息',
      dataIndex: 'info',
    },
    {
      title: '操作',
      width: 270,
      customRender(row) {
        return (
          <div>
            <Button
              onClick={() => {
                options.onClickInfo(row.record)
              }}
              class="group-list-ops-btn"
              size="small"
              type="primary"
              ghost
            >
              信息
            </Button>
            <Button
              onClick={() => {
                goToGroupEditPage(row.record.id)
              }}
              class="group-list-ops-btn ant-info-btn"
              size="small"
            >
              权限
            </Button>
            <Button
              onClick={() => options.onClickDelete(row.record.id)}
              class="group-list-ops-btn"
              size="small"
              danger
              ghost
            >
              删除
            </Button>
          </div>
        )
      },
    },
  ]
  return columns
}

export function useUpdatePermission() {
  const route = useRoute()

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

  return {
    selected,
    allPermissions,
    loading,
    handleUpdatePermissions,
  }
}

export function useCreateGroup() {
  const allPermissions = ref<AllPermissions>({})
  const groupInfo = ref<{
    info: string
    name: string
    selected: {
      [key: string]: {
        checkedList: number[]
        checkAll: boolean
        total: number
      }
    }
  }>({
    info: '',
    name: '',
    selected: {},
  })
  const permissionGetting = ref(false)
  onBeforeMount(async () => {
    permissionGetting.value = true
    try {
      const result = await AdminModel.getAllPermissions()
      allPermissions.value = result
      Object.keys(result).map((k) => {
        groupInfo.value.selected[k] = {
          checkAll: false,
          checkedList: [],
          total: result[k].length,
        }
      })
      permissionGetting.value = false
    } catch (err) {
      permissionGetting.value = false
      if (err instanceof Error) {
        message.error(err.message)
      }
    }
  })
  const rules = reactive<{
    [key: string]: ValidationRule | ValidationRule[]
  }>({
    name: [{ required: true, message: '请输入分组名称', trigger: 'change' }],
  })
  const form = useForm(groupInfo, rules)
  const { validateInfos } = form
  const handleReset = () => {
    groupInfo.value.selected = {}
    Object.keys(allPermissions.value).map((k) => {
      groupInfo.value.selected[k] = {
        checkAll: false,
        checkedList: [],
        total: allPermissions.value[k].length,
      }
    })
    groupInfo.value.name = ''
    groupInfo.value.info = ''
    form.resetFields(groupInfo.value)
  }
  const loading = ref(false)
  const handleCreateGroup = async () => {
    loading.value = true
    try {
      await form.validate()
      const { name, info, selected } = groupInfo.value
      const result = await AdminModel.createOneGroup({
        name,
        info,
        permission_ids: Object.values(selected)
          .map((item) => item.checkedList)
          .flat(),
      })
      message.success(result.message)
      loading.value = false
    } catch (err) {
      loading.value = false
    }
  }
  return {
    groupInfo,
    allPermissions,
    permissionGetting,
    loading,
    validateInfos,
    handleReset,
    handleCreateGroup,
  }
}
