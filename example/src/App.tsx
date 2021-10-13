import * as React from 'react';

import { StyleSheet, View, Button } from 'react-native';
import UMP from 'react-native-google-ump';

export default function App() {
  const requestConsentInfoUpdate = async () => {
    try {
      const result = await UMP.requestConsentInfoUpdate();
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
      <Button
        title="Request consent info update"
        onPress={requestConsentInfoUpdate}
      />
      <View style={styles.spacer} />
      <Button title="Get consent info" onPress={getConsentInfo} />
      <View style={styles.spacer} />
      <Button title="Load consent form" onPress={loadConsentForm} />
      <View style={styles.spacer} />
      <Button title="Show consent form" onPress={showConsentForm} />
      <View style={styles.spacer} />
      <Button title="Reset consent info" onPress={resetConsentInfo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
  },
  button: {
    backgroundColor: 'blue',
  },
  spacer: {
    height: 16,
  },
});
