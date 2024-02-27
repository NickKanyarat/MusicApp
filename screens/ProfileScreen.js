import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";

const ProfileScreen = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Replace 'YOUR_ACCESS_TOKEN' with the access token obtained after authentication
        const response = await fetch("https://api.spotify.com/v1/me", {
          method: "GET",
          headers: {
            Authorization:
              "Bearer BQDBoOMic_uStABngF0rBmKqZgNgbJsGQVDMzfChG0p1eeEX3UXqNZNB56JtEI8I49PZgx4rNkeFj5jX60O79D5VYY4nqnCjgrCrwy79LAee2Js0OUZNPzjDjaAfnBzb7a5vqVJr6CwLn_rZLkWxOIsg6zRMakeKv2UzIfsKW4K-EF0-Uc7Vk3mqTzrs-jEyakRLWMlIVXeDpxCoXbZM2H3w1awVOpnwdtFqqSqsKoUxUoA2vEe_",
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setUserData(data);
        setLoading(false);

        // Fetch profile image
        const imageUrl = data.images.length > 0 ? data.images[0].url : null;
        setProfileImage(imageUrl);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screen}>
        <Text style={{ color: "white", fontSize: 30, fontWeight: "bold" }}>
          User Profile
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : (
          <View>
            <Text style={{ color: "white", fontSize: 18 }}>
              Display Name: {userData.display_name}
            </Text>
            <Text style={{ color: "white", fontSize: 18 }}>
              Email: {userData.email}
            </Text>
            <Text style={{ color: "white", fontSize: 18 }}>
              Country: {userData.country}
            </Text>
            {profileImage && (
              <Image
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  marginTop: 10,
                }}
                source={{ uri: profileImage }}
              />
            )}
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

export default ProfileScreen;
