export default function (/** @type {import('plop').NodePlopAPI} */ plop) {
  plop.setGenerator("react-component", {
    description: "Generate a new React component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What's the name of the new component? (e.g. 'MyComponent')",
      },
    ],
    actions: [
      {
        type: "addMany",
        templateFiles: ["plop-templates/Component/*.hbs"],
        base: "plop-templates/Component",
        destination: "src/components/{{ pascalCase name }}",
      },
    ],
  });
}
