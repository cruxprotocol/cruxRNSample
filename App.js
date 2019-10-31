/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import 'react-native-get-random-values';
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import {CruxPay} from "@cruxpay/rn-sdk/dist/cruxpay-sdk-rn";
import {RNLocalStorage} from "./RNLocalStorage";

const {CruxClient} = CruxPay;
const instructions = "";


type Props = {};
export default class App extends Component<Props> {

  makeid = (length) => {
    let result           = '';
    const characters       = '0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  testCrux = async () => {

    const s = new RNLocalStorage();
    s.setJSON("payIDClaim", {"identitySecrets":"{\"iv\":\"59ZAnVm5vyC6zIZz\",\"encBuffer\":\"1JstBA1vk8LpSfI9kPlGtWytcAZUbGN51g5E8NA/OVXjSsygdjdceeW0bb/2GbR9qkkq4P7nuP9lCjxbXWcsJaj/0AWUOA82AmZnbP7yUH8ATQwdSgyhUQDGboSVsO2JYFg1tPg2P+kA0jIoRYYGpAlcT8hhEe5jRSp9NBZ2cFWV/z3yDRMZtXHUQtwY/bPenREqBv7iBgwnqWLzrDMoY+KrjOXzUC3BWCByYfj02WkXLq6tQnJyPepCl1OGhpfoDCBgRbrIZ+uJxDp0RrAbp52OSREPaHPF/6oShTm5Pre1ZswBxufqwWMfNARY0wA=\"}","virtualAddress":"yadu007@cruxdev.crux"})
    const cruxClientOptions = {
      getEncryptionKey: () => 'fookey',
      walletClientName: 'cruxdev',
      storage: s
    }
    const newId = this.makeid(6);
    const cruxClient = new CruxClient(cruxClientOptions);
    cruxClient.init().then(() => {
      alert("init done");

      cruxClient.getAddressMap().then((addressMap) => {
        alert(`before change addressMap ripple identifier: ${  addressMap.ripple.secIdentifier}`);

        const newAddressMapping = {
          "bitcoin": {"addressHash": "1HX4KvtPdg9QUYwQE1kNqTAjmNaDG7w82V"},
          "ethereum": {"addressHash": "0x0a2311594059b468c9897338b027c8782398b481"},
          "ripple": {"addressHash": "rpfKAA2Ezqoq5wWo3XENdLYdZ8YGziz48h", "secIdentifier": newId},
          "tron": {"addressHash": "TG3iFaVvUs34SGpWq8RG9gnagDLTe1jdyz"}
        }

        cruxClient.putAddressMap(newAddressMapping).then((res) => {
          console.log(res);
          cruxClient.getAddressMap().then((afterPutAddressMap) => {
            alert(`after change addressMap ripple identifier: ${  afterPutAddressMap.ripple.secIdentifier}`);
            // AsyncStorage.getAllKeys().then((keys1)=>{
            //   alert(keys1);
            // })
          }).catch((err) => {
            alert(`ERROR after change addressMap${  err.message}`);
          })

        }).catch((err) => {
          console.log('putAddressMap errorCode', err.errorCode);
          console.log('errorMessage', err.message);
          alert(`ERROR putAddressMap${  err.errorCode  }${err.message}`);
        })

      }).catch((err) => {
        console.log('before getAddressMap errorCode', err.errorCode);
        console.log('errorMessage', err.message);
        alert(`ERROR before change addressMap${  err.message}`);
      })

    })

  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Demo Wallet</Text>
        <Text>wallet client:</Text>
        <Text>wallet encryption key:</Text>
        <Text>wallet addresses:</Text>
        <Button title="Test PutAddress Mapping" onPress={() => this.testCrux()}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
