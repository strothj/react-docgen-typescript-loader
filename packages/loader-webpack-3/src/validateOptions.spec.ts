import validateOptions from "./validateOptions";

it("throws error on unexpected field", () => {
  expect(() =>
    validateOptions({ invalidField: "fail" } as any),
  ).toThrowErrorMatchingSnapshot();
});

it("does not throw on empty", () => {
  expect(() => validateOptions()).not.toThrow();
});

describe("skipPropsWithName", () => {
  it("rejects empty string", () => {
    expect(() =>
      validateOptions({ skipPropsWithName: "" }),
    ).toThrowErrorMatchingSnapshot();

    expect(() => validateOptions({ skipPropsWithName: "prop" })).not.toThrow();
  });

  it("rejects empty array", () => {
    expect(() =>
      validateOptions({ skipPropsWithName: [] }),
    ).toThrowErrorMatchingSnapshot();

    expect(() =>
      validateOptions({ skipPropsWithName: ["prop"] }),
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
