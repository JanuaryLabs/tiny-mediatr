import { Context, Injectable, Injector, ServiceLifetime } from "tiny-injector";
import { INotification, INotificationHandler } from "../notification";

export abstract class INotificationHandlerWrapper<
	TNotification extends INotification
> {
	public abstract handle(
		notification: TNotification,
		context: Context,
		publish: (
			handlers: INotificationHandler<TNotification>[],
			notification: INotification
		) => Promise<void>
	): Promise<void>;
}

@Injectable({
	lifetime: ServiceLifetime.Transient,
	serviceType: INotificationHandlerWrapper,
})
export class NotificationHandlerWrapperImpl<
	TNotification extends INotification
> extends INotificationHandlerWrapper<TNotification> {
	public handle(
		notification: TNotification,
		context: Context,
		publish: (
			handlers: INotificationHandler<TNotification>[],
			notification: INotification
		) => Promise<void>
	): Promise<void> {
		const notificationType = notification.constructor;

		const handlers: INotificationHandler<TNotification>[] =
			Injector.GetServices<INotificationHandler<TNotification>>(
				notificationType,
				context
			);

		return publish(handlers, notification);
	}
}
