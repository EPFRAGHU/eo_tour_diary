import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding EPFO EO Tour Diary master lookup tables...');

  // 1. Regional Offices Lookup
  const officeCuttack = await prisma.regionalOffice.upsert({
    where: { officeCode: 'CTC' },
    update: {},
    create: {
      officeCode: 'CTC',
      officeName: 'District Office, Cuttack',
      district: 'Cuttack',
      state: 'Odisha',
    },
  });

  const officeBhubaneswar = await prisma.regionalOffice.upsert({
    where: { officeCode: 'BBS' },
    update: {},
    create: {
      officeCode: 'BBS',
      officeName: 'Regional Office, Bhubaneswar',
      district: 'Khurda',
      state: 'Odisha',
    },
  });

  console.log('✅ Regional Offices seeded:', officeCuttack.officeCode, officeBhubaneswar.officeCode);

  // 1b. Primary Super Admin User Seed
  const superAdmin = await prisma.user.upsert({
    where: { email: 'raghunatha.maharana@gmail.com' },
    update: { role: 'SUPER_ADMIN', status: 'ACTIVE' },
    create: {
      pfStaffId: 'PF-HQ-001',
      epfoEmpNumber: 'EPFO/HQ/SUPER/001',
      email: 'raghunatha.maharana@gmail.com',
      username: 'raghunatha.admin',
      name: 'Shri Raghunatha Maharana',
      designation: 'Super Administrator / Additional Central PF Commissioner',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      officeId: officeBhubaneswar.id,
      region: 'Odisha Zone',
      district: 'Khordha / Bhubaneswar',
      mobile: '+91 94370 12345',
      isMfaEnabled: true,
      notes: 'Primary Super Admin account. Protected system privileges.',
    },
  });
  console.log('✅ Super Admin account seeded:', superAdmin.email);

  // 2. Visit Purpose Masters Lookup
  const purposes = [
    { code: 'PMVBRY', name: 'PMVBRY Registration & Campaigning', category: 'CAMPAIGN' },
    { code: 'COMPLIANCE_AUDIT', name: 'Compliance Audit of Exempted / Unexempted Estt', category: 'COMPLIANCE' },
    { code: 'SECTION_7A', name: 'Section 7A Enquiry Verification', category: 'ENQUIRY' },
    { code: 'SECTION_14B', name: 'Section 14B Damages Default Check', category: 'ENQUIRY' },
    { code: 'EEC_CAMPAIGN', name: 'EEC Campaign & Uncovered Coverage Check', category: 'CAMPAIGN' },
    { code: 'DEATH_CLAIM', name: 'Death Claim / Pension Verification', category: 'VERIFICATION' },
    { code: 'LABOUR_CODE', name: 'Labour Code Awareness Camp', category: 'CAMPAIGN' },
    { code: 'NAN_DUTY', name: 'NAN Aspirational Block Duty', category: 'SPECIAL_DUTY' },
    { code: 'OFFICE_DUTY', name: 'Attended Office Day / Meeting', category: 'OFFICE' },
  ];

  for (const p of purposes) {
    await prisma.visitPurposeMaster.upsert({
      where: { code: p.code },
      update: { name: p.name, category: p.category },
      create: p,
    });
  }
  console.log(`✅ ${purposes.length} Visit Purposes seeded.`);

  // 3. Conveyance Mode Masters Lookup
  const modes = [
    { code: 'OWN_CAR', name: 'Own Car / Four Wheeler', ratePerKm: 16.0 },
    { code: 'SHARED_EO_CAR', name: 'Car of another EO (Shared)', ratePerKm: 0.0 },
    { code: 'DEPT_VEHICLE', name: 'Departmental / Official Car', ratePerKm: 0.0 },
    { code: 'PUBLIC_BUS', name: 'Public Bus / Express Transit', ratePerKm: 4.0 },
    { code: 'TRAIN_RAIL', name: 'Rail / Train Transport', ratePerKm: 3.5 },
  ];

  for (const m of modes) {
    await prisma.conveyanceModeMaster.upsert({
      where: { code: m.code },
      update: { name: m.name, ratePerKm: m.ratePerKm },
      create: m,
    });
  }
  console.log(`✅ ${modes.length} Conveyance Modes seeded.`);

  // 4. Sample Official Establishments Parsed from Excel
  const establishments = [
    {
      establishmentCode: 'OR/BBS/0006276/000',
      name: 'M/s Jindal Stainless Steel Ltd',
      location: 'Danagadi, Jajpur',
      district: 'Jajpur',
      coverageStatus: 'COVERED' as const,
      industryType: 'Manufacturing / Metallurgy',
    },
    {
      establishmentCode: 'OR/BBS/0001238/000',
      name: 'M/s Bhimtanagar Sukinda Chromite Mines',
      location: 'Sukinda, Jajpur',
      district: 'Jajpur',
      coverageStatus: 'EXEMPTED' as const,
      industryType: 'Mining & Extraction',
    },
    {
      establishmentCode: 'OR/BBS/0005077/000',
      name: 'M/s NTPC Kanhia Thermal Power Plant',
      location: 'Kanhia, Angul',
      district: 'Angul',
      coverageStatus: 'COVERED' as const,
      industryType: 'Power Generation',
    },
    {
      establishmentCode: 'OR/BBS/0016917/024',
      name: 'M/s Executive Engineer, Mahanadi South Division',
      location: 'Cuttack',
      district: 'Cuttack',
      coverageStatus: 'GOVT_UNDERTAKING' as const,
      industryType: 'Public Works / Irrigation',
    },
    {
      establishmentCode: 'OR/BBS/0045231/000',
      name: 'Apex Logistics & Freight India Pvt Ltd',
      location: 'Choudwar Industrial Area, Cuttack',
      district: 'Cuttack',
      coverageStatus: 'COVERED' as const,
      industryType: 'Logistics & Supply Chain',
    },
  ];

  for (const est of establishments) {
    await prisma.establishment.upsert({
      where: { establishmentCode: est.establishmentCode },
      update: { name: est.name, location: est.location },
      create: est,
    });
  }
  console.log(`✅ ${establishments.length} Standard Establishments seeded.`);

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
