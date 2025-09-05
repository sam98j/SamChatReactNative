// react native functional component
// with typescript
import { Text, View, StyleSheet } from 'react-native';

export default function Calls() {
  // check if the user is logged in
  // const { apiResponse, currentUser } = useSelector((state: RootState) => state.authSlice);
  // useEffect(() => {
  //   console.log(currentUser);
  // }, []);
  return (
    <View style={styles.container}>
      <Text>Calls</Text>
    </View>
  );
}
// styles
const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingLeft: 10,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
