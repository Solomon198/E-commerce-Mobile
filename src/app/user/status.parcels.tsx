import React from 'react';
import {View, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {
  Icon,
  Header,
  Right,
  Left,
  Body,
  Container,
  Title,
  Text,
  Button,
  ListItem,
  H1,
} from 'native-base';
import Colors from '../../configs/styles/index';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
import {GetUsersParcel} from '../../configs/global.enum';
import User from '../types/user';
import {Avatar} from 'react-native-ui-lib';

type Props = {
  componentId: string;
  page: number;
  gettingParcelStatus: string;
  errorGettingParcel: string;
  parcels: any[];
  user: User;
  getParcels: (userId: string, page: number) => void;
};

const mapStateToProps = (store: any) => ({
  page: store.User.page,
  gettingParcelStatus: store.User.gettingParcelStatus,
  errorGettingParcel: store.User.errorGettingParcel,
  parcels: store.User.parcels,
  user: store.Auth.user,
});

const mapDispatchStateToProps = (dispatch: any) => ({
  getParcels: (userId: string, page: number) =>
    dispatch({type: GetUsersParcel.GET_PARCEL_CALLER, userId, page}),
});

const styles = StyleSheet.create({
  selectedStyle: {
    color: Colors.Brand.brandColor,
  },
  header: {
    backgroundColor: '#fff',
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
  headerLeft: {
    maxWidth: 50,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {alignSelf: 'center', color: '#888', fontWeight: 'bold'},
  listItemLeft: {maxWidth: 50},
  userName: {fontSize: 19, marginLeft: 10},
  listItemRight: {maxWidth: 40},
  address: {fontSize: 12},
  tripCompletedText: {fontSize: 14},
  cancelledTripText: {fontSize: 14},
  tripPrice: {fontSize: 15},
  emptyComponent: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: '50%',
  },
  emptyComponentIcon: {fontSize: 100, color: Colors.Brand.brandColor},
  emptyComponentText: {fontSize: 25, fontFamily: 'sans-serif-light'},
});

class ParcelManager extends React.Component<Props> {
  componentDidMount() {
    this.props.getParcels(this.props.user.userId, 1);
  }
  render() {
    return (
      <Container>
        <Header
          androidStatusBarColor={Colors.Brand.brandColor}
          hasTabs
          style={styles.header}>
          <Left style={styles.headerLeft}>
            <Button
              onPress={() => Navigation.pop(this.props.componentId)}
              dark
              transparent>
              <Icon
                style={{color: Colors.Brand.brandColor}}
                name="arrow-back"
              />
            </Button>
          </Left>
          <Body>
            <Title style={styles.headerTitle}>Drive History</Title>
          </Body>
          <Right style={styles.listItemRight} />
        </Header>
        <FlatList
          onEndReachedThreshold={0.5}
          onEndReached={() =>
            this.props.getParcels(this.props.user.userId, this.props.page)
          }
          refreshControl={
            <RefreshControl
              onRefresh={() => this.props.getParcels(this.props.user.userId, 1)}
              refreshing={
                this.props.gettingParcelStatus ===
                GetUsersParcel.GET_PARCEL_STARTED
              }
            />
          }
          renderItem={({item}) => (
            <ListItem>
              <Left style={styles.listItemLeft}>
                <Avatar source={{uri: item.parcelPicker.photo}} />
              </Left>
              <Body>
                <H1 style={styles.userName}>
                  {item.parcelPicker.firstName +
                    ' ' +
                    item.parcelPicker.lastName}
                </H1>
                <Text style={styles.address} note>
                  {item.parcelDestinationPhysicalAddress}
                </Text>

                {item.parcelStatus === 3 && (
                  <Button iconLeft success transparent small>
                    <Icon name="checkcircle" type="AntDesign" />
                    <Text uppercase={false} style={styles.tripCompletedText}>
                      Trip Completed
                    </Text>
                  </Button>
                )}

                {item.parcelStatus === 4 && (
                  <Button iconLeft danger transparent small>
                    <Icon name="cancel" type="MaterialIcons" />
                    <Text uppercase={false} style={styles.cancelledTripText}>
                      {item.userReject
                        ? 'You cancelled trip'
                        : item.parcelPicker.firstName + ' cancelled trip'}
                    </Text>
                  </Button>
                )}
              </Body>
              <Right style={styles.listItemRight}>
                <H1 style={styles.tripPrice}>₦{item.parcelPrice}</H1>
              </Right>
            </ListItem>
          )}
          data={this.props.parcels}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={
            <View style={styles.emptyComponent}>
              <Icon
                style={styles.emptyComponentIcon}
                type="MaterialIcons"
                name="drive-eta"
              />
              <Text style={styles.emptyComponentText}>No drive history</Text>
            </View>
          }
        />
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchStateToProps)(ParcelManager);
