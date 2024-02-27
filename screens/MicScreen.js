import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { Audio } from "expo-av";
import { SafeAreaView } from "react-native-safe-area-context";

const MicScreen = () => {
  const [recording, setRecording] = useState(null);

  const handleRecordButtonPress = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "You need to grant microphone permission to record audio."
      );
      return;
    }

    try {
      const recordingInstance = new Audio.Recording();
      await recordingInstance.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recordingInstance.startAsync();
      setRecording(recordingInstance);
    } catch (error) {
      console.error("Failed to start recording:", error);
      Alert.alert("Error", "Failed to start recording.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screen}>
        <Text style={styles.title}>Microphone</Text>
        <View style={styles.content}>
          <TouchableOpacity onPress={handleRecordButtonPress} style={styles.recordButton}>
            <Text style={styles.recordButtonText}>Record</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    backgroundColor: 'purple',
    padding: 10,
    borderRadius: 5,
  },
  recordButtonText: {
    fontSize: 20,
    color: 'white',
  },
});

export default MicScreen;
