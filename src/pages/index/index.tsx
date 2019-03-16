import Taro, { Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import baseComponent from '@utils/baseComponent'
import CircleButton from '@components/circle-button'
import headerPic from '@img/illustrator.png'
import iconMe from '@img/icon_me.png'
import iconPlan from '@img/icon_plan.png'
import './index.scss'

const newComponent = baseComponent<{}, {

}>('index')
export default class extends newComponent {

  config: Config = {
    navigationBarBackgroundColor: '#00c7d2',
    navigationBarTextStyle: 'white',
    navigationBarTitleText: APP_NAME
  }
  componentWillMount() {
    this.$fc.getCurrentUser().then(user=> {
      this.setState({
        solution: user.get('solution')
      })
    })
  }

  componentDidShow() {
    const isLogin = this.$api.checkLoginStatus(false)
    if (!isLogin) {
      setTimeout(() => {
        const isLogin = this.$api.checkLoginStatus()
        if (!isLogin) {
          return
        }
        this.$fc.getCurrentUser().then(user=> {
          this.setState({
            solution: user.get('solution')
          })
        })
      }, 1000)
    } else {
      this.$fc.getCurrentUser().then(user=> {
        this.setState({
          solution: user.get('solution')
        })
      })
    }
  }

  clickPlan() {
    this.navigateTo('plan')
  }

  clickPerson() {
    this.navigateTo('person')
  }

  onSolutionDetail() {
    
  }

  render() {
    const { } = this.state
    return (
      <View className='index-container'>
        <Image
          className='pic-header'
          src={headerPic}
        />
        <View className='menu'>
          <CircleButton icon={iconPlan} background='#00c7d2' text='新方案' onClick={this.clickPlan}></CircleButton>
          <CircleButton icon={iconMe} background='#00c7d2' text='个人中心' onClick={this.clickPerson}></CircleButton>
        </View>
      </View>
    )
  }
}

