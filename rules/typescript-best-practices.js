/**
 * Custom ESLint rule to enforce TypeScript best practices
 * Prevents empty interfaces and explicit any types
 */

const noEmptyInterface = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce TypeScript best practices',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
    messages: {
      noEmptyInterface: 'Interfaces without members are equivalent to their supertype. Use a type alias instead.',
      noExplicitAny: 'Unexpected any. Specify a different type.',
    },
  },
  create(context) {
    return {
      TSInterfaceDeclaration(node) {
        // Check if interface has no members
        if (!node.body || !node.body.body || node.body.body.length === 0) {
          context.report({
            node,
            messageId: 'noEmptyInterface',
          });
        }
      },
      TSTypeAnnotation(node) {
        // Check for explicit any types
        if (node.typeAnnotation && node.typeAnnotation.type === 'TSAnyKeyword') {
          context.report({
            node: node.typeAnnotation,
            messageId: 'noExplicitAny',
          });
        }
      },
    };
  },
};

module.exports = {
  rules: {
    'no-empty-interface': noEmptyInterface,
  },
};