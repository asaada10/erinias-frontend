import { getContext, setContext, type Snippet } from 'svelte';

const key = Symbol('layout-context');

interface LayoutContext {
	sidebarHeader: Snippet | undefined;
	room: Snippet | undefined;
	chatHeader: Snippet | undefined;
	chat: Snippet | undefined;
	chatInput: Snippet | undefined;
	search: Snippet | undefined;
}

export function initLayoutContext() {
	const layout: LayoutContext = $state({
		sidebarHeader: undefined,
		room: undefined,
		chatHeader: undefined,
		chat: undefined,
		chatInput: undefined,
		search: undefined
	});
	return setContext(key, layout);
}

export function setLayoutComponent(component: Partial<LayoutContext>) {
	const context = getContext<LayoutContext>(key);
	Object.assign(context, component);
}

export function cleanLayoutContext() {
	const context = getContext<LayoutContext>(key);
	if (!context) {
		return;
	}
	Object.assign(context, {
		header: undefined,
		sidebarHeader: undefined,
		room: undefined,
		chatHeader: undefined,
		chat: undefined,
		chatInput: undefined,
		search: undefined
	});
}
