import React from 'react';
import { Link } from 'react-router-dom';

export default function Button({ btnType, btnText, customClass }) {
  const getButtonClasses = () => {
    let classes = '';

    switch (btnType) {
      case 'PRIMARY':
        classes = 'bg-blue-500 hover:bg-blue-700';
        break;
      case 'SECONDARY':
        classes = 'bg-gray-300 hover:bg-gray-400';
        break;
      default:
        break;
    }

    return `rounded py-2 px-4 text-white font-bold ${classes} ${customClass}`;
  };

  return (
    <Link to="/event-page" className={getButtonClasses()}>
      {btnText}
    </Link>
  );
}
