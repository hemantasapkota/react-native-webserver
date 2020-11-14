import React, {useState, useEffect} from 'react';
import {
  View,
  Alert,
  NativeModules,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {WebView} from 'react-native-webview';
import AppServerStatusBar from './AppServerStatusBar';

var RNFS = require('react-native-fs');

const AppWebServer = NativeModules.AppWebServer;

const IS_ANDROID = Platform.OS === 'android';
const IS_IOS = Platform.OS == 'ios';

interface State {
  serverRunning: boolean;
  serverUrl: string | null;
  pingUrl: string | null;
}

const App = () => {
  const [state, setState] = useState<State>({
    serverRunning: false,
    serverUrl: null,
    pingUrl: null,
  });

  const handleStatusBarClick = () => {
    state.serverRunning ? handleServerStop() : handleServerStart();
  };

  const handleServerStart = async () => {
    try {
      const serverUrl = await AppWebServer.start(`${RNFS.MainBundlePath}`);
      let newState: State = {
        serverUrl,
        pingUrl: `${serverUrl}/ping`,
        serverRunning: true,
      };
      setState(newState);
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const handleServerStop = async () => {
    try {
      await AppWebServer.stop();
      let newState: State = {
        serverUrl: null,
        pingUrl: null,
        serverRunning: false,
      };
      setState(newState);
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <AppServerStatusBar
          serverRunning={state.serverRunning}
          onPress={handleStatusBarClick}
        />
        <View style={styles.webViewContainer}>
          <WebView
            style={styles.webview}
            source={{uri: state.serverRunning ? state.pingUrl : undefined}}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
  webViewContainer: {
    flex: 1,
    padding: 20,
  },
  webView: {
    flex: 1,
    backgroundColor: 'white',
  },
  infoText: {
    fontWeight: 'bold',
    paddingBottom: 10,
  },
});

export default App;
