/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import { getHomeHydrometries } from './homeapi';
import io from 'socket.io-client/socket.io'

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  StatusBar,
  Text,
  View,
  ListView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Animated,
  Easing
} from 'react-native';

export default class homeCenterApp extends Component {
  constructor(props) {
    super(props);
    this.socket = io('http://home.suriona.com', { path: '/home-center/socket/hydrometries/socket.io', transports: ['websocket'] });
    this.state = {
      hydrometriesJSON: [],
      spinValue: new Animated.Value(0),
      isLoading: true,
      socketStatus: 'Not connected',
      nbCo: 0
    };
  }

  _getHomeHydrometries() {
    this.state.spinValue.setValue(0);
    Animated.timing(this.state.spinValue, {
        toValue: 100,
        easing: Easing.linear,
        duration: 1000
    }).start(() => console.log('animation complete'));
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    getHomeHydrometries()
      .then(json => this.setState({
        hydrometriesJSON: json,
        hydrometriesLIST: ds.cloneWithRows(json),
        isLoading: false
      }))
      .then(() => console.log('hydrometriesJSON', this.state.hydrometriesJSON))
      .catch(error => console.error(error))
  }

  componentDidMount() {
    console.log('componentDidMount');
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this._getHomeHydrometries();
    this.socket.on('connect', () => {
      this.setState({
        socketStatus: 'Connected'
      });
    });

    this.socket.on('hydrometry:save', (hydrometry) => {
      this.state.hydrometriesJSON.unshift(hydrometry);
      this.setState({
        hydrometriesLIST: ds.cloneWithRows(this.state.hydrometriesJSON)
      });
    });
  }

  renderLoadingMessage() {
    return (

      <View style={styles.loadingContainer}>
        <ActivityIndicator
          animating={true}
          color={'#B6D9E5'}
          size={'large'}
          style={{margin: 15}} />
        <Text style={{color: '#B6D9E5'}}>Loading</Text>

      </View>
    );
  }
  renderResults() {
    const getStartValue = () => '0deg'
    const getEndValue = () => '360deg'

    const spin = this.state.spinValue.interpolate({
       inputRange: [0, 100],
       outputRange: [getStartValue(), getEndValue()]
     })

    return (
      <View style={styles.container} >
        <StatusBar
          backgroundColor="#2E538F"
        />
        <View style={styles.header}>
          <Text style={styles.welcome}>
            SurionA Home center
          </Text>
          <TouchableOpacity style={styles.buttonRefresh} onPress={this._getHomeHydrometries.bind(this)}>
            <Animated.Image
              style={{width: 30, height: 30, transform: [{rotate: spin}]}}
              source={require('./refresh.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.subheader}>
          <Text style={styles.currentHydo}>Socket Status: &nbsp;
            <Text style={styles.hydroVal}>
              {this.state.socketStatus}
            </Text>
          </Text>
          <Text style={styles.currentHydo}>Current temperature: &nbsp;
            <Text style={styles.hydroVal}>
              {this.state.hydrometriesJSON[0].inside_temperature}°C
            </Text>
          </Text>
          <Text style={styles.currentHydo}>Current humidity: &nbsp;
            <Text style={styles.hydroVal}>
              {this.state.hydrometriesJSON[0].inside_humidity}%
            </Text>
          </Text>
        </View>
        <View style={styles.listheader}>
          <Text style={styles.instructions}>
            Hydrometries of the 24 last hours:
          </Text>
        </View>
        <ListView
          style={styles.listview}
          dataSource={this.state.hydrometriesLIST}
          renderRow={(rowData) => <View style={styles.listitems}>
            <Text style={styles.hydroValDate}>{new Date(rowData.createdAt).toLocaleString('fr')}</Text>
            <Text style={styles.liscontent}>inside:&nbsp;
              <Text style={styles.hydroVal}>
                {rowData.inside_temperature}°C - {rowData.inside_humidity}%
              </Text>
            </Text>
            <Text style={styles.liscontent}>outside:&nbsp;
              <Text style={styles.hydroVal}>
                {rowData.outside_temperature}°C  - {rowData.outside_humidity}%
              </Text>
            </Text>
          </View>
          }
        />
      </View>
    );
  }
  render() {
    var {isLoading} = this.state;
    if(isLoading)
      return this.renderLoadingMessage();
    else
      return this.renderResults();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E538F',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#314262',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    color: '#F5D785',
    margin: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginRight: 10,
    marginLeft: 10
  },
  subheader: {
    alignSelf: 'stretch',
    backgroundColor: '#314262',
    borderTopWidth: 0.5,
    borderTopColor: '#F5D785',
    paddingTop: 15,
    paddingBottom: 15
  },
  listheader: {
    alignSelf: 'stretch',
    backgroundColor: '#314262',
    borderBottomWidth: 0.5,
    borderBottomColor: '#F5D785',
    paddingBottom: 15
  },
  buttonRefresh: {
    width: 30,
    height: 30
  },
  instructions: {
    textAlign: 'center',
    color: '#F5D785',
    fontWeight: '500'
  },
  currentHydo: {
    textAlign: 'center',
    color: '#B6D9E5',
    marginBottom: 5
  },
  listview: {
    alignSelf: 'stretch',
    backgroundColor: '#314262',
    paddingBottom: 100
  },
  listitems: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  liscontent: {
    color: '#B6D9E5'
  },
  hydroVal: {
    fontWeight: '500',
    color: '#F5D785'
  },
  hydroValDate: {
    fontWeight: '900',
    color: '#B6D9E5'
  }
});

AppRegistry.registerComponent('homeCenterApp', () => homeCenterApp);
