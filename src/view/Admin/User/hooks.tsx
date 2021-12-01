import { computed, onBeforeMount, reactive, Ref, ref } from 'vue'
import { message, TableColumnsType, Space, Button } from 'ant-design-vue'
import { useForm } from 'ant-design-vue/lib/form'
import { ValidationRule } from 'ant-design-vue/lib/form/Form'
import { CheckboxOptionType } from 'ant-design-vue/lib/checkbox/Group'
import AdminModel from '@/model/Admin'
import UserModel from '@/model/User'
import { CreateUserInfo, TablePage, UserListItem } from '@/utils/types'
import { OptionData } from 'ant-design-vue/lib/vc-select/interface'

export function useValidatePasswordRules(firstPassword: Ref<string>) {
  const validatePassword = async (rule: any, value: string) => {
    if (!value) {
      return Promise.reject('请输入密码')
    } else if (value.length < 6) {
      return Promise.reject('密码长度不能少于6位数')
    } else {
      return Promise.resolve()
    }
  }
  const validateConfirmPassword = async (rule: any, value: string) => {
    if (!value) {
      return Promise.reject('请再次输入密码')
    } else if (value !== firstPassword.value) {
      return Promise.reject('两次输入密码不一致!')
    } else {
      return Promise.resolve()
    }
  }
  return {
    validatePassword,
    validateConfirmPassword,
  }
}
export function useCreateUserRules(userInfo: Ref<CreateUserInfo>) {
  const password = computed(() => userInfo.value.password)
  const { validatePassword, validateConfirmPassword } =
    useValidatePasswordRules(password)
  const rules = reactive<{
    [key: string]: ValidationRule | ValidationRule[]
  }>({
    username: [
      {
        required: true,
        message: '用户名不能为空',
        trigger: 'change',
      },
    ],
    email: [
      {
        type: 'email',
        message: '请输入正确的邮箱地址或者不填',
        trigger: 'change',
      },
    ],
    password: [
      {
        required: true,
        validator: validatePassword,
        trigger: 'change',
      },
    ],
    confirm_password: [
      {
        required: true,
        validator: validateConfirmPassword,
        trigger: 'change',
      },
    ],
  })
  return {
    rules,
    validatePassword,
  }
}

function useCreateUserGroupOptions() {
  const groupOptions = ref<CheckboxOptionType[]>()
  onBeforeMount(async () => {
    try {
      const groups = await AdminModel.getAllGroups()
      const result = groups.map((item) => ({
        label: item.name,
        value: item.id,
      }))
      groupOptions.value = result
    } catch (err) {}
  })
  return groupOptions
}

export function useCreateUserForm() {
  const userInfo = ref<CreateUserInfo>({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    group_ids: [],
  })
  const { rules } = useCreateUserRules(userInfo)

  const groupOptions = useCreateUserGroupOptions()

  const form = useForm(userInfo, rules, {
    debounce: {
      wait: 0,
      leading: true,
    },
  })
  const { validateInfos } = form
  const handleReset = () => {
    form.resetFields({
      username: '',
      email: '',
      password: '',
      confirm_password: '',
      group_ids: [],
    })
  }
  const loading = ref(false)
  const handleCreateUser = async () => {
    loading.value = true
    try {
      await form.validate()
      const res = await UserModel.register(userInfo.value)
      message.success(res.message)
      handleReset()
      loading.value = false
    } catch (err: any) {
      console.log('err:', err)
      loading.value = false
      if (err?.message) {
        message.error(err.message)
      }
    }
  }
  return {
    userInfo,
    groupOptions,
    validateInfos,
    loading,
    handleReset,
    handleCreateUser,
  }
}

export function useUserListColumns(options: {
  onEdit?: (record: UserListItem) => void
  onDelete?: (record: UserListItem) => void
}) {
  const columns: TableColumnsType<UserListItem> = [
    {
      title: '名称',
      dataIndex: 'username',
    },
    {
      title: '所属分组',
      customRender(row) {
        const { record } = row
        const data = record.groups.map((item) => item.name).join(',')
        return data
      },
    },
    {
      title: '操作',
      width: 275,
      customRender(row) {
        const { record } = row
        return (
          <Space>
            <Button
              type="primary"
              ghost
              onClick={() => {
                options.onEdit?.(record)
              }}
              size="small"
            >
              编辑
            </Button>
            <Button
              onClick={() => {
                options.onDelete?.(record)
              }}
              danger
              size="small"
            >
              删除
            </Button>
          </Space>
        )
      },
    },
  ]
  return columns
}

