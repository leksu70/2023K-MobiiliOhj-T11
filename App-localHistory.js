import { StatusBar } from 'expo-status-bar';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState, useRef } from 'react';

var counter = 0;

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [history, setHistory] = useState([]);

  
  const initialFocus = useRef(null);

  const saveHistory = () => {
    counter += 1;
    setHistory( [ { id: counter, product: product, amount: amount}, ...history] ); // Lisätään alkuun
    
    setProduct('');
    setAmount('');
    initialFocus.current.focus();
  };

  return (
    <View style={ styles.container }>
      <TextInput 
        ref={ initialFocus }
        value={ product }
        onChangeText={ product => setProduct(product) }
        placeholder={'Product'}
        style={ styles.input }
      />
      <TextInput
        value={ amount }
        onChangeText={ amount => setAmount(amount) }
        placeholder={'Amount'}
        style={ styles.input }
      />
      <Button title='SAVE' onPress={ saveHistory } />
      <Text>product: { product }  amount: { amount } </Text>
      <Text></Text>
      <Text style={ styles.title }>Shopping list</Text>
      <FlatList
        data={ history }
        renderItem={ ({ item }) =>
          <Text style={ styles.text }>
            { item.product } { item.amount} { item.id }
          </Text>
        }
      />
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    fontSize: 15,
    flex: 1,
    marginTop: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  input: {
    width: 250,
    height: 50,
    padding: 5,
    backgroundColor: '#ffffff',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  text: {
    fontWeight: 'bold',
  }
});
