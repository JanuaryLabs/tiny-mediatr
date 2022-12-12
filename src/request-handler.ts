import { ServiceCollection, ServiceType } from "tiny-injector";
import { IRequest } from "./request";
export abstract class RequestHandlerBase {
	public abstract handle(
		request: object,
		serviceProvider: ServiceCollection
	): Promise<object>;
}

export abstract class IRequestHandler<
	in TRequest extends IRequest<TResponse>,
	TResponse = void
> {
	public abstract handle(request: TRequest): Promise<TResponse>;
}

export function RequestHandler(
	request: ServiceType<IRequest<any>>
): ClassDecorator {
	return (object) => {
		const handler = object as ServiceType<any>;
	};
}
