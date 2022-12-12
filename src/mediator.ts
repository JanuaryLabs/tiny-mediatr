import { Injector } from "tiny-injector";
import { ArgumentNullException } from "./exceptions/ArgumentException";
import { INotification } from "./notification";
import { IRequest } from "./request";
import { RequestHandlerBase } from "./request-handler";
import { RequestType } from "./types";
import { isNullOrUndefined } from "./utils";
import { NotificationHandlerWrapper } from "./wrappers/notification-handler-wrapper";
interface ISender {
	send<TResponse>(request: IRequest<TResponse>): Promise<TResponse>;
}

export class Mediator implements ISender {
	private _context = Injector.Create();
	static readonly #requestHandlers: WeakMap<
		RequestType<IRequest<any>>,
		RequestHandlerBase
	> = new WeakMap();
	private static readonly _notificationHandlers: WeakMap<
		RequestType<IRequest<any>>,
		NotificationHandlerWrapper
	> = new WeakMap();
	// private static readonly _streamRequestHandlers: WeakMap<
	// 	RequestType<IRequest<any>>,
	// 	StreamRequestHandlerBase
	// > = new WeakMap();
	send<TResponse>(request: IRequest<TResponse>): Promise<TResponse> {
		if (isNullOrUndefined(request)) {
			throw new ArgumentNullException("request");
		}

		const requestType = request.constructor;

		const handler = Injector.GetRequiredService(requestType, this._context);

		return getOrAdd(Mediator.#requestHandlers, requestType, handler);
	}

	publish(notification: INotification) {
		const notificationType = notification.constructor;
		const handler = Injector.GetRequiredService(
			notificationType,
			this._context
		);
		return getOrAdd(Mediator.#requestHandlers, notificationType, handler);
	}
}

function getOrAdd(
	map: WeakMap<RequestType<IRequest<any>>, any>,
	key: RequestType<IRequest<any>>,
	value: any
) {
	if (map.has(key)) {
		return map.set(key, value);
	}
	return map.get(key);
}
