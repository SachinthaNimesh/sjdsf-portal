import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#667eea",
    padding: 20,
  },
  welcomeText: {
    fontSize: 48,
    color: "white",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 25,
    padding: 30,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#667eea",
  },
  locationInfo: {
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2c3e50",
  },
  checkinButton: {
    width: "100%",
    padding: 18,
    borderRadius: 20,
    backgroundColor: "#27ae60",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  noInternetCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    minWidth: 260,
    maxWidth: 320,
    zIndex: 2,
  },
  noInternetEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  noInternetTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
    textAlign: "center",
  },
  noInternetMsg: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 16,
  },
  noInternetWait: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
  },
  loadingContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 6,
    borderColor: "#fff",
    borderTopColor: "#667eea",
    alignSelf: "center",
    marginBottom: 10,
  },
  

});

export default styles;
