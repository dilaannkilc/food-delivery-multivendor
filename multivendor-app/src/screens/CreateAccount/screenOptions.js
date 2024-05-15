import React from 'react'
import { LeftButton } from '../../components/Header/HeaderIcons/HeaderIcons'

const navigationOptions = props => ({
  headerTitle: '',
  headerRight: null,

  headerLeft: () => (

    <LeftButton iconColor={props?.iconColor} icon="close" />
  ),
  headerStyle: {
    shadowOffset: {
      height: 0
    },
    backgroundColor: props?.backColor
  }
})
export default navigationOptions
