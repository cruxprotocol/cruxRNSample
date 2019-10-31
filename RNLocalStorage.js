import { CruxPay } from "@cruxpay/rn-sdk";
import * as AsyncStorage from "react-native/Libraries/Storage/AsyncStorage";

class RNLocalStorage extends CruxPay.storage.StorageService {

    setItem = async (key, value) => AsyncStorage.setItem(key, value)

    getItem = async (key) => AsyncStorage.getItem(key)
}

export {RNLocalStorage};
