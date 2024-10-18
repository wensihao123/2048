import { Color } from 'cc'

export const getBackground = (num: number) => {
    switch (num) {
        case Math.pow(2,1):
            return new Color(235, 220, 124)
        case Math.pow(2,2):
            return new Color(234, 212, 121)
        case Math.pow(2,3):
            return new Color(240, 206, 119)
        case Math.pow(2,4):
            return new Color(240,194,113)
        case Math.pow(2,5):
            return new Color(240,183,108)
        case Math.pow(2,6):
            return new Color(235,167,99)
        case Math.pow(2,7):
            return new Color(235,155,92)
        case Math.pow(2,8):
            return new Color(235,138,82)
        case Math.pow(2,9):
            return new Color(255,134,79)
        default:
            return new Color(255,122,74)
    }
}