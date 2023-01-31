import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import {
  IconButton,
  Provider,
  Portal,
  Dialog,
  Button,
} from 'react-native-paper';
import asyncAlert from './asyncAlert';

const db = SQLite.openDatabase('little_lemon');

// Implement edit and delete with SQLite
export default function App() {
  const [textInputValue, setTextInputValue] = useState('');
  const [dialog, setDialog] = useState({
    customer: {},
    isVisible: false,
  });
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'create table if not exists customers (id integer primary key not null, uid text, name text);'
      );
      tx.executeSql('select * from customers', [], (_, { rows }) => {
        const customers = rows._array.map((item) => ({
          uid: item.uid,
          name: item.name,
        }));
        setCustomers(customers);
      });
    });
  }, []);

  const showDialog = (customer) =>
    setDialog({
      isVisible: true,
      customer,
    });

  const hideDialog = (updatedCustomer) => {
    setDialog({
      isVisible: false,
      customer: {},
    });
    const newCustomers = customers.map((customer) => {
      if (customer.uid !== updatedCustomer.uid) {
        return customer;
      }

      return updatedCustomer;
    });

    setCustomers(newCustomers);
    // Edit customer from DB
    db.transaction((tx) => {
      tx.executeSql(
        `update customers set uid=?, name=? where uid=${updatedCustomer.uid}`,
        [updatedCustomer.uid, updatedCustomer.name]
      );
    });
  };

  const deleteCustomer = async (customer) => {
    const shouldDelete = await asyncAlert({
      title: 'Delete customer',
      message: `Are you sure you want to delete the customer named "${customer.name}"?`,
    });
    if (!shouldDelete) {
      return;
    }
    const newCustomers = customers.filter((c) => c.uid !== customer.uid);
    setCustomers(newCustomers);
    // SQL transaction to delete item based on uid
    db.transaction((tx) => {
      tx.executeSql('delete from customers where uid = ?', [customer.uid]);
    });
  };

  return (
    <Provider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.titleText}>Little Lemon Customers</Text>
          <TextInput
            placeholder="Enter the customer name"
            value={textInputValue}
            onChangeText={(data) => setTextInputValue(data)}
            underlineColorAndroid="transparent"
            style={styles.textInputStyle}
          />
          <TouchableOpacity
            disabled={!textInputValue}
            onPress={() => {
              const newValue = {
                uid: Date.now().toString(),
                name: textInputValue,
              };
              setCustomers([...customers, newValue]);
              db.transaction((tx) => {
                tx.executeSql(
                  'insert into customers (uid, name) values(?, ?)',
                  [newValue.uid, newValue.name]
                );
              });
              setTextInputValue('');
            }}
            style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}> Save Customer </Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.customerName}>Customers: </Text>
            {customers.map((customer) => (
              <View style={styles.customer}>
                <Text style={styles.customerName}>{customer.name}</Text>
                <View style={styles.icons}>
                  <IconButton
                    icon="pen"
                    size={24}
                    onPress={() => showDialog(customer)}
                  />
                  <IconButton
                    icon="delete"
                    size={24}
                    onPress={() => deleteCustomer(customer)}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
        <Portal>
          <Dialog visible={dialog.isVisible} onDismiss={hideDialog}>
            <Dialog.Title>Edit Customer name</Dialog.Title>
            <Dialog.Content>
              <TextInput
                value={dialog.customer.name}
                onChangeText={(text) =>
                  setDialog((prev) => ({
                    ...prev,
                    customer: {
                      ...prev.customer,
                      name: text,
                    },
                  }))
                }
                underlineColorAndroid="transparent"
                style={styles.textInputStyle}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => hideDialog(dialog.customer)}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  customer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customerName: {
    fontSize: 18,
  },
  buttonStyle: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'green',
    padding: 5,
    marginTop: 32,
    minWidth: 250,
    marginBottom: 16,
  },
  buttonTextStyle: {
    padding: 5,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  textInputStyle: {
    textAlign: 'center',
    height: 40,
    fontSize: 18,
    width: '100%',
    borderWidth: 1,
    borderColor: 'green',
  },
  icons: {
    flexDirection: 'row',
  },
});
