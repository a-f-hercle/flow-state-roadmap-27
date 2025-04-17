
import { Project, Reviewer, Task, TaskCategory, TaskStatus } from '@/types';

// Mock reviewers
export const mockReviewers: Reviewer[] = [
  {
    id: '1',
    name: 'Alex Morgan',
    role: 'Product Director',
    avatar: 'https://i.pravatar.cc/150?img=11'
  },
  {
    id: '2',
    name: 'Jamie Chen',
    role: 'UX Director',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: '3',
    name: 'Taylor Reed',
    role: 'Engineering Director',
    avatar: 'https://i.pravatar.cc/150?img=8'
  },
  {
    id: '4',
    name: 'Jordan Smith',
    role: 'Data Director',
    avatar: 'https://i.pravatar.cc/150?img=12'
  },
  {
    id: '5',
    name: 'Casey Williams',
    role: 'Head of Product',
    avatar: 'https://i.pravatar.cc/150?img=20'
  },
  {
    id: '6',
    name: 'Avery Johnson',
    role: 'Head of UX',
    avatar: 'https://i.pravatar.cc/150?img=32'
  },
  {
    id: '7',
    name: 'Riley Brown',
    role: 'CTO',
    avatar: 'https://i.pravatar.cc/150?img=17'
  },
  {
    id: '8',
    name: 'Drew Garcia',
    role: 'Head of Data',
    avatar: 'https://i.pravatar.cc/150?img=30'
  }
];

// Create date objects for 2025
const createDate = (year: number, month: number, day: number) => {
  const date = new Date(year, month, day);
  return date;
};

