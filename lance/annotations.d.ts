
import type { ILanceUser } from ".";
import type {
	IEvents, Nullable, IUserManager,
	ILoopIndexPluginEvent,
	IDisposable
} from "../common/";
import { IMentionedUser } from "./ui";


export interface IStaticAnnotations {
	readonly Events: IAnnotationManagerEvents;
}

export interface ICommentStatus {
	isTemp: boolean;

	isHidden: boolean;
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
export type ThreadType = "normal" | "temp" | "hidden" | "temp-hidden";

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
	readonly attributes: { [key: string]: string };
	readonly sequence: number;
	readonly type: ThreadType;
	/**
	 * Guaranteed not null
	 */
	readonly comments: ReadonlyArray<IComment>;
	isSelected(): boolean;
	isEmpty(): boolean;
	displayText(): string;
	isTemp(): boolean;
	isHidden(): boolean;

	/**
	 * returns the number of comments
	 */
	count(): number;
	getCommentByIndex(index: number): Nullable<IComment>;
	getCommentById(commentId: string): Nullable<IComment>;

	saveToObject(): any;

	isFirst(commendId: string): boolean;
	isLast(commendId: string): boolean;
	getOpenerId(): Nullable<string>;
	isResolved(): boolean;
	isSelected(): boolean;
	lastComment(): Nullable<IComment>;
	firstComment(): Nullable<IComment>;
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


export interface ICommentAndStatus {
	readonly annotation: IAnnotation;
	readonly comment: IComment;
	readonly status: ICommentStatus;
}

export interface IInsertAnnotationOptions {
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
	type?: ThreadType;
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
	// readonly bEdit: boolean;
	readonly hostData?: any
}

export interface IAnnotationsOwner {
	/**
	 * Creates a path composed of the arguments, prefixed by the plugin path if the arguments
	 * do not form an absolute url
	 * @param args 
	 */
	resolvePath(...args: string[]): string;
	getLocalizedString: (key: string) => string;

	readonly tagName: string;
}

export interface IAddCommentOptions {
	/**
	 * pass the annotation id or the live annotation object
	 */
	readonly annotation: string | IAnnotation;
	readonly text: string;
	/**
	 * Defaults to true
	 */
	readonly triggerEvent?: boolean;
	/**
	 * Defaults to the current user
	 */
	readonly userId?: string;
	/**
	 * already filtered for duplicates
	 */
	readonly mentions?: ReadonlyArray<IMentionedUser>;
}

export interface IUpdateCommentOptions extends Omit<IAddCommentOptions, "userId"> {
	readonly commentId: string;
}

export interface IAnnotationManagerEvents {
	/**
	 * @member LANCE.Annotations
	 * @event USER_CHANGED
	 * fired when the manager is destroyed
	 */
	USER_CHANGED: "annotation:user-changed";
	/**
	 * @member LANCE.Annotations
	 * @event DESTROY
	 * fired when the manager is destroyed
	 */
	DESTROY: "annotation:destroy";
	/**
	 * @member LANCE.Annotations
	 * @event ANNOTATION_CREATED
	 * @param {Annotation} annotation The new Annotation object
	 */
	ANNOTATION_CREATED: "annotation:created"; // annotation: annotation
	/**
	 * @member LANCE.Annotations
	 * @event ANNOTATION_DELETED
	 * @param {String} annotation id of deleted annotation
	 */
	ANNOTATION_DELETED: "annotation:deleted"; // annotation: annotation id

	/**
	 * @member LANCE.Annotations
	 * @event ANNOTATION_RESOLVED
	 * @param {Annotation} annotation The Annotation object
	 */
	ANNOTATION_RESOLVED: "annotation:resolved";

	/**
	 * @member LANCE.Annotations
	 * @event ANNOTATION_PRESELECT
	 * @param {Object} event An object with the fields:
	 * @param {LANCE.Annotations.Annotation} annotation The annotation object
	 * @param {Boolean} isSelected
	 */
	ANNOTATION_PRESELECT: "annotation:preselect";  // { annotation : annotation, isSelected : bool }

	/**
	 * @member LANCE.Annotations
	 * @event ANNOTATION_SELECTED
	 * @param {Object} An object with the fields: 
	 * 
	 * - annotation: The annotation object
	 */
	ANNOTATION_SELECTED: "annotation:selected";  // { annotation : annotation, isSelected : bool }

