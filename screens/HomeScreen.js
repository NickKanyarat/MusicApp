import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
          setAccessToken(token);
          fetchTopTracks(token);
          const interval = setInterval(() => {
            refreshAccessTokenAndFetchTopTracks();
          }, 60000);
          return () => clearInterval(interval);
        } else {
          refreshAccessTokenAndFetchTopTracks();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        Alert.alert("Error", "Failed to fetch data.");
      }
    };

    fetchData();
  }, []);

  const fetchTopTracks = async (token) => {
    try {
      const response = await fetch(
        "https://api.spotify.com/v1/me/top/tracks?limit=30",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch top tracks");
      }

      const data = await response.json();
      setTopTracks(data.items);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      Alert.alert("Error", "Failed to fetch top tracks.");
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      const clientId = "1dc7e39c7d6245deaee8177099bcfd60";
      const clientSecret = "ba10ac5222f94e1bb020bb8f38d1c860";

      const response = await fetch(
        "https://accounts.spotify.com/api/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret,
          }).toString(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to refresh access token");
      }

      const tokenData = await response.json();
      await AsyncStorage.setItem("accessToken", tokenData.access_token);
      setAccessToken(tokenData.access_token);
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw error;
    }
  };

  const refreshAccessTokenAndFetchTopTracks = async () => {
    try {
      await refreshAccessToken();
      const refreshedAccessToken = await AsyncStorage.getItem("accessToken");
      await fetchTopTracks(refreshedAccessToken);
    } catch (error) {
      console.error("Error refreshing access token and fetching top tracks:", error);
    }
  };
  

  const handleTrackPress = (track) => {
    navigation.navigate("Player", { track });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screen}>
        <Text style={styles.title}>Top Tracks</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : (
          <ScrollView contentContainerStyle={styles.tracksContainer}>
            {topTracks.map((track, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleTrackPress(track)}
              >
                <View style={styles.trackItem}>
                  <Image
                    source={{ uri: track.album.images[0].url }}
                    style={styles.trackImage}
                  />
                  <View style={styles.trackInfo}>
                    <Text style={styles.trackName}>{track.name}</Text>
                    <Text style={styles.trackArtists}>
                      {track.artists.map((artist) => artist.name).join(", ")}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
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
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  tracksContainer: {
    alignItems: "flex-start",
  },
  trackItem: {
    flexDirection: "row",
    marginBottom: 20,
    width: "100%",
  },
  trackImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  trackArtists: {
    color: "lightgray",
    fontSize: 14,
  },
});

export default HomeScreen;
