export const institutionTypes = [
  {
    value: 'university',
    label: 'University',
    description:
      'Higher education institution offering undergraduate and graduate programs',
    accessCodePattern: {
      admin: '{UNI}-ADMIN-{YY}',
      staff: '{UNI}-STAFF-{YY}',
      department: '{UNI}-DEPT-{YY}',
    },
  },
  {
    value: 'polytechnic',
    label: 'Polytechnic',
    description:
      'Technical institution focusing on vocational and technical education',
    accessCodePattern: {
      admin: '{POLY}-ADMIN-{YY}',
      staff: '{POLY}-STAFF-{YY}',
      department: '{POLY}-DEPT-{YY}',
    },
  },
  {
    value: 'college_of_education',
    label: 'College of Education',
    description: 'Institution specializing in teacher training and education',
    accessCodePattern: {
      admin: '{COE}-ADMIN-{YY}',
      staff: '{COE}-STAFF-{YY}',
      department: '{COE}-DEPT-{YY}',
    },
  },
  {
    value: 'specialized_college',
    label: 'Specialized College',
    description:
      'Colleges focusing on specific fields (health, agriculture, etc.)',
    accessCodePattern: {
      admin: '{SPEC}-ADMIN-{YY}',
      staff: '{SPEC}-STAFF-{YY}',
      department: '{SPEC}-DEPT-{YY}',
    },
  },
]

