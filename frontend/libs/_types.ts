// Generic object type
export interface PlainObject {
	[key: string]: any;
}
// Type guard for PlainObject
export const isPlainObject = (object: any): object is PlainObject => {
	if (!object) return false;
	if (Object.keys(object).length || object === {}) return true;
	else return false;
};

export const isEmptyObject = (object: any): boolean => {
	if (!object) return true;
	if (Object.keys(object)?.length) return false;
	return true;
};
