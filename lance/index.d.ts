
import type { 
	IFroalaCommandRecord, FroalaModule,	IPluginUserConfig,
	IPluginTooltipOptions, LocalizeFunction, ILoopIndexUser,
	ILoopIndexPlugin, Mutable, ICommandRecord,
	IPluginConfig
} from "../common/";
import type { 
	AnnotationStatusCallback, IAnnotation,
	IAnnotationOptions, IAnnotationsManager, IStaticAnnotations
} from "./annotations";
import type { ICreateAnnotationsUIOptions, ILanceUI, IStaticAnnotationsUI } from "./ui";

export type * from "./annotations";
export interface ILanceGlobals {
	initFroalaLancePlugin(Froala: FroalaModule, options: {
		path: string,
		assetPath?: string;
		commands?: IFroalaCommandRecord[];
	}): Promise<boolean>;

	createAnnotationsUI(options: ICreateAnnotationsUIOptions): ILanceUI;
	readonly Annotations: IStaticAnnotations;
	readonly AnnotationsUI: IStaticAnnotationsUI;
}

export interface ILancePlugin<TEditor extends {} = object> extends ILoopIndexPlugin<TEditor, ILanceConfiguration> {
    getAnnotations(): IAnnotationsManager;
	readonly App: ILanceGlobals;
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

export interface IResolvedDisplayPolicy{
	readonly display: ResolvedDisplayStyle;
	readonly tooltips: boolean;
}

export interface ILanceUserConfiguration extends Mutable<IPluginUserConfig<ILanceTooltipOptions, ICommandRecord>> {
	plugins?: any[];
	annotations: Partial<IAnnotationOptions>;
	isDragEnabled?: boolean;
	undoPolicy?: UndoPolicy;
	/**
	 * Guranteed AnnotationType[] after validation
	 */
	useTextSelection?: boolean | AnnotationType | AnnotationType[];
	extendFocus?: boolean;
	customAttributes?: string[];
	maximize?: any;
	/**
	 * If false or empty, don't show tooltip. When this property reaches the plugin, it is already set to be a string
	 * @deprecated
	 */
	tooltipFormat?: string;

	/**
	 * Defaults to true
	 */
	autoScroll?: boolean | "smooth" | "live";
	/**
	 * Defaults to `annotation`
	 */
	tagName?: string;
	/**
	 * Defaults to `"none"`
	 */
	readonlyPolicy?: ReadOnlyPolicy;

	/**
	 * For Tmce5
	 * @deprecated
	 */
	svgIcon?: string;
	/**
	 * For CKE
	 */
	ckeStrictSelection?: boolean;

	/**
	 * For api key detection (allows test apps to set the api key data as if it was hardcoded)
	 */
	spellingOverride?: any;

	statusCallback?: AnnotationStatusCallback;

	commentSelectionPolicy?: CommentSelectionPolicy;

	resolvedDisplayPolicy?: Partial<IResolvedDisplayPolicy>
}


// export interface ILanceConfiguration extends IPluginUserConfig<ILanceTooltipOptions> {
// 	annotations: Partial<IAnnotationOptions>;
// 	undoPolicy?: UndoPolicy;
// 	/**
// 	 * Guranteed AnnotationType[] after validation
// 	 */
// 	useTextSelection: boolean | AnnotationType | AnnotationType[];
// 	extendFocus: boolean;
// 	customAttributes: string[];

// 	/**
// 	 * Defaults to true
// 	 */
// 	autoScroll: boolean | "smooth" | "live";
// 	/**
// 	 * Defaults to `annotation`
// 	 */
// 	tagName: string;
// 	/**
// 	 * Defaults to `"none"`
// 	 */
// 	readonlyPolicy: ReadOnlyPolicy;

// 	/**
// 	 * For CKE
// 	 */
// 	ckeStrictSelection: boolean;

// 	statusCallback?: AnnotationStatusCallback;


// 	commentSelectionPolicy: CommentSelectionPolicy;

// 	resolveDisplayPolicy: Partial<IResolveDisplayPolicy>;

// 	maximize: unknown;
// }

export interface ILanceConfiguration extends IPluginConfig<ILanceTooltipOptions> {
	plugins?: any[];
	annotations: Partial<IAnnotationOptions>;
	isDragEnabled?: boolean;
	undoPolicy: UndoPolicy;
	/**
	 * Guranteed AnnotationType[] after validation
	 */
	useTextSelection: AnnotationType[];
	extendFocus: boolean;
	customAttributes?: string[];
	maximize?: any;

	// tooltips: ILanceTooltipOptions;
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
	ckeStrictSelection?: boolean;

	statusCallback?: AnnotationStatusCallback;

	commands: ICommandRecord[];

	commentSelectionPolicy: CommentSelectionPolicy;

	resolvedDisplayPolicy: IResolvedDisplayPolicy;

}

export type IEditorConfiguration<TEditorConfig = Record<string, any>> = {
    lance: Partial<ILanceUserConfiguration>;
} & Partial<TEditorConfig>;

