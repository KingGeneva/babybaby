
import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const ForumHeader = () => {
  return (
    <motion.div
      className="text-center mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="mx-auto h-12 w-12 bg-babybaby-cosmic/10 rounded-full flex items-center justify-center mb-4">
        <Users className="h-6 w-6 text-babybaby-cosmic" />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold mb-3 text-babybaby-cosmic">
        Notre Communauté
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Rejoignez des milliers de parents qui s'entraident et partagent leurs expériences
      </p>
    </motion.div>
  );
};

export default ForumHeader;
