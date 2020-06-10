import React from 'react';
import { motion } from 'framer-motion'

export const FadeIn = ({ children }) => (

  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    {children}
  </motion.div>


);