// Mock projects for 2025
export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'High Availability',
    description: 'Implement high availability for the trading platform',
    team: 'Tech Trading',
    owner: 'Alex Morgan',
    currentPhase: 'build',
    phases: {
      'proposal': {
        startDate: createDate(2025, 0, 1),
        endDate: createDate(2025, 0, 15),
        status: 'completed',
        notes: 'Proposal was approved with minor revisions to scope.',
        review: {
          id: '101',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'approved', timestamp: createDate(2025, 0, 15) },
            { id: '2', status: 'approved', timestamp: createDate(2025, 0, 15) },
            { id: '3', status: 'approved', timestamp: createDate(2025, 0, 15) },
            { id: '4', status: 'approved', timestamp: createDate(2025, 0, 15) }
          ]
        }
      },
      'build': {
        startDate: createDate(2025, 0, 16),
        endDate: createDate(2025, 1, 15),
        status: 'in-progress',
        notes: 'Development is on track, addressing minor infrastructure issues.'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['infrastructure', 'reliability', 'trading'],
    createdAt: createDate(2024, 11, 15),
    updatedAt: createDate(2025, 0, 16)
  },
  {
    id: '2',
    title: 'Pricing Adjustment',
    description: 'Adjust pricing algorithms based on market trends',
    team: 'Tech Trading',
    owner: 'Riley Brown',
    currentPhase: 'build',
    phases: {
      'proposal': {
        startDate: createDate(2025, 0, 15),
        endDate: createDate(2025, 1, 1),
        status: 'completed',
        notes: 'Approved on first submission.',
        review: {
          id: '201',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'approved', timestamp: createDate(2025, 1, 1) },
            { id: '2', status: 'approved', timestamp: createDate(2025, 1, 1) },
            { id: '3', status: 'approved', timestamp: createDate(2025, 1, 1) },
            { id: '4', status: 'approved', timestamp: createDate(2025, 1, 1) }
          ]
        }
      },
      'build': {
        startDate: createDate(2025, 1, 2),
        endDate: createDate(2025, 2, 15),
        status: 'in-progress',
        notes: 'Development is in progress with initial algorithm refinement.'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['pricing', 'algorithms', 'trading'],
    createdAt: createDate(2024, 11, 20),
    updatedAt: createDate(2025, 1, 3)
  },
  {
    id: '3',
    title: 'OEMs Integration - Talos',
    description: 'Integrate Talos systems with our trading platform',
    team: 'Tech Trading',
    owner: 'Jamie Chen',
    currentPhase: 'proposal',
    phases: {
      'proposal': {
        startDate: createDate(2025, 1, 15),
        status: 'in-progress',
        notes: 'Integration specification being developed',
        review: {
          id: '301',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'pending' },
            { id: '2', status: 'pending' },
            { id: '3', status: 'pending' },
            { id: '4', status: 'pending' }
          ]
        }
      },
      'build': {
        status: 'not-started'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['integration', 'talos', 'oems'],
    createdAt: createDate(2025, 1, 10),
    updatedAt: createDate(2025, 1, 15)
  },
  {
    id: '4',
    title: 'Delayed Settlement',
    description: 'Implement delayed settlement functionality for trades',
    team: 'Tech Trading',
    owner: 'Jordan Smith',
    currentPhase: 'proposal',
    phases: {
      'proposal': {
        startDate: createDate(2025, 2, 15),
        status: 'in-progress',
        notes: 'Initial proposal under review',
        review: {
          id: '401',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'pending' },
            { id: '2', status: 'pending' },
            { id: '3', status: 'pending' },
            { id: '4', status: 'pending' }
          ]
        }
      },
      'build': {
        status: 'not-started'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['settlement', 'trading', 'finance'],
    createdAt: createDate(2025, 2, 10),
    updatedAt: createDate(2025, 2, 15)
  },
  {
    id: '5',
    title: 'BaaS Integration',
    description: 'Banking as a Service integration with Core Banking System',
    team: 'Tech Custody & Banking',
    owner: 'Drew Garcia',
    currentPhase: 'build',
    phases: {
      'proposal': {
        startDate: createDate(2024, 11, 15),
        endDate: createDate(2025, 0, 15),
        status: 'completed',
        notes: 'Proposal approved with expanded scope',
        review: {
          id: '501',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'approved', timestamp: createDate(2025, 0, 15) },
            { id: '2', status: 'approved', timestamp: createDate(2025, 0, 15) },
            { id: '3', status: 'approved', timestamp: createDate(2025, 0, 15) },
            { id: '4', status: 'approved', timestamp: createDate(2025, 0, 15) }
          ]
        }
      },
      'build': {
        startDate: createDate(2025, 0, 16),
        endDate: createDate(2025, 2, 1),
        status: 'in-progress',
        notes: 'Integration development in progress'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['banking', 'integration', 'custody'],
    createdAt: createDate(2024, 11, 15),
    updatedAt: createDate(2025, 0, 16)
  },
  {
    id: '6',
    title: 'EagleNet',
    description: 'Secure banking network implementation',
    team: 'Tech Custody & Banking',
    owner: 'Casey Williams',
    currentPhase: 'build',
    phases: {
      'proposal': {
        startDate: createDate(2025, 0, 15),
        endDate: createDate(2025, 1, 10),
        status: 'completed',
        notes: 'Proposal approved with security enhancements',
        review: {
          id: '601',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'approved', timestamp: createDate(2025, 1, 10) },
            { id: '2', status: 'approved', timestamp: createDate(2025, 1, 10) },
            { id: '3', status: 'approved', timestamp: createDate(2025, 1, 10) },
            { id: '4', status: 'approved', timestamp: createDate(2025, 1, 10) }
          ]
        }
      },
      'build': {
        startDate: createDate(2025, 1, 11),
        endDate: createDate(2025, 3, 1),
        status: 'in-progress',
        notes: 'Network infrastructure being built'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['network', 'security', 'banking'],
    createdAt: createDate(2025, 0, 5),
    updatedAt: createDate(2025, 1, 11)
  },
  {
    id: '7',
    title: 'BaaS - Add On',
    description: 'Additional features for Banking as a Service platform',
    team: 'Tech Custody & Banking',
    owner: 'Avery Johnson',
    currentPhase: 'proposal',
    phases: {
      'proposal': {
        startDate: createDate(2025, 1, 15),
        endDate: createDate(2025, 2, 15),
        status: 'completed',
        notes: 'Add-on features approved',
        review: {
          id: '701',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'approved', timestamp: createDate(2025, 2, 15) },
            { id: '2', status: 'approved', timestamp: createDate(2025, 2, 15) },
            { id: '3', status: 'approved', timestamp: createDate(2025, 2, 15) },
            { id: '4', status: 'approved', timestamp: createDate(2025, 2, 15) }
          ]
        }
      },
      'build': {
        status: 'not-started'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['banking', 'feature', 'add-on'],
    createdAt: createDate(2025, 1, 5),
    updatedAt: createDate(2025, 2, 15)
  },
  {
    id: '8',
    title: 'Merge Integration',
    description: 'System integration after merger',
    team: 'Tech Custody & Banking',
    owner: 'Taylor Reed',
    currentPhase: 'proposal',
    phases: {
      'proposal': {
        startDate: createDate(2025, 2, 15),
        status: 'in-progress',
        notes: 'Merge integration planning',
        review: {
          id: '801',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'pending' },
            { id: '2', status: 'pending' },
            { id: '3', status: 'pending' },
            { id: '4', status: 'pending' }
          ]
        }
      },
      'build': {
        status: 'not-started'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['merge', 'integration', 'systems'],
    createdAt: createDate(2025, 2, 10),
    updatedAt: createDate(2025, 2, 15)
  },
  {
    id: '9',
    title: 'OpenPayd Integration',
    description: 'Integration with OpenPayd payment services',
    team: 'Tech Custody & Banking',
    owner: 'Drew Garcia',
    currentPhase: 'proposal',
    phases: {
      'proposal': {
        startDate: createDate(2025, 3, 1),
        status: 'in-progress',
        notes: 'Integration specification being defined',
        review: {
          id: '901',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'pending' },
            { id: '2', status: 'pending' },
            { id: '3', status: 'pending' },
            { id: '4', status: 'pending' }
          ]
        }
      },
      'build': {
        status: 'not-started'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['payment', 'integration', 'openpayd'],
    createdAt: createDate(2025, 2, 25),
    updatedAt: createDate(2025, 3, 1)
  },
  {
    id: '10',
    title: 'IBEX (Lightning Network)',
    description: 'Implementation of Lightning Network technology',
    team: 'Tech Custody & Banking',
    owner: 'Riley Brown',
    currentPhase: 'proposal',
    phases: {
      'proposal': {
        startDate: createDate(2025, 3, 10),
        status: 'in-progress',
        notes: 'Lightning Network technical assessment',
        review: {
          id: '1001',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'pending' },
            { id: '2', status: 'pending' },
            { id: '3', status: 'pending' },
            { id: '4', status: 'pending' }
          ]
        }
      },
      'build': {
        status: 'not-started'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['lightning', 'network', 'blockchain'],
    createdAt: createDate(2025, 3, 5),
    updatedAt: createDate(2025, 3, 10)
  },
  {
    id: '11',
    title: 'Full VASP-Banking as a service',
    description: 'Virtual Asset Service Provider banking solution',
    team: 'Tech Custody & Banking',
    owner: 'Casey Williams',
    currentPhase: 'proposal',
    phases: {
      'proposal': {
        startDate: createDate(2025, 4, 1),
        status: 'in-progress',
        notes: 'VASP-Banking solution design',
        review: {
          id: '1101',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'pending' },
            { id: '2', status: 'pending' },
            { id: '3', status: 'pending' },
            { id: '4', status: 'pending' }
          ]
        }
      },
      'build': {
        status: 'not-started'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['vasp', 'banking', 'service'],
    createdAt: createDate(2025, 3, 15),
    updatedAt: createDate(2025, 4, 1)
  },
  {
    id: '12',
    title: 'Digital Cash Management & Money Movement',
    description: 'Digital solution for cash management and transfers',
    team: 'Tech Custody & Banking',
    owner: 'Avery Johnson',
    currentPhase: 'proposal',
    phases: {
      'proposal': {
        startDate: createDate(2025, 6, 1),
        status: 'in-progress',
        notes: 'Digital cash management solution planning',
        review: {
          id: '1201',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'pending' },
            { id: '2', status: 'pending' },
            { id: '3', status: 'pending' },
            { id: '4', status: 'pending' }
          ]
        }
      },
      'build': {
        status: 'not-started'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['cash', 'digital', 'money'],
    createdAt: createDate(2025, 5, 15),
    updatedAt: createDate(2025, 6, 1)
  },
  {
    id: '13',
    title: 'Accounting System & Reporting',
    description: 'New accounting and financial reporting system',
    team: 'Tech PMS',
    owner: 'Jordan Smith',
    currentPhase: 'build',
    phases: {
      'proposal': {
        startDate: createDate(2024, 11, 1),
        endDate: createDate(2025, 0, 15),
        status: 'completed',
        notes: 'Comprehensive accounting system proposal approved',
        review: {
          id: '1301',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'approved', timestamp: createDate(2025, 0, 15) },
            { id: '2', status: 'approved', timestamp: createDate(2025, 0, 15) },
            { id: '3', status: 'approved', timestamp: createDate(2025, 0, 15) },
            { id: '4', status: 'approved', timestamp: createDate(2025, 0, 15) }
          ]
        }
      },
      'build': {
        startDate: createDate(2025, 0, 16),
        endDate: createDate(2025, 3, 1),
        status: 'in-progress',
        notes: 'Core accounting modules being developed'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['accounting', 'reporting', 'finance'],
    createdAt: createDate(2024, 10, 15),
    updatedAt: createDate(2025, 0, 16)
  },
  {
    id: '14',
    title: 'Delayed Settlement Account',
    description: 'Account system for delayed settlements',
    team: 'Tech PMS',
    owner: 'Taylor Reed',
    currentPhase: 'proposal',
    phases: {
      'proposal': {
        startDate: createDate(2025, 2, 15),
        status: 'in-progress',
        notes: 'Settlement account solution design',
        review: {
          id: '1401',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'pending' },
            { id: '2', status: 'pending' },
            { id: '3', status: 'pending' },
            { id: '4', status: 'pending' }
          ]
        }
      },
      'build': {
        status: 'not-started'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['settlement', 'account', 'finance'],
    createdAt: createDate(2025, 2, 1),
    updatedAt: createDate(2025, 2, 15)
  },
  {
    id: '15',
    title: 'DWH transaction reporting',
    description: 'Data warehouse transaction reporting system',
    team: 'Tech PMS',
    owner: 'Drew Garcia',
    currentPhase: 'proposal',
    phases: {
      'proposal': {
        startDate: createDate(2025, 3, 1),
        status: 'in-progress',
        notes: 'Data warehouse reporting solution design',
        review: {
          id: '1501',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'pending' },
            { id: '2', status: 'pending' },
            { id: '3', status: 'pending' },
            { id: '4', status: 'pending' }
          ]
        }
      },
      'build': {
        status: 'not-started'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['data', 'reporting', 'warehouse'],
    createdAt: createDate(2025, 2, 15),
    updatedAt: createDate(2025, 3, 1)
  },
  {
    id: '16',
    title: 'MM Trading Strategy - Monitoring',
    description: 'Market maker trading strategy monitoring tools',
    team: 'Tech PMS',
    owner: 'Jordan Smith',
    currentPhase: 'proposal',
    phases: {
      'proposal': {
        startDate: createDate(2025, 5, 1),
        status: 'in-progress',
        notes: 'Trading strategy monitoring system design',
        review: {
          id: '1601',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'pending' },
            { id: '2', status: 'pending' },
            { id: '3', status: 'pending' },
            { id: '4', status: 'pending' }
          ]
        }
      },
      'build': {
        status: 'not-started'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['trading', 'monitoring', 'strategy'],
    createdAt: createDate(2025, 4, 15),
    updatedAt: createDate(2025, 5, 1)
  },
  {
    id: '17',
    title: 'High Availability',
    description: 'Implement high availability for execution systems',
    team: 'Tech Execution',
    owner: 'Riley Brown',
    currentPhase: 'build',
    phases: {
      'proposal': {
        startDate: createDate(2024, 11, 15),
        endDate: createDate(2025, 0, 15),
        status: 'completed',
        notes: 'High availability solution approved',
        review: {
          id: '1701',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'approved', timestamp: createDate(2025, 0, 15) },
            { id: '2', status: 'approved', timestamp: createDate(2025, 0, 15) },
            { id: '3', status: 'approved', timestamp: createDate(2025, 0, 15) },
            { id: '4', status: 'approved', timestamp: createDate(2025, 0, 15) }
          ]
        }
      },
      'build': {
        startDate: createDate(2025, 0, 16),
        endDate: createDate(2025, 2, 28),
        status: 'in-progress',
        notes: 'Infrastructure enhancements in progress'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['infrastructure', 'reliability', 'execution'],
    createdAt: createDate(2024, 11, 1),
    updatedAt: createDate(2025, 0, 16)
  },
  {
    id: '18',
    title: 'Pricing Shield',
    description: 'Advanced pricing protection mechanisms',
    team: 'Tech Execution',
    owner: 'Taylor Reed',
    currentPhase: 'build',
    phases: {
      'proposal': {
        startDate: createDate(2025, 1, 15),
        endDate: createDate(2025, 2, 1),
        status: 'completed',
        notes: 'Pricing protection solution approved',
        review: {
          id: '1801',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'approved', timestamp: createDate(2025, 2, 1) },
            { id: '2', status: 'approved', timestamp: createDate(2025, 2, 1) },
            { id: '3', status: 'approved', timestamp: createDate(2025, 2, 1) },
            { id: '4', status: 'approved', timestamp: createDate(2025, 2, 1) }
          ]
        }
      },
      'build': {
        startDate: createDate(2025, 2, 2),
        endDate: createDate(2025, 3, 30),
        status: 'in-progress',
        notes: 'Pricing algorithms being enhanced'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['pricing', 'protection', 'execution'],
    createdAt: createDate(2025, 1, 10),
    updatedAt: createDate(2025, 2, 2)
  },
  {
    id: '19',
    title: 'Limit operations WD',
    description: 'Implement limits for withdrawal operations',
    team: 'Tech Execution',
    owner: 'Alex Morgan',
    currentPhase: 'build',
    phases: {
      'proposal': {
        startDate: createDate(2025, 2, 1),
        endDate: createDate(2025, 2, 15),
        status: 'completed',
        notes: 'Withdrawal limits solution approved',
        review: {
          id: '1901',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'approved', timestamp: createDate(2025, 2, 15) },
            { id: '2', status: 'approved', timestamp: createDate(2025, 2, 15) },
            { id: '3', status: 'approved', timestamp: createDate(2025, 2, 15) },
            { id: '4', status: 'approved', timestamp: createDate(2025, 2, 15) }
          ]
        }
      },
      'build': {
        startDate: createDate(2025, 2, 16),
        endDate: createDate(2025, 3, 15),
        status: 'in-progress',
        notes: 'Withdrawal limit system being built'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['limits', 'withdrawal', 'operations'],
    createdAt: createDate(2025, 1, 20),
    updatedAt: createDate(2025, 2, 16)
  },
  {
    id: '20',
    title: 'Commission Fee Bug',
    description: 'Fix issues with commission fee calculations',
    team: 'Tech Execution',
    owner: 'Drew Garcia',
    currentPhase: 'build',
    phases: {
      'proposal': {
        startDate: createDate(2025, 2, 15),
        endDate: createDate(2025, 2, 20),
        status: 'completed',
        notes: 'Commission fee bug fix approved',
        review: {
          id: '2001',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'approved', timestamp: createDate(2025, 2, 20) },
            { id: '2', status: 'approved', timestamp: createDate(2025, 2, 20) },
            { id: '3', status: 'approved', timestamp: createDate(2025, 2, 20) },
            { id: '4', status: 'approved', timestamp: createDate(2025, 2, 20) }
          ]
        }
      },
      'build': {
        startDate: createDate(2025, 2, 21),
        endDate: createDate(2025, 3, 10),
        status: 'in-progress',
        notes: 'Fee calculation system being fixed'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['bugfix', 'commission', 'fee'],
    createdAt: createDate(2025, 2, 10),
    updatedAt: createDate(2025, 2, 21)
  },
  {
    id: '21',
    title: 'Two Side RFQ',
    description: 'Implement two-sided request for quote functionality',
    team: 'Tech Execution',
    owner: 'Jordan Smith',
    currentPhase: 'proposal',
    phases: {
      'proposal': {
        startDate: createDate(2025, 2, 25),
        status: 'in-progress',
        notes: 'Two-sided RFQ solution design',
        review: {
          id: '2101',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'pending' },
            { id: '2', status: 'pending' },
            { id: '3', status: 'pending' },
            { id: '4', status: 'pending' }
          ]
        }
      },
      'build': {
        status: 'not-started'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['rfq', 'trading', 'execution'],
    createdAt: createDate(2025, 2, 20),
    updatedAt: createDate(2025, 2, 25)
  },
  {
    id: '22',
    title: 'Hercle Backoffice Launch',
    description: 'Launch new back office system for Hercle platform',
    team: 'Tech Execution',
    owner: 'Casey Williams',
    currentPhase: 'build',
    phases: {
      'proposal': {
        startDate: createDate(2025, 1, 15),
        endDate: createDate(2025, 2, 1),
        status: 'completed',
        notes: 'Back office system proposal approved',
        review: {
          id: '2201',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'approved', timestamp: createDate(2025, 2, 1) },
            { id: '2', status: 'approved', timestamp: createDate(2025, 2, 1) },
            { id: '3', status: 'approved', timestamp: createDate(2025, 2, 1) },
            { id: '4', status: 'approved', timestamp: createDate(2025, 2, 1) }
          ]
        }
      },
      'build': {
        startDate: createDate(2025, 2, 2),
        endDate: createDate(2025, 4, 30),
        status: 'in-progress',
        notes: 'Back office system being built'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['backoffice', 'launch', 'hercle'],
    createdAt: createDate(2025, 1, 10),
    updatedAt: createDate(2025, 2, 2)
  },
  {
    id: '23',
    title: 'Delayed Settlement Account',
    description: 'Account system for delayed settlements in execution',
    team: 'Tech Execution',
    owner: 'Avery Johnson',
    currentPhase: 'proposal',
    phases: {
      'proposal': {
        startDate: createDate(2025, 3, 1),
        status: 'in-progress',
        notes: 'Settlement account solution design',
        review: {
          id: '2301',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'pending' },
            { id: '2', status: 'pending' },
            { id: '3', status: 'pending' },
            { id: '4', status: 'pending' }
          ]
        }
      },
      'build': {
        status: 'not-started'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['settlement', 'account', 'execution'],
    createdAt: createDate(2025, 2, 20),
    updatedAt: createDate(2025, 3, 1)
  },
  {
    id: '24',
    title: 'Rule management & multi-credentials access',
    description: 'Enhanced rule management and multi-level access system',
    team: 'Tech Execution',
    owner: 'Taylor Reed',
    currentPhase: 'proposal',
    phases: {
      'proposal': {
        startDate: createDate(2025, 3, 15),
        status: 'in-progress',
        notes: 'Access management system design',
        review: {
          id: '2401',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'pending' },
            { id: '2', status: 'pending' },
            { id: '3', status: 'pending' },
            { id: '4', status: 'pending' }
          ]
        }
      },
      'build': {
        status: 'not-started'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['rules', 'access', 'credentials'],
    createdAt: createDate(2025, 3, 10),
    updatedAt: createDate(2025, 3, 15)
  },
  {
    id: '25',
    title: 'DWH Back Office Section',
    description: 'Data warehouse back office reporting section',
    team: 'Tech Execution',
    owner: 'Drew Garcia',
    currentPhase: 'proposal',
    phases: {
      'proposal': {
        startDate: createDate(2025, 3, 25),
        status: 'in-progress',
        notes: 'Back office data warehouse reporting design',
        review: {
          id: '2501',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'pending' },
            { id: '2', status: 'pending' },
            { id: '3', status: 'pending' },
            { id: '4', status: 'pending' }
          ]
        }
      },
      'build': {
        status: 'not-started'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['data', 'warehouse', 'backoffice'],
    createdAt: createDate(2025, 3, 20),
    updatedAt: createDate(2025, 3, 25)
  },
  {
    id: '26',
    title: 'Travel Rule',
    description: 'Implement travel rule compliance system',
    team: 'Tech Execution',
    owner: 'Riley Brown',
    currentPhase: 'proposal',
    phases: {
      'proposal': {
        startDate: createDate(2025, 4, 1),
        status: 'in-progress',
        notes: 'Travel rule compliance system design',
        review: {
          id: '2601',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'pending' },
            { id: '2', status: 'pending' },
            { id: '3', status: 'pending' },
            { id: '4', status: 'pending' }
          ]
        }
      },
      'build': {
        status: 'not-started'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['compliance', 'travel', 'rule'],
    createdAt: createDate(2025, 3, 25),
    updatedAt: createDate(2025, 4, 1)
  },
  {
    id: '27',
    title: 'Staging env',
    description: 'Set up enhanced staging environment',
    team: 'Tech Infrastructure',
    owner: 'Alex Morgan',
    currentPhase: 'build',
    phases: {
      'proposal': {
        startDate: createDate(2024, 11, 15),
        endDate: createDate(2025, 0, 10),
        status: 'completed',
        notes: 'Staging environment proposal approved',
        review: {
          id: '2701',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'approved', timestamp: createDate(2025, 0, 10) },
            { id: '2', status: 'approved', timestamp: createDate(2025, 0, 10) },
            { id: '3', status: 'approved', timestamp: createDate(2025, 0, 10) },
            { id: '4', status: 'approved', timestamp: createDate(2025, 0, 10) }
          ]
        }
      },
      'build': {
        startDate: createDate(2025, 0, 11),
        endDate: createDate(2025, 2, 28),
        status: 'in-progress',
        notes: 'Staging environment infrastructure being built'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['infrastructure', 'staging', 'environment'],
    createdAt: createDate(2024, 11, 10),
    updatedAt: createDate(2025, 0, 11)
  },
  {
    id: '28',
    title: 'Blue Green Deployment',
    description: 'Implement blue-green deployment methodology',
    team: 'Tech Infrastructure',
    owner: 'Riley Brown',
    currentPhase: 'proposal',
    phases: {
      'proposal': {
        startDate: createDate(2025, 2, 1),
        status: 'in-progress',
        notes: 'Blue-green deployment strategy design',
        review: {
          id: '2801',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'pending' },
            { id: '2', status: 'pending' },
            { id: '3', status: 'pending' },
            { id: '4', status: 'pending' }
          ]
        }
      },
      'build': {
        status: 'not-started'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['deployment', 'blue-green', 'infrastructure'],
    createdAt: createDate(2025, 1, 25),
    updatedAt: createDate(2025, 2, 1)
  },
  {
    id: '29',
    title: 'Platform Status Page - Public landing page',
    description: 'Implement public platform status dashboard',
    team: 'Tech Infrastructure',
    owner: 'Jamie Chen',
    currentPhase: 'proposal',
    phases: {
      'proposal': {
        startDate: createDate(2025, 3, 1),
        status: 'in-progress',
        notes: 'Status page design and requirements',
        review: {
          id: '2901',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'pending' },
            { id: '2', status: 'pending' },
            { id: '3', status: 'pending' },
            { id: '4', status: 'pending' }
          ]
        }
      },
      'build': {
        status: 'not-started'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['status', 'platform', 'public'],
    createdAt: createDate(2025, 2, 20),
    updatedAt: createDate(2025, 3, 1)
  },
  {
    id: '30',
    title: 'Cybersecurity adjustment',
    description: 'Enhanced security measures and protocols',
    team: 'Tech Infrastructure',
    owner: 'Taylor Reed',
    currentPhase: 'proposal',
    phases: {
      'proposal': {
        startDate: createDate(2025, 4, 1),
        status: 'in-progress',
        notes: 'Cybersecurity enhancement planning',
        review: {
          id: '3001',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'pending' },
            { id: '2', status: 'pending' },
            { id: '3', status: 'pending' },
            { id: '4', status: 'pending' }
          ]
        }
      },
      'build': {
        status: 'not-started'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['security', 'cyber', 'infrastructure'],
    createdAt: createDate(2025, 3, 15),
    updatedAt: createDate(2025, 4, 1)
  },
  {
    id: '31',
    title: 'Product - Commercial - Tech - Process',
    description: 'Streamline cross-departmental processes',
    team: 'Business Operations',
    owner: 'Casey Williams',
    currentPhase: 'build',
    phases: {
      'proposal': {
        startDate: createDate(2025, 0, 15),
        endDate: createDate(2025, 1, 15),
        status: 'completed',
        notes: 'Process improvement proposal approved',
        review: {
          id: '3101',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'approved', timestamp: createDate(2025, 1, 15) },
            { id: '2', status: 'approved', timestamp: createDate(2025, 1, 15) },
            { id: '3', status: 'approved', timestamp: createDate(2025, 1, 15) },
            { id: '4', status: 'approved', timestamp: createDate(2025, 1, 15) }
          ]
        }
      },
      'build': {
        startDate: createDate(2025, 1, 16),
        endDate: createDate(2025, 3, 31),
        status: 'in-progress',
        notes: 'Process improvements being implemented'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['process', 'optimization', 'operations'],
    createdAt: createDate(2025, 0, 10),
    updatedAt: createDate(2025, 1, 16)
  },
  {
    id: '32',
    title: 'KPI Performance Definition',
    description: 'Define and implement key performance indicators',
    team: 'Business Operations',
    owner: 'Alex Morgan',
    currentPhase: 'proposal',
    phases: {
      'proposal': {
        startDate: createDate(2025, 2, 15),
        status: 'in-progress',
        notes: 'KPI framework definition',
        review: {
          id: '3201',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'pending' },
            { id: '2', status: 'pending' },
            { id: '3', status: 'pending' },
            { id: '4', status: 'pending' }
          ]
        }
      },
      'build': {
        status: 'not-started'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['kpi', 'performance', 'metrics'],
    createdAt: createDate(2025, 2, 10),
    updatedAt: createDate(2025, 2, 15)
  },
  {
    id: '33',
    title: 'Market Mapping and Insights - Lead Generation tool',
    description: 'Market analysis and lead generation platform',
    team: 'Business Operations',
    owner: 'Jordan Smith',
    currentPhase: 'proposal',
    phases: {
      'proposal': {
        startDate: createDate(2025, 3, 1),
        status: 'in-progress',
        notes: 'Market mapping tool requirements gathering',
        review: {
          id: '3301',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'pending' },
            { id: '2', status: 'pending' },
            { id: '3', status: 'pending' },
            { id: '4', status: 'pending' }
          ]
        }
      },
      'build': {
        status: 'not-started'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['market', 'leads', 'analysis'],
    createdAt: createDate(2025, 2, 20),
    updatedAt: createDate(2025, 3, 1)
  },
  {
    id: '34',
    title: 'Customer Support tool',
    description: 'Enhanced customer support platform',
    team: 'Business Operations',
    owner: 'Jamie Chen',
    currentPhase: 'proposal',
    phases: {
      'proposal': {
        startDate: createDate(2025, 3, 15),
        status: 'in-progress',
        notes: 'Support tool requirements definition',
        review: {
          id: '3401',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'pending' },
            { id: '2', status: 'pending' },
            { id: '3', status: 'pending' },
            { id: '4', status: 'pending' }
          ]
        }
      },
      'build': {
        status: 'not-started'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['support', 'customer', 'tool'],
    createdAt: createDate(2025, 3, 10),
    updatedAt: createDate(2025, 3, 15)
  },
  {
    id: '35',
    title: 'Task/Project Management',
    description: 'Comprehensive project management platform',
    team: 'Business Operations',
    owner: 'Avery Johnson',
    currentPhase: 'proposal',
    phases: {
      'proposal': {
        startDate: createDate(2025, 4, 1),
        status: 'in-progress',
        notes: 'Project management tool requirements gathering',
        review: {
          id: '3501',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'pending' },
            { id: '2', status: 'pending' },
            { id: '3', status: 'pending' },
            { id: '4', status: 'pending' }
          ]
        }
      },
      'build': {
        status: 'not-started'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['project', 'management', 'tasks'],
    createdAt: createDate(2025, 3, 25),
    updatedAt: createDate(2025, 4, 1)
  }
];

