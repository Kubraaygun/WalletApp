import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Feather as Icon } from "@expo/vector-icons";
import { qrService } from "../services";
import { Colors } from "../utils/colors";
import { TextStyles } from "../utils/typography";
import { Spacing, IconSize, BorderRadius } from "../utils/spacing";
import CustomButton from "../components/customButton";

const QRScannerScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return;
    setScanned(true);

    // QR verisini parse et
    const parsedData = qrService.parseQRPaymentData(data);

    if (parsedData && parsedData.isValid) {
      // Transfer ekranına yönlendir
      navigation.navigate("TransferScreen", {
        prefillPhone: parsedData.recipient,
        prefillAmount: parsedData.amount,
        prefillDescription: parsedData.description,
        fromQR: true,
      });
    } else {
      Alert.alert(
        "Geçersiz QR Kod",
        "Bu QR kod bir ödeme bilgisi içermiyor.",
        [
          {
            text: "Tekrar Dene",
            onPress: () => setScanned(false),
          },
          {
            text: "İptal",
            onPress: () => navigation.goBack(),
            style: "cancel",
          },
        ]
      );
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // İzin yükleniyor
  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.TEXT_PRIMARY} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Kamera izni kontrol ediliyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // İzin verilmemiş
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.TEXT_PRIMARY} />
        <View style={styles.permissionContainer}>
          <Icon name="camera-off" size={64} color={Colors.GRAY_400} />
          <Text style={styles.permissionTitle}>Kamera İzni Gerekli</Text>
          <Text style={styles.permissionText}>
            QR kod okumak için kamera erişimine izin vermeniz gerekmektedir.
          </Text>
          <CustomButton
            title="İzin Ver"
            onPress={requestPermission}
            variant="primary"
            size="lg"
            style={styles.permissionButton}
          />
          <TouchableOpacity onPress={handleBack} style={styles.backLink}>
            <Text style={styles.backLinkText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <CameraView
        style={styles.camera}
        facing="back"
        enableTorch={flashOn}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
            <Icon name="x" size={IconSize.md} color={Colors.WHITE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>QR Kod Tara</Text>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setFlashOn(!flashOn)}
          >
            <Icon
              name={flashOn ? "zap" : "zap-off"}
              size={IconSize.md}
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        </View>

        {/* Scan Frame */}
        <View style={styles.scanFrameContainer}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <Text style={styles.scanText}>
            QR kodu çerçevenin içine hizalayın
          </Text>
        </View>

        {/* Footer */}
        {scanned && (
          <View style={styles.footer}>
            <CustomButton
              title="Tekrar Tara"
              onPress={() => setScanned(false)}
              variant="secondary"
              size="lg"
            />
          </View>
        )}
      </CameraView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.TEXT_PRIMARY,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    ...TextStyles.bodyMedium,
    color: Colors.WHITE,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  permissionTitle: {
    ...TextStyles.h3,
    color: Colors.WHITE,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  permissionText: {
    ...TextStyles.bodyMedium,
    color: Colors.GRAY_400,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  permissionButton: {
    width: "100%",
  },
  backLink: {
    marginTop: Spacing.lg,
    padding: Spacing.sm,
  },
  backLinkText: {
    ...TextStyles.labelMedium,
    color: Colors.ACCENT,
  },
  camera: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    ...TextStyles.h4,
    color: Colors.WHITE,
  },
  scanFrameContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: Colors.WHITE,
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: BorderRadius.md,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: BorderRadius.md,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: BorderRadius.md,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: BorderRadius.md,
  },
  scanText: {
    ...TextStyles.bodyMedium,
    color: Colors.WHITE,
    marginTop: Spacing.xl,
    textAlign: "center",
  },
  footer: {
    padding: Spacing.lg,
  },
});

export default QRScannerScreen;
