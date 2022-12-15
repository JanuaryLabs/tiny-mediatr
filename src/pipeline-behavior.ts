/// <summary>
/// Represents an async continuation for the next task to execute in the pipeline
/// </summary>
/// <typeparam name="TResponse">Response type</typeparam>
/// <returns>Awaitable task returning a <typeparamref name="TResponse"/></returns>
// public delegate Task<TResponse> RequestHandlerDelegate<TResponse>();

import { IRequest } from "./request";
export type RequestHandlerDelegate<TResponse> = () => Promise<TResponse>;

export abstract class IPipelineBehavior<
	in TRequest extends IRequest<TResponse>,
	TResponse
> {
	public abstract handle(
		request: TRequest,
		next: RequestHandlerDelegate<TResponse>
	): Promise<TResponse>;
}
