export const CONTENT_PACK = {
  id: 'gapzero-demo-2026-01',
  name: 'GapZero Demonstration Pack',
  version: '1.0.0',
  status: 'DEMO',
  academicYear: 'Illustrative examples',
  source: 'Original GapZero sample questions',
  licence: 'Original demonstration content',
  lastChecked: '2026-11-05',
}

export const SUBJECTS_BY_PATH = {
  school: {
    'Class 6': ['Mathematics', 'Science', 'English', 'Social Science'],
    'Class 7': ['Mathematics', 'Science', 'English', 'Social Science'],
    'Class 8': ['Mathematics', 'Science', 'English', 'Social Science'],
    'Class 9': ['Mathematics', 'Science', 'English', 'Social Science'],
    'Class 10': ['Mathematics', 'Science', 'English', 'Social Science'],
    'Class 11': ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'],
    'Class 12': ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'],
  },
  JEE: ['Physics', 'Chemistry', 'Mathematics'],
  NEET: ['Physics', 'Chemistry', 'Biology'],
  CUET: ['English', 'General Test', 'Domain Subject'],
  Other: ['General Studies', 'Mathematics', 'Science'],
}

export const DEMO_QUESTIONS = [
  { id:'p11-001', classLevel:'Class 11', subject:'Physics', chapter:'Units & Measurements', topic:'SI base units', difficulty:'Easy', type:'single', time:1, prompt:'Which of the following is an SI base unit?', options:['Newton','Joule','Kelvin','Pascal'], answer:2, explanation:'Kelvin is one of the seven SI base units. Newton, joule and pascal are derived units.', hint:'Look for a unit that is not defined from other SI units.' },
  { id:'p11-002', classLevel:'Class 11', subject:'Physics', chapter:'Units & Measurements', topic:'Dimensional analysis', difficulty:'Medium', type:'single', time:2, prompt:'The dimensional formula of work is:', options:['[MLT⁻¹]','[ML²T⁻²]','[ML⁻¹T⁻²]','[M⁰L²T⁻¹]'], answer:1, explanation:'Work = force × displacement. Force has dimensions [MLT⁻²], so work has [ML²T⁻²].', hint:'Start with work = force × displacement.' },
  { id:'p11-003', classLevel:'Class 11', subject:'Physics', chapter:'Units & Measurements', topic:'Significant figures', difficulty:'Easy', type:'single', time:1, prompt:'How many significant figures are in 0.00450?', options:['2','3','4','5'], answer:1, explanation:'Leading zeros are not significant. The digits 4, 5 and the trailing zero after the decimal are significant: 3 figures.', hint:'Ignore zeros before the first non-zero digit.' },
  { id:'c11-001', classLevel:'Class 11', subject:'Chemistry', chapter:'Some Basic Concepts', topic:'Mole concept', difficulty:'Easy', type:'single', time:1, prompt:'One mole of any substance contains approximately:', options:['6.022 × 10²³ entities','3.0 × 10⁸ entities','9.8 entities','1.6 × 10⁻¹⁹ entities'], answer:0, explanation:'One mole contains Avogadro constant, approximately 6.022 × 10²³ specified entities.', hint:'Recall Avogadro constant and its power of ten.' },
  { id:'c11-002', classLevel:'Class 11', subject:'Chemistry', chapter:'Some Basic Concepts', topic:'Molar mass', difficulty:'Medium', type:'single', time:2, prompt:'What is the molar mass of H₂O? (H = 1, O = 16)', options:['16 g mol⁻¹','17 g mol⁻¹','18 g mol⁻¹','20 g mol⁻¹'], answer:2, explanation:'Molar mass = 2(1) + 16 = 18 g mol⁻¹.', hint:'Count two hydrogen atoms and one oxygen atom.' },
  { id:'m11-001', classLevel:'Class 11', subject:'Mathematics', chapter:'Sets', topic:'Intersection of sets', difficulty:'Easy', type:'single', time:1, prompt:'If A = {1, 2, 4} and B = {2, 3, 4}, then A ∩ B is:', options:['{1, 3}','{2, 4}','{1, 2, 3, 4}','∅'], answer:1, explanation:'Intersection contains elements common to both sets. Here, 2 and 4 appear in A as well as B.', hint:'Keep only the elements present in both sets.' },
  { id:'m11-002', classLevel:'Class 11', subject:'Mathematics', chapter:'Sets', topic:'Subset', difficulty:'Medium', type:'single', time:2, prompt:'A set containing n distinct elements has how many subsets?', options:['n²','2n','2ⁿ','n!'], answer:2, explanation:'Each element can either be included or excluded independently, giving 2 choices for each of n elements and 2ⁿ subsets.', hint:'Think of two independent choices for every element.' },
  { id:'p12-001', classLevel:'Class 12', subject:'Physics', chapter:'Electric Charges', topic:'Quantisation of charge', difficulty:'Easy', type:'single', time:1, prompt:'The charge on an isolated body is quantised in multiples of:', options:['A continuous fraction of e','The elementary charge e','Only 1 coulomb','The mass of an electron'], answer:1, explanation:'Charge q = ne, where n is an integer and e is the elementary charge magnitude.', hint:'Recall q = ne.' },
  { id:'c12-001', classLevel:'Class 12', subject:'Chemistry', chapter:'Chemical Kinetics', topic:'Rate of reaction', difficulty:'Medium', type:'single', time:2, prompt:'For a first-order reaction, the unit of the rate constant is:', options:['mol L⁻¹ s⁻¹','s⁻¹','L mol⁻¹ s⁻¹','mol² L⁻² s⁻¹'], answer:1, explanation:'For a first-order reaction, k has dimensions of inverse time, so its SI unit is s⁻¹.', hint:'Use the integrated first-order rate equation or dimensional form.' },
  { id:'m12-001', classLevel:'Class 12', subject:'Mathematics', chapter:'Continuity & Differentiability', topic:'Derivative', difficulty:'Easy', type:'single', time:1, prompt:'The derivative of x² with respect to x is:', options:['x','2x','x²','2'], answer:1, explanation:'Using the power rule d(xⁿ)/dx = nxⁿ⁻¹, d(x²)/dx = 2x.', hint:'Apply the power rule.' },
  { id:'b11-001', classLevel:'Class 11', subject:'Biology', chapter:'Cell: The Unit of Life', topic:'Cell organelles', difficulty:'Easy', type:'single', time:1, prompt:'Which organelle is primarily associated with ATP production in eukaryotic cells?', options:['Ribosome','Lysosome','Mitochondrion','Golgi apparatus'], answer:2, explanation:'Mitochondria are the main site of aerobic respiration and generate much of the cell’s ATP.', hint:'Think of the organelle commonly called the powerhouse of the cell.' },
  { id:'s06-m-001', classLevel:'Class 6', subject:'Mathematics', chapter:'Fractions', topic:'Adding fractions', difficulty:'Easy', type:'single', time:1, prompt:'What is 1/2 + 1/4?', options:['1/4','2/6','3/4','1'], answer:2, explanation:'Convert 1/2 to 2/4. Then 2/4 + 1/4 = 3/4.', hint:'Write both fractions with the same denominator.' },
  { id:'s06-s-001', classLevel:'Class 6', subject:'Science', chapter:'Components of Food', topic:'Vitamin deficiency', difficulty:'Easy', type:'single', time:1, prompt:'Deficiency of vitamin C can cause:', options:['Rickets','Scurvy','Night blindness','Goitre'], answer:1, explanation:'Vitamin C deficiency can cause scurvy, which may include bleeding gums and poor wound healing.', hint:'Think of the deficiency associated with bleeding gums.' },
  { id:'s07-m-001', classLevel:'Class 7', subject:'Mathematics', chapter:'Integers', topic:'Addition of integers', difficulty:'Easy', type:'single', time:1, prompt:'What is (-5) + 8?', options:['-13','-3','3','13'], answer:2, explanation:'Starting at -5 and moving 8 units to the right on the number line gives 3.', hint:'A larger positive number outweighs the negative magnitude here.' },
  { id:'s07-s-001', classLevel:'Class 7', subject:'Science', chapter:'Heat', topic:'Measuring temperature', difficulty:'Easy', type:'single', time:1, prompt:'Which instrument is used to measure temperature?', options:['Barometer','Thermometer','Ammeter','Dynamometer'], answer:1, explanation:'A thermometer measures temperature.', hint:'The instrument name contains the word “thermo”.' },
  { id:'s08-m-001', classLevel:'Class 8', subject:'Mathematics', chapter:'Squares and Square Roots', topic:'Square roots', difficulty:'Easy', type:'single', time:1, prompt:'What is the square root of 144?', options:['10','11','12','14'], answer:2, explanation:'12 × 12 = 144, so √144 = 12.', hint:'Find the number that gives 144 when multiplied by itself.' },
  { id:'s08-s-001', classLevel:'Class 8', subject:'Science', chapter:'Force and Pressure', topic:'SI unit of force', difficulty:'Easy', type:'single', time:1, prompt:'The SI unit of force is:', options:['Pascal','Joule','Newton','Watt'], answer:2, explanation:'The SI unit of force is the newton (N).', hint:'It is named after the scientist associated with laws of motion.' },
  { id:'s09-m-001', classLevel:'Class 9', subject:'Mathematics', chapter:'Number Systems', topic:'Irrational numbers', difficulty:'Easy', type:'single', time:1, prompt:'Which of the following is irrational?', options:['1/2','0.25','√2','4'], answer:2, explanation:'√2 cannot be expressed as a ratio of two integers; it is irrational.', hint:'Choose the number with a non-terminating, non-repeating decimal expansion.' },
  { id:'s09-s-001', classLevel:'Class 9', subject:'Science', chapter:'Motion', topic:'Speed formula', difficulty:'Easy', type:'single', time:1, prompt:'Average speed is calculated as:', options:['Time ÷ distance','Distance ÷ time','Distance × time','Displacement ÷ mass'], answer:1, explanation:'Average speed = total distance travelled ÷ total time taken.', hint:'How much distance is covered in each unit of time?' },
  { id:'s10-m-001', classLevel:'Class 10', subject:'Mathematics', chapter:'Quadratic Equations', topic:'Sum of roots', difficulty:'Easy', type:'single', time:1, prompt:'For x² - 5x + 6 = 0, the sum of the roots is:', options:['-6','-5','5','6'], answer:2, explanation:'For ax² + bx + c = 0, sum of roots = -b/a. Here it is -(-5)/1 = 5.', hint:'Use the coefficient relation -b/a.' },
  { id:'s10-s-001', classLevel:'Class 10', subject:'Science', chapter:'Chemical Reactions and Equations', topic:'Oxidation', difficulty:'Easy', type:'single', time:1, prompt:'Rusting of iron is an example of:', options:['Reduction only','Oxidation','Neutralisation','Sublimation'], answer:1, explanation:'Rusting involves iron reacting with oxygen and moisture; it is a corrosion process involving oxidation.', hint:'Think about iron combining with oxygen.' },
  { id:'b12-001', classLevel:'Class 12', subject:'Biology', chapter:'Molecular Basis of Inheritance', topic:'Gene expression', difficulty:'Easy', type:'single', time:1, prompt:'Which molecule carries the codons that are read during translation?', options:['mRNA','rRNA','tRNA','DNA polymerase'], answer:0, explanation:'Messenger RNA (mRNA) carries codons that are read by the ribosome during translation.', hint:'The messenger molecule carries the coded message from DNA.' },
]

