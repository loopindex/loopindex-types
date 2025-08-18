import { IModalAlertManager } from "./common/alerts";

export type * from "./common";

export interface ILoopIndexUtils {
	readonly VERSION: string;
	readonly alertManager: IModalAlertManager;
}
export interface ILoopIndexGlobals {
	readonly $: JQueryStatic;
	readonly utils: ILoopIndexUtils;
}