	/**
	 * @member LANCE.Annotations
	 * @event ANNOTATION_UPDATED
	 * @param {LANCE.Annotations.Annotation} annotation The Annotation object
	 */
	ANNOTATION_UPDATED: "annotation:updated";  // { annotation : annotation, isSelected : bool }
	/**
	 * @member LANCE.Annotations
	 * @event COMMENT_ADDED
	 * @param {LANCE.Annotations.Annotation} annotation The Annotation object
	 * @param {LANCE.Annotations.Comment} comment The Comment object
	 * @param {LANCE.Annotations.CommentStatus} status The status of the new comment
	 */
	COMMENT_ADDED: "annotation:commentcreated"; // annotation : annotation, comment : comment
	/**
	 * @member LANCE.Annotations
	 * @event COMMENT_DELETED
	 * @param {string} annotationId The Annotation object
	 * @param {string} commentId The id of the deleted comment
	 */
	COMMENT_DELETED: "annotation:commentdeleted"; // annotation : annotation, comment : comment
	/**
	 * @member LANCE.Annotations
	 * @event COMMENT_CHANGED
	 * @param {LANCE.Annotations.Annotation} annotation The Annotation object
	 * @param {LANCE.Annotations.Comment} comment The Comment object
	 * @param {LANCE.Annotations.CommentStatus} status The new status of the comment
	 */
	COMMENT_CHANGED: "annotation:commentchanged"; // annotation : annotation, comment : comment
	/**
	 * @member LANCE.Annotations
	 * @event COMMENT_SELECTED
	 * @param {LANCE.Annotations.Annotation} annotation The Annotation object
	 * @param {LANCE.Annotations.Comment} comment The Comment object
	 * @param {Boolean} isSelected
	 * @param {Boolean} isEdit Is this comment selected for editing?
	 */
	COMMENT_SELECTED: "annotation:commentselected"; // annotation : annotation, comment : comment, isSelected : bool, isSelected : bool, isEdit : bool 
	/**
	 * @member LANCE.Annotations
	 * @event RESET
	 * The annotations have been reset
	 */
	RESET: "annotation:reset";
	/**
	 * @member LANCE.Annotations
	 * @event BEFORE_RESET
	 * The annotations have been reset
	 */
	BEFORE_RESET: "annotation:before-reset";
	/**
	 * @member LANCE.Annotations
	 * @event RELOAD
	 * All the annotations have potentially changed
	 */
	RELOAD: "annotation:reload";
	/**
	 * @member LANCE.Annotations
	 * @event ENABLED_CHANGED
	 * @param {Boolean} isEnabled the enabled state of the annotations manager
	 */
	ENABLED_CHANGED: "annotation:enable"; // isEnabled : boolean 

	/**
	 * @member LANCE.Annotations
	 * @event SIZE_CHANGED
	 * @param {Object} data an object with the new width and height of the hosting editor. If one of the listeners changes the dimensions, the hosting editor
	 * should resize according to the changed values.
	 * This event is not initiated by the Annotations object. Rather, an object that is aware of size changes can trigger
	 * this event in order to relay the information to whatever ui is hooked to the Annotations object.
	 */
	SIZE_CHANGED: "annotation:resize";

	/**
	 * @member LANCE.Annotations
	 * @event DONE_EDITING
	 * Sent by the Annotations manager when the ui calls doneEditing.
	 * This means that the focus can be switched from the comments ui to whoever wants it
	 */
	DONE_EDITING: "annotation:done-editing";

	/**
	 * @member LANCE.Annotations
	 * @event ATTRIBUTE_CHANGED
	 * @param {LANCE.Annotations.Annotation} annotation The Annotation object
	 * @param {Object} attributes the changed attributes in a map format `{key: value}`
	 */
	ATTRIBUTE_CHANGED: "annotation:attribute-changed";

	/**
	 * @member LANCE.Annotations
	 * @event ANNOTATIONS_RENUMBERED
	 * @param {LANCE.Annotations.Annotation} annotation The Annotation object
	 * @param {Object} options `{ sequence: Array&lt;annotation id&gt; }` an
	 * object with sequence containing an Array of annotation ids in the correct sequence
	 */
	ANNOTATIONS_RENUMBERED: "annotation:renumbered";

