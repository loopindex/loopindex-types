import type { IFLITEGlobals } from "./flite";
import type { ILanceGlobals } from "./lance";

export type * from "./common";

export interface ILoopIndexGlobals {
	readonly $: JQueryStatic;
	readonly FLITE: IFLITEGlobals;
	readonly LANCE: ILanceGlobals;				
}
declare global {
  interface Window {  
	LOOPINDEX: ILoopIndexGlobals;
  }
}

