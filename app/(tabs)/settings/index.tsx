import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// Import the package.json file
import packageJson from '../../../package.json';
import { Switch } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      {/* option to change app color theme */}
      <View style={styles.colorThemeOptionContainer}>
        {/* section title */}
        <Text style={styles.optionText}>Color Theme</Text>
        {/* options container */}
        <View style={styles.optionsContainer}>
          {/* theme option */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              flexGrow: 1,
              borderBottomColor: '#ddd',
              paddingVertical: 10,
              borderBottomWidth: 1,
            }}
          >
            {/* Text container */}
            <Text style={{ flexGrow: 1, fontFamily: 'BalooBhaijaan2' }}>Light Theme</Text>
            {/* Switch container */}
            <Switch trackColor={{ false: '#ddd', true: '#81b0ff' }} thumbColor={'#f4f3f5'} ios_backgroundColor='#3e3e3e' />
          </View>
          {/* option 2 */}
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexGrow: 1, paddingVertical: 10 }}>
            {/* Text container */}
            <Text style={{ flexGrow: 1, fontFamily: 'BalooBhaijaan2' }}>Dynamic Theme</Text>
            {/* Switch container */}
            <Switch trackColor={{ false: '#ddd', true: '#81b0ff' }} thumbColor={'#f4f3f5'} ios_backgroundColor='#3e3e3e' />
          </View>
        </View>
      </View>
      {/* Support and about section */}
      <View style={styles.colorThemeOptionContainer}>
        {/* section title */}
        <Text style={styles.optionText}>Support & About</Text>
        {/* options container */}
        <View style={styles.optionsContainer}>
          {/* theme option */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              flexGrow: 1,
              borderBottomColor: '#ddd',
              paddingVertical: 10,
              gap: 10,
              borderBottomWidth: 1,
            }}
          >
            {/* icon */}
            <Icon name='information-circle-outline' size={22} color='#8E8E93' />
            {/* Text container */}
            <Text style={{ flexGrow: 1, fontFamily: 'BalooBhaijaan2', color: '#8E8E93' }}>Light Theme</Text>
            {/* Switch container */}
            <Icon name='chevron-forward-outline' size={22} color='#8E8E93' />
          </View>
          {/* option 2 */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              flexGrow: 1,
              paddingVertical: 10,
              gap: 10,
            }}
          >
            <Icon name='information-circle-outline' size={22} color='#8E8E93' />

            {/* Text container */}
            <Text style={{ flexGrow: 1, fontFamily: 'BalooBhaijaan2', color: '#8E8E93' }}>App Version</Text>
            {/* Switch container */}
            <Text style={{ fontFamily: 'BalooBhaijaan2', color: '#8E8E93' }}>{packageJson.version}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  colorThemeOptionContainer: {
    backgroundColor: '#fff',
    marginTop: 20,
  },
  // options container
  optionsContainer: {
    flexDirection: 'column',
    backgroundColor: '#eee',
    borderRadius: 10,
    padding: 10,
  },
  optionText: {
    fontFamily: 'BalooBhaijaan2',
    fontSize: 20,
    color: 'gray',
  },
});
