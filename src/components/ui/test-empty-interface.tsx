import * as React from 'react';

// This should trigger the empty interface rule
interface EmptyInterface {}

// This should be fine
interface ProperInterface {
  prop: string;
}

const TestComponent: React.FC<ProperInterface> = ({ prop }) => {
  return <div>{prop}</div>;
};

export default TestComponent;