import validateOptions from "./validateOptions";

it("throws error on unexpected field", () => {
  expect(() => validateOptions({ invalidField: "fail" } as any)).toThrowError(
    /invalidField.*invalid additional property/,
  );
});

it("does not throw on empty", () => {
  expect(() => validateOptions()).not.toThrow();
});

describe("skipPropsWithName", () => {
  it("rejects empty string", () => {
    expect(() => validateOptions({ skipPropsWithName: "" })).toThrowError(
      /skipPropsWithName.*should NOT be shorter than 1 characters/,
    );

    expect(() => validateOptions({ skipPropsWithName: "prop" })).not.toThrow();
  });

  it("rejects empty array", () => {
    expect(() => validateOptions({ skipPropsWithName: [] })).toThrowError(
      /skipPropsWithName.*should NOT have less than 1 items/,
    );

    expect(() =>
      validateOptions({ skipPropsWithName: ["prop"] }),
    ).not.toThrow();
  });
});

describe("component name resolver", () => {
  it("accepts function", () => {
    expect(() =>
      validateOptions({
        componentNameResolver: () => "",
      } as any),
    ).not.toThrow();
  });
});

describe("prop filter", () => {
  it("accepts function", () => {
    expect(() =>
      validateOptions({
        propFilter: () => true,
      } as any),
    ).not.toThrow();
  });
});

describe("compilerOptions", () => {
  it("accepts object of any shape", () => {
    expect(() =>
      validateOptions({
        compilerOptions: {
          option: "test",
          otherOption: { secondField: "test" },
        },
      } as any),
    ).not.toThrow();
  });
});

describe("v2 includes/excludes fields", () => {
  it("throws error if included", () => {
    expect(() =>
      validateOptions({
        includes: ["*\\.stories\\.tsx$"],
      } as any),
    ).toThrowError(/includes.*is an invalid additional property/);
  });
});
