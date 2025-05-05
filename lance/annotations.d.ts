
import type { ILanceUser } from ".";
import type { 
	IEvents, Nullable, IUserManager,
	ILoopIndexPluginEvent
} from "../common/";

export declare interface IAnnotationManagerEvents {
	readonly ANNOTATION_CREATED: string;
	readonly ANNOTATION_DELETED: string;
	readonly ANNOTATION_RESOLVED: string;
	readonly ANNOTATION_PRESELECT: string;
	readonly ANNOTATION_SELECTED: string;
	readonly ANNOTATION_UPDATED: string;
	readonly COMMENT_ADDED: string;
	readonly COMMENT_DELETED: string;
	readonly COMMENT_CHANGED: string;
	readonly COMMENT_SELECTED: string;
	readonly RESET: string;
	readonly BEFORE_RESET: string;
	readonly RELOAD: string;
	readonly ENABLED_CHANGED: string;
	readonly SIZE_CHANGED: string;
	readonly DONE_EDITING: string;
	readonly ATTRIBUTE_CHANGED: string;
	readonly ANNOTATIONS_RENUMBERED: string;
	readonly ANNOTATION_POSTSELECT: string;
	readonly DESTROY: string;
	readonly USER_CHANGED: string;
	Host: {
		readonly ANNOTATION_NODE_REVEALED: string;
		readonly ANNOTATION_NODES_VISIBLITY: string;
		readonly ANNOTATION_CONTAINER_SCROLL: string;
		readonly LOCALE_CHANGED: string;
	},
	UI: {
		/**
		 * Fired after the UI was created, on the first occasion that the owner is not null;
		 */
		readonly CREATED: string;
		/**
		 * Fired when an owner is set and the UI has already been reported as created
		 */
		readonly ACTIVE: string;
		/**
		 * Fired when an comment UI that has focus is about to be removed from DOM
		 */
		readonly FOCUSED_REMOVED: string;

	}
}

export interface IStaticAnnotations {
	readonly Events: IAnnotationManagerEvents;
}

export interface ICommentStatus {
	/**
	 * @property {Boolean}
	 */
	isSelected: boolean;
	/**
	 * @property {Boolean} isLast This is the last comment in the thread
	 */
	isLast: boolean;
	/**
	 * @property {Boolean} isFirst This is the first comment in the thread
	 */
	isFirst: boolean;
	/**
	 * @property {Boolean} isResolved
	 */
	isResolved: boolean;
	/**
	 * @property {Boolean} isNew This is a new comment, with no text
	 */
	isNew: boolean;
	/**
	 * @property {Boolean} isownerComment This comment was authored by the current user
	 */
	isOwnerComment: boolean;
	/**
	 * @property {Boolean} canDelete can this comment be deleted by the current user
	 */
	canDelete: boolean;
	/**
	 * @property {Boolean} canEdit  can this comment be edited by the current user
	 */
	canEdit: boolean;
	/**
	 * @property {Boolean} canResolve  can this comment be resolved by the current user
	 */
	canResolve: boolean;
	/**
	* @property {Boolean} canReopen  can this comment be reopened
	*/
	canReopen: boolean;
	/**
	 * @property {Boolean} canReply  can the current user reply to this comment?
	 */
	readonly canReply: boolean;

	/**
	 * A map of command enabled statuses keyed by command id,
	 * guaranteed not null
	 */
	readonly custom: Record<string, boolean>;
}

export type CommentFilter = (comment: IComment) => boolean;

export type AnnotationRole = "none" | "opener" | "owner" | "user" | "any";


export interface IComment {
	readonly id: string;
	readonly userId: string;
	readonly userName: string;
	readonly time: number;
	readonly text: string;
	setTime(time: number | Date | string): void;
	setSelected(selected: boolean): void;
	setUserPicture(url: string): void;
	isSelected(): boolean;
	getUserPicture(): string;
	getStatus(): Nullable<ICommentStatus>;
}

