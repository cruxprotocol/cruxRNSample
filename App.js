/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
// import 'react-native-get-random-values';
import './globals';
import React, {Component} from 'react';
import { AppRegistry, View, TextInput, Text, Button, Picker, CheckBox, Alert, StyleSheet } from 'react-native'
import AsyncStorage from "@react-native-community/async-storage";
import {CruxPay} from "@cruxpay/rn-sdk/dist/cruxpay-sdk-rn";
import {RNLocalStorage} from "./RNLocalStorage";

const {CruxClient, errors} = CruxPay;
let walletClientName = "cruxdev"
let encryptionKey = "fookey"

const wallet_btc_address = "1HX4KvtPdg9QUYwQE1kNqTAjmNaDG7w82V"
const wallet_eth_address = "0x0a2311594059b468c9897338b027c8782398b481"
const wallet_trx_address = "TG3iFaVvUs34SGpWq8RG9gnagDLTe1jdyz"
const wallet_xrp_address = "rpfKAA2Ezqoq5wWo3XENdLYdZ8YGziz48h"
const wallet_xrp_sec_identifier = "12345"

const sampleAddressMap = {
  bitcoin: {
    addressHash: wallet_btc_address
  },
  ethereum: {
    addressHash: wallet_eth_address
  },
  tron: {
    addressHash: wallet_trx_address
  },
  ripple: {
    addressHash: wallet_xrp_address,
    secIdentifier: wallet_xrp_sec_identifier
  }
};


type Props = {};
export default class App extends Component<Props> {
  cruxClient;

  constructor(props) {
    super(props);
    // AsyncStorage.clear()    // Can comment to persist the storage

    this.state = {
      walletClientName: this.props.walletClientName || walletClientName,
      encryptionKey: this.props.encryptionKey || encryptionKey,
      userAddresses: sampleAddressMap,

      availability: "",
      registrationId: "",

      newSubdomain: "",
      registrationAcknowledgement: "",

      receiverVirtualAddress: "",
      currency: "",
      addresses: "",

      assetMap: "",

      addressMap: "",

      publishAddressOptions: {},
      putAddressMapAcknowledgement: "",

      cruxIDStatus: "",

      oldEncryptionKey: "",
      newEncryptionKey: "",
      passwordUpdateAcknowledgement: "",
    }

    Object.keys(this.state.userAddresses).forEach((currency) => {
      this.state.publishAddressOptions[currency] = true
    })

    const cruxClientOptions = {
      getEncryptionKey: () => this.state.encryptionKey,
      walletClientName: this.state.walletClientName,
      storage: new RNLocalStorage(),
      // privateKey: "16a6e3cf51643bb56ac6a8a1f0cdea3e0713aaf0e29829d381729748d42dca8f"
    }

    // initialising the cruxClient
    this.cruxClient = new CruxPay.CruxClient(cruxClientOptions)
    this.cruxClient.init()
        .then(async () => {
          await this.getCruxIDState()
        })
        .catch((error) => {
          Alert.alert("ERROR during initialisation", JSON.stringify(error))
          console.log(error);
        })
  }

  isCruxIDAvailable = async () => {
    let UIResponse = ""
    this.setState({ availability: "checking availability ..." })
    let cruxID = this.state.registrationId
    try {
      let available = await this.cruxClient.isCruxIDAvailable(cruxID)
      UIResponse = available ? "available" : "unavailable"
    } catch (e) {
      if (e instanceof errors.CruxClientError) {
        UIResponse = `${e.errorCode}: ${e}`
      } else {
        UIResponse = e
      }

    } finally {
      this.setState({ availability: UIResponse })
    }
  }

