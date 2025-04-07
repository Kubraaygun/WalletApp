const ResultScreen = ({ route }) => {
  const { success, phoneNumber, amount, description, timestamp, error } =
    route.params;

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

      {/* Diğer elementler ve butonlar */}
    </View>
  );
};
