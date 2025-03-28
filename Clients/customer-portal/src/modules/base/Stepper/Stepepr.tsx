import styles from './Stepper.module.pcss';
import StepperItem from './components/StepperItem.tsx';

export default function Stepper() {
  const steps: { status: 'complete' | 'active' | 'not done'; name: string }[] = [
    { status: 'complete', name: 'First' },
    { status: 'active', name: 'Payment verification process' },
    { status: 'not done', name: 'Payment verification' },
    { status: 'not done', name: 'Payment verification' },
    { status: 'not done', name: 'Payment verification' },
    { status: 'not done', name: 'Payment verification' },
    { status: 'not done', name: 'Last' }
  ];

  return (
    <div className={styles.container}>
      {steps.map((step, index) => (
        <StepperItem
          status={step.status}
          name={step.name}
          isFirst={index === 0}
          isLast={index === steps.length - 1}
          key={index}
        />
      ))}
    </div>
  );
}
