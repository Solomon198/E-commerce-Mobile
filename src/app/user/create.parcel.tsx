import React from 'react';
import _ from 'lodash';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Modal,
  Alert,
  Dimensions,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {Icon, Text, Fab, H1, H2, Textarea} from 'native-base';
import Colors from '../../configs/styles/index';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
import SpinKit from 'react-native-spinkit';
import {
  GetCategories,
  inputActionType,
  Post,
  searchLocation,
  setLocation,
} from '../../configs/global.enum';
import crashlytics from '@react-native-firebase/crashlytics';
import {Picker} from 'react-native-ui-lib';
import utilities from '../utilities';
import User from '../types/user';
import storage from '@react-native-firebase/storage';
import brandColors from '../../configs/styles/brand.colors';
import {formatAmountWithComma} from '../utilities/helper.funcs';

const {width} = Dimensions.get('window');
const firebaseStorage = storage;

type searchResult = {
  primaryText: string;
  placeID: string;
  secondaryText: string;
  fullText: string;
};

type locationDetails = {
  name: string;
  longitude: number;
  address: string;
  latitude: number;
};
type Props = {
  longitude: number;
  latitude: number;
  user: User;
  componentId: string;
  locationSearchString: string;
  destinationSearchString: string;
  locationInputActive: boolean;
  searchingLocation: string;
  searchingDestination: string;
  searchResults: searchResult[];
  pickUpLocation: locationDetails;
  pickUpDestination: locationDetails;
  categories: any[];
  feeds: any[];
  postStatus: string;
  isUpdate: boolean;
  postToEdit: any;

  setDestinationSearchString: (str: string) => void;
  setLocationSearchString: (str: string) => void;
  setLocationInputActive: (status: boolean) => void;
  searchLocation: (str: string) => void;
  setLocation: (placeId: string) => void;
  setFetchedLocation: (payload: any) => void;
  ressetInputs: () => void;
  setVariables: (payload: any) => void;
  getCategories: () => void;
  post: (payload: any, isUpdate: boolean) => void;
};
const mapStateToProps = (store: any) => ({
  locationSearchString: store.User.locationSearchString,
  destinationSearchString: store.User.destinationSearchString,
  locationInputActive: store.User.locationInputActive,
  searchingLocation: store.User.searchingLocation,
  searchingDestination: store.User.searchingDestination,
  searchResults: store.User.searchResults,
  pickUpLocation: store.User.pickUpLocation,
  pickUpDestination: store.User.pickUpDestination,
  user: store.Auth.user,
  categories: store.User.categories,
  feeds: store.User.posts,
  postStatus: store.User.postStatus,
});

const mapDispatchStateToProps = (dispatch: any) => ({
  setLocationSearchString: (str: string) =>
    dispatch({type: inputActionType.SET_PARCEL_LOCATION_CALLER, payload: str}),
  setDestinationSearchString: (str: string) =>
    dispatch({
      type: inputActionType.SET_PARCEL_DESITINATION_CALLER,
      payload: str,
    }),
  setLocationInputActive: (status: boolean) =>
    dispatch({
      type: inputActionType.SET_LOCATION_ACTIVE_CALLER,
      payload: status,
    }),
  searchLocation: (str: string) =>
    dispatch({type: searchLocation.SEARCH_LOCATION_CALLER, payload: str}),
  setLocation: (placeId: string) =>
    dispatch({type: setLocation.SET_LOCATION_CALLER, payload: placeId}),
  ressetInputs: () => dispatch({type: inputActionType.SET_RESET_INPUTS_CALLER}),
  setVariables: (payload: any) =>
    dispatch({type: inputActionType.SET_VARIABLES_CALLER, payload}),
  setFetchedLocation: (payload: any) =>
    dispatch({type: inputActionType.SET_LOCATION_CALLER, payload: payload}),
  getCategories: () => dispatch({type: GetCategories.GET_CATEGORIES_CALLER}),
  post: (payload: any, isUpdate: boolean) =>
    dispatch({type: Post.POST_CALLER, payload, isUpdate}),
});

