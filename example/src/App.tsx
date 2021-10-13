import * as React from 'react';

import { StyleSheet, View, Button, TextInput } from 'react-native';
import UMP from 'react-native-google-ump';

export default function App() {
  const [adMobAppId, setAdMobAppId] = React.useState<string>();

  const requestConsentInfoUpdate = async () => {
    try {
      const result = await UMP.requestConsentInfoUpdate({ adMobAppId });
      console.log('requestConsentInfoUpdate result:', result);
    } catch (error) {
      console.error('requestConsentInfoUpdate error:', error);
    }
  };

  const getConsentInfo = async () => {
    try {
      const result = await UMP.getConsentInfo();
      console.log('getConsentInfo result:', result);
    } catch (error) {
      console.error('getConsentInfo error:', error);
    }
  };

  const loadConsentForm = async () => {
    try {
      const result = await UMP.loadConsentForm();
      console.log('loadConsentForm result:', result);
    } catch (error) {
      console.error('loadConsentForm error:', error);
    }
  };

  const showConsentForm = async () => {
    try {
      const result = await UMP.showConsentForm();
      console.log('showConsentForm result:', result);
    } catch (error) {
      console.error('showConsentForm error:', error);
    }
  };

  const resetConsentInfo = async () => {
    try {
      const result = await UMP.resetConsentInfo();
      console.log('resetConsentInfo result:', result);
    } catch (error) {
      console.error('resetConsentInfo error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"
        onChangeText={setAdMobAppId}
      />
      <View style={styles.spacer} />
      <Button
        color="#2196F3"
        title="Request consent info update"
        onPress={requestConsentInfoUpdate}
      />
      <View style={styles.spacer} />
      <Button
        color="#2196F3"
        title="Get consent info"
        onPress={getConsentInfo}
      />
      <View style={styles.spacer} />
      <Button
        color="#2196F3"
        title="Load consent form"
        onPress={loadConsentForm}
      />
      <View style={styles.spacer} />
      <Button
        color="#2196F3"
        title="Show consent form"
        onPress={showConsentForm}
      />
      <View style={styles.spacer} />
      <Button
        color="#2196F3"
        title="Reset consent info"
        onPress={resetConsentInfo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
  },
  input: {
    borderColor: '#2196F3',
    borderWidth: 1,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'blue',
  },
  spacer: {
    height: 16,
  },
});
