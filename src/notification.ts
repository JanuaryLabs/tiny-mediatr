import { Injector, ServiceType } from "tiny-injector";

export abstract class INotification {
	// #typeMatcher: any; https://github.com/microsoft/TypeScript/issues/18499
}

export abstract class INotificationHandler<
	in TNotification extends INotification
> {
	abstract handle(notification: TNotification): Promise<void>;
}

export function NotificationHandler(
	request: ServiceType<INotification>
): ClassDecorator {
	return (object) => {
		const handler = object as ServiceType<any>;
		Injector.AppendScoped(request as any, handler as any);
	};
}
