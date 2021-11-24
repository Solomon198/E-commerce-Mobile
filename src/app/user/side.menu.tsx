import React from 'react';
import {View, TouchableOpacity, StyleSheet, StatusBar} from 'react-native';
import {Body, Icon, ListItem, Text, Title} from 'native-base';
import Colors from '../../configs/styles/index';
import {toggleSideMenu} from './navigations.actions';
import {Navigation} from 'react-native-navigation';
import {Avatar} from 'react-native-ui-lib';
import {AuthNavigationSettingStack} from '../../../nav.config/nav.stack';
import User from '../types/user';
import {connect} from 'react-redux';
import NavigationScreens from '../../../nav.config/navigation.screens';
import {getDefaultProfilePicture} from '../utilities/helper.funcs';

type Props = {
  user: User;
  componentId: string;
  centerComponentId: string;
  logout: () => void;
};

const mapStateToProps = (store: any) => ({
  user: store.Auth.user,
});

const mapDispatchStateToProps = (dispatch: any) => ({
  logout: () => dispatch({type: 'DO-LOGOUT'}),
});

const styles = StyleSheet.create({
  menuItems: {
    borderColor: 'transparent',
  },
  menuText: {
    fontSize: 18,
  },
  menuIcon: {
    color: Colors.Brand.brandColor,
  },
  userInfoContainer: {
    flexDirection: 'row',
  },
  icoProfile: {
    fontSize: 50,
    marginBottom: 10,
    color: Colors.Brand.brandColor,
  },
  userName: {
    marginTop: 15,
    fontWeight: 'bold',
    color: Colors.Brand.brandColor,
  },

  mainContainer: {flex: 1, backgroundColor: '#f4f4f4'},
  avatarContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  avatar: {
    marginLeft: 10,
  },
  titleContainer: {marginLeft: 15},
  profileTitleContainer: {marginLeft: 15, fontSize: 12, color: '#555'},
  flexContainer: {
    flex: 1,
  },
});

class SideMenu extends React.Component<Props> {
  navigate(name: string) {
    toggleSideMenu(false, this.props.componentId);
    Navigation.push('stack.user.center', {
      component: {
        name: name,
      },
    });
  }
  render() {
    return (
      <View style={styles.mainContainer}>
        <StatusBar backgroundColor={Colors.Brand.brandColor} />
        <TouchableOpacity
          onPress={() => this.navigate(NavigationScreens.USER_PROFILE)}
          style={styles.avatarContainer}>
          <Avatar
            containerStyle={styles.avatar}
            onPress={() => this.navigate(NavigationScreens.USER_PROFILE)}
            size={70}
            source={
              this.props.user.photo
                ? {uri: this.props.user.photo}
                : getDefaultProfilePicture(this.props.user.gender)
            }
          />
          <View>
            <View style={styles.titleContainer}>
              <Title style={styles.userName}>
                {this.props.user.firtName + ' ' + this.props.user.lastName}
              </Title>
            </View>

            <Text uppercase={false} style={styles.profileTitleContainer}>
              My Profile
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.flexContainer}>
          <ListItem
            onPress={() =>
              this.navigate(NavigationScreens.PARCEL_MANAGER_SCREEN)
            }
            style={styles.menuItems}>
            <Icon
              style={styles.menuIcon}
              type="MaterialIcons"
              name="drive-eta"
            />
            <Body>
              <Text style={styles.menuText}>Drive history</Text>
            </Body>
          </ListItem>

          <ListItem
            onPress={() =>
              this.navigate(NavigationScreens.PAYMENT_OPTION_SCREEN)
            }
            style={styles.menuItems}>
            <Icon style={styles.menuIcon} type="FontAwesome5" name="coins" />
            <Body>
              <Text style={styles.menuText}>Payments</Text>
            </Body>
          </ListItem>

          {/* <ListItem style={styles.menuItems}>
            <Icon
              style={styles.menuIcon}
              type="MaterialIcons"
              name="contact-support"
            />
            <Body>
              <Text style={styles.menuText}>Support</Text>
            </Body>
          </ListItem> */}

          {/* <ListItem style={styles.menuItems}>
            <Icon
              style={styles.menuIcon}
              type="Entypo"
              name="info-with-circle"
            />
            <Body>
              <Text style={styles.menuText}>About Dan Sako</Text>
            </Body>
          </ListItem> */}

          <ListItem
            onPress={() =>
              AuthNavigationSettingStack().then(() => {
                this.props.logout();
              })
            }
            style={styles.menuItems}>
            <Icon style={styles.menuIcon} type="AntDesign" name="logout" />
            <Body>
              <Text style={styles.menuText}>Logout</Text>
            </Body>
          </ListItem>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchStateToProps)(SideMenu);
