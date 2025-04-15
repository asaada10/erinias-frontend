import type { Reroute } from '@sveltejs/kit';
import { deLocalizeUrl } from './paraglide/runtime';

export const reroute: Reroute = (request) => {
	console.log('Oye, tú estás siendo ejecutado en que lado.');
	return deLocalizeUrl(request.url).pathname;
};
