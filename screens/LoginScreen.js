import * as React from "react";
import { useAuthRequest } from "expo-auth-session";
import { Button, StyleSheet, Text, SafeAreaView, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

// Endpoint
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const LoginScreen = () => {
  const navigation = useNavigation();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "1dc7e39c7d6245deaee8177099bcfd60",
      scopes: [
        "user-read-email",
        "playlist-modify-public",
        "user-read-private",
        "user-read-playback-state",
        "user-modify-playback-state",
        "user-read-currently-playing",
        "playlist-read-private",
        "user-top-read",
      ],
      usePKCE: false,
      redirectUri: "exp://localhost:8081/--/spotify-auth-callback",
    },
    discovery
  );

  React.useEffect(() => {
    const handleResponse = async () => {
      if (response?.type === "success") {
        const { code } = response.params;
        console.log("Received code:", code);

        try {
          const tokenResponse = await fetch(
            "https://accounts.spotify.com/api/token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: "exp://localhost:8081/--/spotify-auth-callback",
                client_id: "1dc7e39c7d6245deaee8177099bcfd60",
                client_secret: "ba10ac5222f94e1bb020bb8f38d1c860",
              }).toString(),
            }
          );

          const tokenData = await tokenResponse.json();
          console.log("Token data:", tokenData);

          const accessToken = tokenData.access_token;

          if (accessToken) {
            console.log("Access token:", accessToken);
            await AsyncStorage.setItem("accessToken", accessToken);
            navigation.navigate("Main", { accessToken: accessToken });
          } else {
            console.error("Access token is undefined or null");
          }
        } catch (error) {
          console.error(
            "Error exchanging authorization code for access token:",
            error
          );
        }
      }
    };

    handleResponse();
  }, [response, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={{ color: "white", fontSize: 60, fontWeight: "bold" }}>
          WELCOME
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            disabled={!request}
            title="Login"
            onPress={() => {
              promptAsync();
            }}
            color="purple"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  buttonContainer: {
    marginTop: 30,
    borderRadius: 20,
    overflow: "hidden",
    width: 200,
    backgroundColor: "purple",
    alignSelf: "center",
  },
});

export default LoginScreen;
