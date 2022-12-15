import {
	Injectable,
	Injector,
	ServiceLifetime,
	ServiceType,
} from "tiny-injector";
import { INotification } from "../notification";
import { INotificationHandler } from "../notification-handler";

type Handler = (notification: INotification) => Promise<void>;

export abstract class INotificationHandlerWrapper {
	public abstract handle(
		notification: INotification,
		publish: (handlers: Handler[], notification: INotification) => Promise<void>
	): Promise<void>;
}

@Injectable({
	lifetime: ServiceLifetime.Transient,
	serviceType: INotificationHandlerWrapper,
})
export class NotificationHandlerWrapperImpl<
	TNotification extends INotification
> extends INotificationHandlerWrapper {
	public handle(
		notification: TNotification,
		publish: (handlers: Handler[], notification: INotification) => Promise<void>
	): Promise<void> {
		const notificationType = notification.constructor;
		const handlers: Handler[] = Injector.GetServices<
			INotificationHandler<TNotification>
		>(notificationType).map(
			(x) => (theNotification: INotification) =>
				x.handle(theNotification as TNotification)
		);

		return publish(handlers, notification);
	}
}
export function NotificationHandler(
	request: ServiceType<INotification>
): ClassDecorator {
	return (object) => {
		const handler = object as ServiceType<any>;
		Injector.AppendTransient(request as any, handler as any);
	};
}
