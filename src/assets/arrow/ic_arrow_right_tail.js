import * as React from "react"
import Svg, { Path } from "react-native-svg"

const IcArrowRightTail = (props) => (
  <Svg
    width={33}
    height={27}
    fill="none"
    viewBox="0 0 33 27"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M.06 13.46c0-.746.554-1.362 1.273-1.46l.2-.013 25.88.001-9.35-9.311A1.472 1.472 0 0 1 19.975.448l.165.143 11.877 11.824a1.486 1.486 0 0 1 .41.78 1.666 1.666 0 0 1 .023.264l-.001.058a1.475 1.475 0 0 1-.006.086l.007-.143a1.485 1.485 0 0 1-.244.81 1.37 1.37 0 0 1-.046.066l-.013.018c-.04.051-.083.1-.129.147h-.001L20.14 26.33a1.472 1.472 0 0 1-2.221-1.922l.143-.165 9.346-9.31H1.533c-.813 0-1.472-.66-1.472-1.473Z"
      fill="#fff"
    />
  </Svg>
)

const MemoizedIcArrowRightTail = React.memo(IcArrowRightTail)
export default MemoizedIcArrowRightTail
