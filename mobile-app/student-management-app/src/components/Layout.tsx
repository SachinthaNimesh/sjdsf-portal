import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from './Header';
import styles from './Layout.styles';

type Props = {
  children: React.ReactNode;
  hideHeader?: boolean; // add prop
};

const Layout: React.FC<Props> = ({ children, hideHeader }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />
      {!hideHeader && <Header />}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

export default Layout;