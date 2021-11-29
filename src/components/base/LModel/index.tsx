import { Modal, ModalFuncProps } from 'ant-design-vue'
import { ExclamationCircleFilled } from '@ant-design/icons-vue'

export class LModal {
  static confirm(props: ModalFuncProps) {
    const { content, okButtonProps, cancelButtonProps, ...others } = props
    Modal.confirm({
      title: '提示',
      content: () => (
        <div class="confirm-warn-content">
          <ExclamationCircleFilled class="confirm-warn-icon" />
          {typeof content === 'function' ? (
            content()
          ) : typeof content === 'string' ? (
            <span>{content}</span>
          ) : (
            { content }
          )}
        </div>
      ),
      centered: true,
      okButtonProps: {
        size: 'small',
        ...okButtonProps,
      },
      cancelButtonProps: {
        size: 'small',
        ...cancelButtonProps,
      },
      ...others,
    })
  }
}
