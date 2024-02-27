import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View, ScrollView, Image, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get access token from AsyncStorage
        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
          setAccessToken(token);

          // Fetch top tracks
          const response = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=30", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch top tracks");
          }

          const data = await response.json();
          setTopTracks(data.items);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screen}>
        <Text style={styles.title}>Top Tracks</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : (
          <ScrollView contentContainerStyle={styles.tracksContainer}>
            {topTracks.map((track, index) => (
              <View key={index} style={styles.trackItem}>
                <Image
                  source={{ uri: track.album.images[0].url }}
                  style={styles.trackImage}
                />
                <View style={styles.trackInfo}>
                  <Text style={styles.trackName}>{track.name}</Text>
                  <Text style={styles.trackArtists}>{track.artists.map(artist => artist.name).join(", ")}</Text>
                </View>
              </View>
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
    alignItems: "center",
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  trackImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    color: "white",
    fontSize: 18,
  },
  trackArtists: {
    color: "lightgray",
    fontSize: 14,
  },
});

export default HomeScreen;