export const nigerianInstitutions = [
  {
    name: 'Abia State University',
    state: 'Abia',
    city: 'Uturu',
    abbreviation: 'ABSU',
    website: 'https://abiastateuniversity.edu.ng/',
    institutionType: 'university',
    category: 'State',
    domains: ['abiastateuniversity.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
          {
            name: 'M.Sc. Computer Science',
            type: 'Postgraduate',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Business Administration',
        code: 'BA',
        programs: [
          {
            name: 'B.Sc. Business Administration',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Medicine and Surgery',
        code: 'MED',
        programs: [
          {
            name: 'MBBS Medicine and Surgery',
            type: 'Undergraduate',
            duration: '6 years',
          },
        ],
      },
      {
        name: 'Education',
        code: 'EDU',
        programs: [
          {
            name: 'B.Ed. Education Management',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Arts and Humanities',
        code: 'AH',
        programs: [
          {
            name: 'B.A. English',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Yaba College of Technology',
    state: 'Lagos',
    city: 'Yaba',
    abbreviation: 'YABATECH',
    website: 'https://www.yabatech.edu.ng/',
    institutionType: 'polytechnic',
    category: 'Federal',
    domains: ['yabatech.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'ND Computer Science',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Computer Science',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'ND Mechanical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Mechanical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Federal College of Education, Kano',
    state: 'Kano',
    city: 'Kano',
    abbreviation: 'FCEKANO',
    website: 'https://fcekano.edu.ng/',
    institutionType: 'college_of_education',
    category: 'Federal',
    domains: ['fcekano.edu.ng'],
    departments: [
      {
        name: 'Science Education',
        code: 'SCI',
        programs: [
          {
            name: 'NCE Biology Education',
            type: 'Certificate',
            duration: '3 years',
          },
          {
            name: 'NCE Chemistry Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Arts Education',
        code: 'ARTS',
        programs: [
          {
            name: 'NCE English Education',
            type: 'Certificate',
            duration: '3 years',
          },
          {
            name: 'NCE History Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Social Science Education',
        code: 'SOC',
        programs: [
          {
            name: 'NCE Economics Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Vocational Education',
        code: 'VOC',
        programs: [
          {
            name: 'NCE Home Economics',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Primary Education',
        code: 'PRI',
        programs: [
          {
            name: 'NCE Primary Education Studies',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Nigerian College of Aviation Technology',
    state: 'Kaduna',
    city: 'Zaria',
    abbreviation: 'NCAT',
    website: 'https://ncat.gov.ng/',
    institutionType: 'specialized_college',
    category: 'Federal',
    domains: ['ncat.gov.ng'],
    departments: [
      {
        name: 'Flight Training',
        code: 'FT',
        programs: [
          {
            name: 'Private Pilot License',
            type: 'Certificate',
            duration: '6 months',
          },
          {
            name: 'Commercial Pilot License',
            type: 'Certificate',
            duration: '18 months',
          },
        ],
      },
      {
        name: 'Aircraft Maintenance Engineering',
        code: 'AME',
        programs: [
          {
            name: 'Aircraft Maintenance Program',
            type: 'Diploma',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Air Traffic Services',
        code: 'ATS',
        programs: [
          {
            name: 'Air Traffic Control Training',
            type: 'Certificate',
            duration: '1 year',
          },
        ],
      },
      {
        name: 'Aviation Management',
        code: 'AVM',
        programs: [
          {
            name: 'Diploma in Aviation Management',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Meteorology',
        code: 'MET',
        programs: [
          {
            name: 'Certificate in Aviation Meteorology',
            type: 'Certificate',
            duration: '6 months',
          },
        ],
      },
    ],
  },
  {
    name: 'Achievers University, Owo',
    state: 'Ondo',
    city: 'Owo',
    abbreviation: 'AUO',
    website: 'https://www.achievers.edu.ng/',
    institutionType: 'university',
    category: 'Private',
    domains: ['achievers.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Business Administration',
        code: 'BA',
        programs: [
          {
            name: 'B.Sc. Business Administration',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Microbiology',
        code: 'MB',
        programs: [
          {
            name: 'B.Sc. Microbiology',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Nursing',
        code: 'NUR',
        programs: [
          {
            name: 'B.Sc. Nursing',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Law',
        code: 'LAW',
        programs: [
          {
            name: 'LL.B Law',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
    ],
  },
  {
    name: 'University of Lagos',
    state: 'Lagos',
    city: 'Lagos',
    abbreviation: 'UNILAG',
    website: 'https://www.unilag.edu.ng/',
    institutionType: 'university',
    category: 'Federal',
    domains: ['unilag.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'B.Eng. Mechanical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Federal University of Technology, Minna',
    state: 'Niger',
    city: 'Minna',
    abbreviation: 'FUTMINNA',
    website: 'https://www.futminna.edu.ng/',
    institutionType: 'university',
    category: 'Federal',
    domains: ['futminna.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'B.Eng. Mechanical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
    ],
  },
  {
    name: 'University of Jos',
    state: 'Plateau',
    city: 'Jos',
    abbreviation: 'UNIJOS',
    website: 'https://www.unijos.edu.ng/',
    institutionType: 'university',
    category: 'Federal',
    domains: ['unijos.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'B.Eng. Mechanical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
    ],
  },
  {
    name: 'University of Benin',
    state: 'Edo',
    city: 'Benin City',
    abbreviation: 'UNIBEN',
    website: 'https://www.uniben.edu/',
    institutionType: 'university',
    category: 'Federal',
    domains: ['uniben.edu'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'B.Eng. Mechanical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
    ],
  },
  {
    name: 'University of Calabar',
    state: 'Cross River',
    city: 'Calabar',
    abbreviation: 'UNICAL',
    website: 'https://www.unical.edu.ng/',
    institutionType: 'university',
    category: 'Federal',
    domains: ['unical.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'B.Eng. Mechanical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
    ],
  },
  {
    name: 'University of Ilorin',
    state: 'Kwara',
    city: 'Ilorin',
    abbreviation: 'UNILORIN',
    website: 'https://www.unilorin.edu.ng/',
    institutionType: 'university',
    category: 'Federal',
    domains: ['unilorin.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'B.Eng. Mechanical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
    ],
  },
  {
    name: 'University of Ibadan',
    state: 'Oyo',
    city: 'Ibadan',
    abbreviation: 'UI',
    website: 'https://www.ui.edu.ng/',
    institutionType: 'university',
    category: 'Federal',
    domains: ['ui.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'B.Eng. Mechanical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Obafemi Awolowo University',
    state: 'Osun',
    city: 'Ile-Ife',
    abbreviation: 'OAU',
    website: 'https://www.oauife.edu.ng/',
    institutionType: 'university',
    category: 'Federal',
    domains: ['oauife.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'B.Eng. Mechanical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Afe Babalola University',
    state: 'Ekiti',
    city: 'Ado Ekiti',
    abbreviation: 'ABUAD',
    website: 'https://www.abuad.edu.ng/',
    institutionType: 'university',
    category: 'Private',
    domains: ['abuad.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Law',
        code: 'LAW',
        programs: [
          {
            name: 'LL.B Law',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Business Administration',
        code: 'BA',
        programs: [
          {
            name: 'B.Sc. Business Administration',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Babcock University',
    state: 'Ogun',
    city: 'Ilishan-Remo',
    abbreviation: 'BU',
    website: 'https://www.babcock.edu.ng/',
    institutionType: 'university',
    category: 'Private',
    domains: ['babcock.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Business Administration',
        code: 'BA',
        programs: [
          {
            name: 'B.Sc. Business Administration',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Medicine',
        code: 'MED',
        programs: [
          {
            name: 'MBBS Medicine',
            type: 'Undergraduate',
            duration: '6 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Covenant University',
    state: 'Ogun',
    city: 'Ota',
    abbreviation: 'CU',
    website: 'https://www.covenantuniversity.edu.ng/',
    institutionType: 'university',
    category: 'Private',
    domains: ['covenantuniversity.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
          {
            name: 'M.Sc. Computer Science',
            type: 'Postgraduate',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Business Administration',
        code: 'BA',
        programs: [
          {
            name: 'B.Sc. Business Administration',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Law',
        code: 'LAW',
        programs: [
          {
            name: 'LL.B Law',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Pan-Atlantic University',
    state: 'Lagos',
    city: 'Lekki',
    abbreviation: 'PAU',
    website: 'https://pau.edu.ng/',
    institutionType: 'university',
    category: 'Private',
    domains: ['pau.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Business Administration',
        code: 'BA',
        programs: [
          {
            name: 'B.Sc. Business Administration',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
    ],
  },
  {
    name: 'University of Nsukka',
    state: 'Enugu',
    city: 'Nsukka',
    abbreviation: 'UNN',
    website: 'https://www.unn.edu.ng/',
    institutionType: 'university',
    category: 'Federal',
    domains: ['unn.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'B.Eng. Mechanical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
    ],
  },
  {
    name: 'University of Port Harcourt',
    state: 'Rivers',
    city: 'Port Harcourt',
    abbreviation: 'UNIPORT',
    website: 'https://www.uniport.edu.ng/',
    institutionType: 'university',
    category: 'Federal',
    domains: ['uniport.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'B.Eng. Mechanical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
    ],
  },
  {
    name: 'University of Uyo',
    state: 'Akwa Ibom',
    city: 'Uyo',
    abbreviation: 'UNIUYO',
    website: 'https://www.uniuyo.edu.ng/',
    institutionType: 'university',
    category: 'State',
    domains: ['uniuyo.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'B.Eng. Mechanical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Ahmadu Bello University',
    state: 'Kaduna',
    city: 'Zaria',
    abbreviation: 'ABU',
    website: 'https://www.abu.edu.ng/',
    institutionType: 'university',
    category: 'Federal',
    domains: ['abu.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
          {
            name: 'M.Sc. Computer Science',
            type: 'Postgraduate',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'B.Eng. Mechanical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Business Administration',
        code: 'BA',
        programs: [
          {
            name: 'B.Sc. Business Administration',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Federal University of Technology, Akure',
    state: 'Ondo',
    city: 'Akure',
    abbreviation: 'FUTA',
    website: 'https://www.futa.edu.ng/',
    institutionType: 'university',
    category: 'Federal',
    domains: ['futa.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'B.Eng. Mechanical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Business Administration',
        code: 'BA',
        programs: [
          {
            name: 'B.Sc. Business Administration',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Lagos State University',
    state: 'Lagos',
    city: 'Ojo',
    abbreviation: 'LASU',
    website: 'https://www.lasu.edu.ng/',
    institutionType: 'university',
    category: 'State',
    domains: ['lasu.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'B.Eng. Mechanical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Business Administration',
        code: 'BA',
        programs: [
          {
            name: 'B.Sc. Business Administration',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Bayero University Kano',
    state: 'Kano',
    city: 'Kano',
    abbreviation: 'BUK',
    website: 'https://www.buk.edu.ng/',
    institutionType: 'university',
    category: 'Federal',
    domains: ['buk.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'B.Eng. Mechanical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Business Administration',
        code: 'BA',
        programs: [
          {
            name: 'B.Sc. Business Administration',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Nigerian Defense Academy',
    state: 'Kaduna',
    city: 'Kaduna',
    abbreviation: 'NDA',
    website: 'https://www.nda.edu.ng/',
    institutionType: 'military',
    category: 'Federal',
    domains: ['nda.edu.ng'],
    departments: [
      {
        name: 'Military Science',
        code: 'MS',
        programs: [
          {
            name: 'B.Sc. Military Science',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Abubakar Tafawa Balewa University',
    state: 'Bauchi',
    city: 'Bauchi',
    abbreviation: 'ATBU',
    website: 'https://www.atbu.edu.ng/',
    institutionType: 'university',
    category: 'Federal',
    domains: ['atbu.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'B.Eng. Mechanical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
    ],
  },
  {
    name: 'University of Maiduguri',
    state: 'Borno',
    city: 'Maiduguri',
    abbreviation: 'UNIMAID',
    website: 'https://www.unimaid.edu.ng/',
    institutionType: 'university',
    category: 'Federal',
    domains: ['unimaid.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'B.Eng. Mechanical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
    ],
  },
  {
    name: 'University of Ado-Ekiti',
    state: 'Ekiti',
    city: 'Ado-Ekiti',
    abbreviation: 'UNAD',
    website: 'https://www.unad.edu.ng/',
    institutionType: 'university',
    category: 'State',
    domains: ['unad.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'B.Eng. Mechanical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Business Administration',
        code: 'BA',
        programs: [
          {
            name: 'B.Sc. Business Administration',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Ekiti State University',
    state: 'Ekiti',
    city: 'Ado-Ekiti',
    abbreviation: 'EKSU',
    website: 'https://www.eksu.edu.ng/',
    institutionType: 'university',
    category: 'State',
    domains: ['eksu.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'B.Eng. Mechanical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
    ],
  },
  {
    name: 'University of Delta',
    state: 'Delta',
    city: 'Agbor',
    abbreviation: 'UNIDEL',
    website: 'https://www.unidel.edu.ng/',
    institutionType: 'university',
    category: 'State',
    domains: ['unidel.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'B.Eng. Mechanical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Delta State University',
    state: 'Delta',
    city: 'Abraka',
    abbreviation: 'DELSU',
    website: 'https://www.delsu.edu.ng/',
    institutionType: 'university',
    category: 'State',
    domains: ['delsu.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'B.Eng. Mechanical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Federal University of Petroleum Resources',
    state: 'Delta',
    city: 'Effurun',
    abbreviation: 'FUPRE',
    website: 'https://www.fupre.edu.ng/',
    institutionType: 'university',
    category: 'Federal',
    domains: ['fupre.edu.ng'],
    departments: [
      {
        name: 'Petroleum Engineering',
        code: 'PE',
        programs: [
          {
            name: 'B.Eng. Petroleum Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Chemical Engineering',
        code: 'CHE',
        programs: [
          {
            name: 'B.Eng. Chemical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Niger Delta University',
    state: 'Bayelsa',
    city: 'Wilberforce Island',
    abbreviation: 'NDU',
    website: 'https://www.ndu.edu.ng/',
    institutionType: 'university',
    category: 'State',
    domains: ['ndu.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'B.Sc. Computer Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EEE',
        programs: [
          {
            name: 'B.Eng. Electrical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'B.Eng. Mechanical Engineering',
            type: 'Undergraduate',
            duration: '5 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Federal University of Agriculture, Abeokuta',
    state: 'Ogun',
    city: 'Abeokuta',
    abbreviation: 'FUNAAB',
    website: 'https://www.funaab.edu.ng/',
    institutionType: 'university',
    category: 'Federal',
    domains: ['funaab.edu.ng'],
    departments: [
      {
        name: 'Agricultural Economics',
        code: 'AE',
        programs: [
          {
            name: 'B.Sc. Agricultural Economics',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Animal Science',
        code: 'AS',
        programs: [
          {
            name: 'B.Sc. Animal Science',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
      {
        name: 'Crop Protection',
        code: 'CP',
        programs: [
          {
            name: 'B.Sc. Crop Protection',
            type: 'Undergraduate',
            duration: '4 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Federal Polytechnic, Ilaro',
    state: 'Ogun',
    city: 'Ilaro',
    abbreviation: 'FPI',
    website: 'https://fpi.edu.ng/',
    institutionType: 'polytechnic',
    category: 'Federal',
    domains: ['fpi.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'ND Computer Science',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Computer Science',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EE',
        programs: [
          {
            name: 'ND Electrical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Electrical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Rufus Giwa Polytechnic',
    state: 'Ondo',
    city: 'Owo',
    abbreviation: 'RUGIPO',
    website: 'https://rugipo.edu.ng/',
    institutionType: 'polytechnic',
    category: 'State',
    domains: ['rugipo.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'ND Computer Science',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Computer Science',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'ND Mechanical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Mechanical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EE',
        programs: [
          {
            name: 'ND Electrical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Electrical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Kaduna Polytechnic',
    state: 'Kaduna',
    city: 'Kaduna',
    abbreviation: 'KADPOLY',
    website: 'https://www.kadunapoly.edu.ng/',
    institutionType: 'polytechnic',
    category: 'Federal',
    domains: ['kadunapoly.edu.ng'],
    departments: [
      {
        name: 'Civil Engineering',
        code: 'CE',
        programs: [
          {
            name: 'ND Civil Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Civil Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'ND Computer Science',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Computer Science',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Abubakar Tafawa Balewa University Teaching Hospital Polytechnic',
    state: 'Bauchi',
    city: 'Bauchi',
    abbreviation: 'ATBUTH',
    website: 'https://atbuth.edu.ng/',
    institutionType: 'polytechnic',
    category: 'Federal',
    domains: ['atbuth.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'ND Computer Science',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Computer Science',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Health Technology',
        code: 'HT',
        programs: [
          {
            name: 'ND Health Technology',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Health Technology',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Ogun State Institute of Technology',
    state: 'Ogun',
    city: 'Ibogun',
    abbreviation: 'OGITECH',
    website: 'https://ogitech.edu.ng/',
    institutionType: 'polytechnic',
    category: 'State',
    domains: ['ogitech.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'ND Computer Science',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Computer Science',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'ND Mechanical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Mechanical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Benue State Polytechnic',
    state: 'Benue',
    city: 'Ugbokolo',
    abbreviation: 'BENPOLY',
    website: 'https://www.benpoly.edu.ng/',
    institutionType: 'polytechnic',
    category: 'State',
    domains: ['benpoly.edu.ng'],
    departments: [
      {
        name: 'Electrical Engineering',
        code: 'EE',
        programs: [
          {
            name: 'ND Electrical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Electrical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'ND Mechanical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Mechanical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Kogi State Polytechnic',
    state: 'Kogi',
    city: 'Lokoja',
    abbreviation: 'KSP',
    website: 'https://kogi.edu.ng/',
    institutionType: 'polytechnic',
    category: 'State',
    domains: ['kogi.edu.ng'],
    departments: [
      {
        name: 'Business Studies',
        code: 'BS',
        programs: [
          {
            name: 'ND Business Studies',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Business Studies',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Civil Engineering',
        code: 'CE',
        programs: [
          {
            name: 'ND Civil Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Civil Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Plateau State Polytechnic',
    state: 'Plateau',
    city: 'Barkin Ladi',
    abbreviation: 'PLAPOLY',
    website: 'https://www.plapoly.edu.ng/',
    institutionType: 'polytechnic',
    category: 'State',
    domains: ['plapoly.edu.ng'],
    departments: [
      {
        name: 'Hospitality Management',
        code: 'HM',
        programs: [
          {
            name: 'ND Hospitality Management',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Hospitality Management',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Tourism',
        code: 'TRM',
        programs: [
          {
            name: 'ND Tourism',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Tourism',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Lagos State Polytechnic',
    state: 'Lagos',
    city: 'Ikorodu',
    abbreviation: 'LASPOTECH',
    website: 'https://www.laspotech.edu.ng/',
    institutionType: 'polytechnic',
    category: 'State',
    domains: ['laspotech.edu.ng'],
    departments: [
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'ND Computer Science',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Computer Science',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'ND Mechanical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Mechanical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Enugu State Polytechnic',
    state: 'Enugu',
    city: 'Enugu',
    abbreviation: 'ESUT',
    website: 'https://www.esut.edu.ng/',
    institutionType: 'polytechnic',
    category: 'State',
    domains: ['esut.edu.ng'],
    departments: [
      {
        name: 'Electrical/Electronics Engineering',
        code: 'EE',
        programs: [
          {
            name: 'ND Electrical/Electronics Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Electrical/Electronics Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Civil Engineering',
        code: 'CE',
        programs: [
          {
            name: 'ND Civil Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Civil Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Oyo State College of Agriculture',
    state: 'Oyo',
    city: 'Igboora',
    abbreviation: 'OSCA',
    website: 'https://www.osca.edu.ng/',
    institutionType: 'polytechnic',
    category: 'State',
    domains: ['osca.edu.ng'],
    departments: [
      {
        name: 'Agricultural Engineering',
        code: 'AE',
        programs: [
          {
            name: 'ND Agricultural Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Agricultural Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Animal Science',
        code: 'AS',
        programs: [
          {
            name: 'ND Animal Science',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Animal Science',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Kwara State Polytechnic',
    state: 'Kwara',
    city: 'Ilorin',
    abbreviation: 'KWARAPOLY',
    website: 'https://www.kwarapoly.edu.ng/',
    institutionType: 'polytechnic',
    category: 'State',
    domains: ['kwarapoly.edu.ng'],
    departments: [
      {
        name: 'Electrical Engineering',
        code: 'EE',
        programs: [
          {
            name: 'ND Electrical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Electrical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'ND Mechanical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Mechanical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Federal Polytechnic, Offa',
    state: 'Kwara',
    city: 'Offa',
    abbreviation: 'OFFAPOLY',
    website: 'https://www.fpo.edu.ng/',
    institutionType: 'polytechnic',
    category: 'Federal',
    domains: ['fpo.edu.ng'],
    departments: [
      {
        name: 'Accountancy',
        code: 'AC',
        programs: [
          {
            name: 'ND Accountancy',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Accountancy',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Marketing',
        code: 'MK',
        programs: [
          {
            name: 'ND Marketing',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Marketing',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Abia State Polytechnic',
    state: 'Abia',
    city: 'Aba',
    abbreviation: 'ABIAPOLY',
    website: 'https://www.abiapoly.edu.ng/',
    institutionType: 'polytechnic',
    category: 'State',
    domains: ['abiapoly.edu.ng'],
    departments: [
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'ND Mechanical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Mechanical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EE',
        programs: [
          {
            name: 'ND Electrical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Electrical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Anambra State Polytechnic',
    state: 'Anambra',
    city: 'Mgbakwu',
    abbreviation: 'ANSPOLY',
    website: 'https://www.anspoly.edu.ng/',
    institutionType: 'polytechnic',
    category: 'State',
    domains: ['anspoly.edu.ng'],
    departments: [
      {
        name: 'Business Administration',
        code: 'BA',
        programs: [
          {
            name: 'ND Business Administration',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Business Administration',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Science Laboratory Technology',
        code: 'SLT',
        programs: [
          {
            name: 'ND Science Laboratory Technology',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Science Laboratory Technology',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Nigerian Army School of Military Engineering',
    state: 'Kogi',
    city: 'Lokoja',
    abbreviation: 'NASME',
    website: 'https://www.army.mil.ng/',
    institutionType: 'polytechnic',
    category: 'Military',
    domains: ['army.mil.ng'],
    departments: [
      {
        name: 'Civil Engineering',
        code: 'CE',
        programs: [
          {
            name: 'ND Civil Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Civil Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Ogun State Polytechnic',
    state: 'Ogun',
    city: 'Ijebu-Igbo',
    abbreviation: 'OGUNPOLY',
    website: 'https://www.ogunpoly.edu.ng/',
    institutionType: 'polytechnic',
    category: 'State',
    domains: ['ogunpoly.edu.ng'],
    departments: [
      {
        name: 'Electrical Engineering',
        code: 'EE',
        programs: [
          {
            name: 'ND Electrical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Electrical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'ND Mechanical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Mechanical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Delta State Polytechnic',
    state: 'Delta',
    city: 'Ogwashi-Uku',
    abbreviation: 'DELTAPOLY',
    website: 'https://www.deltapoly.edu.ng/',
    institutionType: 'polytechnic',
    category: 'State',
    domains: ['deltapoly.edu.ng'],
    departments: [
      {
        name: 'Agricultural Engineering',
        code: 'AE',
        programs: [
          {
            name: 'ND Agricultural Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Agricultural Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Business Administration',
        code: 'BA',
        programs: [
          {
            name: 'ND Business Administration',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Business Administration',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Imo State Polytechnic',
    state: 'Imo',
    city: 'Umuagwo',
    abbreviation: 'IMOPOLY',
    website: 'https://www.imopoly.edu.ng/',
    institutionType: 'polytechnic',
    category: 'State',
    domains: ['imopoly.edu.ng'],
    departments: [
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'ND Mechanical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Mechanical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Electrical Engineering',
        code: 'EE',
        programs: [
          {
            name: 'ND Electrical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Electrical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Ekiti State Polytechnic',
    state: 'Ekiti',
    city: 'Ado-Ekiti',
    abbreviation: 'EKITIPOLY',
    website: 'https://www.ekitipoly.edu.ng/',
    institutionType: 'polytechnic',
    category: 'State',
    domains: ['ekitipoly.edu.ng'],
    departments: [
      {
        name: 'Science Laboratory Technology',
        code: 'SLT',
        programs: [
          {
            name: 'ND Science Laboratory Technology',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Science Laboratory Technology',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Computer Science',
        code: 'CS',
        programs: [
          {
            name: 'ND Computer Science',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Computer Science',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Kogi State Polytechnic',
    state: 'Kogi',
    city: 'Lokoja',
    abbreviation: 'KOGIPOLY',
    website: 'https://www.kogipoly.edu.ng/',
    institutionType: 'polytechnic',
    category: 'State',
    domains: ['kogipoly.edu.ng'],
    departments: [
      {
        name: 'Public Administration',
        code: 'PA',
        programs: [
          {
            name: 'ND Public Administration',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Public Administration',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Business Administration',
        code: 'BA',
        programs: [
          {
            name: 'ND Business Administration',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Business Administration',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Abubakar Tatari Ali Polytechnic',
    state: 'Bauchi',
    city: 'Bauchi',
    abbreviation: 'ATAPOLY',
    website: 'https://www.atapoly.edu.ng/',
    institutionType: 'polytechnic',
    category: 'State',
    domains: ['atapoly.edu.ng'],
    departments: [
      {
        name: 'Civil Engineering',
        code: 'CE',
        programs: [
          {
            name: 'ND Civil Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Civil Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          {
            name: 'ND Mechanical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Mechanical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Auchi Polytechnic',
    state: 'Edo',
    city: 'Auchi',
    abbreviation: 'AUCHIPOLY',
    website: 'https://www.auchipoly.edu.ng/',
    institutionType: 'polytechnic',
    category: 'Federal',
    domains: ['auchipoly.edu.ng'],
    departments: [
      {
        name: 'Mass Communication',
        code: 'MC',
        programs: [
          {
            name: 'ND Mass Communication',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Public Relations',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Fine and Applied Arts',
        code: 'FAA',
        programs: [
          {
            name: 'ND Fine Arts',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Textile Design',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Osun State Polytechnic',
    state: 'Osun',
    city: 'Iree',
    abbreviation: 'OSUNPOLY',
    website: 'https://www.osunpoly.edu.ng/',
    institutionType: 'polytechnic',
    category: 'State',
    domains: ['osunpoly.edu.ng'],
    departments: [
      {
        name: 'Accountancy',
        code: 'ACCT',
        programs: [
          {
            name: 'ND Accountancy',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Accountancy',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Marketing',
        code: 'MKT',
        programs: [
          {
            name: 'ND Marketing',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Marketing',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Nasarawa State Polytechnic',
    state: 'Nasarawa',
    city: 'Lafia',
    abbreviation: 'NASPOLY',
    website: 'https://www.naspoly.edu.ng/',
    institutionType: 'polytechnic',
    category: 'State',
    domains: ['naspoly.edu.ng'],
    departments: [
      {
        name: 'Building Technology',
        code: 'BT',
        programs: [
          {
            name: 'ND Building Technology',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Building Technology',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Environmental Studies',
        code: 'ES',
        programs: [
          {
            name: 'ND Environmental Studies',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Environmental Studies',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Ramat Polytechnic',
    state: 'Borno',
    city: 'Maiduguri',
    abbreviation: 'RAMATPOLY',
    website: 'https://www.ramatpoly.edu.ng/',
    institutionType: 'polytechnic',
    category: 'State',
    domains: ['ramatpoly.edu.ng'],
    departments: [
      {
        name: 'Agricultural Engineering',
        code: 'AE',
        programs: [
          {
            name: 'ND Agricultural Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Agricultural Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Computer Engineering',
        code: 'CPE',
        programs: [
          {
            name: 'ND Computer Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Computer Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Federal College of Education, Abeokuta',
    state: 'Ogun',
    city: 'Abeokuta',
    abbreviation: 'FCEAbeokuta',
    website: 'https://fce-abeokuta.edu.ng/',
    institutionType: 'college_of_education',
    category: 'Federal',
    domains: ['fce-abeokuta.edu.ng'],
    departments: [
      {
        name: 'Science Education',
        code: 'SCI',
        programs: [
          {
            name: 'NCE Biology Education',
            type: 'Certificate',
            duration: '3 years',
          },
          {
            name: 'NCE Chemistry Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Arts Education',
        code: 'ARTS',
        programs: [
          {
            name: 'NCE English Education',
            type: 'Certificate',
            duration: '3 years',
          },
          {
            name: 'NCE History Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Vocational Education',
        code: 'VOC',
        programs: [
          {
            name: 'NCE Home Economics',
            type: 'Certificate',
            duration: '3 years',
          },
          {
            name: 'NCE Technical Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Primary Education',
        code: 'PRI',
        programs: [
          {
            name: 'NCE Primary Education Studies',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Federal College of Education (Technical), Gombe',
    state: 'Gombe',
    city: 'Gombe',
    abbreviation: 'FCETGombe',
    website: 'https://fcetgombe.edu.ng/',
    institutionType: 'college_of_education',
    category: 'Federal',
    domains: ['fcetgombe.edu.ng'],
    departments: [
      {
        name: 'Technical Education',
        code: 'TECH',
        programs: [
          {
            name: 'NCE Electrical/Electronic Technology',
            type: 'Certificate',
            duration: '3 years',
          },
          {
            name: 'NCE Woodwork Technology',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Science Education',
        code: 'SCI',
        programs: [
          {
            name: 'NCE Integrated Science Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Arts Education',
        code: 'ARTS',
        programs: [
          {
            name: 'NCE English Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Vocational Education',
        code: 'VOC',
        programs: [
          {
            name: 'NCE Business Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'College of Education, Warri',
    state: 'Delta',
    city: 'Warri',
    abbreviation: 'COEWarri',
    website: 'https://coewarri.edu.ng/',
    institutionType: 'college_of_education',
    category: 'State',
    domains: ['coewarri.edu.ng'],
    departments: [
      {
        name: 'Science Education',
        code: 'SCI',
        programs: [
          {
            name: 'NCE Biology Education',
            type: 'Certificate',
            duration: '3 years',
          },
          {
            name: 'NCE Physics Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Social Science Education',
        code: 'SOC',
        programs: [
          {
            name: 'NCE Economics Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Vocational Education',
        code: 'VOC',
        programs: [
          {
            name: 'NCE Home Economics',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Primary Education',
        code: 'PRI',
        programs: [
          {
            name: 'NCE Primary Education Studies',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Federal College of Education (Technical), Akoka',
    state: 'Lagos',
    city: 'Akoka',
    abbreviation: 'FCETAkoka',
    website: 'https://fcetakoka.edu.ng/',
    institutionType: 'college_of_education',
    category: 'Federal',
    domains: ['fcetakoka.edu.ng'],
    departments: [
      {
        name: 'Technical Education',
        code: 'TECH',
        programs: [
          {
            name: 'NCE Electrical Engineering Technology',
            type: 'Certificate',
            duration: '3 years',
          },
          {
            name: 'NCE Mechanical Engineering Technology',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Science Education',
        code: 'SCI',
        programs: [
          {
            name: 'NCE Computer Science Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Business Education',
        code: 'BUS',
        programs: [
          {
            name: 'NCE Office Technology Management',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Federal College of Education (Special), Oyo',
    state: 'Oyo',
    city: 'Oyo',
    abbreviation: 'FCESpecialOyo',
    website: 'https://fcesoyo.edu.ng/',
    institutionType: 'college_of_education',
    category: 'Federal',
    domains: ['fcesoyo.edu.ng'],
    departments: [
      {
        name: 'Special Education',
        code: 'SPED',
        programs: [
          {
            name: 'NCE Special Needs Education',
            type: 'Certificate',
            duration: '3 years',
          },
          {
            name: 'NCE Deaf Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Science Education',
        code: 'SCI',
        programs: [
          {
            name: 'NCE Biology Education',
            type: 'Certificate',
            duration: '3 years',
          },
          {
            name: 'NCE Physics Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Vocational Education',
        code: 'VOC',
        programs: [
          {
            name: 'NCE Home Economics',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'College of Education, Ikere-Ekiti',
    state: 'Ekiti',
    city: 'Ikere-Ekiti',
    abbreviation: 'COEIkere',
    website: 'https://coeikere.edu.ng/',
    institutionType: 'college_of_education',
    category: 'State',
    domains: ['coeikere.edu.ng'],
    departments: [
      {
        name: 'Arts Education',
        code: 'ARTS',
        programs: [
          {
            name: 'NCE Yoruba Education',
            type: 'Certificate',
            duration: '3 years',
          },
          {
            name: 'NCE English Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Primary Education',
        code: 'PRI',
        programs: [
          {
            name: 'NCE Primary Education Studies',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Science Education',
        code: 'SCI',
        programs: [
          {
            name: 'NCE Integrated Science',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Emmanuel Alayande College of Education, Oyo',
    state: 'Oyo',
    city: 'Oyo',
    abbreviation: 'EACOED',
    website: 'https://eacoed.edu.ng/',
    institutionType: 'college_of_education',
    category: 'State',
    domains: ['eacoed.edu.ng'],
    departments: [
      {
        name: 'Science Education',
        code: 'SCI',
        programs: [
          {
            name: 'NCE Mathematics Education',
            type: 'Certificate',
            duration: '3 years',
          },
          {
            name: 'NCE Chemistry Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Arts Education',
        code: 'ARTS',
        programs: [
          {
            name: 'NCE Music Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Social Science Education',
        code: 'SOC',
        programs: [
          {
            name: 'NCE Social Studies Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'College of Education, Minna',
    state: 'Niger',
    city: 'Minna',
    abbreviation: 'COEMinna',
    website: 'https://coeminna.edu.ng/',
    institutionType: 'college_of_education',
    category: 'State',
    domains: ['coeminna.edu.ng'],
    departments: [
      {
        name: 'Primary Education',
        code: 'PRI',
        programs: [
          {
            name: 'NCE Primary Education Studies',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Special Education',
        code: 'SPC',
        programs: [
          {
            name: 'NCE Special Needs Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'College of Education, Gindiri',
    state: 'Plateau',
    city: 'Gindiri',
    abbreviation: 'COEGindiri',
    website: 'https://coegindiri.edu.ng/',
    institutionType: 'college_of_education',
    category: 'State',
    domains: ['coegindiri.edu.ng'],
    departments: [
      {
        name: 'Arts and Social Sciences',
        code: 'ARTS',
        programs: [
          {
            name: 'NCE Christian Religious Studies',
            type: 'Certificate',
            duration: '3 years',
          },
          {
            name: 'NCE Social Studies Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Science Education',
        code: 'SCI',
        programs: [
          {
            name: 'NCE Biology Education',
            type: 'Certificate',
            duration: '3 years',
          },
          {
            name: 'NCE Chemistry Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Federal College of Education, Zaria',
    state: 'Kaduna',
    city: 'Zaria',
    abbreviation: 'FCEZaria',
    website: 'https://fcezaria.edu.ng/',
    institutionType: 'college_of_education',
    category: 'Federal',
    domains: ['fcezaria.edu.ng'],
    departments: [
      {
        name: 'Arts Education',
        code: 'ARTS',
        programs: [
          {
            name: 'NCE Arabic Education',
            type: 'Certificate',
            duration: '3 years',
          },
          {
            name: 'NCE English Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Science Education',
        code: 'SCI',
        programs: [
          {
            name: 'NCE Physics Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Vocational Education',
        code: 'VOC',
        programs: [
          {
            name: 'NCE Business Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: "Sa'adatu Rimi College of Education, Kano",
    state: 'Kano',
    city: 'Kano',
    abbreviation: 'SRCOEKano',
    website: 'https://srcoe.edu.ng/',
    institutionType: 'college_of_education',
    category: 'State',
    domains: ['srcoe.edu.ng'],
    departments: [
      {
        name: 'Vocational Education',
        code: 'VOC',
        programs: [
          {
            name: 'NCE Home Economics',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Science Education',
        code: 'SCI',
        programs: [
          {
            name: 'NCE Integrated Science',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Primary Education',
        code: 'PRI',
        programs: [
          {
            name: 'NCE Primary Education Studies',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Federal College of Education (Technical), Bichi',
    state: 'Kano',
    city: 'Bichi',
    abbreviation: 'FCETBichi',
    website: 'https://fcetbichi.edu.ng/',
    institutionType: 'college_of_education',
    category: 'Federal',
    domains: ['fcetbichi.edu.ng'],
    departments: [
      {
        name: 'Technical Education',
        code: 'TECH',
        programs: [
          {
            name: 'NCE Building Technology',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Science Education',
        code: 'SCI',
        programs: [
          {
            name: 'NCE Chemistry Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'College of Education, Ekiadolor',
    state: 'Edo',
    city: 'Ekiadolor',
    abbreviation: 'COEEkiadolor',
    website: 'https://coee.edu.ng/',
    institutionType: 'college_of_education',
    category: 'State',
    domains: ['coee.edu.ng'],
    departments: [
      {
        name: 'Arts Education',
        code: 'ARTS',
        programs: [
          {
            name: 'NCE History Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Science Education',
        code: 'SCI',
        programs: [
          {
            name: 'NCE Chemistry Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Primary Education',
        code: 'PRI',
        programs: [
          {
            name: 'NCE Primary Education Studies',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Nasarawa State College of Education, Akwanga',
    state: 'Nasarawa',
    city: 'Akwanga',
    abbreviation: 'COEAkwanga',
    website: 'https://coeakwanga.edu.ng/',
    institutionType: 'college_of_education',
    category: 'State',
    domains: ['coeakwanga.edu.ng'],
    departments: [
      {
        name: 'Arts and Social Sciences',
        code: 'ARTS',
        programs: [
          {
            name: 'NCE Economics Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Science Education',
        code: 'SCI',
        programs: [
          {
            name: 'NCE Mathematics Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Federal College of Education, Okene',
    state: 'Kogi',
    city: 'Okene',
    abbreviation: 'FCEOkene',
    website: 'https://fceokene.edu.ng/',
    institutionType: 'college_of_education',
    category: 'Federal',
    domains: ['fceokene.edu.ng'],
    departments: [
      {
        name: 'Arts Education',
        code: 'ARTS',
        programs: [
          {
            name: 'NCE English Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Technical Education',
        code: 'TECH',
        programs: [
          {
            name: 'NCE Electrical Technology',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Akwa Ibom State College of Education, Afaha Nsit',
    state: 'Akwa Ibom',
    city: 'Afaha Nsit',
    abbreviation: 'AKSCOE',
    website: 'https://akscoe.edu.ng/',
    institutionType: 'college_of_education',
    category: 'State',
    domains: ['akscoe.edu.ng'],
    departments: [
      {
        name: 'Vocational Education',
        code: 'VOC',
        programs: [
          {
            name: 'NCE Business Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Languages',
        code: 'LANG',
        programs: [
          {
            name: 'NCE Ibibio Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'College of Education, Gashua',
    state: 'Yobe',
    city: 'Gashua',
    abbreviation: 'COEGashua',
    website: 'https://coegashua.edu.ng/',
    institutionType: 'college_of_education',
    category: 'State',
    domains: ['coegashua.edu.ng'],
    departments: [
      {
        name: 'Science Education',
        code: 'SCI',
        programs: [
          {
            name: 'NCE Biology Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Arts Education',
        code: 'ARTS',
        programs: [
          {
            name: 'NCE History Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Federal College of Education, Pankshin',
    state: 'Plateau',
    city: 'Pankshin',
    abbreviation: 'FCEPankshin',
    website: 'https://fcepankshin.edu.ng/',
    institutionType: 'college_of_education',
    category: 'Federal',
    domains: ['fcepankshin.edu.ng'],
    departments: [
      {
        name: 'Science Education',
        code: 'SCI',
        programs: [
          {
            name: 'NCE Physics Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Arts Education',
        code: 'ARTS',
        programs: [
          {
            name: 'NCE Religious Studies Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Kashim Ibrahim College of Education, Maiduguri',
    state: 'Borno',
    city: 'Maiduguri',
    abbreviation: 'KICOE',
    website: 'https://kicoe.edu.ng/',
    institutionType: 'college_of_education',
    category: 'State',
    domains: ['kicoe.edu.ng'],
    departments: [
      {
        name: 'Languages',
        code: 'LANG',
        programs: [
          {
            name: 'NCE Kanuri Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Science Education',
        code: 'SCI',
        programs: [
          {
            name: 'NCE Physics Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Adeniran Ogunsanya College of Education, Otto-Ijanikin',
    state: 'Lagos',
    city: 'Otto-Ijanikin',
    abbreviation: 'AOCOED',
    website: 'https://aocoed.edu.ng/',
    institutionType: 'college_of_education',
    category: 'State',
    domains: ['aocoed.edu.ng'],
    departments: [
      {
        name: 'Social Sciences',
        code: 'SOC',
        programs: [
          {
            name: 'NCE Geography Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Education',
        code: 'EDU',
        programs: [
          {
            name: 'NCE Early Childhood Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'College of Education, Oju',
    state: 'Benue',
    city: 'Oju',
    abbreviation: 'COEOju',
    website: 'https://coeoju.edu.ng/',
    institutionType: 'college_of_education',
    category: 'State',
    domains: ['coeoju.edu.ng'],
    departments: [
      {
        name: 'Vocational Education',
        code: 'VOC',
        programs: [
          {
            name: 'NCE Home Economics',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Science',
        code: 'SCI',
        programs: [
          {
            name: 'NCE Integrated Science',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Federal College of Education (Technical), Umunze',
    state: 'Anambra',
    city: 'Umunze',
    abbreviation: 'FCETUmunze',
    website: 'https://fcetumunze.edu.ng/',
    institutionType: 'college_of_education',
    category: 'Federal',
    domains: ['fcetumunze.edu.ng'],
    departments: [
      {
        name: 'Technical Education',
        code: 'TECH',
        programs: [
          {
            name: 'NCE Automobile Technology',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Business Education',
        code: 'BUS',
        programs: [
          {
            name: 'NCE Secretarial Studies',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Isa Kaita College of Education, Dutsin-Ma',
    state: 'Katsina',
    city: 'Dutsin-Ma',
    abbreviation: 'IKCOE',
    website: 'https://ikcoe.edu.ng/',
    institutionType: 'college_of_education',
    category: 'State',
    domains: ['ikcoe.edu.ng'],
    departments: [
      {
        name: 'Languages',
        code: 'LANG',
        programs: [
          {
            name: 'NCE Hausa Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Arts',
        code: 'ART',
        programs: [
          {
            name: 'NCE Christian Religious Studies',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Kwara State College of Education, Ilorin',
    state: 'Kwara',
    city: 'Ilorin',
    abbreviation: 'KWCOE',
    website: 'https://kwcoeilorin.edu.ng/',
    institutionType: 'college_of_education',
    category: 'State',
    domains: ['kwcoeilorin.edu.ng'],
    departments: [
      {
        name: 'Social Sciences',
        code: 'SOC',
        programs: [
          {
            name: 'NCE Political Science Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Languages',
        code: 'LANG',
        programs: [
          {
            name: 'NCE Arabic Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Enugu State College of Education (Technical), Enugu',
    state: 'Enugu',
    city: 'Enugu',
    abbreviation: 'ESCET',
    website: 'https://escet.edu.ng/',
    institutionType: 'college_of_education',
    category: 'State',
    domains: ['escet.edu.ng'],
    departments: [
      {
        name: 'Science Education',
        code: 'SCI',
        programs: [
          {
            name: 'NCE Integrated Science Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Technical Education',
        code: 'TECH',
        programs: [
          {
            name: 'NCE Automobile Technology',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Federal College of Education, Katsina',
    state: 'Katsina',
    city: 'Katsina',
    abbreviation: 'FCEKatsina',
    website: 'https://fcekatsina.edu.ng/',
    institutionType: 'college_of_education',
    category: 'Federal',
    domains: ['fcekatsina.edu.ng'],
    departments: [
      {
        name: 'Languages',
        code: 'LANG',
        programs: [
          {
            name: 'NCE Hausa Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Social Sciences',
        code: 'SOC',
        programs: [
          {
            name: 'NCE Social Studies Education',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Federal College of Education (Technical), Omoku',
    state: 'Rivers',
    city: 'Omoku',
    abbreviation: 'FCETOmoku',
    website: 'https://fcetomoku.edu.ng/',
    institutionType: 'college_of_education',
    category: 'Federal',
    domains: ['fcetomoku.edu.ng'],
    departments: [
      {
        name: 'Vocational Education',
        code: 'VOC',
        programs: [
          {
            name: 'NCE Home Economics',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Technical Education',
        code: 'TECH',
        programs: [
          {
            name: 'NCE Woodwork Technology',
            type: 'Certificate',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Federal College of Animal Health and Production Technology',
    state: 'Oyo',
    city: 'Ibadan',
    abbreviation: 'FCAHPT',
    website: 'https://fcahptib.edu.ng/',
    institutionType: 'specialized_college',
    category: 'Federal',
    domains: ['fcahptib.edu.ng'],
    departments: [
      {
        name: 'Animal Health',
        code: 'AH',
        programs: [
          {
            name: 'ND Animal Health and Production',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Animal Health Technology',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Veterinary Laboratory Technology',
        code: 'VLT',
        programs: [
          {
            name: 'Certificate in Veterinary Laboratory Technology',
            type: 'Certificate',
            duration: '1 year',
          },
        ],
      },
    ],
  },
  {
    name: 'Federal College of Fisheries and Marine Technology',
    state: 'Lagos',
    city: 'Victoria Island',
    abbreviation: 'FCFMT',
    website: 'https://fcfmt.edu.ng/',
    institutionType: 'specialized_college',
    category: 'Federal',
    domains: ['fcfmt.edu.ng'],
    departments: [
      {
        name: 'Fisheries Technology',
        code: 'FT',
        programs: [
          {
            name: 'ND Fisheries Technology',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Fisheries Technology',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Nautical Science',
        code: 'NS',
        programs: [
          {
            name: 'ND Nautical Science',
            type: 'Diploma',
            duration: '3 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Federal College of Agriculture',
    state: 'Oyo',
    city: 'Ibadan',
    abbreviation: 'FCA',
    website: 'https://fcaib.edu.ng/',
    institutionType: 'specialized_college',
    category: 'Federal',
    domains: ['fcaib.edu.ng'],
    departments: [
      {
        name: 'Crop Production',
        code: 'CP',
        programs: [
          {
            name: 'ND Crop Production',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Soil Science',
        code: 'SS',
        programs: [
          {
            name: 'ND Soil Science',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'National Metallurgical Training Institute',
    state: 'Anambra',
    city: 'Onitsha',
    abbreviation: 'NMTI',
    website: 'https://nmti.gov.ng/',
    institutionType: 'specialized_college',
    category: 'Federal',
    domains: ['nmti.gov.ng'],
    departments: [
      {
        name: 'Metallurgy',
        code: 'MT',
        programs: [
          {
            name: 'Diploma in Metallurgical Engineering',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Welding Technology',
        code: 'WT',
        programs: [
          {
            name: 'Diploma in Welding Technology',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Petroleum Training Institute',
    state: 'Delta',
    city: 'Effurun',
    abbreviation: 'PTI',
    website: 'https://pti.edu.ng/',
    institutionType: 'specialized_college',
    category: 'Federal',
    domains: ['pti.edu.ng'],
    departments: [
      {
        name: 'Petroleum Engineering',
        code: 'PE',
        programs: [
          {
            name: 'ND Petroleum Engineering Technology',
            type: 'Diploma',
            duration: '2 years',
          },
          {
            name: 'HND Petroleum Engineering Technology',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
      {
        name: 'Gas Engineering',
        code: 'GE',
        programs: [
          {
            name: 'Diploma in Gas Engineering Technology',
            type: 'Diploma',
            duration: '2 years',
          },
        ],
      },
    ],
  },
  {
    name: 'Nigerian Army College of Nursing',
    state: 'Lagos',
    city: 'Yaba',
    abbreviation: 'NACN',
    website: 'https://nacn.ng/',
    institutionType: 'specialized_college',
    category: 'Federal',
    domains: ['nacn.ng'],
    departments: [
      {
        name: 'Nursing Science',
        code: 'NS',
        programs: [
          {
            name: 'Diploma in Nursing',
            type: 'Diploma',
            duration: '3 years',
          },
        ],
      },
      {
        name: 'Midwifery',
        code: 'MW',
        programs: [
          {
            name: 'Certificate in Midwifery',
            type: 'Certificate',
            duration: '1 year',
          },
        ],
      },
    ],
  },
]
export const getInstitutionsByType = (type, stateFilter = null) => {
  let institutions = nigerianInstitutions.filter(
    (inst) => inst.institutionType === type
  )

  if (stateFilter) {
    institutions = institutions.filter((inst) => inst.state === stateFilter)
  }

  return institutions
}

export const getUniqueStates = () => {
  return [...new Set(nigerianInstitutions.map((inst) => inst.state))].sort()
}

export const getAllInstitutions = (type = null) => {
  return type
    ? nigerianInstitutions.filter((inst) => inst.institutionType === type)
    : nigerianInstitutions
}
