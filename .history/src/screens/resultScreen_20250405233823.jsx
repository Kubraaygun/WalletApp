import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../utils/colors";

const ResultScreen = ({ route }) => {
  const navigation = useNavigation();
  const { success, phoneNumber, amount, description, timestamp, error } =
    route.params;

  const balanceAnimation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Balance animation on component mount
    Animated.timing(balanceAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBackToHome = () => {
    navigation.navigate("Home");
  };

  const handleRetry = () => {
    // Implement retry logic
    alert("Tekrar transfer işlemi yapmak istiyor musunuz?");
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {success ? (
          <MaterialIcons name="check-circle" size={60} color={Colors.GREEN} />
        ) : (
          <MaterialIcons name="error" size={60} color={Colors.RED} />
        )}
      </View>

      <Text style={styles.title}>
        {success ? "Başarılı İşlem" : "Başarısız İşlem"}
      </Text>

      <Text style={styles.message}>
        {success ? (
          <>
            <Text style={styles.details}>Alıcı: {phoneNumber}</Text>
            <Text style={styles.details}>Miktar: {amount} TL</Text>
            {description && (
              <Text style={styles.details}>Açıklama: {description}</Text>
            )}
            <Text style={styles.details}>
              Zaman: {new Date(timestamp).toLocaleString()}
            </Text>
          </>
        ) : (
          <Text style={styles.error}>{error}</Text>
        )}
      </Text>

      <Animated.View
        style={[styles.balanceContainer, { opacity: balanceAnimation }]}
      >
        <Text style={styles.balanceText}>
          Güncellenmiş Bakiye: {/* Display updated balance here */}
        </Text>
      </Animated.View>

      <View style={styles.buttonContainer}>
        {success ? (
          <TouchableOpacity style={styles.button} onPress={handleBackToHome}>
            <Text style={styles.buttonText}>Ana Sayfaya Dön</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleRetry}>
            <Text style={styles.buttonText}>Tekrar Dene</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.WHITE,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  details: {
    fontSize: 16,
    marginBottom: 5,
  },
  error: {
    fontSize: 16,
    color: Colors.RED,
    marginBottom: 20,
  },
  balanceContainer: {
    marginBottom: 20,
  },
  balanceText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: Colors.BLACK,
    padding: 10,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ResultScreen;
