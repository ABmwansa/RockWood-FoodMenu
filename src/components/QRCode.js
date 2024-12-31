import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import '../style/QRCode.css';

const QRCode = () => {
  const qrCodeValue = "https://yourwebsite.com"; // Replace with your URL or data

  return (
    <div className="qrcode-container">
      <QRCodeCanvas value={qrCodeValue} size={256} />
    </div>
  );
};

export default QRCode;
