export default {
  description: "A component.",
  displayName: "Component",
  props: {
    someProp: {
      defaultValue: null,
      description: `whether the Select is loading externally or not (such as options being loaded).
if true, a loading spinner will be shown at the right side.
@default false`,
      name: "someProp",
      required: true,
      type: {
        name: "string",
      },
    },
  },
};
