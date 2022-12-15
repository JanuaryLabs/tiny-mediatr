export * from "./mediator";
export * from "./request";
export * from "./request-handler";

// interface VM {}
// class ListQuery extends IRequest<VM> {}

// const app = express();

// app.use((req, res, next) => {
// 	req.mediator = new Mediator();
// });

// app.get("/", (req, res) => {
// 	req.mediator.send(new ListQuery());
// 	res.json([]);
// });

// app.listen();

// declare global {
// 	namespace Express {
// 		export interface Request {
// 			mediator: Mediator;
// 		}
// 	}
// }