export interface IAnnotation {
	readonly id: string;
	readonly attributes: { [key: string]: any };
	readonly sequence: number;
	/**
	 * Guaranteed not null
	 */
	readonly comments: ReadonlyArray<IComment>;
	invalidateStatus(): void;
	isSelected(): boolean;
	isEmpty(): boolean;
	displayText(): string;
	/**
	 * Guaranteed not null
	 */
	setSelected(selected: boolean): void;
	setResolved(resolved: boolean): void;
	saveToObject(): any;
	/**
	 * returns the number of comments
	 */
	count(): number;
	getCommentByIndex(index: number): Nullable<IComment>;
	getCommentById(commentId: string): Nullable<IComment>;
	setCommentText(commentId: string, text: string): void;
	isFirst(commendId: string): boolean;
	isLast(commendId: string): boolean;
	getOpenerId(): string;
	addComment(props: any): IComment;
	deleteComment(commentId: string): boolean;
	selectComment(id: string, bSelected: boolean): void;
	isResolved(): boolean;
	isSelected(): boolean;
	firstComment(): IComment;
}

export type ISerializedComment = IComment;
export interface ISerializedAnnotation {
	readonly id: string;
	readonly resolved: boolean;
	readonly sequence: number;
	readonly attributes: any,
	readonly comments: ISerializedComment[]
}
export type AnnotationOrId = IAnnotation | string;


export declare interface ICommentAndStatus {
	readonly annotation: IAnnotation;
	readonly comment: IComment;
	readonly status: ICommentStatus;
}

export declare interface IInsertAnnotationOptions {
	/**
	 * Position in the annotations sequence. Defaults to last
	 */
	position: number;
	notify?: boolean;
	/**
	 * allows you to attach an arbitrary context that will be echoed in the ensuing events
	 */
	context?: any;
	fromData?: boolean;
}

export interface ISelectAnnotationOptions {
	id: string;
	select: boolean;
	hostData?: any;
	isDeselecting: boolean;
	/**
	 * if false, don't trigger an event
	 */
	notify?: false;
}

export interface ISelectCommentOptions {
	readonly annotationId: string;
	readonly commentId: string;
	readonly bSelect: boolean;
	readonly bEdit: boolean;
	readonly hostData?: any
}

export declare interface IAnnotationsOwner {
	/**
	 * Creates a path composed of the arguments, prefixed by the plugin path if the arguments
	 * do not form an absolute url
	 * @param args 
	 */
	resolvePath(...args: string[]): string;
	getLocalizedString: (key: string) => string;

	readonly tagName: string;
}

export interface IAnnotationsManager {
	readonly events: IEvents;
	readonly users: IUserManager<ILanceUser>;
	loadFromData(data?: Array<any>): void;
	dispose(): void;
	/**
	 * @ignore
	 * @method getAllAnnotationIds
	 * @returns {Array} An array of all the current annotation ids
	 */
	getAllAnnotationIds(): Array<string>;
	/**
	 * @ignroe
	 * @param force If true, set to enabled regardless of the disable count
	 */
	enable(isEnabled: boolean): void;
	isEnabled(): boolean;
	selectAnnotation(options: Partial<ISelectAnnotationOptions>): void;
	/**
	 * Select a comment in an annotation
	 * @param annotationId 
	 * @param commentId 
	 * @param bSelect 
	 * @param bEdit If true, display comment editing UI
	 * @param hostData Data passed to the UI (usually the corresponding editor node, for visual alignment)
	 */
	selectComment(options: ISelectCommentOptions): void;
	unselectAll(): void;
	serializeAnnotation(annotation: AnnotationOrId): Nullable<ISerializedAnnotation>;
	deleteAnnotation(annotationId: AnnotationOrId, ...args: any[]): void;
	setAnnotationsSequence(ids: ReadonlyArray<string>): void;
	getAnnotationById(id: string): Nullable<IAnnotation>;
	insertAnnotation(data: IInsertAnnotationOptions): IAnnotation;
	setAttribute(annotationId: string, attrName: string, value: any): Nullable<IAnnotation>;
	resolveAnnotation(annotationId: AnnotationOrId, commentId: string, isResolved: boolean): this;

	/**
	 * @return an array of selected annotations
	 */
	getSelectedAnnotationIds(): Array<string>;

	addUsers(users: ReadonlyArray<ILanceUser>): void;

	/**
	 * Returns the user id of the annotations manager
	 */
	getUserId(): string;

	/**
	* sets the user id of the annotations manager
	* @param id 
	* @returns the new user id
	*/
	setUserId(id: string): string;

