import * as React from "react"
import Svg, { Path } from "react-native-svg"

const CredderRatingRed = (props) => (
  <Svg
    width={18}
    height={18}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m1.23 13.503 3.897-2.25a4.498 4.498 0 0 0 3.898 2.25 4.5 4.5 0 0 0 3.897-2.25l3.896 2.25A8.999 8.999 0 0 1 9.024 18a9.002 9.002 0 0 1-7.794-4.498Z"
      fill="#FF7262"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m16.819 4.505-3.897 2.25a4.496 4.496 0 0 0-3.897-2.25 4.502 4.502 0 0 0-3.898 2.25l-3.896-2.25A8.998 8.998 0 0 1 9.024.009a9.003 9.003 0 0 1 7.795 4.497ZM4.524 9.005a4.476 4.476 0 0 1 .603-2.25L1.231 4.507a8.998 8.998 0 0 0 0 8.996l3.896-2.25a4.474 4.474 0 0 1-.603-2.248Z"
      fill="#F0F0F0"
    />
    <Path
      d="M16.178 13.136a8.244 8.244 0 0 1-7.153 4.136 8.248 8.248 0 0 1-8.25-8.246A8.248 8.248 0 0 1 9.025.78a8.223 8.223 0 0 1 7.137 4.105l.657-.38C15.264 1.816 12.377.009 9.044.009c-4.97 0-9 4.028-9 8.996 0 4.968 4.03 8.996 9 8.996a8.89 8.89 0 0 0 7.775-4.498l-.64-.366Z"
      fill="#000"
      fillOpacity={0.1}
    />
    <Path
      d="M9.248 8.028a1.022 1.022 0 0 0-.869.187l-6.356 4.687a.053.053 0 0 0-.015.071c.007.012.018.02.032.024a.058.058 0 0 0 .04-.002l7.311-3.157a.954.954 0 0 0 .58-.651.927.927 0 0 0-.113-.723.99.99 0 0 0-.61-.436Zm.174 1.002a.404.404 0 0 1-.168.235.427.427 0 0 1-.34.06.418.418 0 0 1-.31-.31.39.39 0 0 1 .082-.334.435.435 0 0 1 .432-.141.42.42 0 0 1 .257.184.393.393 0 0 1 .047.306Z"
      fill="#000"
    />
  </Svg>
)

export default CredderRatingRed
