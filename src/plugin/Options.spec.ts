import { validateOptions } from "./Options";

describe("validateOptions", () => {
  it("does not error on undefined", () => {
    validateOptions();
  });

  it("throws on non-object", () => {
    expect(() => validateOptions("fail" as any)).toThrowErrorMatchingSnapshot();
  });

  it("throws on unexpected property", () => {
    expect(() =>
      validateOptions({ unexpected: "" }),
    ).toThrowErrorMatchingSnapshot();
  });

  it("throws on include not being array of strings", () => {
    expect(() =>
      validateOptions({ includes: "fail" }),
    ).toThrowErrorMatchingSnapshot();

    expect(() => {
      validateOptions({ includes: [3] });
    }).toThrowErrorMatchingSnapshot();
  });

  it("does not throw on empty object", () => {
    validateOptions({});
  });
});
