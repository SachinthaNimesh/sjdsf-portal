import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  spinner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  arc: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 8,
    borderColor: "#667eea",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    borderTopColor: "#667eea",
    backgroundColor: "transparent",
  },
  dot: {
    position: "absolute",
    top: 2,
    left: 21,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#000000ff",
    zIndex: 2,
  },
});

export default styles;
