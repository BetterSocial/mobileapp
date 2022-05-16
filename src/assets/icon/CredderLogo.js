import * as React from "react"
import Svg, { ClipPath, Defs, G, Path } from "react-native-svg"

const CredderLogo = (props) => (
  <Svg
    width={65}
    height={15}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        d="M10.742 9.379A3.694 3.694 0 0 1 9.41 10.75a3.56 3.56 0 0 1-1.821.502V15a7.123 7.123 0 0 0 3.64-1.005 7.392 7.392 0 0 0 2.666-2.743l-3.153-1.874Z"
        fill="#FF7262"
      />
      <Path
        d="m4.436 9.379-3.153 1.874a7.392 7.392 0 0 0 2.666 2.743 7.123 7.123 0 0 0 3.64 1.005v-3.748a3.56 3.56 0 0 1-1.82-.502A3.695 3.695 0 0 1 4.435 9.38Z"
        fill="#FFA462"
      />
      <Path
        d="M3.948 7.504a3.814 3.814 0 0 1 .488-1.874L1.283 3.756a7.666 7.666 0 0 0-.975 3.748c0 1.316.336 2.608.975 3.748l3.153-1.874a3.816 3.816 0 0 1-.488-1.874Z"
        fill="#FFE502"
      />
      <Path
        d="M7.59 3.756V.008a7.122 7.122 0 0 0-3.642 1.004 7.392 7.392 0 0 0-2.665 2.744L4.436 5.63c.32-.57.779-1.044 1.332-1.373a3.56 3.56 0 0 1 1.821-.501Z"
        fill="#17FCA3"
      />
      <Path
        d="m10.742 5.63 3.153-1.874a7.391 7.391 0 0 0-2.665-2.744A7.122 7.122 0 0 0 7.589.008v3.748c.64 0 1.267.172 1.82.501a3.694 3.694 0 0 1 1.333 1.373Z"
        fill="#08CF84"
      />
      <Path
        d="M13.377 10.947a6.775 6.775 0 0 1-2.445 2.523 6.526 6.526 0 0 1-3.343.923c-3.686 0-6.675-3.076-6.675-6.871C.914 3.727 3.903.65 7.59.65a6.504 6.504 0 0 1 3.333.912 6.751 6.751 0 0 1 2.441 2.509l.532-.316C12.637 1.514 10.301.008 7.605.008 3.583.008.323 3.364.323 7.504c0 4.14 3.26 7.495 7.282 7.495 2.708 0 5.036-1.489 6.29-3.748l-.518-.304Z"
        fill="#000"
        fillOpacity={0.1}
      />
      <Path
        d="M8.242 7.311a.734.734 0 0 0-.426-.495L2.52 4.438a.04.04 0 0 0-.029-.001.041.041 0 0 0-.023.018.043.043 0 0 0 .012.056L7.107 8.08l.005.003a.698.698 0 0 0 .892-.012.758.758 0 0 0 .238-.76Zm-.595.488a.295.295 0 0 1-.319-.112.318.318 0 0 1 .107-.47.296.296 0 0 1 .335.045.314.314 0 0 1 .1.276.317.317 0 0 1-.115.207.3.3 0 0 1-.107.054Z"
        fill="#000"
      />
      <Path
        d="M20.54 11.142c-.718 0-1.362-.155-1.932-.467a3.387 3.387 0 0 1-1.335-1.295c-.32-.56-.48-1.192-.48-1.896 0-.703.16-1.33.48-1.882.32-.552.76-.983 1.322-1.295.57-.311 1.219-.467 1.945-.467.682 0 1.279.142 1.789.427.518.285.907.694 1.166 1.228l-1.244.748a1.938 1.938 0 0 0-.752-.734 1.915 1.915 0 0 0-.972-.254c-.605 0-1.107.205-1.504.614-.398.4-.597.939-.597 1.615 0 .677.195 1.22.584 1.63.397.4.903.6 1.517.6.354 0 .678-.08.972-.24a2.04 2.04 0 0 0 .752-.748l1.244.748a2.88 2.88 0 0 1-1.18 1.241c-.51.285-1.101.427-1.775.427ZM25.79 4.961c.468-.747 1.289-1.121 2.464-1.121v1.588a2 2 0 0 0-.376-.04c-.63 0-1.124.192-1.478.575-.354.373-.531.916-.531 1.628v3.458h-1.621v-7.13h1.543v1.042ZM35.425 7.524c0 .116-.008.28-.026.494h-5.432c.095.525.342.944.739 1.255.406.303.908.454 1.504.454.76 0 1.387-.258 1.88-.774l.868 1.028a2.928 2.928 0 0 1-1.18.868 4.186 4.186 0 0 1-1.607.293c-.76 0-1.43-.155-2.01-.467a3.367 3.367 0 0 1-1.348-1.295c-.31-.56-.466-1.192-.466-1.896 0-.694.15-1.317.453-1.869.312-.56.74-.996 1.284-1.308.544-.311 1.158-.467 1.84-.467.675 0 1.276.156 1.803.467.536.303.95.734 1.245 1.295.302.552.453 1.193.453 1.922Zm-3.5-2.35c-.519 0-.96.161-1.323.481-.354.312-.57.73-.648 1.255h3.928c-.069-.516-.28-.934-.635-1.255-.354-.32-.795-.48-1.322-.48ZM43.114 1.145v9.905H41.56v-.92c-.268.337-.601.59-.998.76a3.22 3.22 0 0 1-1.297.254 3.602 3.602 0 0 1-1.802-.454 3.24 3.24 0 0 1-1.245-1.282c-.302-.56-.453-1.201-.453-1.922 0-.721.15-1.357.453-1.91a3.24 3.24 0 0 1 1.245-1.28 3.602 3.602 0 0 1 1.802-.455c.458 0 .877.08 1.257.24.38.16.705.401.973.721V1.145h1.62Zm-3.656 8.57c.39 0 .74-.089 1.05-.267a2 2 0 0 0 .74-.787c.181-.339.272-.73.272-1.175 0-.445-.091-.837-.273-1.175a1.906 1.906 0 0 0-.739-.774 2 2 0 0 0-1.05-.28 2 2 0 0 0-1.05.28 1.908 1.908 0 0 0-.739.774c-.181.338-.272.73-.272 1.175 0 .445.09.836.272 1.175.182.338.428.6.74.787.31.178.66.267 1.05.267ZM51.365 1.145v9.905H49.81v-.92c-.268.337-.6.59-.998.76-.39.17-.822.254-1.297.254a3.602 3.602 0 0 1-1.802-.454 3.24 3.24 0 0 1-1.245-1.282c-.302-.56-.453-1.201-.453-1.922 0-.721.15-1.357.453-1.91a3.24 3.24 0 0 1 1.245-1.28 3.602 3.602 0 0 1 1.802-.455c.458 0 .877.08 1.257.24.38.16.705.401.973.721V1.145h1.62Zm-3.655 8.57c.389 0 .738-.089 1.05-.267a2 2 0 0 0 .738-.787c.182-.339.273-.73.273-1.175 0-.445-.091-.837-.273-1.175a1.905 1.905 0 0 0-.738-.774 2 2 0 0 0-1.05-.28 2 2 0 0 0-1.05.28 1.904 1.904 0 0 0-.74.774c-.181.338-.272.73-.272 1.175 0 .445.09.836.272 1.175.182.338.428.6.74.787.31.178.66.267 1.05.267ZM59.346 7.524c0 .116-.009.28-.026.494h-5.432c.095.525.342.944.74 1.255.405.303.907.454 1.503.454.76 0 1.387-.258 1.88-.774l.868 1.028a2.93 2.93 0 0 1-1.18.868 4.188 4.188 0 0 1-1.607.293c-.76 0-1.43-.155-2.01-.467a3.365 3.365 0 0 1-1.348-1.295c-.31-.56-.466-1.192-.466-1.896 0-.694.15-1.317.453-1.869.311-.56.74-.996 1.284-1.308.544-.311 1.158-.467 1.84-.467.675 0 1.276.156 1.803.467.536.303.95.734 1.244 1.295.303.552.454 1.193.454 1.922Zm-3.5-2.35c-.519 0-.96.161-1.322.481-.355.312-.571.73-.649 1.255h3.928c-.069-.516-.28-.934-.635-1.255-.354-.32-.795-.48-1.322-.48ZM61.797 4.961c.467-.747 1.288-1.121 2.464-1.121v1.588a2 2 0 0 0-.376-.04c-.631 0-1.124.192-1.478.575-.354.373-.532.916-.532 1.628v3.458h-1.62v-7.13h1.542v1.042Z"
        fill="#121213"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" transform="translate(.286)" d="M0 0h64v15H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)

export default CredderLogo
