import { StyleSheet } from "react-native";



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  backgroundElement1: {
    position: 'absolute',
    top: 80,
    left: 80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E0E7FF',
    opacity: 0.3,
  },
  backgroundElement2: {
    position: 'absolute',
    bottom: 80,
    right: 80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#F3E8FF',
    opacity: 0.3,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  backdropTouchable: {
    flex: 1,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    alignItems: 'flex-end',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  labelContainer: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
    position: 'relative',
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  labelArrow: {
    position: 'absolute',
    right: -4,
    top: '50%',
    marginTop: -4,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderLeftColor: '#1F2937',
    borderTopWidth: 4,
    borderTopColor: 'transparent',
    borderBottomWidth: 4,
    borderBottomColor: 'transparent',
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mainFab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  mainFabInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;