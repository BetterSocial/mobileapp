import * as React from "react"
import Svg, { Path } from "react-native-svg"

const IconChatCheckMark = (props) => (
  <Svg
    width={14}
    height={14}
    fill="none"
    viewBox="0 0 10 10"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.635.193c.267.261.272.69.011.958L4.031 7.925a.677.677 0 0 1-1.002-.036L.16 4.502a.677.677 0 0 1 1.034-.875l2.388 2.819L9.677.204a.677.677 0 0 1 .958-.011Z"
      fill="#828282"
    />
  </Svg>
)

export default IconChatCheckMark
