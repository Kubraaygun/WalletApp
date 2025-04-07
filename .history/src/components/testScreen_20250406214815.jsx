import { useDispatch } from "react-redux";
setLoading;
import { View, Button } from "react-native";
import { setLoading } from "../store/loadingSlice";

const TestScreen = () => {
  const dispatch = useDispatch();

  const fakeApi = async () => {
    dispatch(setLoading(true));
    await new Promise((res) => setTimeout(res, 2000)); // 2 saniye beklet
    dispatch(setLoading(false));
  };

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Button title="Test Loading" onPress={fakeApi} />
    </View>
  );
};

export default TestScreen;