	/**
	 * Used to notify this manager that the comment is no longer edited
	 * @param annotationId \
	 */
	addCustomAttributes(attrs: string | Array<string>): void;
	getCommentStatus(annotationId: string, commentId: string): ICommentStatus;
	getLocalizedString(key: string): string;
	countAnnotations(excludeEmpty?: true): number;
	getAnnotationByIndex(index: number): Nullable<IAnnotation>;
	deleteComment(annotationId: string, commentId: string): this;
	getComment(annotationId: string, commentId: string): ICommentAndStatus;
	revertComment(annotationId: string, commentId: string, allowDelete: boolean): IComment;
	setCommentText(annotationId: string | IAnnotation, commentId: string, text: string): Nullable<IComment>;
	// addComment(annotationId: string | IAnnotation, commentId: string, text: string, noTrigger?: boolean): IComment;
	addComment(annotationId: string | IAnnotation, text: string, noTrigger?: boolean): Nullable<IComment>;

	/**
	 * returns a function that matches a comment if it is related to the provided text
	 * @param text 
	 */
	createCommentFilter(text: string): CommentFilter;

	/**
	 * Works according to the resolveAllPolicy in its config
	 */
	canResolveAll(): boolean;
	/**
	 * Works according to the resolveAllPolicy in its config
	 */
	resolveAll(): IAnnotation[];

	getHost(): IAnnotationsOwner;
}
export declare interface IAnnotationPermissionsDetailedBlock {
	first?: AnnotationRole;
	last?: AnnotationRole;
	default?: AnnotationRole;
}

export declare interface IAnnotationPermissions {
	edit: AnnotationRole | IAnnotationPermissionsDetailedBlock;
	delete: AnnotationRole | IAnnotationPermissionsDetailedBlock;
	resolve: AnnotationRole | IAnnotationPermissionsDetailedBlock;
}

export type RequestUserCallback = (user: ILanceUser, callback: (user: ILanceUser) => any) => any;

interface IAnnotationStatusOptions {
	comment: IComment;
	annotation: IAnnotation,
	status: ICommentStatus;
	owner: IAnnotationsManager;
}

export type AnnotationStatusCallback = (options: IAnnotationStatusOptions) => any;

interface IResolveAllCallbackData {
	readonly owner: IAnnotationsManager;
	readonly annotation: IAnnotation;
}

export type ResolveAllCallback = (data: IResolveAllCallbackData) => boolean;

export type ResolveAllPolicy = "strict" | "all" | ResolveAllCallback;

export interface IAnnotationOptions {
	defaultPicture: string;
	permissions: IAnnotationPermissions;
	userId: string;
	// optional function that generates unique ids for annotation objects
	idGenerator: (user?: ILanceUser) => string;
	owner: IAnnotationsOwner;
	requestUser: RequestUserCallback;
	statusCallback: Function;
	users: Array<ILanceUser>;
	// for the api key test, this is the head element
	hostOptions?: JQuery;
	resolveAllPolicy: ResolveAllPolicy;
}

/**
 * Basic comment/thread ID structure
 */
export declare interface ICommentID {
	readonly annotationId: string;
	readonly commentId: string;
}
export namespace LanceEvents {
	interface ICommentEditingDoneEvent extends ICommentID {
		canceled: boolean;
		mode: "comment" | "reply"
	}

	interface IAnnotationEvent {
		readonly annotation: IAnnotation;
	}
	
	interface ICommentChangedEvent extends IAnnotationEvent{
		readonly comment: IComment;
		readonly status: ICommentStatus;
	}

	interface IAnnotationAttributesEvent extends IAnnotationEvent {
		readonly attributes: Record<string, string>;
	}
	
	interface IAnnotationsRenumberedEvent {
		readonly sequence: ReadonlyArray<string>;
	}
	
	interface IAnnotationCreatedEvent extends IAnnotationEvent {
		next: string;
		context?: any;
		before?: string;
	}
	
	interface IAnnotationDeletedEvent {
		readonly id: string;
	}
	
	interface IAnnotationPreselectEvent extends ILoopIndexPluginEvent, IAnnotationEvent {
		readonly isSelected: boolean;
	}
	
}