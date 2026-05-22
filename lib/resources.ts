export type Resource = {
  title: string;
  description: string;
  link: string;
  type: 'article' | 'video' | 'helpline' | 'exercise';
};

export type ResourceCategory = {
  id: string;
  label: string;
  emoji: string;
  color: string;
  textColor: string;
  resources: Resource[];
};

export const resourceCategories: ResourceCategory[] = [
  {
    id: 'crisis',
    label: 'Crisis & Emergency',
    emoji: '🆘',
    color: '#fff0f0',
    textColor: '#c0392b',
    resources: [
      {
        title: 'Mentally Aware Nigeria Initiative (MANI)',
        description: 'Free 24/7 mental health helpline for Nigerians. Call 0800-1000-6464 anytime you need to talk to someone.',
        link: 'https://en.wikipedia.org/wiki/Mental_health_in_Nigeria',
        type: 'helpline',
      },
      {
        title: 'WHO Mental Health Support',
        description: 'World Health Organization mental health resources and crisis support information for Africa.',
        link: 'https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response',
        type: 'helpline',
      },
      {
        title: 'Crisis Support — What To Do',
        description: 'If you are in crisis, learn what steps to take immediately and how to reach help near you.',
        link: 'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/anxiety-fear-panic/',
        type: 'helpline',
      },
    ],
  },
  {
    id: 'anxiety',
    label: 'Anxiety & Stress',
    emoji: '😰',
    color: '#f0f4ff',
    textColor: '#2c5282',
    resources: [
      {
        title: 'Understanding Anxiety as a Student',
        description: 'Learn what anxiety is, why it happens during exam periods, and how to manage it effectively.',
        link: 'https://www.mind.org.uk/information-support/types-of-mental-health-problems/anxiety-and-panic-attacks/about-anxiety/',
        type: 'article',
      },
      {
        title: 'Breathing Exercises for Stress Relief',
        description: 'A guided breathing technique you can do anywhere — before exams, in hostels, or between lectures.',
        link: 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/',
        type: 'exercise',
      },
      {
        title: 'Tips to Reduce Anxiety',
        description: 'Practical strategies for dealing with anxiety and the unique pressures of university life.',
        link: 'https://www.verywellmind.com/tips-to-reduce-anxiety-2584047',
        type: 'article',
      },
    ],
  },
  {
    id: 'depression',
    label: 'Depression & Low Mood',
    emoji: '💙',
    color: '#f0f7f4',
    textColor: '#2d6a4f',
    resources: [
      {
        title: 'Recognising Depression in University Students',
        description: 'Signs to watch for in yourself and your friends. Early recognition can make a big difference.',
        link: 'https://www.mind.org.uk/information-support/types-of-mental-health-problems/depression/about-depression/',
        type: 'article',
      },
      {
        title: 'Depression Overview — NHS',
        description: 'How to tell the difference between feeling down and clinical depression, and what steps to take.',
        link: 'https://www.nhs.uk/mental-health/conditions/depression-in-adults/overview/',
        type: 'article',
      },
      {
        title: 'How to Improve Your Mood',
        description: 'Simple evidence-based activities that genuinely help lift your mood — even on your worst days.',
        link: 'https://www.verywellmind.com/how-to-improve-your-mood-4175453',
        type: 'exercise',
      },
    ],
  },
  {
    id: 'campus',
    label: 'Campus Life & Pressure',
    emoji: '🎓',
    color: '#fef9f0',
    textColor: '#b8860b',
    resources: [
      {
        title: 'Student Mental Health Guide',
        description: 'Specific advice for students dealing with FYP pressure, job hunting, and academic stress.',
        link: 'https://www.verywellmind.com/mental-health-tips-for-college-students-5194347',
        type: 'article',
      },
      {
        title: 'Dealing with Family Pressure',
        description: 'How to manage expectations from family while taking care of your own mental health.',
        link: 'https://www.verywellmind.com/how-to-deal-with-family-stress-3144726',
        type: 'article',
      },
      {
        title: 'Financial Stress and Mental Health',
        description: 'Practical tips for managing the mental toll of financial pressure as a student.',
        link: 'https://www.mind.org.uk/information-support/tips-for-everyday-living/money-and-mental-health/about-money-and-mental-health/',
        type: 'article',
      },
    ],
  },
  {
    id: 'selfcare',
    label: 'Self-Care & Wellness',
    emoji: '🌿',
    color: '#f5f0ff',
    textColor: '#553c9a',
    resources: [
      {
        title: 'Building a Self-Care Routine',
        description: 'How to take care of your mental health daily — even with a packed lecture schedule.',
        link: 'https://www.mind.org.uk/information-support/tips-for-everyday-living/wellbeing/wellbeing/',
        type: 'article',
      },
      {
        title: 'Sleep and Mental Health',
        description: 'Why sleep matters for your mental health and how to improve your sleep as a student.',
        link: 'https://www.sleepfoundation.org/mental-health',
        type: 'article',
      },
      {
        title: 'Mindfulness for Beginners — NHS',
        description: 'A simple introduction to mindfulness meditation — no experience needed, just 5 minutes a day.',
        link: 'https://www.nhs.uk/mental-health/self-help/tips-and-support/mindfulness/',
        type: 'exercise',
      },
    ],
  },
];