export const CURRICULUM_DEMO = [
  { classLevel:'Class 6', subject:'Mathematics', chapter:'Fractions', topics:['Adding fractions'] },
  { classLevel:'Class 6', subject:'Science', chapter:'Components of Food', topics:['Vitamin deficiency'] },
  { classLevel:'Class 7', subject:'Mathematics', chapter:'Integers', topics:['Addition of integers'] },
  { classLevel:'Class 7', subject:'Science', chapter:'Heat', topics:['Measuring temperature'] },
  { classLevel:'Class 8', subject:'Mathematics', chapter:'Squares and Square Roots', topics:['Square roots'] },
  { classLevel:'Class 8', subject:'Science', chapter:'Force and Pressure', topics:['SI unit of force'] },
  { classLevel:'Class 9', subject:'Mathematics', chapter:'Number Systems', topics:['Irrational numbers'] },
  { classLevel:'Class 9', subject:'Science', chapter:'Motion', topics:['Speed formula'] },
  { classLevel:'Class 10', subject:'Mathematics', chapter:'Quadratic Equations', topics:['Sum of roots'] },
  { classLevel:'Class 10', subject:'Science', chapter:'Chemical Reactions and Equations', topics:['Oxidation'] },
  { classLevel:'Class 11', subject:'Physics', chapter:'Units & Measurements', topics:['SI base units','Dimensional analysis','Significant figures'] },
  { classLevel:'Class 11', subject:'Chemistry', chapter:'Some Basic Concepts', topics:['Mole concept','Molar mass'] },
  { classLevel:'Class 11', subject:'Mathematics', chapter:'Sets', topics:['Intersection of sets','Subset'] },
  { classLevel:'Class 11', subject:'Biology', chapter:'Cell: The Unit of Life', topics:['Cell organelles'] },
  { classLevel:'Class 12', subject:'Physics', chapter:'Electric Charges', topics:['Quantisation of charge'] },
  { classLevel:'Class 12', subject:'Chemistry', chapter:'Chemical Kinetics', topics:['Rate of reaction'] },
  { classLevel:'Class 12', subject:'Mathematics', chapter:'Continuity & Differentiability', topics:['Derivative'] },
]

export const MISTAKE_TYPES = ['Concept', 'Calculation', 'Formula', 'Misread', 'Silly error', 'Guess', 'Time issue']
export const REVISION_INTERVALS = [1, 3, 7, 14, 30]
