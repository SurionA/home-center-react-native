/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import { getHomeHydrometries } from './homeapi'
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  ScrollView,
  ActivityIndicator
} from 'react-native';

export default class homeCenterApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hydrometriesJSON: [],
      isLoading: true
    };
  }

  _getHomeHydrometries() {
    console.log('_getHomeHydrometries');
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    getHomeHydrometries() // fetch() retourne une Promise
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
    this._getHomeHydrometries();
  }

  renderLoadingMessage() {
    return (

      <View style={styles.loadingContainer}>
        <ActivityIndicator
          animating={true}
          color={'#fff'}
          size={'small'}
          style={{margin: 15}} />
          <Text style={{color: '#fff'}}>Contacting Unsplash</Text>

      </View>
    );
  }
  renderResults() {


    return (
      <View style={styles.container} >
        <View>
          <Text style={styles.welcome}>
            Welcome to SurionA Home center !
          </Text>
        </View>
        <View style={styles.subheader}>
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    color: '#F5D785',
    margin: 10,
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