	/**
	 * @member LANCE.Annotations
	 * The annotation with the specified id has been selected. Useful when the page needs to
	 * scroll before selecting the annotation in the sidebar - the UI listens to postselect, so everything has
	 * been done by the time it selects the annotation
	 * @event ANNOTATION_POSTSELECT
	 * @param {Object} An object with the fields: 
	 * 
	 * - annotation: The annotations object
	 */
	ANNOTATION_POSTSELECT: "annotation:postselect";
	Host: {
		/**
		 * @member LANCE.Annotations
		 * This event is placed here for lack of a better place, since the Annotations object is the only channel
		 * between the plugin and the UI. It notifies the listeners that an annotation node has been selected and revealed.
		 * Normally this event is consumed only by the {@link LANCE.AnnotationsUI}
		 * 
		 * <strong>Note</strong>: Access this event name through `App.LANCE.Annotations.Events.Host`
		 * @event ANNOTATION_NODE_REVEALED
		 * @ignore
		 * @param {Object} node the revealed DOM element
		 * @param {String} annotationId The ID of the relevant thread
		 */
		ANNOTATION_NODE_REVEALED: "annotation:node-revealed";
		/**
		 * @member LANCE.Annotations
		 * @ignore
		 * This event is placed here for lack of a better place, since the Annotations object is the only channel
		 * between the plugin and the UI. It notifies the listeners that the visiblity of some annotation nodes has changed  {@link LANCE.AnnotationsUI}
		 * 
		 * <strong>Note</strong>: Access this event name through `App.LANCE.Annotations.Events.Host`
		 * @event ANNOTATION_NODES_VISIBILITY
		 * @param {IAnnotationNodeVisibilityRecord[]} nodes { node, annotationId, visibility }
		 */
		ANNOTATION_NODES_VISIBILITY: "annotation:node-visibility";

		/**
		 * @member LANCE.Annotations
		 * @ignore
		 * This event is placed here for lack of a better place, since the Annotations object is the only channel
		 * between the plugin and the UI. It notifies the listeners that the visiblity of some annotation nodes has changed  {@link LANCE.AnnotationsUI}
		 * 
		 * <strong>Note</strong>: Access this event name through `App.LANCE.Annotations.Events.Host`
		 * @event ANNOTATION_CONTAINER_SCROLL
		 * @param {IScrollEvent} nodes { scroller, dy }
		 */
		ANNOTATION_CONTAINER_SCROLL: "annotation:container-scroll";

		/**
		 * @member LANCE.Annotations
		 * @ignore
		 * Fire when the plugin has successfully switched to another locale. Typically you'll change some UI labels following
		 * this event.
		 * 
		 * <strong>Note</strong>: Access this event name through `App.LANCE.Annotations.Events.Host`
		 * @event LOCALE_CHANGED
		 */
		LOCALE_CHANGED: "host:locale"
	},
	UI: {
		/**
		 * @member LANCE.Annotations
		 * A UI Sidebar has been created
		 * @event UI_CREATED
		 * @param {Object} event An object with the fields: 
		 * - ui: The top level element of the sidebar
		 */
		CREATED: "annotationsui:created";
		ACTIVE: "annotationsui:active";
		FOCUS_REMOVED: "annotationsui:focusremove";
	}

}


export interface IAnnotationsManager<TUser extends ILanceUser = ILanceUser> extends IDisposable {
	readonly events: IEvents;
	readonly users: IUserManager<TUser>;
	// loadFromData(data?: Array<any>): void;
	/**
	 * @method getAllAnnotationIds
	 * @returns {Array} An array of all the current annotation ids
	 */
	getAllAnnotationIds(): Array<string>;

	/**
	 * @method getAllAnnotationIds
	 * @returns {Array} A copy of the annotations array
	 */
	getAllAnnotations(): Array<IAnnotation>;

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
	getAnnotationById(id: string): Nullable<IAnnotation>;
	insertAnnotation(data: IInsertAnnotationOptions): IAnnotation;
	setAttribute(annotationId: string, attrName: string, value: any): Nullable<IAnnotation>;
	resolveAnnotation(annotationId: AnnotationOrId, commentId: string, isResolved: boolean): this;

	/**
	 * @return an array of selected annotations
	 */
	getSelectedAnnotationIds(): Array<string>;

	addUsers(users: ReadonlyArray<Partial<TUser>>): void;

