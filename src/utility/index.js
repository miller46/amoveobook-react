export function getDisplayExpires(endBlock, height) {
	let expires = new Date();
	const diff = endBlock - height;
	const minutes = diff * 10;
	expires.setMinutes(expires.getMinutes() + minutes);
	const options = {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
	return expires.toLocaleDateString('en-US', options) + " (Block " + endBlock + ")";
}

export {createIcon} from './blockies'