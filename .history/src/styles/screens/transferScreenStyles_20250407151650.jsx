import { StyleSheet } from "react-native";
import { Colors } from "../../utils/colors";

const TransferScreenstyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    position: "relative",
  },
  title: {
    fontSize: 24,
    marginBottom: 80,
    fontWeight: "bold",
    color: Colors.BLACK,
  },
  balanceContainer: {
    fontWeight: "bold",
    marginTop: 20,
  },
  balanceTextContainer: {
    fontWeight: "bold",
    fontSize: 18,
  },
  icon: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    width: 80,
    height: 80,
    marginTop: 100, // s
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconStyleUser: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
});

export default TransferScreenstyles;
