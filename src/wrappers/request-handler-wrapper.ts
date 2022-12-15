import { Injectable, Injector, ServiceLifetime } from "tiny-injector";
import {
	IPipelineBehavior,
	RequestHandlerDelegate,
} from "../pipeline-behavior";
import { IRequest } from "../request";
import { IRequestHandler } from "../request-handler";

export abstract class RequestHandlerWrapper<TResponse> {
	public abstract handle(request: IRequest<TResponse>): Promise<TResponse>;
}

@Injectable({
	lifetime: ServiceLifetime.Transient,
	serviceType: RequestHandlerWrapper,
})
export class RequestHandlerWrapperImpl<
	TRequest extends IRequest<TResponse>,
	TResponse
> extends RequestHandlerWrapper<TResponse> {
	public override handle(request: IRequest<TResponse>): Promise<TResponse> {
		const handler: RequestHandlerDelegate<TResponse> = () =>
			Injector.GetRequiredService<IRequestHandler<TRequest, TResponse>>(
				IRequestHandler<TRequest, TResponse>
			).handle(request as TRequest);

		return Injector.GetServices<IPipelineBehavior<TRequest, TResponse>>(
			IPipelineBehavior<TRequest, TResponse>
		)
			.reverse()
			.reduce(
				(acc, pipeline) => () => pipeline.handle(request as TRequest, acc),
				() => handler()
			)();
	}
}
