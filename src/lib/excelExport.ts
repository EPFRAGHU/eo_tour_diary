import { TourProgramItem, UserProfile } from '@/types';
import { DailyVisitEntry } from '@/components/diary/DailyDiaryEntryForm';
import { getDefaultOfficeName } from '@/lib/officeConfig';

export interface TourDiaryExcelOptions {
  month?: number;
  year?: number;
  tour?: TourProgramItem;
  entries?: DailyVisitEntry[];
  user?: Partial<UserProfile>;
  filename?: string;
}

/**
 * Generates an official Microsoft Excel (.xls) file for EPFO Tour Diary.
 * Uses structured XML/HTML Excel table format compatible with MS Excel, LibreOffice & Google Sheets.
 */
export function exportTourDiaryToExcel(options: TourDiaryExcelOptions = {}): void {
  const currentYear = options.year || new Date().getFullYear();
  const currentMonth = options.month || new Date().getMonth() + 1;
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthStr = monthNames[currentMonth - 1];
  const officeName = getDefaultOfficeName();
  const officerName = options.user?.name || 'Shri Raghunatha Maharana';
  const designation = options.user?.designation || 'Enforcement Officer (EO/AO)';
  const filename = options.filename || `tour_diary_${currentYear}_${String(currentMonth).padStart(2, '0')}.xls`;

  // Sample or provided entries
  const entries: DailyVisitEntry[] = options.entries && options.entries.length > 0
    ? options.entries
    : [
        {
          id: 'ent-1',
          visitDate: `${currentYear}-08-10`,
          dayType: 'TOUR_DAY',
          establishmentCode: 'OR/BBS/6276',
          establishmentName: 'M/s Jindal Stainless Steel Ltd',
          location: 'Danagadi, Jajpur',
          durationDays: 1,
          purpose: 'Inspection of 14B damages defaults & un-enrolled contract worker verification.',
          orderRef: 'Comp.Audit/Exempted Est./2024-25/818',
          distanceKm: 105,
          conveyanceMode: 'Own Car',
          vehicleDetails: 'OD-02-AK-9988',
          hotelStayed: true,
          hotelName: 'Hotel Jajpur Residency',
          hotelDays: 1,
          hotelAmount: 1200,
          reportSubmittedRef: 'OR/DO/CTC/Compliance/2026/810',
          remarks: 'Conducted compliance verification and verified form 11 registers.',
        },
        {
          id: 'ent-2',
          visitDate: `${currentYear}-08-11`,
          dayType: 'TOUR_DAY',
          establishmentCode: 'OR/BBS/1238',
          establishmentName: 'M/s Bhimtanagar Sukinda Chromite Mines',
          location: 'Sukinda, Jajpur',
          durationDays: 1,
          purpose: 'Section 7A Enquiry Records Examination & Attendance audit',
          orderRef: 'Comp.Audit/Exempted Est./2024-25/819',
          distanceKm: 85,
          conveyanceMode: 'Official Jeep',
          vehicleDetails: 'Govt Vehicle OD-05-G-1200',
          hotelStayed: false,
          hotelName: '',
          hotelDays: 0,
          hotelAmount: 0,
          reportSubmittedRef: 'OR/DO/CTC/Audit/Excel/457',
          remarks: 'Inspected wage slips and checked non-enrolled staff list.',
        },
        {
          id: 'ent-3',
          visitDate: `${currentYear}-08-12`,
          dayType: 'TOUR_DAY',
          establishmentCode: 'OR/BBS/5077',
          establishmentName: 'M/s NTPC Kanhia Thermal Power Plant',
          location: 'Kanhia, Angul',
          durationDays: 1,
          purpose: 'PMVBRY Campaigning & Verification of contractor compliance',
          orderRef: 'PMVBRY/Drive/2026/102',
          distanceKm: 140,
          conveyanceMode: 'Own Car',
          vehicleDetails: 'OD-02-AK-9988',
          hotelStayed: true,
          hotelName: 'NTPC Guest House',
          hotelDays: 1,
          hotelAmount: 800,
          reportSubmittedRef: 'OR/DO/CTC/PMVBRY/2026/912',
          remarks: 'Organized worker awareness camp on social security code.',
        },
        {
          id: 'ent-4',
          visitDate: `${currentYear}-08-14`,
          dayType: 'OFFICE_DAY',
          establishmentCode: 'OR/BBS/16917/24',
          establishmentName: 'M/s Executive Engineer, Mahanadi South Division',
          location: 'Cuttack',
          durationDays: 1,
          purpose: 'Hearing on 7A assessment dues & verification of challan copies',
          orderRef: '7A/Assessment/CTC/2026/410',
          distanceKm: 15,
          conveyanceMode: 'Two Wheeler',
          vehicleDetails: 'OD-05-E-4545',
          hotelStayed: false,
          hotelName: '',
          hotelDays: 0,
          hotelAmount: 0,
          reportSubmittedRef: 'OR/DO/CTC/7A/2026/410',
          remarks: 'Challan verified for ₹4,20,000 deposited into EPFO SBI A/c No. 1.',
        },
        {
          id: 'ent-5',
          visitDate: `${currentYear}-08-18`,
          dayType: 'TOUR_DAY',
          establishmentCode: 'OR/BBS/0045231/000',
          establishmentName: 'Apex Logistics & Freight India Pvt Ltd',
          location: 'Choudwar Industrial Area, Cuttack',
          durationDays: 1,
          purpose: 'Section 14B damages notice hearing and attendance muster audit',
          orderRef: '14B/Damages/CTC/2026/88',
          distanceKm: 28,
          conveyanceMode: 'Own Car',
          vehicleDetails: 'OD-02-AK-9988',
          hotelStayed: false,
          hotelName: '',
          hotelDays: 0,
          hotelAmount: 0,
          reportSubmittedRef: 'OR/DO/CTC/14B/2026/88',
          remarks: 'Served Form 11 notice for 18 non-enrolled security guards.',
        },
      ];

  const totalKm = entries.reduce((acc, curr) => acc + (Number(curr.distanceKm) || 0), 0);
  const totalHotelAmount = entries.reduce((acc, curr) => acc + (Number(curr.hotelAmount) || 0), 0);

  // Construct XML/HTML Spreadsheet for Excel
  const excelContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Tour_Diary_${monthStr}_${currentYear}</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <style>
        body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; }
        .header-title { font-size: 16pt; font-weight: bold; text-align: center; color: #002B49; }
        .header-sub { font-size: 12pt; font-weight: bold; text-align: center; color: #333333; }
        .meta-table { margin-bottom: 15px; width: 100%; border-collapse: collapse; }
        .meta-table td { padding: 4px 8px; font-size: 11pt; }
        .meta-label { font-weight: bold; color: #002B49; width: 18%; }
        .meta-val { border-bottom: 1px solid #999; }
        .data-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .data-table th { background-color: #002B49; color: #FFFFFF; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #001A2C; padding: 8px 6px; font-size: 10pt; }
        .data-table td { border: 1px solid #CCCCCC; padding: 6px 8px; font-size: 10pt; vertical-align: top; }
        .data-table tr:nth-child(even) { background-color: #F8FAFC; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .total-row { background-color: #E2E8F0; font-weight: bold; }
        .sig-section { margin-top: 30px; width: 100%; }
        .sig-block { font-size: 11pt; text-align: center; padding-top: 40px; }
      </style>
    </head>
    <body>
      <table style="width: 100%;">
        <tr>
          <td colspan="12" class="header-title">EMPLOYEES' PROVIDENT FUND ORGANISATION</td>
        </tr>
        <tr>
          <td colspan="12" class="header-sub">MINISTRY OF LABOUR & EMPLOYMENT, GOVT. OF INDIA</td>
        </tr>
        <tr>
          <td colspan="12" style="text-align: center; font-size: 13pt; font-weight: bold; color: #0284C7; padding: 6px 0 14px 0;">
            MONTHLY DIARY OF ENFORCEMENT OFFICER / ASSISTANT ACCOUNTS OFFICER
          </td>
        </tr>
      </table>

      <table class="meta-table">
        <tr>
          <td class="meta-label">Name of Officer:</td>
          <td class="meta-val"><strong>${officerName}</strong></td>
          <td class="meta-label" style="text-align: right;">Diary For Month:</td>
          <td class="meta-val"><strong>${monthStr} ${currentYear}</strong></td>
        </tr>
        <tr>
          <td class="meta-label">Designation:</td>
          <td class="meta-val">${designation}</td>
          <td class="meta-label" style="text-align: right;">Office Jurisdiction:</td>
          <td class="meta-val">${officeName}</td>
        </tr>
      </table>

      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 35px;">Sl. No.</th>
            <th style="width: 85px;">Date of Visit</th>
            <th style="width: 75px;">Day Type</th>
            <th style="width: 120px;">Estt Code</th>
            <th style="width: 220px;">Name of Establishment</th>
            <th style="width: 140px;">Place / Location</th>
            <th style="width: 240px;">Purpose of Visit / Section (7A/14B/Form 11)</th>
            <th style="width: 100px;">Conveyance Mode & Vehicle</th>
            <th style="width: 75px;">Distance (Km)</th>
            <th style="width: 80px;">Hotel Claim (₹)</th>
            <th style="width: 160px;">Inspection Report / Notice Ref</th>
            <th style="width: 180px;">Remarks & Outcome</th>
          </tr>
        </thead>
        <tbody>
          ${entries
            .map(
              (e, idx) => `
            <tr>
              <td class="text-center">${idx + 1}</td>
              <td class="text-center">${e.visitDate || ''}</td>
              <td class="text-center"><strong>${e.dayType === 'TOUR_DAY' ? 'Tour Day' : e.dayType === 'OFFICE_DAY' ? 'Office / HQ' : 'Camp / Leave'}</strong></td>
              <td class="text-center" style="font-family: Consolas, monospace; font-weight: bold; color: #002B49;">${e.establishmentCode || ''}</td>
              <td><strong>${e.establishmentName || ''}</strong></td>
              <td>${e.location || ''}</td>
              <td>${e.purpose || ''}</td>
              <td class="text-center">${e.conveyanceMode || 'Own Car'}${e.vehicleDetails ? `<br/><small style="color: #666;">(${e.vehicleDetails})</small>` : ''}</td>
              <td class="text-right">${e.distanceKm || 0}</td>
              <td class="text-right">${e.hotelStayed && e.hotelAmount ? `₹${e.hotelAmount}` : '-'}</td>
              <td style="font-size: 9pt;">${e.reportSubmittedRef || '-'}</td>
              <td style="font-size: 9pt;">${e.remarks || '-'}</td>
            </tr>
          `
            )
            .join('')}
          <tr class="total-row">
            <td colspan="8" style="text-align: right; padding-right: 12px;"><strong>MONTHLY TOTALS:</strong></td>
            <td class="text-right"><strong>${totalKm} Km</strong></td>
            <td class="text-right"><strong>₹${totalHotelAmount.toLocaleString('en-IN')}</strong></td>
            <td colspan="2" style="color: #002B49; font-size: 9pt;"><strong>${entries.length} Total Diary Entries Recorded</strong></td>
          </tr>
        </tbody>
      </table>

      <table class="sig-section" style="margin-top: 40px;">
        <tr>
          <td style="width: 33%; text-align: center; vertical-align: bottom;">
            <br/><br/>
            _______________________________<br/>
            <strong>Signature of Enforcement Officer</strong><br/>
            Date: ${new Date().toISOString().split('T')[0]}
          </td>
          <td style="width: 33%; text-align: center; vertical-align: bottom;">
            <br/><br/>
            _______________________________<br/>
            <strong>Accounts Officer / Verification</strong><br/>
            Date:
          </td>
          <td style="width: 33%; text-align: center; vertical-align: bottom;">
            <br/><br/>
            _______________________________<br/>
            <strong>Assistant PF Commissioner (APFC)</strong><br/>
            Regional / District Office: ${officeName}
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.setAttribute('download', filename);
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}
