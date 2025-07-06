import { ILoopIndexGlobals } from ".";
import type { IFLITEGlobals } from "./flite";
import type { ILanceGlobals } from "./lance";

declare global {
  interface Window {  
	  readonly LOOPINDEX: ILoopIndexGlobals;
    readonly FLITE: IFLITEGlobals;
    readonly LANCE: ILanceGlobals;				
  }
}

