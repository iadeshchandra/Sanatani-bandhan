import QRCode from 'qrcode';

export const APP_BASE_URL = 'https://sanatanibandhan.web.app';

export const generateStandardA_AutoLoginQR = async (
  memberId: string,
  pin: string,
  workspaceName: string
): Promise<string> => {
  const url = `${APP_BASE_URL}/?action=autologin&id=${encodeURIComponent(memberId)}&pin=${encodeURIComponent(pin)}&workspace=${encodeURIComponent(workspaceName)}`;
  try {
    return await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0f172a', // slate-900
        light: '#ffffff',
      }
    });
  } catch (err) {
    console.error('Error generating QR', err);
    return '';
  }
};

export const generateStandardB_GatePassQR = async (
  memberId: string
): Promise<string> => {
  const url = `${APP_BASE_URL}/?action=verify&id=${encodeURIComponent(memberId)}`;
  try {
    return await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#ea580c', // orange-600
        light: '#ffffff',
      }
    });
  } catch (err) {
    console.error('Error generating QR', err);
    return '';
  }
};
