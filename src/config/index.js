export {languages} from './languages'
export {currencies} from './currencies'
export {api} from './api'
export {images} from './images'

export const tokenDecimals = 100000000;
export const tokenUnit = "VEO";

const isTestnet = true;

export const CONTRACT_ADDRESS = isTestnet
	? "0x6887AD54bb06F8c72b7690c1e5A6bd9a73610961"
	: "0xA15d59410D8D4c9da920709B4E866947ab160fc9";

const etherscanBase = isTestnet
	? "https://ropsten.etherscan.io/address/"
	: "https://etherscan.io/address/";

export const ETHERSCAN_URL = etherscanBase + CONTRACT_ADDRESS;

export const DEFAULT_PROVIDER = isTestnet
	? "https://ropsten.infura.io/ciBBPCkyQfaUNJHDiCMJ"
	: "https://mainnet.infura.io/ciBBPCkyQfaUNJHDiCMJ";
