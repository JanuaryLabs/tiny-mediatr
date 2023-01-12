export abstract class IRequest<T = void> {
	// #typeMatcher: any; https://github.com/microsoft/TypeScript/issues/18499
}

import { Injector, ServiceType } from "tiny-injector";

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
		Injector.AddScoped(request as any, handler as any);
	};
}
