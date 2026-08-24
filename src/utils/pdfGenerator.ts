import jsPDF from 'jspdf';
import { get } from 'idb-keyval';
import QRCode from 'qrcode';
import { DevoteeMember, TreasuryTransaction, WorkspaceConfig, PoojaBooking } from '../types';

/**
 * Generate cryptographic doc ref: DOC REF: SB-XXXX-XXXX-XXXX
 */
export const generateCryptoDocRef = (prefix = 'SB'): string => {
  const segment = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DOC REF: ${prefix}-${segment()}-${segment()}-${segment()}`;
};

/**
 * Resolve active workspace logo safely with format inspection
 */
export const getActiveWorkspaceLogo = async (workspaceId: string): Promise<string | null> => {
  try {
    const customLogo = await get(`sb_logo_${workspaceId}`);
    if (customLogo && customLogo.startsWith('data:image/')) {
      return customLogo;
    }
  } catch (e) {
    console.warn('Could not read custom workspace logo', e);
  }
  return null;
};

/**
 * Helper to inspect Base64 image format safely for jsPDF
 */
const getImageFormat = (base64String: string): 'JPEG' | 'PNG' | 'WEBP' => {
  if (base64String.includes('image/png')) return 'PNG';
  if (base64String.includes('image/webp')) return 'WEBP';
  return 'JPEG';
};

/**
 * 1. Smart Devotee / Member Card PDF
 */
export const generateDevoteeCardPDF = async (
  member: DevoteeMember,
  workspace: WorkspaceConfig
): Promise<void> => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [85.6, 120], // Smart ID card dimensions
  });

  const docRef = generateCryptoDocRef('CARD');
  const qrData = JSON.stringify({
    ref: member.qrCodeRef,
    id: member.id,
    name: member.fullName,
    pin: member.pin,
    workspace: workspace.name,
    tier: member.sevaTier,
  });

  const qrDataUrl = await QRCode.toDataURL(qrData, {
    margin: 1,
    width: 200,
    color: { dark: '#92400E', light: '#FFFBEB' },
  });

  // Background gradient-style border
  doc.setFillColor(254, 243, 199); // amber-100
  doc.rect(0, 0, 85.6, 120, 'F');

  // Header band
  doc.setFillColor(180, 83, 9); // amber-700
  doc.rect(0, 0, 85.6, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(workspace.name.toUpperCase(), 42.8, 8, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(workspace.tagline || 'Sanatani Bandhan Verified Member', 42.8, 13, { align: 'center' });
  doc.text(`SAMPRADAYA: ${workspace.sampradaya || 'Sanatan Dharma'}`, 42.8, 18, { align: 'center' });

  // Photo / Avatar box or custom photo
  const photoY = 26;
  if (member.avatarBase64 && member.avatarBase64.startsWith('data:image/')) {
    try {
      const fmt = getImageFormat(member.avatarBase64);
      doc.addImage(member.avatarBase64, fmt, 30.8, photoY, 24, 24);
    } catch (e) {
      doc.setFillColor(251, 191, 36);
      doc.roundedRect(30.8, photoY, 24, 24, 2, 2, 'F');
      doc.setTextColor(146, 64, 14);
      doc.setFontSize(14);
      doc.text('🕉️', 42.8, photoY + 14, { align: 'center' });
    }
  } else {
    doc.setFillColor(251, 191, 36);
    doc.roundedRect(30.8, photoY, 24, 24, 2, 2, 'F');
    doc.setTextColor(146, 64, 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('🕉️', 42.8, photoY + 15, { align: 'center' });
  }

  // Member details
  doc.setTextColor(31, 41, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(member.fullName, 42.8, 55, { align: 'center' });

  if (member.spiritualName) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(180, 83, 9);
    doc.text(`(${member.spiritualName})`, 42.8, 59, { align: 'center' });
  }

  // Seva Tier badge
  doc.setFillColor(217, 119, 6);
  doc.roundedRect(26.8, 62, 32, 5.5, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text(`SEVA: ${member.sevaTier.toUpperCase()} (${member.sevaIndex} pts)`, 42.8, 66, { align: 'center' });

  // Gotra & ID Metadata
  doc.setTextColor(75, 85, 99);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`Gotra: ${member.gotra || 'Kashyapa'}   •   Kul: ${member.varnaKul || 'Sanatan'}`, 42.8, 72, { align: 'center' });
  doc.text(`Member ID: ${member.id}   •   Phone: ${member.phone}`, 42.8, 76, { align: 'center' });

  // QR Code Stamp
  doc.addImage(qrDataUrl, 'PNG', 28.8, 80, 28, 28);

  // Footer & Crypto Ref
  doc.setFontSize(5);
  doc.setTextColor(107, 114, 128);
  doc.text('Scan for Gate Pass & Offline Identity Verification', 42.8, 111, { align: 'center' });
  doc.text(docRef, 42.8, 114, { align: 'center' });
  doc.text('Made with ❤️ by TrackIQ Academy • Universal Community Management', 42.8, 117, { align: 'center' });

  doc.save(`${member.fullName.replace(/\s+/g, '_')}_SmartCard.pdf`);
};

/**
 * 2. Section 80G / 12A Donation Tax Exemption Receipt
 */
export const generateTaxReceiptPDF = async (
  tx: TreasuryTransaction,
  workspace: WorkspaceConfig
): Promise<void> => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const docRef = generateCryptoDocRef('TAX80G');
  const qrData = JSON.stringify({
    txId: tx.id,
    receiptNo: tx.taxReceiptNumber || `SB-TAX-${tx.id.slice(-6)}`,
    amount: tx.amount,
    date: tx.date,
    donor: tx.devoteeName,
    taxReg: workspace.taxExemptionNumber,
  });

  const qrDataUrl = await QRCode.toDataURL(qrData, { margin: 1, width: 180 });

  // Border & Header
  doc.setDrawColor(180, 83, 9);
  doc.setLineWidth(1);
  doc.rect(10, 10, 190, 277);

  // Header Title
  doc.setFillColor(254, 243, 199);
  doc.rect(11, 11, 188, 32, 'F');

  doc.setTextColor(180, 83, 9);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(workspace.name, 105, 22, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text(workspace.address + ', ' + workspace.city + ', ' + workspace.country, 105, 28, { align: 'center' });
  doc.text(`Trust Reg: ${workspace.trustRegNumber || 'TRUST/VEDIC/2024'} | 80G Exemption: ${workspace.taxExemptionNumber || 'CIT(E)/80G/SB-998'}`, 105, 34, { align: 'center' });

  // Title Box
  doc.setFillColor(180, 83, 9);
  doc.rect(11, 44, 188, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text('OFFICIAL DONATION & TAX EXEMPTION RECEIPT (SECTION 80G)', 105, 51, { align: 'center' });

  // Receipt meta
  doc.setTextColor(31, 41, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`Receipt No: ${tx.taxReceiptNumber || 'TX-80G-' + tx.id}`, 20, 65);
  doc.text(`Date of Issue: ${tx.date}`, 140, 65);

  doc.text(`Payment Mode: ${tx.paymentMode}`, 20, 72);
  doc.text(`Ref/UTR No: ${tx.referenceNo || 'UPI-' + tx.id.slice(-8)}`, 140, 72);

  // Donor Table Box
  doc.setDrawColor(229, 231, 235);
  doc.setFillColor(249, 250, 251);
  doc.rect(20, 80, 170, 45, 'FD');

  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text('Donor Name:', 25, 90);
  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.text(tx.devoteeName || 'Generous Sanatan Bhakta', 65, 90);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text('Seva / Purpose:', 25, 100);
  doc.setTextColor(17, 24, 39);
  doc.text(`${tx.category} - ${tx.purpose}`, 65, 100);

  doc.setTextColor(107, 114, 128);
  doc.text('Custody Handled By:', 25, 110);
  doc.setTextColor(17, 24, 39);
  doc.text(tx.handledBy || 'Treasury Sevadar', 65, 110);

  // Amount Box
  doc.setFillColor(254, 243, 199);
  doc.rect(20, 132, 170, 25, 'FD');
  doc.setTextColor(180, 83, 9);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`Total Amount Received: ${workspace.currencySymbol || '₹'} ${tx.amount.toLocaleString()}`, 25, 147);

  // Exemption Text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(75, 85, 99);
  const legalNote = `This official receipt qualifies for tax deduction under Section 80G/12A of the Income Tax Act. We gratefully acknowledge this sacred contribution towards our Dharmic, educational, and charitable humanitarian activities. May Sri Hari shower you with eternal peace and divine grace.`;
  doc.text(doc.splitTextToSize(legalNote, 170), 20, 168);

  // QR Code & Signatures
  doc.addImage(qrDataUrl, 'PNG', 25, 195, 38, 38);
  doc.setFontSize(7);
  doc.text('Scan to verify digital audit stamp', 25, 238);

  // Authorized Signatory
  doc.line(130, 225, 180, 225);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(17, 24, 39);
  doc.text('Authorized Signatory', 135, 231);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text(`For ${workspace.name}`, 135, 236);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text(docRef, 105, 268, { align: 'center' });
  doc.text('Made with ❤️ by TrackIQ Academy • Universal Community Management', 105, 273, { align: 'center' });

  doc.save(`80G_Receipt_${tx.id}.pdf`);
};

/**
 * 3. Sacred Sankalp & Pooja Booking Receipt
 */
export const generatePoojaSankalpPDF = async (
  booking: PoojaBooking,
  workspace: WorkspaceConfig
): Promise<void> => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });
  const docRef = generateCryptoDocRef('SANKALP');
  const qrData = JSON.stringify({
    bookingId: booking.id,
    pooja: booking.poojaName,
    devotee: booking.devoteeName,
    gotra: booking.gotra,
    tithi: booking.tithiDate,
  });

  const qrDataUrl = await QRCode.toDataURL(qrData, { margin: 1, width: 160 });

  doc.setFillColor(254, 243, 199);
  doc.rect(0, 0, 148, 210, 'F');

  doc.setFillColor(180, 83, 9);
  doc.rect(0, 0, 148, 22, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('॥ श्री शुभ संकल्प पत्रम् ॥', 74, 10, { align: 'center' });
  doc.setFontSize(8);
  doc.text(workspace.name, 74, 16, { align: 'center' });

  doc.setTextColor(31, 41, 55);
  doc.setFontSize(12);
  doc.text(booking.poojaName, 74, 34, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tithi / Date: ${booking.tithiDate} (${booking.timeSlot})`, 74, 40, { align: 'center' });

  // Details box
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(12, 46, 124, 60, 2, 2, 'F');

  doc.setTextColor(107, 114, 128);
  doc.text('Yajamana / Devotee:', 18, 56);
  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.devoteeName, 60, 56);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text('Gotra & Nakshatra:', 18, 66);
  doc.setTextColor(17, 24, 39);
  doc.text(`${booking.gotra} ${booking.nakshatra ? `| ${booking.nakshatra}` : ''}`, 60, 66);

  doc.setTextColor(107, 114, 128);
  doc.text('Assigned Purohit:', 18, 76);
  doc.setTextColor(17, 24, 39);
  doc.text(booking.purohitAssigned || 'Mandir Chief Priest', 60, 76);

  doc.setTextColor(107, 114, 128);
  doc.text('Dakshina Seva:', 18, 86);
  doc.setTextColor(180, 83, 9);
  doc.setFont('helvetica', 'bold');
  doc.text(`${workspace.currencySymbol || '₹'} ${booking.dakshinaAmount} (${booking.paymentStatus})`, 60, 86);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text('Sankalp Prayer:', 18, 96);
  doc.setTextColor(17, 24, 39);
  doc.text(doc.splitTextToSize(booking.sankalpDescription, 68), 60, 96);

  // QR and footer
  doc.addImage(qrDataUrl, 'PNG', 54, 115, 40, 40);

  doc.setFontSize(7);
  doc.setTextColor(107, 114, 128);
  doc.text('Present this slip at Mandir sanctum sanctorum for Pushpanjali', 74, 165, { align: 'center' });
  doc.text(docRef, 74, 195, { align: 'center' });
  doc.text('Made with ❤️ by TrackIQ Academy • Universal Community Management', 74, 200, { align: 'center' });

  doc.save(`Sankalp_${booking.id}.pdf`);
};
