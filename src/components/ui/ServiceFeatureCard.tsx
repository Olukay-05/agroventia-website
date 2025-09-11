import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useScrollToSection } from '@/hooks/useScrollToSection';

interface ServiceFeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

const ServiceFeatureCard: React.FC<ServiceFeatureCardProps> = ({
  title,
  description,
  icon,
  isActive = false,
  onClick,
}) => {
  const { scrollToSection } = useScrollToSection();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(0, { stiffness: 300, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 20 });
  const scale = useSpring(1, { stiffness: 200, damping: 20 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    x.set(mouseX);
    y.set(mouseY);

    // Calculate rotation based on mouse position
    const rotateYValue = (mouseX / rect.width) * 10;
    const rotateXValue = -(mouseY / rect.height) * 10;

    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);

    // Scale up slightly on hover
    scale.set(1.02);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onClick) {
      scale.set(1.02);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    x.set(0);
    y.set(0);
  };

  // Spring-transformed values for smooth animations
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  // Transform values for icon movement
  const iconX = useTransform(springX, [-100, 100], [-10, 10]);
  const iconY = useTransform(springY, [-100, 100], [-10, 10]);

  return (
    <motion.div
      ref={ref}
      className={`relative h-full cursor-pointer rounded-2xl border p-6 transition-all duration-300 ${
        isActive
          ? 'border-green-500 bg-gradient-to-br from-green-50 to-white shadow-lg'
          : 'border-gray-200 bg-[#fdf8f0] hover:border-green-300 hover:shadow-md'
      }`}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      {/* Floating icon with 3D effect */}
      <motion.div
        className="mb-4 flex items-center justify-center"
        style={{
          x: iconX,
          y: iconY,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-xl ${
            isActive
              ? 'bg-green-100 text-green-600'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {icon}
        </div>
      </motion.div>

      {/* Content */}
      <div className="space-y-3">
        <h3
          className={`text-xl font-semibold ${
            isActive ? 'text-green-700' : 'text-gray-900'
          }`}
        >
          {title}
        </h3>
        <p className="text-gray-600">{description}</p>

        {onClick && (
          <motion.div
            className="flex items-center text-green-600"
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={e => {
              e.stopPropagation();
              scrollToSection('products');
              if (onClick) onClick();
            }}
          >
            {/* <span className="text-sm font-medium">View Products</span>
            <ArrowRight size={16} className="ml-1" /> */}
          </motion.div>
        )}
      </div>

      {/* Animated border highlight */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-green-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
};

export default ServiceFeatureCard;
