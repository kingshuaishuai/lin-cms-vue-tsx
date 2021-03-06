import Icon from '@/components/base/Icon'
import { IconName } from '@/components/base/Icon/type'
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import { CloseOutlined } from '@ant-design/icons-vue'
import './index.less'
import BScroll from '@/components/base/BScroll'
import { useMenuContext, useRouteHistories } from './hooks'
import { useNameToStageMap } from '@/hooks/stage'

export default defineComponent({
  name: 'ReuseTab',
  setup() {
    const stageList = useNameToStageMap()
    const { histories, handleCloseHistoryTab } = useRouteHistories()

    const {
      container,
      menuInfo,
      onContextmenuTag,
      closeAll,
      closeLeft,
      closeRight,
      closeOthers,
    } = useMenuContext(histories)

    return () => {
      return (
        <div ref={container} class="reuseTab-container">
          <BScroll scrollX click={false}>
            <div class="reuseTab">
              {histories.value.map((item, index) => {
                if (!stageList.value[item.stageId]) return null
                return (
                  <RouterLink
                    exactActiveClass="reuseTab__item--active"
                    class="reuseTab__item"
                    to={item.path}
                    key={item.stageId}
                    {...{
                      onContextmenu: (event: MouseEvent) =>
                        onContextmenuTag(event, index),
                    }}
                  >
                    <Icon
                      class="reuseTab__item-icon"
                      name={stageList.value[item.stageId].icon as IconName}
                    />
                    <span class="reuseTab__item-title">
                      {stageList.value[item.stageId].title}
                    </span>
                    <CloseOutlined
                      class="reuseTab__item-close"
                      onClick={(event) =>
                        handleCloseHistoryTab(event, item, index)
                      }
                    />
                  </RouterLink>
                )
              })}
            </div>
          </BScroll>
          <ul
            v-show={menuInfo.visible}
            style={{
              top: `${menuInfo.top}px`,
              left: `${menuInfo.left}px`,
            }}
            class="reuseTab__contextmenu"
          >
            <li onClick={closeAll} class="reuseTab__contextmenu-item">
              ????????????
            </li>
            <li
              onClick={closeOthers}
              v-show={menuInfo.hasOthers}
              class="reuseTab__contextmenu-item"
            >
              ????????????
            </li>
            <li
              onClick={closeLeft}
              v-show={menuInfo.hasLeft}
              class="reuseTab__contextmenu-item"
            >
              ????????????
            </li>
            <li
              onClick={closeRight}
              v-show={menuInfo.hasRight}
              class="reuseTab__contextmenu-item"
            >
              ????????????
            </li>
          </ul>
        </div>
      )
    }
  },
})