  registerCruxID = async () => {
    let UIResponse = ""
    let cruxID = this.state.newSubdomain
    try {
      await this.cruxClient.registerCruxID(cruxID)
      UIResponse = 'cruxID registration initiated!'
      try {
        const { success, failures } = await this.cruxClient.putAddressMap(sampleAddressMap)
        UIResponse += `\nsuccessfully published: ${JSON.stringify(success)}, \nFailed publishing: ${JSON.stringify(failures, undefined, 4)}`
      } catch (e_1) {
        if (e_1 instanceof errors.CruxClientError) {
          UIResponse += `\n${e_1.errorCode}: ${e_1}`
        } else {
          UIResponse += '\n' + e_1
        }
      }
      console.log("============================= PAYIDCLAIM (PLEASE SAVE) ===============================", await AsyncStorage.getItem('payIDClaim'))
      Alert.alert('Save the PayIDClaim', "Your payIDClaim is printed to the console.")
    } catch (e) {
      if (e instanceof errors.CruxClientError) {
        UIResponse = `${e.errorCode}: ${e}`
      } else {
        UIResponse = e
      }
    } finally {
      this.setState({ registrationAcknowledgement: UIResponse })
    }
  }

  resolveCurrencyAddressForCruxID = async () => {
    let UIResponse = ""
    let cruxID = this.state.receiverVirtualAddress
    let walletCurrencySymbol = this.state.currency
    this.setState({ addresses: `resolving cruxID (${cruxID}) ${walletCurrencySymbol} address ...` })
    try {
      let resolvedAddress = await this.cruxClient.resolveCurrencyAddressForCruxID(cruxID, walletCurrencySymbol)
      UIResponse = JSON.stringify(resolvedAddress, undefined, 4)
    } catch (e) {
      if (e instanceof errors.CruxClientError) {
        UIResponse = `${e.errorCode}: ${e}`
      } else {
        UIResponse = e
      }
    } finally {
      this.setState({ addresses: UIResponse })
    }

  }

  getAssetMap = async () => {
    let UIResponse = ""
    try {
      let assetMap = await this.cruxClient.getAssetMap()
      UIResponse = JSON.stringify(assetMap, undefined, 4)
    } catch (e) {
      if (e instanceof errors.CruxClientError) {
        UIResponse = `${e.errorCode}: ${e}`
      } else {
        UIResponse = e
      }
    } finally {
      this.setState({ assetMap: UIResponse })
    }
  }

  getAddressMap = async () => {
    let UIResponse = ""
    try {
      let addressMap = await this.cruxClient.getAddressMap()
      UIResponse = JSON.stringify(addressMap, undefined, 4)
    } catch (e) {
      if (e instanceof errors.CruxClientError) {
        UIResponse = `${e.errorCode}: ${e}`
      } else {
        UIResponse = e
      }
    } finally {
      this.setState({ addressMap: UIResponse })
    }
  }

  putAddressMap = async () => {
    let UIResponse = ""
    let addressMap = {};
    Object.keys(this.state.publishAddressOptions).forEach((option) => {
      if (this.state.publishAddressOptions[option] === true) {
        addressMap[option] = this.state.userAddresses[option]
      }
    })
    console.log(addressMap);
    try {
      this.setState({ putAddressMapAcknowledgement: "Publishing your selected addresses..." })
      let { success, failures } = await this.cruxClient.putAddressMap(addressMap)
      UIResponse = `successfully published: ${JSON.stringify(success)}, \nFailed publishing: ${JSON.stringify(failures, undefined, 4)}`
    } catch (e) {
      if (e instanceof errors.CruxClientError) {
        UIResponse = `${e.errorCode}: ${e}`
      } else {
        UIResponse = e
      }
    } finally {
      this.setState({ putAddressMapAcknowledgement: UIResponse })
    }
  }

  getCruxIDState = async () => {
    let UIResponse = ""
    let cruxIDStatus = { cruxID: null, status: { status: "NONE", statusDetail: "" } }
    try {
      cruxIDStatus = await this.cruxClient.getCruxIDState()
      UIResponse = JSON.stringify(cruxIDStatus, undefined, 4)
    } catch (e) {
      if (e instanceof errors.CruxClientError) {
        UIResponse = `${e.errorCode}: ${e}`
      } else {
        UIResponse = e
      }
    } finally {
      this.setState({ cruxIDStatus: UIResponse })
    }
    return cruxIDStatus
  }

