import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get access token from AsyncStorage
        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
          // Fetch user data
          const response = await fetch("https://api.spotify.com/v1/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const data = await response.json();
          setUserData(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screen}>
        <Text style={styles.title}>User Profile</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : (
          <View style={styles.profileInfo}>
            <View style={styles.labelContainer}>
              <Image
                source={{
                  uri:
                    userData.images.length > 0 ? userData.images[0].url : null,
                }}
                style={styles.profileImage}
              />
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{userData.display_name}</Text>
            </View>

            <View style={styles.labelContainer}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{userData.email}</Text>
            </View>

            <View style={styles.labelContainer}>
              <Text style={styles.label}>Country:</Text>
              <Text style={styles.value}>{userData.country}</Text>
            </View>
          </View>
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
    textAlign: "center",
  },
  profileInfo: {
    alignItems: "center",
  },
  labelContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20,
  },
  label: {
    color: "lightgray",
    fontSize: 18,
    marginRight: 5,
    fontWeight: "600",
  },
  value: {
    color: "white",
    fontSize: 18,
    fontWeight: "normal",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
});

export default ProfileScreen;
