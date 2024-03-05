import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

/**
 * @typedef {Object} IconShare
 * @property {string} color
 * @property {number} height
 * @property {number} width
 */

/**
 *
 * @param {IconShare} props
 */

function Ic_Dm_Anon(props) {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M13.5432 8.50128C13.1981 8.50128 12.9181 8.22123 12.9181 7.87617V6.03879C12.9164 6.01289 12.9164 5.98664 12.9181 5.96015V4.27389C12.9181 3.90883 12.7405 3.58711 12.4313 3.39208C12.1229 3.19704 11.7554 3.17621 11.4253 3.33457L11.1953 3.44542C10.781 3.63128 10.3243 3.59378 9.96006 3.35707C9.59499 3.11953 9.37662 2.71779 9.37662 2.28189L8.12558 2.25021C7.55131 2.25021 7.08373 2.71779 7.08373 3.29206V7.87617C7.08373 8.22123 6.80368 8.50128 6.45862 8.50128C6.11356 8.50128 5.83352 8.22123 5.83352 7.87617V6.71119C2.60319 7.18313 1.24826 8.08773 1.24826 8.49937C1.24826 9.20699 4.33712 10.5831 9.99975 10.5831C15.6624 10.5831 18.7513 9.20699 18.7513 8.49937C18.7513 8.08783 17.397 7.18355 14.1683 6.71153V7.87617C14.1683 8.22123 13.8882 8.50128 13.5432 8.50128ZM20.0015 8.49937C20.0015 6.54197 16.2775 5.74367 14.1683 5.44902V4.27389C14.1683 3.48126 13.7674 2.75697 13.0973 2.33439C12.4271 1.91182 11.6003 1.86431 10.8844 2.20771L10.626 2.28189C10.626 1.5751 10.0509 1 9.34412 1H8.12558C6.86119 1 5.83352 2.02768 5.83352 3.29206V5.4487C3.72474 5.7431 -0.00195312 6.54126 -0.00195312 8.49937C-0.00195312 10.6881 5.02974 11.8333 9.99975 11.8333C14.9698 11.8333 20.0015 10.6881 20.0015 8.49937ZM6.66225 18.4727C6.77977 18.4919 6.89729 18.5011 7.01481 18.5011C7.53407 18.5011 8.03665 18.3185 8.43422 17.9801C8.8993 17.5834 9.16518 17.0125 9.16518 16.4124V15.5856H10.8312V16.4124C10.8312 17.0125 11.097 17.5834 11.5621 17.9801C11.9588 18.3185 12.4623 18.5011 12.9815 18.5011C13.099 18.5011 13.2166 18.4919 13.3341 18.4727L14.8618 18.2294C15.907 18.0618 16.6655 17.1958 16.6655 16.1682V15.377H17.7076C18.0527 15.377 18.3328 15.097 18.3328 14.7519C18.3328 14.4069 18.0527 14.1268 17.7076 14.1268H16.5552C16.4784 14.0155 16.3658 13.9292 16.2304 13.8861C14.6285 13.3752 12.8673 13.3752 11.2654 13.8861C11.0545 13.9535 10.8986 14.1263 10.8484 14.3353H9.14794C9.09773 14.1263 8.94168 13.9535 8.73011 13.8861C7.12817 13.3752 5.36703 13.3752 3.76509 13.8861C3.55419 13.9535 3.39827 14.1263 3.34809 14.3353H2.29112C1.94606 14.3353 1.66602 14.6154 1.66602 14.9605C1.66602 15.3055 1.94606 15.5856 2.29112 15.5856H3.33085V16.1682C3.33085 17.1958 4.08931 18.0627 5.13449 18.2294L6.66225 18.4727ZM12.0814 16.4124V14.9982C12.0821 14.9857 12.0825 14.9731 12.0825 14.9605L12.0825 14.9535C13.1715 14.6854 14.3263 14.6855 15.4153 14.9546V16.169C15.4153 16.5782 15.0994 16.9258 14.6651 16.995L13.1374 17.2384C12.8582 17.2817 12.5806 17.2058 12.3739 17.0292C12.1847 16.8683 12.0814 16.6491 12.0814 16.4124ZM4.58106 15.0122V16.1682C4.58106 16.5774 4.89695 16.925 5.33119 16.9941L6.85895 17.2384C7.13817 17.2817 7.41488 17.2058 7.62242 17.0292C7.81162 16.8683 7.91497 16.6491 7.91497 16.4124V14.9538C6.82631 14.6856 5.67188 14.6854 4.58314 14.9533L4.58318 14.9605C4.58318 14.9779 4.58247 14.9951 4.58106 15.0122Z"
        fill={props.color}
      />
    </Svg>
  );
}

const IcDmAnon = React.memo(Ic_Dm_Anon);
export {IcDmAnon};
