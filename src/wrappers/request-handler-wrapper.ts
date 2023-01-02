import { Context, Injectable, Injector, ServiceLifetime } from "tiny-injector";
import {
	IPipelineBehavior,
	RequestHandlerDelegate,
} from "../pipeline-behavior";
import { IRequest, IRequestHandler } from "../request";

export abstract class RequestHandlerWrapper<TResponse> {
	public abstract handle(
		request: IRequest<TResponse>,
		context: Context
	): Promise<TResponse>;
}

@Injectable({
	lifetime: ServiceLifetime.Transient,
	serviceType: RequestHandlerWrapper,
})
export class RequestHandlerWrapperImpl<
	TRequest extends IRequest<TResponse>,
	TResponse
> extends RequestHandlerWrapper<TResponse> {
	public override handle(
		request: IRequest<TResponse>,
		context: Context
	): Promise<TResponse> {
		const handler: RequestHandlerDelegate<TResponse> = () =>
			Injector.GetRequiredService<IRequestHandler<TRequest, TResponse>>(
				IRequestHandler<TRequest, TResponse>,
				context
			).handle(request as TRequest);

		return Injector.GetServices<IPipelineBehavior<TRequest, TResponse>>(
			IPipelineBehavior<TRequest, TResponse>,
			context
		)
			.reverse()
			.reduce(
				(acc, pipeline) => () => pipeline.handle(request as TRequest, acc),
				() => handler()
			)();
	}
}
