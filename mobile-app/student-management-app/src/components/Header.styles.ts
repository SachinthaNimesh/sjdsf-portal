import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.1)",
    position: "absolute",
    top: 30, // changed from 30 to 0
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  greeting: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  greetingText: {
    color: "white",
    fontSize: 24,
    fontWeight: "600",
  },
  wave: {
    fontSize: 28,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: "#ff6b6b",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitial: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
});

export default styles;
