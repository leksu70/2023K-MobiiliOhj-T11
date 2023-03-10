import { StatusBar } from 'expo-status-bar';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('history.db');

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [history, setHistory] = useState([]);

  const initialFocus = useRef(null);

  useEffect( () => {
    db.transaction( tx => {
      tx.executeSql('create table if not exists history (id integer primary key not null, product text, amount text);');
    }, null, updateList);
    initialFocus.current.focus();
  }, []);

  useEffect( () => {
    setProduct('');
    initialFocus.current.focus();
    setAmount('');
  }, [history]);

  const saveItem = () => {
    db.transaction( tx => {
      tx.executeSql('insert into history (product, amount) values (?, ?);', [product, amount]);
    }, null, updateList)
  };

  const updateList = () => {
    db.transaction( tx => {
      tx.executeSql('select * from history;', [], (_, { rows }) => 
        setHistory(rows._array)
      );
    }, null, null);
  };

  const deleteItem = (id) => {
    db.transaction( tx => {
      tx.executeSql('delete from history where id = ?;', [id]);}, null, updateList
    )
  }

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
      <Button title='SAVE' onPress={ saveItem } />
      
      <Text style={ styles.title }>Shopping list</Text>

      <FlatList
        data={ history }
        keyExtractor={ item => item.id.toString() }
        renderItem={ ({ item }) =>
          <View style={ styles.listcontainer }>
            <Text>{ item.product }, { item.amount}</Text>
            <Text style={{ color: '#0000ff' }} onPress={ () => deleteItem(item.id) }>    bought</Text>
          </View>
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
  },
  listcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
