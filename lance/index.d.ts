
import type { ILoopIndexGlobals } from "..";
import type { 
	FroalaModule, IPluginUserConfig,
	IPluginTooltipOptions, LocalizeFunction, ILoopIndexUser,
	ILoopIndexPlugin, Mutable, ICommandRecord,
	IPluginConfig, ILoopIndexLogger,
	IFroalaInitOptions,	OperationPromise,
	Nullable
} from "../common/";
import type { RangeInfo } from "../common/dom";
import type { 
	AnnotationStatusCallback, IAnnotation,
	IAnnotationOptions, IAnnotationsManager, IStaticAnnotations,
	ThreadType
} from "./annotations";
import type { ICreateAnnotationsUIOptions, ILanceUI, IStaticAnnotationsUI } from "./ui";

export type * from "./annotations";


export interface ILanceCommands {
	/**
	 * @member LANCE.Commands
	 * @readonly
	 * @static
	 * @property {String} [ANNOTATE="annotate"]
	 */
	readonly ANNOTATE: string,
	/**
	 * @member LANCE.Commands
	 * @readonly
	 * @static
	 * @property {String} [RESOLVE_ALL="lance-resolve-all"]
	 */
	readonly RESOLVE_ALL: string,
}

export type ILanceFroalaInitOptions = IFroalaInitOptions<ILanceUserConfiguration>;

export interface ILanceEvents {
	readonly INIT: "lance::init";
}

export interface ILanceGlobals {
	initFroalaLancePlugin<TConfig extends IPluginUserConfig>(Froala: FroalaModule, options: IFroalaInitOptions<TConfig>): Promise<boolean>;

	createAnnotationsUI(options: ICreateAnnotationsUIOptions): ILanceUI;
	
	readonly logger: ILoopIndexLogger;
	readonly Commands: ILanceCommands;
	readonly Events: ILanceEvents;
	readonly Annotations: IStaticAnnotations;
	readonly AnnotationsUI: IStaticAnnotationsUI;
}

export interface IDocumentLocation {
	readonly start: number;
	readonly end: number;
	readonly text?: string;
}

export interface IAnnotateWithOptions {
	readonly userId: string;
	readonly text: string;
	readonly location?: IDocumentLocation;
	readonly bookmarkId?: string;
	/**
	 * If not null/undefined, append to this annotation
	 */
	readonly annotationId?: string;
	/**
	 * Defaults to `"normal"`
	 */
	readonly type?: ThreadType;
}


export interface IAnnotationBookmarkOptions {
	readonly range?: RangeInfo;
	readonly maxLength?: number;
}


export interface ILancePlugin<
	TEditor extends {} = object, TConfig extends ILanceConfiguration = ILanceConfiguration
	> extends ILoopIndexPlugin<TEditor, TConfig> {
	/**
	 * @method getAnnotations
	 * @returns {LANCE.Annotations} The Annotations manager associated with this plugin instance
	 */
	getAnnotations(): IAnnotationsManager;
	/**
	 * returns the DOM node correspoding to an annotation
	 * @param {String} id The Annotation id
	 */
	getAnnotationNodeForId(id: string): Nullable<HTMLElement>;

	/**
	 * Return all the nodes associated with this annotation
	 * @param annId 
	 */
	getAllAnnotationNodesForId(annId: string): HTMLElement[];

	/**
	 * Return all the annotation nodes in the document
	 * @param type If provided, return only annotation nodes of this type 
	 */
	getAllAnnotationNodes(type?: RuntimeAnnotationType): HTMLElement[];

	annotateWith(options: IAnnotateWithOptions): OperationPromise<IAnnotation>;

	setAnnotationBookmark(options: IAnnotationBookmarkOptions): string;


	readonly App: ILanceAppGlobals;

	readonly isEnabled: boolean;
}

/**
 * Defined here rather than in LanceEvents, because the LANCE namespace may not be available when you
 * set a listener for this event
 */
export interface ILanceInitEvent {
	readonly lance: ILancePlugin;
}

