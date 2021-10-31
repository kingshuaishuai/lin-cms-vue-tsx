import { CSSProperties, PropType } from 'vue'
import {
  toValidableType,
  any,
  string,
  number,
  bool,
  object,
  array,
  func,
  integer,
  symbol,
} from 'vue-types'
import { VueNode } from './types'

const PropTypes = {
  any,
  string,
  number,
  bool,
  object,
  array,
  func,
  integer,
  symbol,
  strOption<T>() {
    return toValidableType<T>('strOption', {
      type: String as unknown as PropType<T>,
    })
  },
  shape<T>() {
    return toValidableType<T>('shape', {})
  },
  looseBool() {
    return toValidableType<boolean>('looseBool', {
      type: Boolean,
      default: undefined,
    })
  },
  style() {
    return toValidableType<string | CSSProperties>('style', {
      type: [String, Object],
    })
  },
  VNodeChild() {
    return toValidableType<VueNode>('VNodeChild', {
      type: null,
    })
  },
}

export default PropTypes
