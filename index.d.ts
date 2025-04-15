import type { IFLITEConfiguration, IFLITEGlobals } from "./flite";
import type { ILanceConfiguration, ILanceGlobals } from "./lance";
import { FroalaOptions } from "froala-editor";

export * from "./common";
export * from "./flite";
export * from "./lance";

export interface IExtendedFroalaOptions extends FroalaOptions {
	readonly flite?: Partial<IFLITEConfiguration>;
	readonly lance?: Partial<ILanceConfiguration>;
	toolbarButtons?: Record<string, {
		buttons: string[];
	}>
}

export interface IEditorLoopIndexPlugins {
	flite?: IFLITEPlugin;
	lance?: ILancePlugin;
}


declare global {
  interface Window {  
	LOOPINDEX: {
		$: JQueryStatic;
		FLITE: IFLITEGlobals;
		LANCE: ILanceGlobals;				
	};
  }
}

