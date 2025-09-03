import { useRef, useState } from 'react';

interface TiltedContainerProps {
  children: React.ReactNode;
  rotateAmplitude?: number;
  scaleOnHover?: number;
  className?: string;
}

export default function TiltedContainer({
  children,
  rotateAmplitude = 8,
  scaleOnHover = 1.02,
  className = '',
}: TiltedContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;
    const scale = isHovered ? scaleOnHover : 1;

    setTransform(
      `perspective(800px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${scale})`
    );
  }

  function handleMouseEnter() {
    setIsHovered(true);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    setTransform('perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)');
  }

  return (
    <div
      ref={ref}
      className={`transition-transform duration-200 ease-out min-h-[200px] ${className}`}
      style={{
        transform:
          transform ||
          'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
