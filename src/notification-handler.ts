import { INotification } from "./notification";

/// <summary>
/// Defines a handler for a notification
/// </summary>
/// <typeparam name="TNotification">The type of notification being handled</typeparam>
export abstract class INotificationHandler<
	in TNotification extends INotification
> {
	/// <summary>
	/// Handles a notification
	/// </summary>
	/// <param name="notification">The notification</param>
	/// <param name="cancellationToken">Cancellation token</param>
	abstract handle(notification: TNotification): Promise<void>;
}

/// <summary>
/// Wrapper class for a synchronous notification handler
/// </summary>
/// <typeparam name="TNotification">The notification type</typeparam>
export abstract class NotificationHandler<
	TNotification extends INotification
> extends INotificationHandler<TNotification> {}
