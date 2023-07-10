export function errorTransform(error: any, message?: string): Error {
  if (error instanceof Error) {
    let errorMessage;
    if (message !== undefined) {
      errorMessage = message;
    } else if ((error as any).reason !== undefined) {
      errorMessage = (error as any).reason;
    } else if ((error as any).message !== undefined) {
      errorMessage = (error as any).message;
    }
    const newError = new Error(errorMessage);
    newError.name = error.name;
    newError.stack = error.stack;
    return newError;
  } else {
    return error;
  }
}
