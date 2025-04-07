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
});

export default TransferScreenstyles;
