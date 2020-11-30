import React from 'react';
import { Text, TouchableHighlight, StyleSheet, View } from 'react-native';

interface Props {
  onPress: Function;
  serverRunning: boolean;
}

const AppServerStatusBar: React.FC<Props> = ({ serverRunning, onPress }) => {
  return (
    <View>
      <TouchableHighlight style={styles.serverStatusBar} onPress={onPress}>
        <Text style={styles.serverStatusBarText}>
          {serverRunning
            ? 'In-app server running. Click to shutdown.'
            : 'In-app server not running. Click to start.'}
        </Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  serverStatusBar: {
    width: '100%',
    height: 30,
    backgroundColor: '#FFB74D',
    justifyContent: 'center',
  },
  serverStatusBarText: {
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

export default AppServerStatusBar;
