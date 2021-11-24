import {Navigation} from 'react-native-navigation';

export const toggleSideMenu = (status: boolean, componentId: string) => {
  Navigation.mergeOptions(componentId, {
    sideMenu: {
      left: {
        visible: status,
      },
    },
  });
};
