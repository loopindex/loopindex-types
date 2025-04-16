
import type { 
	IFroalaCommandRecord, FroalaModule,	IPluginUserConfig,
	IPluginTooltipOptions, LocalizeFunction, ILoopIndexUser
} from "../common/";
import type { 
	AnnotationStatusCallback, IAnnotation,
	IAnnotationOptions, IAnnotationsManager 
} from "./annotations";
import type { ICreateAnnotationsUIOptions, ILanceUI } from "./ui";

export type * from "./annotations";
export interface ILanceGlobals {
	initFroalaLancePlugin(Froala: FroalaModule, options: {
		path: string,
		assetPath?: string;
		commands?: IFroalaCommandRecord[];
	}): Promise<boolean>;

	createAnnotationsUI(options: ICreateAnnotationsUIOptions): ILanceUI;
}

export interface ILancePlugin<TEditor = unknown> {
    getAnnotations(): IAnnotationsManager;
    readonly version: string;
	readonly App: ILanceGlobals;
	readonly editor: TEditor;
}

export interface ILanceInitEvent {
	lance: ILancePlugin;
}

export type UndoPolicy = "none" | "create" | "all";
export type ResolvedDisplayStyle = "none" | "minimal" | "full";
export type RuntimeAnnotationType = "pin" | "text";
export type AnnotationType = RuntimeAnnotationType | "all" | "pin/start" | "pin/end";
export type ReadOnlyPolicy = "none" | "full";
export type CommentSelectionPolicy = "full" | "caret" | "none";

export interface IResolveDisplayPolicy{
	readonly display: ResolvedDisplayStyle;
	readonly tooltips: boolean;
}

export interface ITooltipTitleOptions {
	config: ILanceTooltipOptions;
	annotation: IAnnotation;
	localize: LocalizeFunction;
}
export type TooltipCallback = (options: ITooltipTitleOptions) => string;

export interface ILanceTooltipOptions extends IPluginTooltipOptions{
	formatter?: TooltipCallback;
}

export interface ILanceUser extends ILoopIndexUser {
	readonly picture?: string;
}

export interface ILanceConfiguration extends IPluginUserConfig<ILanceTooltipOptions> {
	annotations: Partial<IAnnotationOptions>;
	undoPolicy?: UndoPolicy;
	/**
	 * Guranteed AnnotationType[] after validation
	 */
	useTextSelection: boolean | AnnotationType | AnnotationType[];
	extendFocus: boolean;
	customAttributes: string[];

	/**
	 * Defaults to true
	 */
	autoScroll: boolean | "smooth" | "live";
	/**
	 * Defaults to `annotation`
	 */
	tagName: string;
	/**
	 * Defaults to `"none"`
	 */
	readonlyPolicy: ReadOnlyPolicy;

	/**
	 * For CKE
	 */
	ckeStrictSelection: boolean;

	statusCallback?: AnnotationStatusCallback;


	commentSelectionPolicy: CommentSelectionPolicy;

	resolveDisplayPolicy: Partial<IResolveDisplayPolicy>
}

export type IEditorConfiguration<TEditorConfig = Record<string, any>> = {
    lance: Partial<ILanceConfiguration>;
} & Partial<TEditorConfig>;

