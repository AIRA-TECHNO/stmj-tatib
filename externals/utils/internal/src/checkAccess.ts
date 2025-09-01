import { useContextGlobal } from "@/externals/contexts/ContextGlobal";


/**
 * utils check access feature user
 * example usage: checkUserAccess(['user:create,read'], UserAuthed?.accesses)
 */
export function checkUserAccess(
	rules: string[],
	userAccesses?: any[]
) {
	if (!userAccesses) {
		const { UserAuthed } = useContextGlobal();
		userAccesses = [];
	}
	for (const rule of rules) {
		const [rKeyFeature, rAccesses] = rule.split(':');
		for (const { access, key } of userAccesses) {
			if (key == rKeyFeature) {
				for (const acs of access) {
					if (rAccesses.split(',').includes(acs)) {
						return true;
					}
				}
			}
		}
	}
	return false;
}


/**
 * utils helper for check is enabled menu
 */
export function checkEnabledMenu(availabledMenus: any[], destinationPath: string) {
	for (const availabledMenu of availabledMenus) {
		if (availabledMenu.path == destinationPath) return true;
		for (const availabledChildrenMenu of (availabledMenu.children ?? [])) {
			if (availabledChildrenMenu.path == destinationPath) return true;
		}
	}
	return false;
}