export class ArgumentException extends Error {
	constructor(message: string, paramName?: string) {
		super(`${message}${paramName ? `\nParameter name: ${paramName}` : ""}`);
	}
}

export class ArgumentNullException extends ArgumentException {
	constructor(paramName?: string) {
		super(
			`Unhandled Exception: ArgumentNullException: Value cannot be null.`,
			paramName
		);
	}
}