export type UndoPolicy = "none" | "create" | "all";
export type ResolvedDisplayStyle = "none" | "minimal" | "full";
export type RuntimeAnnotationType = "pin" | "text";
export type AnnotationType = RuntimeAnnotationType | "all" | "pin/start" | "pin/end";
export type ReadOnlyPolicy = "none" | "full";
export type CommentSelectionPolicy = "full" | "caret" | "none";
export type EditorScrollType = "smooth" | "live";

export interface IResolveDisplayPolicy{
	readonly display: ResolvedDisplayStyle;
	readonly tooltips: boolean;
}

export interface ITooltipTitleOptions {
	readonly config: ILanceTooltipOptions;
	readonly annotation: IAnnotation;
	readonly localize: LocalizeFunction;
}
export type TooltipCallback = (options: ITooltipTitleOptions) => string;

export interface ILanceTooltipOptions extends IPluginTooltipOptions{
	readonly formatter?: TooltipCallback;
}

export type LanceUserTypes = "user" | "bot-comment";
export interface ILanceUser<TUserType extends string = LanceUserTypes> extends ILoopIndexUser<TUserType> {
	readonly picture?: string;
}

export interface IResolvedDisplayPolicy{
	readonly display: ResolvedDisplayStyle;
	readonly tooltips: boolean;
}

export interface ILanceUserConfiguration extends IPluginUserConfig<ILanceTooltipOptions, ICommandRecord> {
	readonly plugins?: any[];
	readonly annotations: Partial<IAnnotationOptions>;
	readonly isDragEnabled?: boolean;
	readonly undoPolicy: UndoPolicy;
	/**
	 * Guranteed AnnotationType[] after validation
	 */
	readonly useTextSelection: boolean | AnnotationType | AnnotationType[];
	readonly extendFocus: boolean;
	readonly customAttributes: string[];
	readonly maximize: unknown;
	/**
	 * If false or empty, don't show tooltip. When this property reaches the plugin, it is already set to be a string
	 * @deprecated
	 */
	readonly tooltipFormat: string;

	/**
	 * Defaults to true
	 */
	readonly autoScroll: boolean | "smooth" | "live";
	/**
	 * Defaults to `annotation`
	 */
	readonly tagName: string;
	/**
	 * Defaults to `"none"`
	 */
	readonly readonlyPolicy: ReadOnlyPolicy;

	/**
	 * For CKE
	 */
	readonly ckeStrictSelection?: boolean;

	/**
	 * For internal use
	 */
	readonly spellingOverride?: any;

	readonly statusCallback: AnnotationStatusCallback;

	readonly commentSelectionPolicy: CommentSelectionPolicy;

	readonly resolvedDisplayPolicy: Partial<IResolvedDisplayPolicy>
}

/**
 * This is the configuration object maintained by each instance of the Lance plugin
 */
export interface ILanceConfiguration extends IPluginConfig<ILanceTooltipOptions> {
	/**
	 * CKEditor only
	 */
	readonly plugins: Record<string, unknown>;
	readonly annotations: Partial<IAnnotationOptions>;
	readonly isDragEnabled?: boolean;
	readonly undoPolicy: UndoPolicy;
	/**
	 * Guranteed AnnotationType[] after validation
	 */
	readonly useTextSelection: AnnotationType[];
	readonly extendFocus: boolean;
	readonly customAttributes?: string[];
	readonly maximize?: unknown;

	// tooltips: ILanceTooltipOptions;
	/**
	 * Defaults to true
	 */
	readonly autoScroll: boolean | EditorScrollType;
	/**
	 * Defaults to `annotation`
	 */
	readonly tagName: string;
	/**
	 * Defaults to `"none"`
	 */
	readonly readonlyPolicy: ReadOnlyPolicy;

	/**
	 * For CKE
	 */
	readonly ckeStrictSelection?: boolean;

	readonly statusCallback?: AnnotationStatusCallback;

	readonly commentSelectionPolicy: CommentSelectionPolicy;

	readonly resolvedDisplayPolicy: IResolvedDisplayPolicy;

}

export type IEditorConfiguration<TEditorConfig = Record<string, any>> = {
    readonly lance: Partial<ILanceUserConfiguration>;
} & Partial<TEditorConfig>;

export interface ILanceAppGlobals extends ILoopIndexGlobals {
	readonly LANCE: ILanceGlobals;				
}
