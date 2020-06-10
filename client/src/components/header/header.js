import React from 'react';
import './header.css';
import { motion } from 'framer-motion';

const Header = ({ title }) => {

  const variants = {
    slide: {
      transform: 'translate(4px, 3px)',
      transition: { duration: 0.3, delay: 0.5 }
    }
  }

  return (
    <div id="header">
      <h1 id="frontTitle">{title}</h1>
      <motion.h1
        variants={variants}
        animate="slide"
        id="backTitle" >{title}</motion.h1>
    </div>
  );
}


export default Header;
