import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import baseComponent from '@utils/baseComponent'
import './index.scss'

type PropType = {
  background?: string,
  icon?: string,
  text?: string,
  onClick?: Function,
  className?: string
}
const newComponent = baseComponent<PropType, {

}>()

export default class extends newComponent {

  props: PropType

  onClick() {
    this.props.onClick && this.props.onClick(...arguments)
  }

  render() {
    const {icon, text, background, className } = this.props
    return (
      <View className={className?className + " circle-bt-outer": "circle-bt-outer"}>
        {icon ?
          <Image className="icon" style={background?{ background }:{}} src={icon} onClick={this.onClick.bind(this)} />
          : <View className="icon" style={background?{ background }:{}} onClick={this.onClick.bind(this)}></View>
        }
        {text && <Text className="text">{text}</Text>}
      </View >
    )
  }
}