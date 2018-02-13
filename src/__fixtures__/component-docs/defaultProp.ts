export default {
  description: "A component.",
  displayName: "Component",
  props: {
    someProp: {
      defaultValue: { value: "some value" },
      description: "Prop description",
      name: "someProp",
      required: true,
      type: {
        name: "string",
      },
    },
  },
};
