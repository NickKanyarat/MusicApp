import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      if (recording) {
        await recording.stopAndUnloadAsync(); // ปลดออกอ็อบเจกต์ Recording ที่ถูกเตรียมไว้ก่อนหน้า
        setRecording(null); // เคลียร์ตัวแปร state ที่เก็บอ็อบเจกต์ Recording
      }
  
      const recordingInstance = new Audio.Recording(); // สร้างอ็อบเจกต์ Recording ใหม่
      await recordingInstance.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recordingInstance.startAsync();
      setRecording(recordingInstance); // ตั้งค่าอ็อบเจกต์ Recording ใหม่เป็นอ็อบเจกต์ที่ถูกสร้างขึ้นใหม่
    } catch (error) {
      console.error("Failed to start recording:", error);
      Alert.alert("Error", "Failed to start recording.");
    }
  };
  
  const handleSaveRecording = async () => {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      await AsyncStorage.setItem("recentRecording", uri);
      Alert.alert("Success", "Recording saved successfully!");
    } catch (error) {
      console.error("Failed to save recording:", error);
      Alert.alert("Error", "Failed to save recording.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screen}>
        <Text style={styles.title}>Microphone</Text>
        <View style={styles.content}>
          <TouchableOpacity onPress={handleRecordButtonPress}>
            <FontAwesome name="microphone" size={80} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSaveRecording}>
            <Text style={styles.buttonText}>Save Recording</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    marginTop: 20,
  },
});

export default MicScreen;