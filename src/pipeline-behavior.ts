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
