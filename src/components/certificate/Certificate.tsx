
import React from 'react';

interface CertificateProps {
  recipientName: string;
  achievementText: string;
  date: string;
  signatureText: string;
}

const Certificate: React.FC<CertificateProps> = ({
  recipientName,
  achievementText,
  date,
  signatureText
}) => {
  return (
    <div className="relative w-[400px] h-[570px] border-8 border-double border-babybaby-lightblue rounded-lg flex flex-col items-center p-6 bg-[#FFF8F0]">
      {/* Cadre décoratif */}
      <div className="absolute inset-0 border-[16px] border-[#FFF8F0] pointer-events-none"></div>
      <div className="absolute inset-4 border-2 border-babybaby-lightblue pointer-events-none"></div>
      
      {/* Décoration en haut */}
      <div className="w-32 h-6 mb-4 text-babybaby-pink opacity-60">
        <svg viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
          <path d="M50,0c0,0,25,18,50,18c-25,0-50,18-50,18S25,18,0,18C25,18,50,0,50,0z" />
        </svg>
      </div>
      
      {/* En-tête */}
      <h1 className="text-4xl font-bold tracking-wide text-babybaby-blue mb-3 font-comfortaa">
        CERTIFICAT
      </h1>
      <h2 className="text-2xl font-bold tracking-wide text-babybaby-blue mb-10 font-comfortaa">
        D'ACCOMPLISSEMENT
      </h2>
      
      {/* Texte d'introduction */}
      <p className="text-center text-babybaby-blue mb-6 font-light text-lg">
        Ce certificat est fièrement présenté à
      </p>
      
      {/* Nom du destinataire */}
      <h3 className="text-3xl font-bold text-babybaby-blue mb-2 text-center font-comfortaa">
        {recipientName}
      </h3>
      <div className="w-48 h-0.5 bg-babybaby-pink opacity-70 mb-6"></div>
      
      {/* Texte d'accomplissement */}
      <p className="text-center text-babybaby-blue mb-8 leading-relaxed w-[90%]">
        {achievementText}
      </p>
      
      {/* Bas du certificat */}
      <div className="mt-auto flex justify-between w-full items-end">
        <div className="flex flex-col items-center">
          <p className="text-babybaby-blue font-light mb-2">DATE</p>
          <div className="w-24 border-t border-babybaby-blue text-center pt-1">
            <span className="text-babybaby-blue">{date}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 0C30 22 30 22 30 22C14 22 14 22 14 22L2 40C2 40 30 40 30 40C30 40 58 40 58 40L46 22C46 22 30 22 30 22" stroke="#33C3F0" fill="none" strokeWidth="1.5"/>
            <circle cx="30" cy="8" r="4" fill="#33C3F0"/>
            <path d="M18 25C18 22 22 22 22 22" stroke="#33C3F0" fill="none" strokeWidth="1.5"/>
            <path d="M42 25C42 22 38 22 38 22" stroke="#33C3F0" fill="none" strokeWidth="1.5"/>
          </svg>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="h-8 flex items-end mb-2">
            <svg width="80" height="20" viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,10 C20,0 60,30 80,10" stroke="#9b87f5" fill="none" strokeWidth="1"/>
            </svg>
          </div>
          <div className="w-24 border-t border-babybaby-blue text-center pt-1">
            <span className="text-babybaby-blue text-xs">{signatureText}</span>
          </div>
        </div>
      </div>
      
      {/* Logo */}
      <div className="mt-4">
        <h3 className="text-center">
          <span className="text-babybaby-blue text-2xl font-bold">Baby</span>
          <span className="text-babybaby-pink text-2xl font-bold">Baby</span>
        </h3>
      </div>
      
      {/* Décoration en bas */}
      <div className="w-32 h-6 mt-4 text-babybaby-pink opacity-60 transform rotate-180">
        <svg viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
          <path d="M50,0c0,0,25,18,50,18c-25,0-50,18-50,18S25,18,0,18C25,18,50,0,50,0z" />
        </svg>
      </div>
    </div>
  );
};

export default Certificate;
