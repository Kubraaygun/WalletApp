import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { addTransaction, setBalance } from "../redux/reducers";

const transferValidationSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Geçerli bir telefon numarası girin")
    .required("Telefon numarası gereklidir"),
  amount: Yup.number()
    .min(10, "Minimum transfer tutarı 10 TL olmalı")
    .required("Tutar gereklidir"),
});

const TransferScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { balance } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  const handleTransfer = (values) => {
    if (balance >= values.amount) {
      setIsLoading(true);
      setTimeout(() => {
        dispatch(
          addTransaction({
            amount: values.amount,
            description: `Transfer to ${values.phone}`,
          })
        );
        dispatch(setBalance(balance - values.amount));
        navigation.navigate("Result", { success: true });
        setIsLoading(false);
      }, 1000);
    } else {
      navigation.navigate("Result", {
        success: false,
        error: "Yetersiz bakiye",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Para Gönder</Text>
      <Formik
        initialValues={{ phone: "", amount: "" }}
        validationSchema={transferValidationSchema}
        onSubmit={handleTransfer}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <TextInput
              placeholder="Alıcı Telefon"
              style={styles.input}
              value={values.phone}
              onChangeText={handleChange("phone")}
              onBlur={handleBlur("phone")}
            />
            {touched.phone && errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}

            <TextInput
              placeholder="Miktar"
              style={styles.input}
              keyboardType="numeric"
              value={values.amount}
              onChangeText={handleChange("amount")}
              onBlur={handleBlur("amount")}
            />
            {touched.amount && errors.amount && (
              <Text style={styles.errorText}>{errors.amount}</Text>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={isLoading || !values.phone || !values.amount}
            >
              <Text style={styles.buttonText}>Devam</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "80%",
  },
  buttonText: { color: "#fff" },
  errorText: { color: "red", fontSize: 12 },
});

export default TransferScreen;
