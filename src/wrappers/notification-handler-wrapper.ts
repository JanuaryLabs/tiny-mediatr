import { ServiceProvider } from "tiny-injector";
import { INotification } from "../notification";
import { INotificationHandler } from "../notification-handler";

type Handler = (notification: INotification) => Promise<void>;

export abstract class NotificationHandlerWrapper {
	public abstract handle(
		notification: INotification,
		serviceFactory: ServiceProvider,
		publish: (handlers: Handler[], notification: INotification) => Promise<void>
	): Promise<void>;
}

export class NotificationHandlerWrapperImpl<
	TNotification extends INotification
> extends NotificationHandlerWrapper {
	public handle(
		notification: TNotification,
		serviceFactory: ServiceProvider,
		publish: (handlers: Handler[], notification: INotification) => Promise<void>
	): Promise<void> {
		const handlers: Handler[] = serviceFactory
			.GetServices<INotificationHandler<TNotification>>(
				INotificationHandler<TNotification>
			)
			.map(
				(x) => (theNotification: INotification) =>
					x.handle(theNotification as TNotification)
			);

		return publish(handlers, notification);
	}
}
