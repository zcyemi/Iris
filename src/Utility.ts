export class Utility {


	public static Hashfnv32a(str: string): number {
		var FNV1_32A_INIT = 0x811c9dc5;
		var hval = FNV1_32A_INIT;
		for (var i = 0; i < str.length; ++i) {
			hval ^= str.charCodeAt(i);
			hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
		}
		return hval >>> 0;
	}
}