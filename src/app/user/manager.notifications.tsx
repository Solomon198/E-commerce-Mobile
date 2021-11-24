import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Icon, Header, Left, Body, Container, Title, H1} from 'native-base';
import Colors from '../../configs/styles/index';
export default class Notification extends React.Component {
  render() {
    return (
      <Container>
        <Header hasTabs style={styles.header}>
          <Left>
            <View style={styles.avatarContainer}>
              <Icon
                style={{color: Colors.Brand.brandColor}}
                name="user"
                type="FontAwesome"
              />
            </View>
          </Left>
          <Body>
            <Title style={styles.pageTitle}>Notification</Title>
          </Body>
        </Header>

        <View style={styles.notificationContainer}>
          <H1>Show Notifications here</H1>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  pageTitle: {color: '#000'},
  selectedStyle: {
    color: Colors.Brand.brandColor,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#f4f4f4',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.Brand.brandColor,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: Colors.Brand.brandColor,
  },
  notificationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
});
