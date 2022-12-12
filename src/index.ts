import express from "express";
import { Injector } from "tiny-injector";
import { Mediator } from "./mediator";
import { IRequest } from "./request";
import { IRequestHandler, RequestHandler } from "./request-handler";

export function addMediatR() {
	Injector.AddTransient(Mediator);
}

interface VM {}
class ListQuery extends IRequest<VM> {}

@RequestHandler(ListQuery)
export class ListHandler extends IRequestHandler<ListQuery, VM> {
	public handle(request: ListQuery): Promise<VM> {
		throw new Error("Method not implemented.");
	}
}
const app = express();

app.use((req, res, next) => {
	req.mediator = new Mediator();
});

app.get("/", (req, res) => {
	req.mediator.send(new ListQuery());
	res.json([]);
});

app.listen();

declare global {
	namespace Express {
		export interface Request {
			mediator: Mediator;
		}
	}
}
