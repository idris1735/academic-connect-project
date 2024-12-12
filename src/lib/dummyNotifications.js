export const dummyNotifications = [
  {
    id: '1',
    type: 'CONNECTION_REQUEST',
    message: 'sent you a connection request',
    read: false,
    createdAt: { toDate: () => new Date(Date.now() - 1000 * 60 * 5) }, // 5 minutes ago
    sender: {
      id: 'user1',
      name: 'Dr. Sarah Johnson',
      photoURL: 'https://picsum.photos/seed/sarah/200',
    },
  },
  {
    id: '2',
    type: 'MESSAGE',
    message: 'mentioned you in a comment: "Great insights @username on the AI research"',
    read: false,
    createdAt: { toDate: () => new Date(Date.now() - 1000 * 60 * 30) }, // 30 minutes ago
    sender: {
      id: 'user2',
      name: 'Prof. Michael Chen',
      photoURL: 'https://picsum.photos/seed/michael/200',
    },
  },
  {
    id: '3',
    type: 'PROJECT',
    message: 'invited you to collaborate on the project "Machine Learning in Healthcare"',
    read: false,
    createdAt: { toDate: () => new Date(Date.now() - 1000 * 60 * 60 * 2) }, // 2 hours ago
    sender: {
      id: 'user3',
      name: 'Dr. Elena Rodriguez',
      photoURL: 'https://picsum.photos/seed/elena/200',
    },
  },
  {
    id: '4',
    type: 'LIKE',
    message: 'liked your research paper on "Neural Networks in Climate Modeling"',
    read: true,
    createdAt: { toDate: () => new Date(Date.now() - 1000 * 60 * 60 * 24) }, // 1 day ago
    sender: {
      id: 'user4',
      name: 'Prof. David Kim',
      photoURL: 'https://picsum.photos/seed/david/200',
    },
  },
  {
    id: '5',
    type: 'CONNECTION_REQUEST',
    message: 'accepted your connection request',
    read: true,
    createdAt: { toDate: () => new Date(Date.now() - 1000 * 60 * 60 * 48) }, // 2 days ago
    sender: {
      id: 'user5',
      name: 'Dr. Aisha Patel',
      photoURL: 'https://picsum.photos/seed/aisha/200',
    },
  },
]
