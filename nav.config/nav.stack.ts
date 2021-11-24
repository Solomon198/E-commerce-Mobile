import {Navigation} from 'react-native-navigation';
import NavigationScreens from './navigation.screens';

export function DefaultNavSettingStack() {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: NavigationScreens.SWITCH_SCREEN,
              id: NavigationScreens.SWITCH_SCREEN,
            },
          },
        ],
      },
    },
  });
}

export function AuthNavigationSettingStack() {
  return Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: NavigationScreens.SIGNIN_SCREEN,
              id: NavigationScreens.SIGNIN_SCREEN,
            },
          },
        ],
      },
    },
  });
}

export function User() {
  Navigation.setRoot({
    root: {
      sideMenu: {
        center: {
          stack: {
            id: 'stack.user.center',
            children: [
              {
                component: {
                  name: NavigationScreens.DASHBOARD_SCREEN,
                  id: NavigationScreens.DASHBOARD_SCREEN,
                },
              },
            ],
          },
        },

        left: {
          component: {
            name: NavigationScreens.SIDEMENU_SCREEN,
            id: NavigationScreens.SIDEMENU_SCREEN,
          },
        },
      },
    },
  });
}
