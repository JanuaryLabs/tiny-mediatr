import { Injector } from "tiny-injector";
import { ArgumentNullException } from "./exceptions/ArgumentException";
import { INotification } from "./notification";
import { IRequest } from "./request";
import { IRequestHandler, RequestHandlerBase } from "./request-handler";
import { RequestType } from "./types";
import { isNullOrUndefined } from "./utils";
import { INotificationHandlerWrapper } from "./wrappers/notification-handler-wrapper";
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
		INotificationHandlerWrapper
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

		const handler =
			Injector.GetRequiredService<
				IRequestHandler<IRequest<TResponse>, TResponse>
			>(requestType);

		return handler.handle(request);
	}

	public async publish<TNotification extends INotification>(
		notification: TNotification
	): Promise<void> {
		if (isNullOrUndefined(notification)) {
			throw new ArgumentNullException("request");
		}

		const handler = Injector.GetRequiredService<INotificationHandlerWrapper>(
			INotificationHandlerWrapper
		);

		return handler.handle(notification, async (handlers, notification) => {
			for (const item of handlers) {
				await item(notification);
			}
		});
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