	/**
	 * Returns the current user id of the annotations manager
	 */
	getUserId(): string;

	/**
	* sets the current user id of the annotations manager
	* @param id 
	* @returns the new user id
	*/
	setUserId(id: string): string;

	// addCustomAttributes(attrs: string | Array<string>): void;
	getCommentStatus(annotationId: string, commentId: string): ICommentStatus;
	getLocalizedString(key: string): string;
	countAnnotations(excludeEmpty?: true): number;
	getAnnotationByIndex(index: number): Nullable<IAnnotation>;
	deleteComment(annotationId: string, commentId: string): this;
	getComment(annotationId: string, commentId: string): Nullable<ICommentAndStatus>;
	revertComment(annotationId: string, commentId: string, allowDelete: boolean): Nullable<IComment>;
	updateComment(options: IUpdateCommentOptions): Nullable<IComment>;
	/**
	 * @deprecated Use `updateComment`
	 * @param annotationId 
	 * @param commentId 
	 * @param text 
	 */
	setCommentText(annotationId: string | IAnnotation, commentId: string, text: string): Nullable<IComment>;
	/**
	 * @deprecated Use `addCommentBy` instead
	 * @param annotationId 
	 * @param text 
	 * @param noTrigger 
	 */
	addComment(annotationId: string | IAnnotation, text: string, noTrigger?: boolean): Nullable<IComment>;
	/**
	 * Better interface for adding comments. Add a comment with the provided text in the provide annotation. using
	 * the provided userid or the current user id
	 * @param options 
	 */
	addCommentBy(options: IAddCommentOptions): Nullable<IComment>;

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

export interface IAnnotationPermissionsDetailedBlock {
	readonly first?: AnnotationRole;
	readonly last?: AnnotationRole;
	readonly default?: AnnotationRole;
}

export interface IAnnotationPermissions {
	readonly edit: AnnotationRole | IAnnotationPermissionsDetailedBlock;
	readonly delete: AnnotationRole | IAnnotationPermissionsDetailedBlock;
	readonly resolve: AnnotationRole | IAnnotationPermissionsDetailedBlock;
}

export type RequestUserCallback<TUser extends ILanceUser = ILanceUser> = (user: TUser, callback: (user: TUser) => any) => any;

interface IAnnotationStatusOptions<TUser extends ILanceUser = ILanceUser> {
	readonly comment: IComment;
	readonly annotation: IAnnotation,
	readonly status: ICommentStatus;
	readonly owner: IAnnotationsManager<TUser>;
}

export type AnnotationStatusCallback<TUser extends ILanceUser = ILanceUser> = (options: IAnnotationStatusOptions<TUser>) => any;

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
export interface ICommentID {
	readonly annotationId: string;
	readonly commentId: string;
}
export namespace LanceEvents {
	interface ICommentEditingDoneEvent extends ICommentID {
		canceled: boolean;
		readonly mode: "comment" | "reply"
	}

	interface IAnnotationEvent {
		readonly owner: IAnnotationsManager;
		readonly annotation: IAnnotation;
	}

	interface ICommentChangedEvent extends IAnnotationEvent {
		readonly comment: IComment;
		readonly status: ICommentStatus;
		readonly mentions: ReadonlyArray<IMentionedUser>;
	}
	interface ICommentDeletedEvent extends IAnnotationEvent {
		readonly comment: IComment;
		readonly commentId: string;
		readonly annotationId: string;
	}

	interface IAnnotationAttributesEvent extends IAnnotationEvent {
		readonly attributes: Record<string, string>;
	}

	interface IAnnotationsRenumberedEvent {
		readonly sequence: ReadonlyArray<string>;
	}

	interface IAnnotationCreatedEvent extends IAnnotationEvent {
		// context set by the originator of the event
		readonly context?: unknown;
		// ID of the annotation before which this one is placed
		readonly before?: string;
		readonly range?: Range;
	}

	interface IAnnotationDeletedEvent extends IAnnotationEvent{
		readonly id: string;
	}

	interface IAnnotationPreselectEvent extends ILoopIndexPluginEvent, IAnnotationEvent {
		readonly isSelected: boolean;
	}

	interface ISequenceChangedEvent {
		readonly sequence: ReadonlyArray<string>;
	}

	interface IAnnotationResolvedEvent {
		readonly annotation: IAnnotation;
		readonly context?: unknown;
	}

}