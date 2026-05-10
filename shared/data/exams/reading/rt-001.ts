import type { ReadingExam } from './types';

/**
 * IELTS Academic Reading Test 1
 *
 * Part 1 — Marie Curie: Pioneer of Radioactivity     Q1–13
 *   Group 1: True / False / Not Given                Q1–7
 *   Group 2: Sentence Completion (≤2 words)          Q8–13
 *
 * Part 2 — The Rise of Remote Work                   Q14–26
 *   Group 1: Multiple Choice                         Q14–20
 *   Group 2: Short Answer (≤3 words)                 Q21–26
 *
 * Part 3 — Biodiversity and Ecosystem Services       Q27–40
 *   Group 1: Yes / No / Not Given                    Q27–33
 *   Group 2: Matching Headings                       Q34–40
 */
const rt001: ReadingExam = {
  id: 'rt-001',
  title: 'IELTS Academic Reading Test 1',
  description: 'A full-length IELTS Academic Reading test with three passages and 40 questions.',
  durationMins: 60,
  totalQuestions: 40,

  parts: [
    // ────────────────────────────────────────────────────────────────────────
    // PART 1
    // ────────────────────────────────────────────────────────────────────────
    {
      partNumber: 1,
      questionRange: { from: 1, to: 13 },

      passage: {
        title: 'Marie Curie: Pioneer of Radioactivity',
        paragraphs: [
          {
            text: 'Marie Skłodowska Curie was born on 7 November 1867 in Warsaw, in the Kingdom of Poland, which was then part of the Russian Empire. Growing up in difficult circumstances, she showed exceptional intellectual ability from an early age. Denied access to higher education in Poland due to her gender, she made a pact with her older sister Bronia: Marie would support Bronia\'s medical studies in Paris, and Bronia would in turn finance Marie\'s education. In 1891, at the age of 24, Marie finally moved to Paris to study at the Sorbonne, becoming one of a very small number of women enrolled there at the time.',
          },
          {
            text: 'In Paris, Marie excelled in mathematics and physics, graduating first in her physics degree in 1893. She met Pierre Curie in 1894 — a physicist who shared her passion for science — and they married in 1895. Together, they began investigating the mysterious rays emitted by uranium, a phenomenon first noted by Henri Becquerel in 1896. It was Marie who coined the term \'radioactivity\' to describe this property of emitting rays.',
          },
          {
            text: 'Working in a converted shed with minimal equipment, Marie and Pierre conducted a systematic investigation of radioactive materials. In 1898, their research led to the discovery of two new elements. The first, which Marie named polonium after her homeland Poland, was announced in July 1898. The second, radium, was announced in December of the same year. Isolating radium required processing enormous quantities of pitchblende ore — a tedious and physically demanding task that took several years.',
          },
          {
            text: 'In 1903, Marie and Pierre Curie, together with Henri Becquerel, were awarded the Nobel Prize in Physics for their research into radioactivity. Marie became the first woman ever to receive a Nobel Prize. After Pierre\'s tragic death in a road accident in 1906, Marie took over his professorship at the Sorbonne, becoming its first female professor. In 1911, she received a second Nobel Prize, this time in Chemistry, for her discovery of radium and polonium — making her the first person to win Nobel Prizes in two different sciences.',
          },
          {
            text: 'During the First World War, Marie recognised the potential of X-rays in medicine and developed mobile radiography units, known as \'petites Curies\'. Together with her daughter Irène, she trained 150 women as radiographers and personally operated these units near the front lines. It is estimated that over one million wounded soldiers were X-rayed using these mobile units during the conflict.',
          },
          {
            text: 'One of Marie Curie\'s outstanding achievements was her understanding of the need to accumulate intense radioactive sources, not only for the treatment of illness but also to maintain an abundant supply for research. The existence in Paris at the Radium Institute of a stock of 1.5 grams of radium made a decisive contribution to the success of experiments undertaken in the years around 1930 — including the discovery of the neutron by Sir James Chadwick and the discovery of artificial radioactivity in 1934 by Irène and Frédéric Joliot-Curie.',
          },
          {
            text: 'A few months after the discovery of artificial radioactivity, Marie Curie died as a result of aplastic anaemia caused by prolonged exposure to radiation. She had always carried test tubes containing radioactive isotopes in her pocket and stored them in her desk drawer, remarking on the pretty blue-green light they gave off. Despite the health risks now known to be associated with radiation, Curie herself never acknowledged the dangers, believing the work was too important to stop. Her notebooks from the 1890s remain so highly radioactive that they are kept in lead-lined boxes.',
          },
        ],
      },

      questionGroups: [
        {
          type: 'true-false-not-given',
          instruction:
            'Do the following statements agree with the information given in Reading Passage 1? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, or NOT GIVEN if there is no information on this.',
          questionRange: { from: 1, to: 7 },
          questions: [
            { type: 'true-false-not-given', number: 1, text: 'Marie Curie was the first woman ever to study at the Sorbonne in Paris.', answer: 'FALSE' },
            { type: 'true-false-not-given', number: 2, text: 'The word "radioactivity" was first used by Marie Curie.', answer: 'TRUE' },
            { type: 'true-false-not-given', number: 3, text: 'Marie and Pierre Curie conducted their research in purpose-built laboratory facilities.', answer: 'FALSE' },
            { type: 'true-false-not-given', number: 4, text: 'The element polonium was named after Marie Curie\'s country of origin.', answer: 'TRUE' },
            { type: 'true-false-not-given', number: 5, text: 'Marie Curie shared the 1903 Nobel Prize in Physics with Pierre Curie and Henri Becquerel.', answer: 'TRUE' },
            { type: 'true-false-not-given', number: 6, text: 'Marie Curie acknowledged the health dangers of radioactive materials and took precautions to protect herself.', answer: 'FALSE' },
            { type: 'true-false-not-given', number: 7, text: 'The French government has established a dedicated museum in Paris to honour Marie Curie\'s achievements.', answer: 'NOT GIVEN' },
          ],
        },
        {
          type: 'sentence-completion',
          instruction:
            'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
          questionRange: { from: 8, to: 13 },
          questions: [
            { type: 'sentence-completion', number: 8, beforeBlank: 'During the First World War, Marie and Irène Curie trained women as', afterBlank: 'to operate mobile radiography units.', answer: 'radiographers', wordLimit: 2 },
            { type: 'sentence-completion', number: 9, beforeBlank: 'The radioactive material held at the Radium Institute in Paris contributed to Sir James Chadwick\'s discovery of', afterBlank: '.', answer: 'the neutron', wordLimit: 2 },
            { type: 'sentence-completion', number: 10, beforeBlank: 'In 1911, Marie Curie received her second Nobel Prize for the discovery of radium and', afterBlank: '.', answer: 'polonium', wordLimit: 2 },
            { type: 'sentence-completion', number: 11, beforeBlank: 'The mobile radiography units developed by Marie Curie were used to X-ray', afterBlank: 'during the First World War.', answer: 'wounded soldiers', wordLimit: 2 },
            { type: 'sentence-completion', number: 12, beforeBlank: 'Marie Curie believed that accumulating radioactive sources was important both for research and for the', afterBlank: 'of illness.', answer: 'treatment', wordLimit: 2 },
            { type: 'sentence-completion', number: 13, beforeBlank: 'Marie Curie died from', afterBlank: 'caused by prolonged exposure to radiation.', answer: 'aplastic anaemia', wordLimit: 2 },
          ],
        },
      ],
    },

    // ────────────────────────────────────────────────────────────────────────
    // PART 2
    // ────────────────────────────────────────────────────────────────────────
    {
      partNumber: 2,
      questionRange: { from: 14, to: 26 },

      passage: {
        title: 'The Rise of Remote Work',
        paragraphs: [
          {
            text: 'The COVID-19 pandemic forced an unprecedented experiment in remote working. Almost overnight, millions of employees worldwide shifted from offices to home environments, and organisations discovered that productivity often remained stable or even improved. What began as an emergency measure has evolved into a permanent restructuring of the modern workplace.',
          },
          {
            text: 'Research conducted by Stanford University economist Nicholas Bloom found that employees working from home were 13% more productive than their office-based counterparts. The study attributed this to fewer breaks and sick days, a quieter working environment, and the elimination of commuting time. Workers reported higher job satisfaction and lower stress levels, and staff turnover at the company studied dropped by 50%.',
          },
          {
            text: 'However, remote working is not without its challenges. Social isolation has emerged as a significant concern, with many remote workers reporting feelings of loneliness and disconnection from colleagues. The absence of informal interactions — the chance conversations in corridors or around the coffee machine — can hinder creativity and collaboration. Research suggests that truly innovative ideas are more likely to emerge from spontaneous face-to-face exchanges than from scheduled video calls.',
          },
          {
            text: 'The impact on urban environments has been substantial. Traditional office districts in major cities have seen decreased footfall, affecting local businesses that depended on commuters. Meanwhile, demand for housing in suburban and rural areas has surged as workers, freed from the need to commute daily, seek larger homes with dedicated office space. This demographic shift has wide implications for urban planning, public transport, and local service provision.',
          },
          {
            text: 'Technology has been central to enabling remote work. Cloud computing services enabled employees to access work systems from anywhere, while project management tools helped teams coordinate across time zones. Cybersecurity, however, emerged as a major concern: home networks are typically less secure than corporate infrastructure, creating vulnerabilities that cybercriminals have been quick to exploit.',
          },
          {
            text: 'Looking ahead, many organisations are adopting hybrid working models that combine the flexibility of remote work with the collaborative benefits of office presence. In a recent survey of global companies, 74% indicated plans to make a hybrid working approach permanent. This arrangement offers employees greater autonomy over how and where they work, while ensuring regular in-person contact to maintain team cohesion and company culture.',
          },
        ],
      },

      questionGroups: [
        {
          type: 'multiple-choice',
          instruction:
            'Choose the correct letter, A, B, C or D.',
          questionRange: { from: 14, to: 20 },
          questions: [
            {
              type: 'multiple-choice',
              number: 14,
              text: 'According to the Stanford University study, why were home workers more productive?',
              options: [
                { letter: 'A', text: 'They worked significantly longer hours.' },
                { letter: 'B', text: 'They had fewer absences and less noise distraction.' },
                { letter: 'C', text: 'They were given more challenging tasks to complete.' },
                { letter: 'D', text: 'They communicated more frequently with managers.' },
              ],
              answer: 'B',
            },
            {
              type: 'multiple-choice',
              number: 15,
              text: 'What does the passage suggest about informal workplace interactions?',
              options: [
                { letter: 'A', text: 'They reduce overall productivity.' },
                { letter: 'B', text: 'They are easily replicated through video calls.' },
                { letter: 'C', text: 'They can encourage creative and innovative thinking.' },
                { letter: 'D', text: 'They are valued mainly by younger employees.' },
              ],
              answer: 'C',
            },
            {
              type: 'multiple-choice',
              number: 16,
              text: 'What effect has remote working had on city centres?',
              options: [
                { letter: 'A', text: 'It has led to an increase in office construction.' },
                { letter: 'B', text: 'It has reduced the number of customers for local businesses.' },
                { letter: 'C', text: 'It has improved public transport networks.' },
                { letter: 'D', text: 'It has caused a rise in city centre property prices.' },
              ],
              answer: 'B',
            },
            {
              type: 'multiple-choice',
              number: 17,
              text: 'Which of the following is described as a major concern associated with remote working?',
              options: [
                { letter: 'A', text: 'The high cost of home office equipment.' },
                { letter: 'B', text: 'Reduced internet connection speeds.' },
                { letter: 'C', text: 'Security risks posed by home internet networks.' },
                { letter: 'D', text: 'The difficulty of tracking employee working hours.' },
              ],
              answer: 'C',
            },
            {
              type: 'multiple-choice',
              number: 18,
              text: 'Why are workers choosing to move to suburban or rural areas?',
              options: [
                { letter: 'A', text: 'Property prices are significantly lower there.' },
                { letter: 'B', text: 'Government incentives encourage this move.' },
                { letter: 'C', text: 'They can find homes with more space for working.' },
                { letter: 'D', text: 'Better digital infrastructure is available outside cities.' },
              ],
              answer: 'C',
            },
            {
              type: 'multiple-choice',
              number: 19,
              text: 'What did a recent survey of global companies reveal about the future of working?',
              options: [
                { letter: 'A', text: 'Most companies will require staff to return to offices full-time.' },
                { letter: 'B', text: 'The majority plan to permanently combine remote and office work.' },
                { letter: 'C', text: 'Few companies are making permanent changes to working arrangements.' },
                { letter: 'D', text: 'Companies are planning to reduce their office space significantly.' },
              ],
              answer: 'B',
            },
            {
              type: 'multiple-choice',
              number: 20,
              text: 'According to the passage, what benefit did employees experience from working remotely?',
              options: [
                { letter: 'A', text: 'Access to more advanced technology.' },
                { letter: 'B', text: 'Lower levels of workplace stress.' },
                { letter: 'C', text: 'Higher salaries and bonuses.' },
                { letter: 'D', text: 'Greater access to training programmes.' },
              ],
              answer: 'B',
            },
          ],
        },
        {
          type: 'short-answer',
          instruction:
            'Answer the questions below. Choose NO MORE THAN THREE WORDS AND/OR A NUMBER from the passage for each answer.',
          questionRange: { from: 21, to: 26 },
          questions: [
            { type: 'short-answer', number: 21, text: 'By what percentage were home workers found to be more productive than office workers?', answer: '13%', wordLimit: 3 },
            { type: 'short-answer', number: 22, text: 'By how much did staff turnover fall at the company studied in the Stanford research?', answer: '50%', wordLimit: 3 },
            { type: 'short-answer', number: 23, text: 'What type of computing technology allowed employees to access work systems from any location?', answer: 'cloud computing', wordLimit: 3 },
            { type: 'short-answer', number: 24, text: 'What name is given to the working arrangement that combines both remote and office-based work?', answer: 'hybrid working', wordLimit: 3 },
            { type: 'short-answer', number: 25, text: 'What percentage of global companies surveyed said they planned to make hybrid working permanently?', answer: '74%', wordLimit: 3 },
            { type: 'short-answer', number: 26, text: 'What type of networks do cybercriminals target in the context of remote working?', answer: 'home networks', wordLimit: 3 },
          ],
        },
      ],
    },

    // ────────────────────────────────────────────────────────────────────────
    // PART 3
    // ────────────────────────────────────────────────────────────────────────
    {
      partNumber: 3,
      questionRange: { from: 27, to: 40 },

      passage: {
        title: 'Biodiversity and Ecosystem Services',
        subtitle: 'The hidden economy of the natural world',
        paragraphs: [
          {
            label: 'A',
            text: 'The term "biodiversity" refers to the variety of life on Earth at all its levels, from genes to ecosystems, encompassing the diversity within species, between species, and of ecosystems themselves. Scientists estimate that there are approximately 8.7 million species on Earth, of which only around 1.2 million have been formally identified and described. This figure suggests that the vast majority of life on our planet remains unknown to science.',
          },
          {
            label: 'B',
            text: 'Biodiversity provides what ecologists call "ecosystem services" — the wide range of benefits that humans receive from the natural world. These are grouped into four categories: provisioning services (food, fresh water, timber, and medicinal resources); regulating services (climate regulation, flood control, disease suppression, and water purification); cultural services (recreation, spiritual fulfilment, and tourism); and support services (nutrient cycling, soil formation, and photosynthesis), which underlie all the other categories.',
          },
          {
            label: 'C',
            text: 'The economic value of ecosystem services is immense, yet has historically been neglected in conventional economic accounting. A landmark study published in the journal Nature estimated the total value of global ecosystem services at $33 trillion per year — a figure that exceeded the entire global GDP at the time. Despite this extraordinary value, ecosystems continue to be degraded at unprecedented rates as forests are cleared, wetlands are drained, and coral reefs are bleached by rising ocean temperatures.',
          },
          {
            label: 'D',
            text: 'Current rates of species extinction are estimated to be between 1,000 and 10,000 times higher than natural background rates, leading scientists to declare that the Earth is experiencing its sixth mass extinction event. Unlike previous extinctions caused by natural phenomena such as volcanic eruptions or asteroid impacts, this one is occurring with extraordinary speed, and many species are disappearing before they can even be discovered or catalogued.',
          },
          {
            label: 'E',
            text: 'The current biodiversity crisis is primarily driven by human activities. Habitat destruction — particularly the conversion of forests and wetlands to agricultural land — remains the leading cause of species loss. This is compounded by the overexploitation of wild populations, pollution from industrial and agricultural sources, the introduction of invasive alien species, and climate change, which is altering temperature and precipitation patterns in ways that many species cannot adapt to quickly enough.',
          },
          {
            label: 'F',
            text: 'There is growing recognition that preserving biodiversity is not merely an ethical obligation but an economic and practical necessity. Conservation strategies have evolved from simply designating protected areas to more holistic approaches: involving local communities, integrating biodiversity into land use planning, and creating financial incentives through payments for ecosystem services (PES) schemes. Countries are also beginning to incorporate "natural capital" accounting into national economic frameworks, attempting to quantify the value of natural assets.',
          },
          {
            label: 'G',
            text: 'The scientific community cautions, however, that even well-designed conservation measures cannot fully compensate for the fundamental driver of biodiversity loss: an economic system that treats natural capital as a free and inexhaustible resource. Meaningful progress requires a fundamental shift in how societies value nature — not as a commodity to be exploited indefinitely, but as the foundation upon which all human prosperity ultimately depends.',
          },
        ],
      },

      questionGroups: [
        {
          type: 'yes-no-not-given',
          instruction:
            'Do the following statements agree with the claims of the writer in Reading Passage 3? Write YES if the statement agrees with the claims of the writer, NO if the statement contradicts the claims of the writer, or NOT GIVEN if it is impossible to say what the writer thinks about this.',
          questionRange: { from: 27, to: 33 },
          questions: [
            { type: 'yes-no-not-given', number: 27, text: 'The number of species so far identified by scientists represents only a small proportion of all species believed to exist.', answer: 'YES' },
            { type: 'yes-no-not-given', number: 28, text: 'Provisioning services are considered more economically valuable than regulating services.', answer: 'NOT GIVEN' },
            { type: 'yes-no-not-given', number: 29, text: 'The Nature study estimated that the value of ecosystem services was greater than the total global economic output at that time.', answer: 'YES' },
            { type: 'yes-no-not-given', number: 30, text: 'The contribution of ecosystem services has consistently been recognised in mainstream economic calculations.', answer: 'NO' },
            { type: 'yes-no-not-given', number: 31, text: 'The current mass extinction event is primarily the result of natural geological processes.', answer: 'NO' },
            { type: 'yes-no-not-given', number: 32, text: 'Payments for ecosystem services (PES) schemes provide financial rewards to encourage conservation.', answer: 'YES' },
            { type: 'yes-no-not-given', number: 33, text: 'Most scientists believe that conservation programmes alone are sufficient to halt biodiversity loss.', answer: 'NO' },
          ],
        },
        {
          type: 'matching-headings',
          instruction:
            'Reading Passage 3 has seven paragraphs, A–G. Choose the correct heading for each paragraph from the list of headings below.',
          questionRange: { from: 34, to: 40 },
          headingOptions: [
            { label: 'i', text: 'The monetary worth of the natural world' },
            { label: 'ii', text: 'Classifying the benefits provided by nature' },
            { label: 'iii', text: 'Why mainstream economics undervalues the environment' },
            { label: 'iv', text: 'Defining biodiversity and its scope' },
            { label: 'v', text: 'Evolving strategies to protect ecosystems' },
            { label: 'vi', text: 'A crisis driven by human behaviour' },
            { label: 'vii', text: 'The alarming scale of species loss' },
            { label: 'viii', text: 'Comparing historical and modern extinction events' },
            { label: 'ix', text: 'Towards a new relationship between economics and nature' },
          ],
          questions: [
            { type: 'matching-headings', number: 34, paragraphLabel: 'A', answer: 'iv' },
            { type: 'matching-headings', number: 35, paragraphLabel: 'B', answer: 'ii' },
            { type: 'matching-headings', number: 36, paragraphLabel: 'C', answer: 'i' },
            { type: 'matching-headings', number: 37, paragraphLabel: 'D', answer: 'vii' },
            { type: 'matching-headings', number: 38, paragraphLabel: 'E', answer: 'vi' },
            { type: 'matching-headings', number: 39, paragraphLabel: 'F', answer: 'v' },
            { type: 'matching-headings', number: 40, paragraphLabel: 'G', answer: 'ix' },
          ],
        },
      ],
    },
  ],
};

export default rt001;
