import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert, // เพิ่ม Alert เข้ามา
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MplayerScreen = ({ route }) => {
  const { track } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const navigation = useNavigation();
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        setAccessToken(token);
      } else {
        navigation.navigate("Login");
      }
    };

    fetchAccessToken();
  }, []);

  const togglePlayback = async () => {
    if (!accessToken) {
      navigation.navigate("Login");
      return;
    }

    try {
      if (isPlaying) {
        setIsPlaying(false);
        await pausePlayback();
      } else {
        setIsPlaying(true);
        await startPlayback();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to toggle playback.");
      console.error("Failed to toggle playback:", error);
    }
  };

  const startPlayback = async () => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: [track.uri],
        }),
      });
  
      if (response.ok) {
        console.log("Playback started successfully.");
      } else {
        console.error("Failed to start playback:", response.status);
        Alert.alert("Error", "Failed to start playback.");
      }
    } catch (error) {
      console.error("Error starting playback:", error);
      Alert.alert("Error", "Failed to start playback.");
    }
  };
  
  const pausePlayback = async () => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me/player/pause", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        console.log("Playback paused successfully.");
      } else {
        console.error("Failed to pause playback:", response.status);
        Alert.alert("Error", "Failed to pause playback.");
      }
    } catch (error) {
      console.error("Error pausing playback:", error);
      Alert.alert("Error", "Failed to pause playback.");
    }
  };

  const playNextTrack = async () => {
    // Add code to play the next track
  };

  const playPreviousTrack = async () => {
    // Add code to play the previous track
  };

  const onSliderValueChange = async (value) => {
    setSliderValue(value);
    // Add code to control the position of the track
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screen}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="left" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Music Player</Text>
        <View style={styles.trackImageContainer}>
          <Image
            source={{ uri: track.album.images[0].url }}
            style={styles.trackImage}
          />
        </View>
        <View style={styles.trackInfoContainer}>
          <Text style={styles.trackName}>{track.name}</Text>
          <Text style={styles.trackArtists}>
            {track.artists.map((artist) => artist.name).join(", ")}
          </Text>
        </View>
        <View style={styles.sliderContainer}>
          <Slider
            style={{ width: "100%", alignSelf: "center", marginTop: 20 }}
            minimumValue={0}
            maximumValue={100}
            value={sliderValue}
            onValueChange={onSliderValueChange}
            minimumTrackTintColor="white"
            maximumTrackTintColor="white"
          />
        </View>
        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={playPreviousTrack}>
            <AntDesign name="banckward" size={45} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePlayback}>
            <AntDesign
              name={isPlaying ? "pausecircle" : "play"}
              size={45}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={playNextTrack}>
            <AntDesign name="forward" size={45} color="white" />
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
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  trackImageContainer: {
    alignItems: "center",
  },
  trackImage: {
    aspectRatio: 1,
    width: "100%",
    maxWidth: 350,
    height: undefined,
  },
  trackInfoContainer: {
    alignItems: "flex-start",
    marginLeft: 15,
    marginTop: 30,
    marginBottom: 30,
    height: 110,
  },
  trackName: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  trackArtists: {
    color: "lightgray",
    fontSize: 15,
    height: 50,
  },
  sliderContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "85%",
    alignSelf: "center",
    position: "relative",
  },
});

export default MplayerScreen;