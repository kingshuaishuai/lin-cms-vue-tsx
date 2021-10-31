export interface MenuItem {
  name: symbol | string
  title: string
  icon: string
  path: string
  children?: MenuItem[]
}