const styles = StyleSheet.create({
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageClose: {
    width: 50,
    height: 50,
    backgroundColor: 'whitesmoke',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#e8e8e8',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  accountActions: {
    backgroundColor: '#f4f4f4',
    width: 60,
    height: 60,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadAction: {
    fontFamily: 'sans-serif-light',
    marginVertical: 50,
    fontSize: 19,
    fontWeight: 'bold',
    color: Colors.Brand.brandColor,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 20,
  },
  uploaderContainer: {justifyContent: 'center', alignItems: 'center'},
  progressPercentage: {
    position: 'absolute',
    fontWeight: 'bold',
    color: Colors.Brand.brandColor,
  },
});
class CreateParcel extends React.Component<Props> {
  navigationEventListener: any;
  ref: any;
  vRef: any;
  pickUplocationTimerHandler: any;
  destinationTimerHandler: any;

  locationRef: any;

  state = {
    longitude: this.props.longitude,
    latitude: this.props.latitude,
    showModal: false,
    address: '',
    gettingLocationStatus: 'NOT-STARTED',
    language: '',
    coverImage: '',
    title: '',
    description: '',
    price: '',
    category: {value: '', label: ''},
    count: 0,
    totalPercentage: 0,
    uploading: false,
    uploadState: 'Uploading Image ....',
  };

  goBack() {
    Keyboard.dismiss();
    Navigation.pop(this.props.componentId);
  }

  post(media: string) {
    this.setState({uploading: true});

    const checkPicture = this.state.coverImage.indexOf('http');
    if (this.props.postToEdit && checkPicture >= 0) {
      return this.props.post(
        {
          title: this.state.title,
          description: this.state.description,
          coverImage: this.state.coverImage,
          category: this.state.category.value,
          price: this.state.price,
          userId: this.props.user.userId,
          postId: this.props.postToEdit.postId,
        },
        this.props.postToEdit.postId ? true : false,
      );
    }

    const stamp = new Date().getTime();
    let $task = firebaseStorage()
      .ref('/profile/medias/user')
      .child('Img' + stamp)
      .putFile(media);

    $task.on('state_changed', (task) => {
      let percentageUploaded = (task.bytesTransferred / task.totalBytes) * 100;
      this.setState({totalPercentage: percentageUploaded});
    });

    $task.then(() => {
      $task.snapshot?.ref
        .getDownloadURL()
        .then((url) => {
          this.setState({uploading: false});
          const $post = {
            title: this.state.title,
            description: this.state.description,
            coverImage: url,
            category: this.state.category.value,
            price: this.state.price.toString(),
            userId: this.props.user.userId,
          };
          if (this.props.postToEdit) {
            if (this.props.postToEdit.postId) {
              $post['postId'] = this.props.postToEdit.postId;
            }
          }
          this.props.post($post, this.props?.postToEdit?.postId ? true : false);
        })
        .catch((e) => {
          console.log(e);
          crashlytics().log('could not get download url for uploaded task');
          crashlytics().recordError(e);
        });
    });

    $task.catch((e) => {
      crashlytics().log('uploading image failed');
      crashlytics().recordError(e);
      this.setState({uploading: false}, () => {
        Alert.alert('', 'unable to upload profile photo');
      });
    });
  }

  uploadProfilePic() {
    utilities.Helpers.getImageFromGallery()
      .then((url) => {
        this.setState({coverImage: url});
        // this.setState(
        //   {uploading: true, uploadState: 'Uploading Profile Picture ....'},
        //   () => {
        //     this.upload(url as string);
        //   },
        // );
      })
      .catch((e) => {
        crashlytics().log('uploading error');
        crashlytics().recordError(e);
        Alert.alert('', 'unable to upload profile photo');
      });
  }

  componentDidMount() {
    this.props.getCategories();

    if (this.props.postToEdit) {
      const {
        coverImage,
        title,
        description,
        price,
        category,
      } = this.props.postToEdit;
      const {name} = this.props.categories.find(
        ($category) => $category.categoryId === category,
      );
      this.setState({
        coverImage,
        title,
        description,
        price: price.toString(),
        category: {label: name, value: category},
      });
    }
  }

  renderUploader() {
    return (
      <Modal
        transparent
        visible={
          this.state.uploading || this.props.postStatus === Post.POST_STARTED
        }>
        <View style={styles.modal}>
          <View style={styles.uploaderContainer}>
            <SpinKit size={200} type="Circle" color={Colors.Brand.brandColor} />
            <H2 style={styles.progressPercentage}>
              {this.state.totalPercentage.toFixed(0) + '%'}
            </H2>
          </View>
          <H1 style={styles.uploadAction}>{this.state.uploadState} </H1>
        </View>
      </Modal>
    );
  }

  render() {
    const formatCategories = this.props.categories.map((category) => ({
      label: category.name,
      value: category.categoryId,
    }));

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: '#fff', padding: 10}}>
        {this.renderUploader()}
        <View style={styles.postHeader}>
          <View>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#777'}}>
              {this.props.postToEdit
                ? 'Editing post'
                : 'What do you want to sell ?'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => Navigation.pop(this.props.componentId)}
            style={styles.pageClose}>
            <Icon
              style={{color: '#444', fontSize: 20}}
              name="close"
              type="AntDesign"
            />
          </TouchableOpacity>
        </View>
        {this.state.coverImage ? (
          <ImageBackground
            source={{uri: this.state.coverImage}}
            style={{width: null, height: 250}}
            resizeMode="cover"
            resizeMethod="resize"
            imageStyle={{borderRadius: 10}}>
            <TouchableOpacity
              onPress={() => this.uploadProfilePic()}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon
                type="MaterialCommunityIcons"
                name="image-plus"
                style={{color: '#e0e0e0', fontSize: 80}}
              />
            </TouchableOpacity>
          </ImageBackground>
        ) : (
          <TouchableOpacity
            onPress={() => this.uploadProfilePic()}
            style={{
              height: 250,
              borderWidth: 2,
              borderColor: 'lightgray',
              borderStyle: 'dashed',
              borderRadius: 10,
              marginTop: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              type="MaterialCommunityIcons"
              name="image-plus"
              style={{color: '#e0e0e0', fontSize: 80}}
            />
          </TouchableOpacity>
        )}

        <TextInput
          style={styles.input}
          value={this.state.title}
          placeholder="Title e.g Delicous pounded yam"
          onChangeText={(text) => this.setState({title: text})}
          editable={this.state.coverImage ? true : false}
        />
        <Textarea
          maxLength={160}
          numberOfLines={3}
          value={this.state.description}
          style={styles.input}
          onChangeText={(text) => this.setState({description: text})}
          placeholder="describe your package"
          disabled={!this.state.title ? true : false}
        />

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View>
            <TextInput
              keyboardType="numeric"
              value={this.state.price}
              style={styles.input}
              editable={this.state.description ? true : false}
              placeholder="How much does it cost ?"
              onChangeText={(text) => this.setState({price: text})}
            />
          </View>
          <View style={{flex: 1}}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 25,
                alignSelf: 'center',
                color: '#888',
              }}>
              ₦{formatAmountWithComma(this.state.price ? this.state.price : 0)}
              .00
            </Text>
          </View>
        </View>

        <Picker
          placeholder="What type of item do you want to sell ? "
          floatingPlaceholder
          value={this.state.category}
          enableModalBlur={false}
          onChange={(item) => this.setState({category: item})}
          topBarProps={{title: 'Categories'}}
          showSearch
          searchPlaceholder={'Search a category'}
          searchStyle={{
            color: Colors.blue30,
            placeholderTextColor: Colors.grey50,
          }}>
          {_.map(formatCategories, (option) => (
            <Picker.Item key={option.value} value={option} disabled={false} />
          ))}
        </Picker>
        {this.state.category.value && this.state.price ? (
          <Fab
            active={true}
            style={{left: 10}}
            style={{backgroundColor: brandColors.brandColor}}
            position="bottomRight"
            onPress={() => this.post(this.state.coverImage)}>
            <Icon style={{color: '#fff'}} name="check" type="Feather" />
          </Fab>
        ) : null}
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchStateToProps)(CreateParcel);
