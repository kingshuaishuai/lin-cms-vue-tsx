import AdminModel from '@/model/Admin'
import type { PermissionGroupItem, PermissionGroupList } from '@/utils/types'
import { Button, message, Modal } from 'ant-design-vue'
import { ExclamationCircleFilled } from '@ant-design/icons-vue'
import { useForm } from 'ant-design-vue/lib/form'
import { ValidationRule } from 'ant-design-vue/lib/form/Form'
import { ColumnsType } from 'ant-design-vue/lib/table'
import { onBeforeMount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
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