// Tasks for 2025
export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "High Availability",
    description: "Implement high availability for the trading platform",
    category: "infrastructure",
    status: "in-progress",
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 1, 15),
    team: "Tech Trading",
    color: "bg-indigo-100 border-indigo-300"
  },
  {
    id: "task-2",
    title: "Pricing Adjustment",
    description: "Adjust pricing algorithms based on market trends",
    category: "feature",
    status: "in-progress",
    startDate: new Date(2025, 1, 10),
    endDate: new Date(2025, 2, 5),
    team: "Tech Trading",
    color: "bg-indigo-100 border-indigo-300"
  },
  {
    id: "task-3",
    title: "OEMs Integration - Talos",
    description: "Integrate Talos system with our platform",
    category: "feature",
    status: "planned",
    startDate: new Date(2025, 2, 1),
    endDate: new Date(2025, 3, 15),
    team: "Tech Trading",
    color: "bg-indigo-100 border-indigo-300"
  },
  {
    id: "task-4",
    title: "Delayed Settlement",
    description: "Implement delayed settlement functionality",
    category: "feature",
    status: "planned",
    startDate: new Date(2025, 3, 10),
    endDate: new Date(2025, 4, 20),
    team: "Tech Trading",
    color: "bg-indigo-100 border-indigo-300"
  },
  {
    id: "task-5",
    title: "BaaS Integration",
    description: "Banking as a Service integration with Core Banking System",
    category: "feature",
    status: "in-progress",
    startDate: new Date(2025, 0, 15),
    endDate: new Date(2025, 2, 28),
    team: "Tech Custody & Banking",
    color: "bg-yellow-100 border-yellow-300"
  },
  {
    id: "task-6",
    title: "EagleNet",
    description: "Secure banking network implementation",
    category: "feature",
    status: "in-progress",
    startDate: new Date(2025, 1, 10),
    endDate: new Date(2025, 2, 10),
    team: "Tech Custody & Banking",
    color: "bg-yellow-100 border-yellow-300"
  },
  {
    id: "task-7",
    title: "BaaS - Add On",
    description: "Additional features for Banking as a Service platform",
    category: "feature",
    status: "planned",
    startDate: new Date(2025, 2, 1),
    endDate: new Date(2025, 3, 15),
    team: "Tech Custody & Banking",
    color: "bg-yellow-100 border-yellow-300"
  },
  {
    id: "task-8",
    title: "Merge Integration",
    description: "System integration after merger",
    category: "infrastructure",
    status: "planned",
    startDate: new Date(2025, 3, 1),
    endDate: new Date(2025, 4, 15),
    team: "Tech Custody & Banking",
    color: "bg-yellow-100 border-yellow-300"
  },
  {
    id: "task-9",
    title: "OpenPayd Integration",
    description: "Integration with OpenPayd payment services",
    category: "feature",
    status: "planned",
    startDate: new Date(2025, 3, 15),
    endDate: new Date(2025, 5, 5),
    team: "Tech Custody & Banking",
    color: "bg-yellow-100 border-yellow-300"
  },
  {
    id: "task-10",
    title: "IBEX (Lightning Network)",
    description: "Implementation of Lightning Network technology",
    category: "feature",
    status: "planned",
    startDate: new Date(2025, 3, 20),
    endDate: new Date(2025, 5, 10),
    team: "Tech Custody & Banking",
    color: "bg-yellow-100 border-yellow-300"
  },
  {
    id: "task-11",
    title: "Full VASP-Banking as a service",
    description: "Virtual Asset Service Provider banking solution",
    category: "feature",
    status: "planned",
    startDate: new Date(2025, 4, 1),
    endDate: new Date(2025, 6, 30),
    team: "Tech Custody & Banking",
    color: "bg-yellow-100 border-yellow-300"
  },
  {
    id: "task-12",
    title: "Digital Cash Management & Money Movement",
    description: "Digital solution for cash management and transfers",
    category: "feature",
    status: "planned",
    startDate: new Date(2025, 6, 1),
    endDate: new Date(2025, 8, 30),
    team: "Tech Custody & Banking",
    color: "bg-yellow-100 border-yellow-300"
  },
  {
    id: "task-13",
    title: "Accounting System & Reporting",
    description: "New accounting and financial reporting system",
    category: "feature",
    status: "in-progress",
    startDate: new Date(2025, 0, 5),
    endDate: new Date(2025, 2, 25),
    team: "Tech PMS",
    color: "bg-red-100 border-red-300"
  },
  {
    id: "task-14",
    title: "Delayed Settlement Account",
    description: "Account system for delayed settlements",
    category: "feature",
    status: "planned",
    startDate: new Date(2025, 2, 15),
    endDate: new Date(2025, 4, 30),
    team: "Tech PMS",
    color: "bg-red-100 border-red-300"
  },
  {
    id: "task-15",
    title: "DWH transaction reporting",
    description: "Data warehouse transaction reporting system",
    category: "feature",
    status: "planned",
    startDate: new Date(2025, 3, 1),
    endDate: new Date(2025, 5, 15),
    team: "Tech PMS",
    color: "bg-red-100 border-red-300"
  },
  {
    id: "task-16",
    title: "MM Trading Strategy - Monitoring",
    description: "Market maker trading strategy monitoring tools",
    category: "feature",
    status: "planned",
    startDate: new Date(2025, 5, 1),
    endDate: new Date(2025, 7, 15),
    team: "Tech PMS",
    color: "bg-red-100 border-red-300"
  },
  {
    id: "task-17",
    title: "High Availability",
    description: "Implement high availability for execution systems",
    category: "infrastructure",
    status: "in-progress",
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 1, 28),
    team: "Tech Execution",
    color: "bg-green-100 border-green-300"
  },
  {
    id: "task-18",
    title: "Pricing Shield",
    description: "Advanced pricing protection mechanisms",
    category: "feature",
    status: "in-progress",
    startDate: new Date(2025, 1, 15),
    endDate: new Date(2025, 3, 30),
    team: "Tech Execution",
    color: "bg-green-100 border-green-300"
  },
  {
    id: "task-19",
    title: "Limit operations WD",
    description: "Implement limits for withdrawal operations",
    category: "feature",
    status: "in-progress",
    startDate: new Date(2025, 2, 10),
    endDate: new Date(2025, 3, 15),
    team: "Tech Execution",
    color: "bg-green-100 border-green-300"
  },
  {
    id: "task-20",
    title: "Commission Fee Bug",
    description: "Fix issues with commission fee calculations",
    category: "bugfix",
    status: "in-progress",
    startDate: new Date(2025, 2, 20),
    endDate: new Date(2025, 3, 10),
    team: "Tech Execution",
    color: "bg-green-100 border-green-300"
  },
  {
    id: "task-21",
    title: "Two Side RFQ",
    description: "Implement two-sided request for quote functionality",
    category: "feature",
    status: "planned",
    startDate: new Date(2025, 3, 1),
    endDate: new Date(2025, 4, 15),
    team: "Tech Execution",
    color: "bg-green-100 border-green-300"
  },
  {
    id: "task-22",
    title: "Hercle Backoffice Launch",
    description: "Launch new back office system for Hercle platform",
    category: "feature",
    status: "in-progress",
    startDate: new Date(2025, 1, 15),
    endDate: new Date(2025, 4, 30),
    team: "Tech Execution",
    color: "bg-green-100 border-green-300"
  },
  {
    id: "task-23",
    title: "Delayed Settlement Account",
    description: "Account system for delayed settlements in execution",
    category: "feature",
    status: "planned",
    startDate: new Date(2025, 3, 1),
    endDate: new Date(2025, 5, 15),
    team: "Tech Execution",
    color: "bg-green-100 border-green-300"
  },
  {
    id: "task-24",
    title: "Rule management & multi-credentials access",
    description: "Enhanced rule management and multi-level access system",
    category: "infrastructure",
    status: "planned",
    startDate: new Date(2025, 3, 15),
    endDate: new Date(2025, 5, 30),
    team: "Tech Execution",
    color: "bg-green-100 border-green-300"
  },
  {
    id: "task-25",
    title: "DWH Back Office Section",
    description: "Data warehouse back office reporting section",
    category: "feature",
    status: "planned",
    startDate: new Date(2025, 3, 25),
    endDate: new Date(2025, 6, 10),
    team: "Tech Execution",
    color: "bg-green-100 border-green-300"
  },
  {
    id: "task-26",
    title: "Travel Rule",
    description: "Implement travel rule compliance system",
    category: "compliance",
    status: "planned",
    startDate: new Date(2025, 4, 1),
    endDate: new Date(2025, 6, 15),
    team: "Tech Execution",
    color: "bg-green-100 border-green-300"
  },
  {
    id: "task-27",
    title: "Staging env",
    description: "Set up enhanced staging environment",
    category: "infrastructure",
    status: "in-progress",
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 1, 28),
    team: "Tech Infrastructure",
    color: "bg-orange-100 border-orange-300"
  },
  {
    id: "task-28",
    title: "Blue Green Deployment",
    description: "Implement blue-green deployment methodology",
    category: "infrastructure",
    status: "planned",
    startDate: new Date(2025, 2, 1),
    endDate: new Date(2025, 4, 15),
    team: "Tech Infrastructure",
    color: "bg-orange-100 border-orange-300"
  },
  {
    id: "task-29",
    title: "Platform Status Page - Public landing page",
    description: "Implement public platform status dashboard",
    category: "feature",
    status: "planned",
    startDate: new Date(2025, 3, 1),
    endDate: new Date(2025, 5, 15),
    team: "Tech Infrastructure",
    color: "bg-orange-100 border-orange-300"
  },
  {
    id: "task-30",
    title: "Cybersecurity adjustment",
    description: "Enhanced security measures and protocols",
    category: "security",
    status: "planned",
    startDate: new Date(2025, 4, 1),
    endDate: new Date(2025, 6, 30),
    team: "Tech Infrastructure",
    color: "bg-orange-100 border-orange-300"
  },
  {
    id: "task-31",
    title: "Product - Commercial - Tech - Process",
    description: "Streamline cross-departmental processes",
    category: "improvement",
    status: "in-progress",
    startDate: new Date(2025, 1, 15),
    endDate: new Date(2025, 3, 15),
    team: "Business Operations",
    color: "bg-pink-100 border-pink-300"
  },
  {
    id: "task-32",
    title: "KPI Performance Definition",
    description: "Define and implement key performance indicators",
    category: "improvement",
    status: "planned",
    startDate: new Date(2025, 2, 15),
    endDate: new Date(2025, 4, 15),
    team: "Business Operations",
    color: "bg-pink-100 border-pink-300"
  },
  {
    id: "task-33",
    title: "Market Mapping and Insights - Lead Generation tool",
    description: "Market analysis and lead generation platform",
    category: "feature",
    status: "planned",
    startDate: new Date(2025, 3, 1),
    endDate: new Date(2025, 5, 15),
    team: "Business Operations",
    color: "bg-pink-100 border-pink-300"
  },
  {
    id: "task-34",
    title: "Customer Support tool",
    description: "Enhanced customer support platform",
    category: "feature",
    status: "planned",
    startDate: new Date(2025, 3, 15),
    endDate: new Date(2025, 5, 30),
    team: "Business Operations",
    color: "bg-pink-100 border-pink-300"
  },
  {
    id: "task-35",
    title: "Task/Project Management",
    description: "Comprehensive project management platform",
    category: "feature",
    status: "planned",
    startDate: new Date(2025, 4, 1),
    endDate: new Date(2025, 6, 30),
    team: "Business Operations",
    color: "bg-pink-100 border-pink-300"
  }
];
