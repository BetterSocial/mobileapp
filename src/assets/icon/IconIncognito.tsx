import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

export default function IconIncognito({color, ...rest}) {
  return (
    <Svg width="21" height="20" viewBox="0 0 21 20" fill="none" {...rest}>
      <Rect x="0.5" width="20" height="20" rx="10" fill="#107793" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5812 5.01754C10.3923 4.90631 10.1387 4.8687 9.82896 4.86846C9.82896 4.86846 9.42299 4.84181 9.0642 4.94169C8.8413 5.00375 8.68296 5.1264 8.51068 5.29889C8.35789 5.45186 8.24805 5.62786 8.19598 5.86442C8.12242 6.19859 8.14358 6.58313 8.14358 6.58313C8.14342 6.96227 8.14352 7.37747 8.14456 7.80635C7.63491 7.85103 6.98415 7.96979 6.41347 8.15851C6.05867 8.27584 5.70765 8.4289 5.43701 8.62642C5.17467 8.8179 4.91016 9.11082 4.91016 9.51507C4.91016 9.91181 5.16006 10.2184 5.45135 10.4352C5.74815 10.6562 6.15403 10.8368 6.62575 10.9812C7.57399 11.2714 8.88379 11.4434 10.386 11.4434C11.9374 11.4434 13.3629 11.2737 14.3825 10.9698C14.8875 10.8193 15.3284 10.6258 15.6336 10.3769C15.9457 10.1223 16.1778 9.74838 16.0577 9.29224C15.9717 8.96538 15.7103 8.73877 15.4625 8.58452C15.2029 8.42294 14.8807 8.29285 14.5498 8.18724C14.0061 8.0137 13.3875 7.89033 12.8662 7.80938C12.8663 7.73331 12.8665 7.65575 12.8667 7.5766C12.8672 7.34495 12.8677 7.09941 12.8677 6.83774C12.8677 6.59938 12.8359 6.40307 12.7647 6.23233C12.6922 6.05831 12.5913 5.94197 12.5098 5.85603C12.3027 5.63787 12.0805 5.50374 11.8438 5.44815C11.6096 5.39317 11.4009 5.42447 11.2383 5.46877C11.1581 5.49061 11.085 5.51683 11.0263 5.53851L10.9855 5.55366C10.9556 5.56479 10.9318 5.57368 10.9098 5.58129C10.9086 5.5586 10.9064 5.52749 10.9009 5.49273C10.8926 5.44084 10.8749 5.35255 10.8222 5.25906C10.7666 5.16056 10.6854 5.07885 10.5812 5.01754ZM12.867 8.63654C12.8672 8.66894 12.8675 8.70108 12.8677 8.73299C12.8695 8.9585 12.6882 9.14277 12.4626 9.14457C12.2371 9.14636 12.0529 8.96501 12.0511 8.7395C12.0482 8.38489 12.0491 7.99786 12.05 7.5686C12.0505 7.33773 12.0511 7.09456 12.0511 6.83774C12.0511 6.6704 12.0284 6.58853 12.0109 6.54644C11.9947 6.50763 11.9727 6.47651 11.9174 6.4182C11.7983 6.29267 11.7107 6.25578 11.6571 6.24319C11.6009 6.23 11.5387 6.23335 11.4529 6.25673C11.4088 6.26873 11.3633 6.28461 11.3094 6.30454L11.2809 6.31516C11.2366 6.33169 11.1824 6.3519 11.1321 6.36794C11.0248 6.40212 10.7871 6.471 10.5522 6.34333C10.3488 6.23275 10.1982 6.08778 10.132 5.88553C10.1088 5.81437 10.1009 5.74967 10.0977 5.70367C10.043 5.69388 9.96131 5.68587 9.84296 5.68518C9.76118 5.69086 9.67972 5.69173 9.61398 5.69244L9.56731 5.69303C9.48386 5.69438 9.42468 5.69765 9.37178 5.70704C9.28839 5.72184 9.19373 5.7551 9.0642 5.89544C9.03892 5.92283 9.01928 5.94945 9.00104 6.01847C8.97862 6.1033 8.96028 6.24752 8.96028 6.5097C8.95995 7.17564 8.96028 7.95876 8.96514 8.73369C8.96655 8.9592 8.78488 9.14316 8.55937 9.14457C8.33386 9.14598 8.1499 8.96432 8.14849 8.7388C8.14825 8.70129 8.14803 8.66377 8.14781 8.62624C7.71203 8.66965 7.15555 8.77327 6.66988 8.93388C6.35177 9.03907 6.0912 9.16002 5.91847 9.28608C5.73745 9.4182 5.72682 9.49845 5.72682 9.51507C5.72682 9.5392 5.74136 9.63303 5.93898 9.78013C6.13108 9.92313 6.43859 10.0699 6.86474 10.2003C7.71226 10.4597 8.93619 10.6268 10.386 10.6268C11.8905 10.6268 13.2309 10.4609 14.1493 10.1872C14.6134 10.0489 14.9346 9.89314 15.1174 9.74402C15.2933 9.60058 15.2752 9.52774 15.268 9.50008C15.2623 9.47863 15.2209 9.39609 15.031 9.27786C14.8528 9.16697 14.6023 9.06125 14.3014 8.96523C13.8517 8.82168 13.332 8.71294 12.867 8.63654Z"
        fill={`${color ?? COLORS.almostBlack}`}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.9798 12.2782C12.3531 12.226 13.0075 12.2608 13.3123 12.3035C13.3214 12.3048 13.3304 12.3064 13.3393 12.3082C13.5445 12.3512 13.6883 12.3826 13.7867 12.4071C13.8356 12.4193 13.8806 12.4316 13.9196 12.4445C13.9498 12.4546 14.0128 12.4763 14.0731 12.5184C14.0939 12.5329 14.1232 12.5558 14.1526 12.5892L14.7628 12.5892C14.9883 12.5892 15.1711 12.772 15.1711 12.9975C15.1711 13.223 14.9883 13.4059 14.7628 13.4059H14.2612L14.261 13.4826C14.261 13.5028 14.2611 13.5243 14.2613 13.5469C14.2629 13.7878 14.2654 14.1522 14.0357 14.4739C13.7139 14.9246 13.2871 14.9851 12.9194 15.0372C12.8918 15.0411 12.8646 15.045 12.8378 15.0489C12.799 15.0547 12.7542 15.0623 12.7053 15.0707C12.5462 15.0977 12.3441 15.1322 12.1628 15.1332C11.8925 15.1346 11.5942 15.0695 11.3285 14.8268C11.1118 14.6289 10.9824 14.4285 10.9288 14.1771C10.8936 14.0122 10.8953 13.8228 10.8968 13.6546C10.8971 13.6149 10.8975 13.5763 10.8973 13.5395L10.8972 13.5141H10.1239C10.1239 13.5224 10.1238 13.5309 10.1238 13.5395C10.1237 13.5763 10.124 13.6148 10.1244 13.6545C10.1259 13.8228 10.1275 14.0122 10.0924 14.1771C10.0387 14.4285 9.90935 14.6289 9.69264 14.8268C9.42693 15.0695 9.12864 15.1346 8.85833 15.1332C8.67706 15.1322 8.47489 15.0977 8.31585 15.0707C8.26697 15.0623 8.22216 15.0547 8.18328 15.0489C8.15649 15.045 8.1293 15.0411 8.10177 15.0372C7.73405 14.9851 7.30728 14.9246 6.9854 14.4739C6.75574 14.1522 6.75823 13.7879 6.75987 13.5471C6.75995 13.5358 6.76002 13.5248 6.76007 13.5141H6.24232C6.0168 13.5141 5.83398 13.3313 5.83398 13.1058C5.83398 12.8802 6.0168 12.6974 6.24232 12.6974H6.79895C6.80501 12.6838 6.81182 12.6705 6.81938 12.6575C6.86144 12.585 6.91531 12.5413 6.94803 12.5184C7.00832 12.4763 7.07138 12.4546 7.10155 12.4445C7.14052 12.4316 7.18554 12.4193 7.23439 12.4071C7.33282 12.3826 7.47668 12.3512 7.68181 12.3082C7.69076 12.3064 7.69976 12.3048 7.70881 12.3035C8.01361 12.2608 8.66802 12.226 9.04134 12.2782C9.29083 12.313 9.47691 12.3467 9.61397 12.3823C9.73127 12.4128 9.88423 12.4608 9.99679 12.5672C10.0354 12.6036 10.0697 12.6472 10.0961 12.6974L10.925 12.6974C10.9515 12.6472 10.9858 12.6036 11.0243 12.5672C11.1369 12.4608 11.2899 12.4128 11.4072 12.3823C11.5442 12.3467 11.7303 12.313 11.9798 12.2782ZM13.186 13.1105C12.9148 13.0742 12.3575 13.05 12.0928 13.087C11.9265 13.1102 11.8035 13.1311 11.7133 13.1496C11.7128 13.2564 11.7133 13.3681 11.714 13.5361C11.7143 13.5997 11.7139 13.6498 11.7135 13.6943C11.7131 13.7464 11.7128 13.7908 11.7136 13.8404C11.7149 13.9212 11.7197 13.9702 11.7275 14.0067C11.7375 14.0537 11.7563 14.1115 11.8792 14.2238C11.9532 14.2913 12.0317 14.3172 12.1584 14.3165C12.2678 14.3159 12.37 14.2985 12.5053 14.2755C12.5679 14.2649 12.6375 14.253 12.7183 14.2411L12.7655 14.2341C12.9667 14.2044 13.0793 14.1878 13.1739 14.1537C13.249 14.1265 13.3065 14.0898 13.3711 13.9993C13.4399 13.9029 13.4435 13.802 13.4443 13.4804C13.4448 13.3263 13.4447 13.252 13.4414 13.1929C13.4409 13.1833 13.4403 13.1741 13.4395 13.1648C13.372 13.1499 13.2887 13.132 13.186 13.1105ZM8.92833 13.087C8.66365 13.05 8.10638 13.0742 7.83517 13.1105C7.73245 13.132 7.64913 13.1499 7.58158 13.1648C7.58083 13.1741 7.58021 13.1833 7.57968 13.1929C7.57642 13.252 7.57638 13.3263 7.57678 13.4804C7.57764 13.802 7.58118 13.9029 7.65002 13.9993C7.71462 14.0898 7.77217 14.1265 7.84726 14.1537C7.94183 14.1878 8.05448 14.2044 8.25559 14.2341L8.30288 14.2411C8.38359 14.253 8.45324 14.2649 8.51581 14.2755C8.65108 14.2985 8.75329 14.3159 8.86272 14.3165C8.98944 14.3172 9.06793 14.2913 9.1419 14.2238C9.26488 14.1115 9.28364 14.0537 9.29368 14.0067C9.30145 13.9702 9.30619 13.9212 9.30754 13.8404C9.30837 13.7908 9.30802 13.7464 9.30762 13.6943C9.30727 13.6498 9.30688 13.5997 9.30715 13.5361C9.30785 13.3681 9.3083 13.2564 9.30784 13.1496C9.21763 13.1311 9.09468 13.1102 8.92833 13.087Z"
        fill={`${color ?? COLORS.almostBlack}`}
      />
    </Svg>
  );
}
