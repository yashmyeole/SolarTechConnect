export const THREADS = {
  pro: [
    {
      id: 1,
      with: { kind: 'member', id: 'aisha-rahman' },
      subtitle: 'Talent Lead at Prairie Sun EPC',
      jobId: 5,
      unread: true,
      time: '10:42 am',
      topic: 'jobs',
      quickReplies: ['Thursday at 10:00 am works for me.', 'Could we do Friday morning instead?'],
      messages: [
        {
          from: 'them',
          text: 'Hi Maria, your profile came up for our Crew Lead opening. Your commercial rooftop experience is exactly what the role needs.',
          day: 'Nov 9',
          time: '4:10 pm',
        },
        { from: 'them', jobId: 5, day: 'Nov 9', time: '4:11 pm' },
        {
          from: 'me',
          text: 'Thanks Aisha. I am interested. I could start two weeks after an offer.',
          day: 'Nov 9',
          time: '6:02 pm',
        },
        {
          from: 'them',
          text: 'Great. Could you do a 30-minute video call on Thursday at 10:00 am?',
          day: 'Today',
          time: '10:42 am',
        },
      ],
    },
    {
      id: 2,
      with: { kind: 'member', id: 'deshawn-carter' },
      subtitle: 'Journeyman Electrician at Brightline Solar',
      unread: false,
      time: 'Nov 8',
      topic: 'all',
      messages: [
        {
          from: 'them',
          text: 'Are you going to the Chicago installers meetup on the 19th?',
          day: 'Nov 8',
          time: '7:15 pm',
        },
        { from: 'me', text: 'Planning to. Save me a seat.', day: 'Nov 8', time: '7:40 pm' },
      ],
    },
    {
      id: 3,
      with: { kind: 'company', id: 'lakeshore-training' },
      subtitle: 'OSHA 30 weekend cohort',
      unread: false,
      time: 'Nov 6',
      topic: 'all',
      messages: [
        {
          from: 'them',
          text: 'Your seat for the December 5 cohort is held until Friday. Reply here if you have questions about the schedule.',
          day: 'Nov 6',
          time: '9:00 am',
        },
      ],
    },
  ],
  emp: [
    {
      id: 1,
      with: { kind: 'member', id: 'maria-alvarez' },
      subtitle: 'PV Installer at Brightline Solar',
      jobId: 5,
      unread: true,
      time: 'Nov 9',
      topic: 'jobs',
      messages: [
        {
          from: 'me',
          text: 'Hi Maria, your profile came up for our Crew Lead opening. Your commercial rooftop experience is exactly what the role needs.',
          day: 'Nov 9',
          time: '4:10 pm',
        },
        {
          from: 'them',
          text: 'Thanks Aisha. I am interested. I could start two weeks after an offer.',
          day: 'Nov 9',
          time: '6:02 pm',
        },
        {
          from: 'me',
          text: 'Great. Could you do a 30-minute video call on Thursday at 10:00 am?',
          day: 'Today',
          time: '10:42 am',
        },
      ],
    },
    {
      id: 2,
      with: { kind: 'member', id: 'marcus-lee' },
      subtitle: 'Crew Lead at Midwest Rooftop Solar',
      jobId: 5,
      unread: false,
      time: 'Nov 8',
      topic: 'jobs',
      messages: [
        {
          from: 'them',
          text: 'Happy to share references from my last two commercial jobs.',
          day: 'Nov 8',
          time: '2:30 pm',
        },
        { from: 'me', text: 'Please do. I will pass them to the hiring manager today.', day: 'Nov 8', time: '3:05 pm' },
      ],
    },
  ],
};
