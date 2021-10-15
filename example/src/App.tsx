import * as React from 'react';

import { StyleSheet, View, Button, Switch, Text } from 'react-native';
import UMP, { DebugGeography } from 'react-native-google-ump';

export default function App() {
  const [underaged, setUnderaged] = React.useState(false);
  const [fakeEEA, setFakeEEA] = React.useState(false);
  const [fakeNotEEA, setFakeNotEEA] = React.useState(false);

  const toggleEEA = (newValue: boolean) => {
    if (newValue) {
      setFakeEEA(true);
      setFakeNotEEA(false);
    } else {
      setFakeEEA(false);
    }
  };

  const toggleNotEEA = (newValue: boolean) => {
    if (newValue) {
      setFakeNotEEA(true);
      setFakeEEA(false);
    } else {
      setFakeNotEEA(false);
    }
  };

  const requestConsentInfoUpdate = async () => {
    const debugGeography = fakeEEA
      ? DebugGeography.EEA
      : DebugGeography.DISABLED;
    try {
      const result = await UMP.requestConsentInfoUpdate({
        underAgeOfConsent: underaged,
        debugGeography,
      });
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
      <View style={styles.option}>
        <Text>Tag for under age of consent</Text>
        <Switch value={underaged} onValueChange={setUnderaged} />
      </View>
      <View style={styles.option}>
        <Text>Pretend to be in the EEA</Text>
        <Switch value={fakeEEA} onValueChange={toggleEEA} />
      </View>
      <View style={styles.option}>
        <Text>Pretend not to be in the EEA</Text>
        <Switch value={fakeNotEEA} onValueChange={toggleNotEEA} />
      </View>
      <View style={styles.spacer} />
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
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: 'blue',
  },
  spacer: {
    height: 16,
  },
});
