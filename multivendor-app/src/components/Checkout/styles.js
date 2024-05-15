import { StyleSheet } from 'react-native'
import { scale } from '../../utils/scaling'

export const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      height: scale(40),
      flex: 1
    },
    ovalContainer: {
      backgroundColor: theme?.gray200,
      flex: 1,
      borderRadius: scale(40),
      marginHorizontal: scale(10),
      marginVertical: scale(3),
      flexDirection: theme?.isRTL ? 'row-reverse' : 'row'
    },
    ovalButton: {
      flex: 1,
      borderRadius: scale(40),
      marginHorizontal: scale(2),
      marginVertical: scale(2),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    instructionContainer: {
      padding: scale(10),
      flexDirection: theme?.isRTL ? 'row-reverse' : 'row',
      margin: scale(10),
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: scale(10),
      borderColor: theme.gray500
    },
    leftContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    middleContainer: { flex: 6, justifyContent: 'space-evenly' },

    navigateButtonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.main,
      borderColor: theme.main,
      borderWidth: 1,
      borderRadius: scale(25),
      width: scale(200)
    },
    dismissButtonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderRadius: scale(25),
      width: scale(200),
      borderColor: theme.newIconColor
    },
    modalContainer: {
      backgroundColor: theme?.themeBackground,
      borderWidth: 1,
      borderColor: theme.newIconColor,
      borderRadius: scale(20),
      padding: scale(20),
      width: '90%', 
      alignSelf: 'center', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: 'auto', 
    },
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
      justifyContent: 'center', 
      alignItems: 'center', 
    }
  })