  updatePassword = async () => {
    let UIResponse = ""
    let oldEncryptionKey = this.state.oldEncryptionKey
    let newEncryptionKey = this.state.newEncryptionKey
    try {
      await this.cruxClient.updatePassword(oldEncryptionKey, newEncryptionKey)
      UIResponse = 'updated password successfully!'
    } catch (e) {
      if (e instanceof errors.CruxClientError) {
        UIResponse = `${e.errorCode}: ${e}`
      } else {
        UIResponse = e
      }
    } finally {
      this.setState({ passwordUpdateAcknowledgement: UIResponse })
    }
  }

  render() {
    return (
        <>
          <View>
            <Text>Demo Wallet</Text>
            <View>
              <Text>wallet client: {this.state.walletClientName}</Text>
              <Text>wallet encryption key: {this.state.encryptionKey}</Text>
              {/* <Text>wallet addresses: {this.state.userAddresses} </Text> */}
            </View>
          </View>

          <Text style={styles.container}></Text>

          <View>
            <Text>CruxPay Interface</Text>

            <View>
              <Text>cruxID status:</Text>
              <Text>{this.state.cruxIDStatus}</Text>
            </View>

            <View>
              <Text>cruxID availability:</Text>
              <TextInput placeholder="ankit" onChangeText={(registrationId) => this.setState({ registrationId })}></TextInput>
              <Button title="Check" onPress={() => this.isCruxIDAvailable()}></Button>
              <Text>{this.state.availability}</Text>
            </View>

            <View>
              <Text>cruxID registration:</Text>
              <TextInput placeholder="ankit" onChangeText={(newSubdomain) => this.setState({ newSubdomain })}></TextInput>
              <Text>@{this.state.walletClientName}.crux</Text>
              <Button title="Register" onPress={() => this.registerCruxID()}></Button>
              <Text>{this.state.registrationAcknowledgement}</Text>
            </View>

            <View>
              <Text>resolving public addresses:</Text>
              <TextInput placeholder="ankit@scatter_dev.crux" onChangeText={(receiverVirtualAddress) => this.setState({ receiverVirtualAddress })}></TextInput>
              <Picker
                  selectedValue={this.state.currency}
                  style={{ height: 50, width: 100 }}
                  onValueChange={(itemValue) =>
                      this.setState({ currency: itemValue })
                  }>
                {Object.keys(this.state.userAddresses).map((currency) => { return <Picker.Item label={currency} value={currency} /> })}
              </Picker>
              <Button title="Resolve address" onPress={() => this.resolveCurrencyAddressForCruxID()}></Button>
              <Text>{this.state.addresses}</Text>
            </View>

            <View>
              <Text>fetch wallet asset map:</Text>
              <Button title="Get supported assets" onPress={() => this.getAssetMap()}></Button>
              <Text>{this.state.assetMap}</Text>
            </View>

            <View>
              <Text>fetch public address map:</Text>
              <Button title="Get Public Addresses" onPress={() => this.getAddressMap()}></Button>
              <Text>{this.state.addressMap}</Text>
            </View>

            <View>
              <Text>publish address map:</Text>
              {
                Object.keys(this.state.userAddresses).map((currency, index) => {
                  return <View key={index}>
                    <CheckBox
                        key={index}
                        value={this.state.publishAddressOptions[currency]}
                        onValueChange={(value) => {
                          let options = this.state.publishAddressOptions
                          options[currency] = value;
                          this.setState({publishAddressOptions: options })
                        }}
                    />
                    <Text>{currency}</Text>
                  </View>
                })
              }
              <Button title="Publish Addresses" onPress={() => this.putAddressMap()}></Button>
              <Text>{this.state.putAddressMapAcknowledgement}</Text>
            </View>

            <View>
              <Text>change password (effectively encryptionKey):</Text>
              <TextInput placeholder="old encryption key" onChangeText={(oldEncryptionKey) => this.setState({ oldEncryptionKey })}></TextInput>
              <TextInput placeholder="new encryption key" onChangeText={(newEncryptionKey) => this.setState({ newEncryptionKey })}></TextInput>
              <Button title="Change Password" onPress={() => this.updatePassword()}></Button>
              <Text>{this.state.passwordUpdateAcknowledgement}</Text>
            </View>


          </View>
        </>
    )
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
