import './RateStars.css';
import { useState } from 'react';

interface RateStarsProps {
  setIsThanksOpen: (isOpen: boolean) => void;
  setInputEnabled: (isOpen: boolean) => void;
}

export default function RateStars({
  setIsThanksOpen,
  setInputEnabled,
}: RateStarsProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const handleRate = (index: number) => {
    setCurrentStep(index + 1);
    setIsThanksOpen(true);
    setInputEnabled(false);
  };

  const handleMouseOver = (index: number) => {
    const items = document.querySelectorAll('.statusBar__item');
    items.forEach((item, i) => {
      if (i < index) {
        item.classList.add('statusBar__mark');
      }
    });
  };

  const handleMouseOut = () => {
    const items = document.querySelectorAll('.statusBar__item');
    items.forEach((item) => {
      item.classList.remove('statusBar__mark');
    });
  };

  return (
    <div className='rate-stars'>
      {[...Array(10).keys()].map((index) => (
        <div
          className={`statusBar__item ${
            currentStep === index + 1 || currentStep > index + 1
              ? 'currentStep_type_active'
              : ''
          }`}
          key={index}
          onClick={() => handleRate(index)}
          onMouseOver={() => handleMouseOver(index)}
          onMouseOut={handleMouseOut}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
}
