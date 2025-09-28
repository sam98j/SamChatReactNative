import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// Import the package.json file
import packageJson from '../../../../package.json';
import { Switch } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import i18n from '@/i18n';

export default function SettingsScreen() {
  // t method
  const t = i18n.t.bind(i18n);
  // current locale
  const prefLang = i18n.locale;
  return (
    <View style={[styles.container, { direction: prefLang === 'ar' ? 'rtl' : 'ltr' }]}>
      {/* option to change app color theme */}
      <View style={styles.colorThemeOptionContainer}>
        {/* section title */}
        <Text style={styles.optionText}>{t('settings.colorTheme')}</Text>
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
            <Text style={{ flexGrow: 1, fontFamily: 'BalooBhaijaan2' }}>{t('settings.lightTheme')}</Text>
            {/* Switch container */}
            <Switch trackColor={{ false: '#ddd', true: '#81b0ff' }} thumbColor={'#f4f3f5'} ios_backgroundColor='#3e3e3e' />
          </View>
          {/* option 2 */}
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexGrow: 1, paddingVertical: 10 }}>
            {/* Text container */}
            <Text style={{ flexGrow: 1, fontFamily: 'BalooBhaijaan2' }}>{t('settings.dynamicTheme')}</Text>
            {/* Switch container */}
            <Switch trackColor={{ false: '#ddd', true: '#81b0ff' }} thumbColor={'#f4f3f5'} ios_backgroundColor='#3e3e3e' />
          </View>
        </View>
      </View>
      {/* Support and about section */}
      <View style={styles.colorThemeOptionContainer}>
        {/* section title */}
        <Text style={styles.optionText}>{t('settings.supportAbout')}</Text>
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
            <Icon name='moon-outline' size={21} color='#8E8E93' />
            {/* Text container */}
            <Text style={{ flexGrow: 1, fontFamily: 'BalooBhaijaan2', color: '#8E8E93' }}>{t('settings.darkTheme')}</Text>
            {/* Switch container */}
            <Icon
              name='chevron-forward-outline'
              size={22}
              color='#8E8E93'
              style={{ transform: [{ scaleX: prefLang === 'ar' ? -1 : 1 }] }}
            />
          </View>
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
            <Icon name='sunny-outline' size={22} color='#8E8E93' />
            {/* Text container */}
            <Text style={{ flexGrow: 1, fontFamily: 'BalooBhaijaan2', color: '#8E8E93' }}>{t('settings.lightTheme')}</Text>
            {/* Switch container */}
            <Icon
              name='chevron-forward-outline'
              size={22}
              color='#8E8E93'
              style={{ transform: [{ scaleX: prefLang === 'ar' ? -1 : 1 }] }}
            />
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
            <Text style={{ flexGrow: 1, fontFamily: 'BalooBhaijaan2', color: '#8E8E93' }}>{t('settings.appVersion')}</Text>
            {/* Switch container */}
            <Text style={{ fontFamily: 'BalooBhaijaan2', color: '#8E8E93' }}>{packageJson.version}</Text>
          </View>
        </View>
      </View>
      {/* Support and about section */}
      <View style={styles.colorThemeOptionContainer}>
        {/* section title */}
        <Text style={styles.optionText}>{t('settings.chatSettings')}</Text>
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
            <Icon name='ear-outline' size={21} color='#8E8E93' />
            {/* Text container */}
            <Text style={{ flexGrow: 1, fontFamily: 'BalooBhaijaan2', color: '#8E8E93' }}>{t('settings.chatSounds')}</Text>
            {/* Switch container */}
            {/* TODO: implement chat sound controller */}
            <Switch trackColor={{ false: '#ddd', true: '#81b0ff' }} thumbColor={'#f4f3f5'} ios_backgroundColor='#3e3e3e' />
          </View>
          {/* theme option */}
          {/* option 2 */}
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
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 10,
  },
  optionText: {
    fontFamily: 'BalooBhaijaan2',
    fontSize: 20,
    color: 'gray',
  },
});
