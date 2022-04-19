import * as React from "react"
import Svg, {
    ClipPath,
    Defs,
    G,
    LinearGradient,
    Path,
    Stop,
} from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */

const IconBetterOnboarding = (props) => (
    <Svg
        width={184}
        height={225}
        fill="none"
        viewBox="0 0 156 240"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <G
            clipPath="url(#a)"
            filter="url(#b)"
            fillRule="evenodd"
            clipRule="evenodd"
        >
            <Path
                d="M73.768 12.517.668 140.359a4.897 4.897 0 0 0 .565 5.639 4.856 4.856 0 0 0 5.498 1.31l50.22-20.486a55.789 55.789 0 0 1 42.099 0l50.219 20.468a4.865 4.865 0 0 0 5.481-1.311 4.893 4.893 0 0 0 .582-5.62L82.214 12.517a4.879 4.879 0 0 0-4.223-2.449 4.861 4.861 0 0 0-4.223 2.449Z"
                fill="url(#c)"
            />
            <Path
                d="M136.692 107.783c-18.64-8.216-74.653 16.74-79.741 19.057l-.38.162-49.84 20.288a4.863 4.863 0 0 1-5.48-1.311 4.892 4.892 0 0 1-.583-5.62L73.787 12.517a4.861 4.861 0 0 1 8.445 0l54.46 95.266Z"
                fill="#fff"
            />
        </G>
        <Path
            d="M8.798 174.921a9 9 0 0 1 3.539-3.211 11.062 11.062 0 0 1 5.259-1.265 11.858 11.858 0 0 1 6.413 1.79 12.185 12.185 0 0 1 4.506 5.099 16.706 16.706 0 0 1 1.681 7.707 17.014 17.014 0 0 1-1.69 7.785 12.563 12.563 0 0 1-4.507 5.147 11.853 11.853 0 0 1-6.403 1.81 11.226 11.226 0 0 1-5.279-1.177 9.487 9.487 0 0 1-3.52-3.211v3.98H0V161.6h8.798v13.321Zm12.483 10.12a6.848 6.848 0 0 0-1.847-5.099 5.89 5.89 0 0 0-4.458-1.888 6.017 6.017 0 0 0-2.435.473 5.98 5.98 0 0 0-2.032 1.415 8.325 8.325 0 0 0 0 10.305 5.98 5.98 0 0 0 2.032 1.415c.77.325 1.6.486 2.435.473a5.994 5.994 0 0 0 4.458-1.888 7.23 7.23 0 0 0 1.847-5.206Zm40.216-.409c-.005.856-.057 1.71-.156 2.56H41.497a6.107 6.107 0 0 0 1.691 4.077 5.398 5.398 0 0 0 3.734 1.42 4.637 4.637 0 0 0 2.734-.664 4.603 4.603 0 0 0 1.841-2.119h9.326a12.97 12.97 0 0 1-2.659 5.109 13.051 13.051 0 0 1-4.614 3.464 15.251 15.251 0 0 1-6.315 1.275 15.307 15.307 0 0 1-7.478-1.79 12.687 12.687 0 0 1-5.132-5.099 15.68 15.68 0 0 1-1.848-7.785 16.027 16.027 0 0 1 1.799-7.785 12.764 12.764 0 0 1 5.122-5.099 15.45 15.45 0 0 1 7.537-1.751 15.48 15.48 0 0 1 7.39 1.732 12.408 12.408 0 0 1 5.005 4.992 14.83 14.83 0 0 1 1.867 7.502v-.039Zm-8.973-2.296a4.467 4.467 0 0 0-1.545-3.571 6.187 6.187 0 0 0-7.586 0 5.73 5.73 0 0 0-1.847 3.62l10.978-.049Zm29.267 9.594v7.406h-4.467c-3.174 0-5.65-.766-7.43-2.297-1.779-1.567-2.668-4.097-2.668-7.609v-11.288h-3.49v-7.25h3.49v-6.938h8.798v6.938h5.738v7.25h-5.768v11.434a2.4 2.4 0 0 0 .616 1.839 3.045 3.045 0 0 0 2.053.554l3.128-.039Zm20.529 0v7.406h-4.458c-3.174 0-5.653-.766-7.439-2.297-1.78-1.567-2.659-4.097-2.659-7.609v-11.288h-3.47v-7.25h3.49v-6.938h8.798v6.938h5.748v7.25h-5.787v11.434a2.398 2.398 0 0 0 .615 1.839 3.045 3.045 0 0 0 2.053.554l3.109-.039Zm31.575-7.298a23.55 23.55 0 0 1-.147 2.56h-19.844a6.057 6.057 0 0 0 1.691 4.077 5.385 5.385 0 0 0 3.744 1.382 4.621 4.621 0 0 0 4.565-2.754h9.326a12.947 12.947 0 0 1-2.662 5.111 13.018 13.018 0 0 1-4.621 3.462 15.17 15.17 0 0 1-6.305 1.274 15.345 15.345 0 0 1-7.488-1.79 12.748 12.748 0 0 1-5.122-5.099 15.67 15.67 0 0 1-1.848-7.785 16.013 16.013 0 0 1 1.799-7.784 12.674 12.674 0 0 1 5.122-5.099 16.677 16.677 0 0 1 14.927-.059 12.41 12.41 0 0 1 5.025 4.953 14.937 14.937 0 0 1 1.867 7.59l-.029-.039Zm-8.974-2.296a4.469 4.469 0 0 0-1.535-3.571 5.659 5.659 0 0 0-8.299.716 5.598 5.598 0 0 0-1.134 2.855h10.968Zm22.092-6.734a11.282 11.282 0 0 1 3.852-3.678 9.806 9.806 0 0 1 5.122-1.372v9.234h-2.405a7.324 7.324 0 0 0-4.887 1.431c-1.095.915-1.643 2.536-1.643 4.865v13.224h-8.798v-28.414h8.798l-.039 4.71ZM73.776 224.058c-1.09 0-2.068-.193-2.934-.578-.866-.4-1.556-.938-2.07-1.611a4.102 4.102 0 0 1-.817-2.237h3.392c.064.513.313.938.746 1.275.448.336 1.002.505 1.66.505.64 0 1.138-.129 1.49-.385.37-.257.554-.585.554-.986 0-.433-.225-.754-.674-.963-.433-.224-1.13-.465-2.092-.721-.995-.241-1.813-.489-2.454-.746a4.347 4.347 0 0 1-1.636-1.179c-.449-.529-.673-1.242-.673-2.14a3.5 3.5 0 0 1 .625-2.021c.433-.609 1.043-1.09 1.828-1.443.802-.353 1.74-.53 2.815-.53 1.587 0 2.854.401 3.8 1.203.947.786 1.468 1.852 1.564 3.199h-3.223c-.049-.529-.273-.946-.674-1.25-.385-.321-.906-.481-1.564-.481-.609 0-1.082.112-1.419.336-.32.225-.48.538-.48.938 0 .449.224.794.673 1.035.449.224 1.146.457 2.093.697.962.241 1.755.49 2.38.746a4.072 4.072 0 0 1 1.613 1.203c.465.529.705 1.235.721 2.117 0 .769-.216 1.459-.65 2.068-.416.61-1.026 1.091-1.827 1.444-.786.336-1.708.505-2.767.505ZM91.31 224.058c-1.283 0-2.437-.281-3.464-.842a6.31 6.31 0 0 1-2.43-2.43c-.576-1.042-.865-2.245-.865-3.608s.297-2.566.89-3.608a6.276 6.276 0 0 1 2.478-2.406c1.042-.577 2.205-.866 3.487-.866 1.283 0 2.446.289 3.488.866a6.114 6.114 0 0 1 2.454 2.406c.61 1.042.914 2.245.914 3.608s-.313 2.566-.938 3.608a6.387 6.387 0 0 1-2.502 2.43c-1.042.561-2.213.842-3.512.842Zm0-2.935c.61 0 1.179-.144 1.708-.433.545-.305.978-.754 1.3-1.347.32-.593.48-1.315.48-2.165 0-1.267-.337-2.237-1.01-2.91-.658-.69-1.467-1.035-2.43-1.035-.962 0-1.772.345-2.43 1.035-.64.673-.961 1.643-.961 2.91 0 1.267.312 2.245.938 2.935.641.673 1.443 1.01 2.405 1.01ZM103.475 217.178c0-1.379.28-2.582.841-3.608.562-1.042 1.34-1.844 2.334-2.406.994-.577 2.133-.866 3.416-.866 1.651 0 3.014.417 4.089 1.251 1.09.818 1.82 1.973 2.189 3.464h-3.632c-.193-.577-.522-1.026-.987-1.347-.449-.337-1.01-.505-1.684-.505-.962 0-1.723.353-2.285 1.058-.561.69-.842 1.676-.842 2.959 0 1.267.281 2.253.842 2.959.562.689 1.323 1.034 2.285 1.034 1.364 0 2.254-.609 2.671-1.828h3.632c-.369 1.443-1.099 2.59-2.189 3.44-1.091.85-2.454 1.275-4.089 1.275-1.283 0-2.422-.281-3.416-.842a6.125 6.125 0 0 1-2.334-2.406c-.561-1.042-.841-2.253-.841-3.632ZM124.127 208.927c-.593 0-1.09-.184-1.491-.553a1.93 1.93 0 0 1-.578-1.419c0-.561.193-1.026.578-1.395.401-.385.898-.578 1.491-.578.593 0 1.082.193 1.467.578.401.369.602.834.602 1.395a1.89 1.89 0 0 1-.602 1.419c-.385.369-.874.553-1.467.553Zm1.66 1.588v13.326h-3.368v-13.326h3.368ZM131.856 217.13c0-1.347.265-2.542.794-3.584.545-1.042 1.275-1.844 2.189-2.406.93-.561 1.964-.842 3.103-.842.994 0 1.86.201 2.598.602.754.401 1.355.906 1.804 1.515v-1.9h3.392v13.326h-3.392v-1.948c-.433.625-1.034 1.146-1.804 1.563-.754.401-1.628.602-2.622.602a5.725 5.725 0 0 1-3.079-.866c-.914-.578-1.644-1.387-2.189-2.43-.529-1.058-.794-2.269-.794-3.632Zm10.488.048c0-.818-.16-1.515-.481-2.093-.321-.593-.754-1.042-1.299-1.347a3.413 3.413 0 0 0-1.756-.481c-.625 0-1.203.153-1.732.457-.529.305-.962.754-1.299 1.347-.321.578-.481 1.267-.481 2.069s.16 1.507.481 2.117c.337.593.77 1.05 1.299 1.371a3.36 3.36 0 0 0 1.732.481 3.54 3.54 0 0 0 1.756-.457c.545-.321.978-.77 1.299-1.347.321-.593.481-1.299.481-2.117ZM156.001 206.041v17.8h-3.368v-17.8h3.368Z"
            fill="#fff"
        />
        <Defs>
            <LinearGradient
                id="c"
                x1={77.993}
                y1={10.068}
                x2={144.302}
                y2={147.469}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#9B9B9B" />
                <Stop offset={1} stopColor="#fff" />
            </LinearGradient>
            <ClipPath id="a">
                <Path
                    fill="#fff"
                    transform="translate(0 10.057)"
                    d="M0 0h156v137.614H0z"
                />
            </ClipPath>
        </Defs>
    </Svg>
)

export default IconBetterOnboarding
