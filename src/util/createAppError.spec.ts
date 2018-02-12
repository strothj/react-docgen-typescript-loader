import createAppError from "./createAppError";

it("returns an error when no error object is provided", () => {
  expect(createAppErrorAsJson()).toMatchSnapshot();
});

it("wraps a provided error object", () => {
  expect(createAppErrorAsJson(new Error("Provided Error"))).toMatchSnapshot();
});

it("creates error from message", () => {
  expect(createAppErrorAsJson("Error Message")).toMatchSnapshot();
});

function createAppErrorAsJson(error?: string | Error) {
  const appError: Error & { innerError?: Error } = createAppError(error);

  return {
    message: appError.message,
    stack: appError.stack && appError.stack.split("\n")[0],
    innerError: appError.innerError && appError.innerError.message,
  };
}
