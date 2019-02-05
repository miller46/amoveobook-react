import {api} from "../config";

export function hasChannel(amoveo3) {
	let hasChannel = false;
	if (amoveo3 && amoveo3.channels) {
		let network = getNetwork(amoveo3);
		const coinbase = amoveo3.coinbase;
		const serverPubkey = api[network].serverPublicKey;
		for (let i = 0; i < amoveo3.channels.length; i++) {
			const channel = amoveo3.channels[i];
			const channelServerPubkey = channel.serverPubKey;
			const channelInfo = channel.me;
			if (channelInfo) {
				const channelAddress = channelInfo[1];
				if (channelAddress === coinbase && serverPubkey === channelServerPubkey) {
					hasChannel = true;
					break;
				}
			}
		}
	}

	return hasChannel;
}

export function getNetwork(amoveo3) {
	let network = localStorage.getItem("lastNetwork") || "mainnet"
	if (amoveo3 && amoveo3.network) {
		network = window.amoveo3.network;
		localStorage.setItem("lastNetwork", network);
	}

	return network;
}
