import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Colors from '../../../utils/Colors';
import { useNavigation } from '@react-navigation/native';

const RadioButton = ({ options, selectedOption, onSelect }) => {
  return (
    <View style={{ flexDirection: 'column' }}>
      {options.map((option, index) => (
        <TouchableOpacity 
          key={index}
          style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}
          onPress={() => onSelect(option)}
        >
          <View
            style={{
              height: 24,
              width: 24,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: option === selectedOption ? Colors.primary : Colors.GRAY,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {option === selectedOption && (
              <View
                style={{
                  height: 12,
                  width: 12,
                  borderRadius: 6,
                  backgroundColor: Colors.primary,
                }}
              />
            )}
          </View>
          <Text style={{ marginLeft: 5, fontFamily: 'outfit', fontSize: 30 }}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const RadioForm = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const navigateToScreen = useNavigation();

  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  const handleSaveData = () => {
    console.log("Selected Option:", selectedOption);
    if (selectedOption === 'Are you a Mall?') {
      navigateToScreen.navigate('SpaceForm');
    } else if (selectedOption === 'Are you a Homeowner?') {
      navigateToScreen.navigate('Form');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Image style={styles.tinyLogo} source={require('../../../assets/images/provider.jpeg')} />
      <View style={{marginTop: 60, marginLeft: 50}}>
        <RadioButton 
          options={['Are you a Mall?', 'Are you a Homeowner?']}
          selectedOption={selectedOption}
          onSelect={handleSelectOption}
        />
        <View style={{marginLeft: 90}}>
          <TouchableOpacity
            style={{ marginTop: 20, padding: 10, width: 150, height: 40, backgroundColor: Colors.primary, borderRadius: 99 }}
            onPress={handleSaveData}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontFamily: 'outfit' }}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RadioForm;

const styles = StyleSheet.create({
  tinyLogo:{
    width: '100%',
    height: 150
  }
});
