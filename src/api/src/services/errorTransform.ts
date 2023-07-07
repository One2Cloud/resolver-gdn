export function errorTransform(error: any, message?: string): Error {
  // console.log("returned error: ", error);
  if (error instanceof Error) {
    // console.log("is instance of error --------------------------------")
    let errorMessage;
    if (message !== undefined) {
      errorMessage = message;
    } else if ((error as any).reason !== undefined) {
      errorMessage = (error as any).reason;
    } else if ((error as any).message !== undefined) {
      errorMessage = (error as any).message;
    }
    console.log('new Error with errorMessage:', errorMessage)
    const newError = new Error(errorMessage)
    newError.name = error.name
    newError.stack = error.stack;
    return newError
  } else {
    console.log('not a new Error')
    return error
  }
}