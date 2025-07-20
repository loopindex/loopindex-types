import { ILoopIndexGlobals } from ".";
import type { IFLITEGlobals } from "./flite";
import type { ILanceGlobals } from "./lance";

interface LIGlobals {
    readonly FLITE: IFLITEGlobals;
    readonly LANCE: ILanceGlobals;				
}

declare global {
  interface Window {  
	  readonly LOOPINDEX: ILoopIndexGlobals & LIGlobals;
  }
}

