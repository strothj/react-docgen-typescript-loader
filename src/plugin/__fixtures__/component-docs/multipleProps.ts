export default {
  description: "A component.",
  displayName: "Component",
  props: {
    someProp: {
      defaultValue: null,
      description: "Prop description",
      name: "someProp",
      required: true,
      type: {
        name: "string",
      },
    },
    otherProp: {
      defaultValue: null,
      description: "Other prop description",
      name: "otherProp",
      required: false,
      type: {
        name: "boolean",
      },
    },
  },
};
