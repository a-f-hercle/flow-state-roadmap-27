
import { Project, Reviewer } from '@/types';

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

// Create date objects for easier handling
const today = new Date();
const lastWeek = new Date();
lastWeek.setDate(today.getDate() - 7);
const nextWeek = new Date();
nextWeek.setDate(today.getDate() + 7);
const twoWeeksAgo = new Date();
twoWeeksAgo.setDate(today.getDate() - 14);
const threeWeeksAgo = new Date();
threeWeeksAgo.setDate(today.getDate() - 21);

// Mock projects
export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Customer Feedback Portal',
    description: 'A platform for customers to submit product feedback and vote on features.',
    team: 'Product Experience',
    owner: 'Alex Morgan',
    currentPhase: 'build',
    phases: {
      'proposal': {
        startDate: threeWeeksAgo,
        endDate: twoWeeksAgo,
        status: 'completed',
        notes: 'Proposal was approved with minor revisions to scope.',
        review: {
          id: '101',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'approved', timestamp: twoWeeksAgo },
            { id: '2', status: 'approved', timestamp: twoWeeksAgo },
            { id: '3', status: 'approved', timestamp: twoWeeksAgo },
            { id: '4', status: 'approved', timestamp: twoWeeksAgo }
          ]
        }
      },
      'build': {
        startDate: lastWeek,
        endDate: nextWeek,
        status: 'in-progress',
        notes: 'Development is on track, addressing minor UI issues.'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['customer', 'feedback', 'ui/ux'],
    createdAt: threeWeeksAgo,
    updatedAt: today
  },
  {
    id: '2',
    title: 'Inventory Management System',
    description: 'An internal tool to track inventory across all warehouse locations.',
    team: 'Operations',
    owner: 'Riley Brown',
    currentPhase: 'proposal',
    phases: {
      'proposal': {
        startDate: twoWeeksAgo,
        endDate: lastWeek,
        status: 'completed',
        notes: 'Approved on first submission.',
        review: {
          id: '201',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'approved', timestamp: lastWeek },
            { id: '2', status: 'approved', timestamp: lastWeek },
            { id: '3', status: 'approved', timestamp: lastWeek },
            { id: '4', status: 'approved', timestamp: lastWeek }
          ]
        }
      },
      'build': {
        startDate: lastWeek,
        status: 'in-progress',
        notes: 'Development has started with initial architecture planning.'
      },
      'release': {
        status: 'not-started'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['inventory', 'operations', 'internal'],
    createdAt: twoWeeksAgo,
    updatedAt: today
  },
  {
    id: '3',
    title: 'Mobile Checkout Redesign',
    description: 'Streamline the mobile checkout experience to improve conversion rates.',
    team: 'E-commerce',
    owner: 'Jamie Chen',
    currentPhase: 'results',
    phases: {
      'proposal': {
        startDate: threeWeeksAgo,
        endDate: threeWeeksAgo,
        status: 'completed',
        notes: 'Project approved with high priority.',
        review: {
          id: '301',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'approved', timestamp: threeWeeksAgo },
            { id: '2', status: 'approved', timestamp: threeWeeksAgo },
            { id: '3', status: 'approved', timestamp: threeWeeksAgo },
            { id: '4', status: 'approved', timestamp: threeWeeksAgo }
          ]
        }
      },
      'build': {
        startDate: twoWeeksAgo,
        endDate: lastWeek,
        status: 'completed',
        notes: 'Development completed ahead of schedule.'
      },
      'release': {
        startDate: lastWeek,
        endDate: today,
        status: 'completed',
        notes: 'Successfully deployed to production.'
      },
      'results': {
        startDate: today,
        status: 'in-progress',
        notes: 'Initial metrics show 15% improvement in checkout completion.'
      }
    },
    tags: ['mobile', 'checkout', 'conversion'],
    createdAt: threeWeeksAgo,
    updatedAt: today
  },
  {
    id: '4',
    title: 'Analytics Dashboard',
    description: 'Comprehensive dashboard for tracking key performance metrics.',
    team: 'Data',
    owner: 'Jordan Smith',
    currentPhase: 'proposal',
    phases: {
      'proposal': {
        startDate: today,
        status: 'in-progress',
        notes: 'Initial proposal under review.',
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
    tags: ['analytics', 'dashboard', 'metrics'],
    createdAt: today,
    updatedAt: today
  },
  {
    id: '5',
    title: 'Supplier Portal',
    description: 'A centralized platform for supplier onboarding and management.',
    team: 'Supply Chain',
    owner: 'Drew Garcia',
    currentPhase: 'release',
    phases: {
      'proposal': {
        startDate: threeWeeksAgo,
        endDate: threeWeeksAgo,
        status: 'completed',
        notes: 'Proposal approved with expanded scope.',
        review: {
          id: '501',
          type: 'OK1',
          reviewers: [
            { id: '1', status: 'approved', timestamp: threeWeeksAgo },
            { id: '2', status: 'approved', timestamp: threeWeeksAgo },
            { id: '3', status: 'approved', timestamp: threeWeeksAgo },
            { id: '4', status: 'approved', timestamp: threeWeeksAgo }
          ]
        }
      },
      'build': {
        startDate: twoWeeksAgo,
        endDate: lastWeek,
        status: 'completed',
        notes: 'Development completed with all required features.'
      },
      'release': {
        startDate: lastWeek,
        status: 'in-progress',
        notes: 'Final testing before production deployment.'
      },
      'results': {
        status: 'not-started'
      }
    },
    tags: ['supplier', 'portal', 'supply-chain'],
    createdAt: threeWeeksAgo,
    updatedAt: today
  }
];
