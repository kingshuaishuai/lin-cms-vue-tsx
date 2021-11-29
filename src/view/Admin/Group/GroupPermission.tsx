import type { AllPermissions } from '@/utils/types'
import { Checkbox, Spin } from 'ant-design-vue'
import { CheckboxOptionType } from 'ant-design-vue/es/checkbox/Group'
import { defineComponent, PropType } from 'vue'

export interface SelectedPermission {
  [key: string]: {
    checkedList: number[]
    checkAll: boolean
    total: number
  }
}

export default defineComponent({
  name: 'GroupPermission',
  props: {
    selected: {
      type: Object as PropType<SelectedPermission>,
      default: () => ({}),
    },
    loading: Boolean,
    allPermissions: {
      type: Object as PropType<AllPermissions>,
      default: () => ({}),
    },
  },
  setup(props) {
    return () => {
      const selected = props.selected
      return (
        <Spin spinning={props.loading}>
          {Object.entries(props.allPermissions).map(([moduleName, module]) => {
            const options: CheckboxOptionType[] = module.map((item) => ({
              label: item.name,
              value: item.id,
            }))
            const moduleSelected = selected[moduleName]
            if (!moduleSelected) return null
            moduleSelected.checkAll =
              moduleSelected.checkedList.length === moduleSelected.total
            return (
              <div class="permission-module">
                <div class="permission-module__title">
                  <Checkbox
                    indeterminate={
                      moduleSelected.checkedList.length > 0 &&
                      moduleSelected.checkedList.length !== moduleSelected.total
                    }
                    v-model={[moduleSelected.checkAll, 'checked']}
                    onChange={(e) => {
                      if (
                        moduleSelected.checkedList.length < moduleSelected.total
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
          })}
        </Spin>
      )
    }
  },
})