export function useUserList() {
  const loading = ref(false)
  const tableData = ref<TablePage<UserListItem>>({
    count: 10,
    page: 0,
    total: 0,
    items: [],
  })
  const selectGroupId = ref<number>()
  const groupOptions = ref<OptionData[]>()

  const getUsers = async (params: {
    count?: number
    page?: number
    group_id?: number
  }) => {
    loading.value = true
    try {
      let result = await AdminModel.getUsers(params)
      if (result.items.length === 0 && result.page > 0) {
        result = await AdminModel.getUsers({
          ...params,
          page: result.page - 1,
        })
      }
      tableData.value = result
      loading.value = false
    } catch (err) {
      loading.value = false
    }
  }

  const getAllGroup = async () => {
    const result = await AdminModel.getAllGroups()
    const options = result.map((item) => ({
      label: item.name,
      value: item.id,
    }))
    groupOptions.value = options
  }

  onBeforeMount(() => {
    getUsers({
      page: tableData.value.page,
      count: tableData.value.count,
      group_id: selectGroupId.value,
    })
    getAllGroup()
  })

  const deleteUser = async (record: UserListItem) => {
    loading.value = true
    try {
      await AdminModel.deleteOneUser(record.id)
      await getUsers({
        page: tableData.value.page,
        count: tableData.value.count,
        group_id: selectGroupId.value,
      })
      loading.value = false
    } catch (err) {
      loading.value = false
    }
  }

  return {
    loading,
    tableData,
    selectGroupId,
    groupOptions,
    getUsers,
    deleteUser,
  }
}

export function useUserEditModal() {
  const infoVisible = ref(false)
  const updating = ref(false)
  // set currentEditUserInfoCache
  let currentEditUserInfoCache: UserListItem
  const handleEdit = (record: UserListItem) => {
    currentEditUserInfoCache = record
    infoVisible.value = true
    userBaseInfo.value = {
      username: record.username,
      email: record.email || '',
      group_ids: record.groups.map((item) => item.id),
    }
  }

  // user info form
  const userBaseInfo = ref<{
    username: string
    email: string
    group_ids: number[]
  }>({
    username: '',
    email: '',
    group_ids: [],
  })
  const userInfoRules: {
    [key: string]: ValidationRule | ValidationRule[]
  } = reactive({
    email: [
      {
        type: 'email',
        message: '请输入正确的邮箱地址或者不填',
        trigger: 'change',
      },
    ],
  })
  const userInfoForm = useForm(userBaseInfo, userInfoRules)
  const handleUpdateUserInfo = async () => {
    updating.value = true
    try {
      await userInfoForm.validate()
      const res = await AdminModel.updateOneUser(currentEditUserInfoCache.id, {
        email: userBaseInfo.value.email,
        group_ids: userBaseInfo.value.group_ids,
      })
      updating.value = false
      infoVisible.value = false
      message.success(res.message)
    } catch (err) {
      updating.value = false
      throw err
    }
  }
  const handleResetUserInfoFrom = () => {
    userInfoForm.resetFields({
      username: currentEditUserInfoCache?.username || '',
      email: currentEditUserInfoCache?.email || '',
      groups: [...currentEditUserInfoCache?.groups],
    })
  }

  // password form
  const passwordModel = ref({
    new_password: '',
    confirm_password: '',
  })
  const password = computed(() => passwordModel.value.new_password)
  const { validatePassword, validateConfirmPassword } =
    useValidatePasswordRules(password)
  const passwordRules: {
    [key: string]: ValidationRule | ValidationRule[]
  } = {
    new_password: [
      {
        required: true,
        validator: validatePassword,
        trigger: 'change',
      },
    ],
    confirm_password: [
      {
        required: true,
        validator: validateConfirmPassword,
        trigger: 'change',
      },
    ],
  }
  const passwordForm = useForm(passwordModel, passwordRules)

  const handleResetPasswordForm = () => {
    passwordForm.resetFields({
      new_password: '',
      confirm_password: '',
    })
  }

  const handleChangePassword = async () => {
    updating.value = true
    try {
      await passwordForm.validate()
      const res = await AdminModel.changePassword(
        currentEditUserInfoCache.id,
        passwordModel.value,
      )
      message.success(res.message)
      updating.value = false
      infoVisible.value = false
    } catch (err) {
      updating.value = false
    }
  }

  return {
    infoVisible,
    updating,
    handleEdit,
    userBaseInfo,
    userInfoForm,
    handleResetUserInfoFrom,
    handleUpdateUserInfo,
    passwordModel,
    passwordForm,
    handleResetPasswordForm,
    handleChangePassword,
  }
}
