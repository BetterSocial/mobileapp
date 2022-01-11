import * as React from "react"
import Svg, { Path } from "react-native-svg"

const IconChatCheckMark = (props) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21.936 8.502a.903.903 0 1 0-1.293-1.262l-8.126 8.322-1.018-1.202-1.27 1.295 1.55 1.832a.903.903 0 0 0 1.336.047l8.82-9.032Zm-5.42 0a.903.903 0 0 0-1.291-1.262l-8.127 8.322-3.183-3.759a.903.903 0 0 0-1.379 1.168l3.825 4.516a.903.903 0 0 0 1.335.047l8.82-9.032Z"
      fill="#828282"
    />
  </Svg>
)

export default IconChatCheckMark
