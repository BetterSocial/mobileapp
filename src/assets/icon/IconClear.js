import * as React from "react"
import Svg, { Path } from "react-native-svg"

const IconClear = (props) => (
  <Svg
    width={9}
    height={10}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 9 10"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.764 1.847A.743.743 0 1 0 7.714.796L4.558 3.95 1.33.72A.743.743 0 1 0 .28 1.773l3.228 3.229L.279 8.23A.743.743 0 1 0 1.33 9.28l3.23-3.228 3.153 3.154a.743.743 0 0 0 1.051-1.051L5.61 5l3.154-3.154Z"
      fill="#C4C4C4"
    />
  </Svg>
)

export default IconClear
