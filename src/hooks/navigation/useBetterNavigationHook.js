import { useNavigation } from "@react-navigation/core"

import { NavigationConstants } from "../../utils/constants"

const useBetterNavigationHook = () => {
    const navigation = useNavigation()

    const toCreatePost = () => {
        navigation.navigate(NavigationConstants.CREATE_POST_SCREEN)
    }

    const toCreatePostWithTopic = (topic) => {
        if (topic === undefined || topic?.length === 0 || topic === null) throw new Error('topic is undefined')

        navigation.navigate(NavigationConstants.CREATE_POST_SCREEN, { topic })
    }

    return {
        toCreatePost,
        toCreatePostWithTopic
    }
}

export default useBetterNavigationHook