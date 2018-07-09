declare module "@webpack-contrib/schema-utils" {
  export interface Options {
    name: string;
    schema: object;
    target: object;
  }

  export default function validate(options: Options): void;
}
