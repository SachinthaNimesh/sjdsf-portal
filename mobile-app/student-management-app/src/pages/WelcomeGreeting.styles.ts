import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    width: "100%",
    padding: 30,
    paddingVertical: 45,
    borderRadius: 18,
  },
  text: {
    color: "#000",
    fontSize: 48,
    textAlign: "center",
    fontWeight: "600",
  },
  lottie: {
    width: 180,
    height: 180,
    alignSelf: "center",
    marginBottom: 20,
  },
});

export default styles;
