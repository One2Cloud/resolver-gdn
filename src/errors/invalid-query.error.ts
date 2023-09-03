// export class InvalidQueryError extends Error {
//   public readonly status = 400;

//   constructor(query: Record<string, unknown>) {
//     let queryName = Object.keys(query)[0];
//     let queryValue = query[queryName];
//     let errorMessage = `Query '${queryName}' with invalid value '${queryValue}'.`;

//     super(errorMessage);

//     this.name = "INVALID_QUERY";
//   }
// }