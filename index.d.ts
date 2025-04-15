import type { IFLITEGlobals } from "./flite";
import type { ILanceGlobals } from "./lance";

export type * from "./common";
declare global {
  interface Window {  
	LOOPINDEX: {
		$: JQueryStatic;
		FLITE: IFLITEGlobals;
		LANCE: ILanceGlobals;				
	};
  }
}

