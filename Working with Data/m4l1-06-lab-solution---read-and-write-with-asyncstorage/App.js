import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import Constants from 'expo-constants';
import { Switch } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import useUpdate from './useUpdate';

export default function App() {
  const [preferences, setPreferences] = useState({
    pushNotifications: false,
    emailMarketing: false,
    latestNews: false,
  });

  useEffect(() => {
    // Populating preferences from storage using AsyncStorage.multiGet
    (async () => {
      try {
        const values = await AsyncStorage.multiGet(Object.keys(preferences));
        const initialState = values.reduce((acc, curr) => {
          // Every item in the values array is itself an array with a string key and a stringified value, i.e ['pushNotifications', 'false']
          acc[curr[0]] = JSON.parse(curr[1]);
          return acc;
        }, {});
        setPreferences(initialState);
      } catch (e) {
        Alert.alert(`An error occurred: ${e.message}`);
      }
    })();
  }, []);

  // This effect only runs when the preferences state updates, excluding initial mount
  useUpdate(() => {
    (async () => {
      // Every time there is an update on the preference state, we persist it on storage
      // The exercise requierement is to use multiSet API
      const keyValues = Object.entries(preferences).map((entry) => {
        return [entry[0], String(entry[1])];
      });
      try {
        await AsyncStorage.multiSet(keyValues);
      } catch (e) {
        Alert.alert(`An error occurred: ${e.message}`);
      }
    })();
  }, [preferences]);

  const updateState = (key) => () =>
    setPreferences((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Account Preferences</Text>
      <View style={styles.row}>
        <Text style={styles.text}>Push notifications</Text>
        <Switch
          value={preferences.pushNotifications}
          onValueChange={updateState('pushNotifications')}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Marketing emails</Text>
        <Switch
          value={preferences.emailMarketing}
          onValueChange={updateState('emailMarketing')}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Latest news</Text>
        <Switch
          value={preferences.latestNews}
          onValueChange={updateState('latestNews')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  text: {
    fontSize: 18,
  },
  header: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
