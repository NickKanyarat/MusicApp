import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const response = await fetch(
          "https://api.spotify.com/v1/playlists/3cEYpjA9oz9GiPac4AsH4n/tracks", // Spotify top tracks playlist ID
          {
            method: "GET",
            headers: {
              Authorization:
                "Bearer BQCVZ5c9m_1vaY3E7yiyV9fOMagaY9dZf9fgarpHnI_y2LfVx1N9n4FBteNCHts2PlFP3OTEgepmRYz0OQvUXbbQGSkH2drU_ATGk8aAWWRRtk1ObzrJg51wSbUlIN-6ulMh3ce_PdpTBQdftwdDyORZJSr6B3atvALy8aUGGqwH7nuAjFSmujYDXzlsi5pYwjsegx-P6Jb-Mv_Ik5yrE7LMXyZSYCMu6Psws3pSA9Kp3aTLMGyA", // Replace with your Spotify access token
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        const tracks = data.items.map((item) => item.track); // Extracting the tracks from the response
        setTopTracks(tracks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching top tracks:", error);
        setLoading(false);
      }
    };

    fetchTopTracks();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screen}>
        <Text style={{ color: "white", fontSize: 30, fontWeight: "bold" }}>
          Top Tracks
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : (
          <View>
            {topTracks.map((track, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Image
                  source={{ uri: track.album.images[0].url }}
                  style={{ width: 50, height: 50, marginRight: 10 }}
                />
                <View>
                  <Text style={{ color: "white", fontSize: 18 }}>
                    {index + 1}. {track.name}
                  </Text>
                  <Text style={{ color: "white", fontSize: 14 }}>
                    {track.artists.map((artist) => artist.name).join(", ")}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "black",
  },
  screen: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
});

export default HomeScreen;
