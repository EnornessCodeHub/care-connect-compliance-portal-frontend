// Mock data for dashboard demonstration
type DashboardStatus = "critical" | "warning" | "success" | "info";

interface DashboardItem {
  value: string | number;
  status: DashboardStatus;
}

interface DashboardData {
  quickAlerts: {
    newIncidents: DashboardItem;
    newComplaints: DashboardItem;
    highRiskAlerts: DashboardItem;
    restrictivePracticeAlerts: DashboardItem;
  };
  dailyOperations: {
    lateCheckIns: DashboardItem;
    lateCheckOuts: DashboardItem;
    todayCancellationsStaff: DashboardItem;
    todayCancellationsClient: DashboardItem;
    shiftCoverageGaps: DashboardItem;
  };
  compliance: {
    expiredStaffDocs: DashboardItem;
    staffDocsExpiring30: DashboardItem;
    staffDocsExpiring60: DashboardItem;
    staffDocsExpiring90: DashboardItem;
    expiredClientDocs: DashboardItem;
    clientDocsExpiring30: DashboardItem;
    clientDocsExpiring60: DashboardItem;
    clientDocsExpiring90: DashboardItem;
    overdueTasks: DashboardItem;
  };
  financial: {
    unvoicedCosts: DashboardItem;
    invoicedCosts: DashboardItem;
    outstandingPayments30: DashboardItem;
    outstandingPayments60: DashboardItem;
    outstandingPayments90: DashboardItem;
    pendingApprovals: DashboardItem;
    fundingUtilisation: DashboardItem;
  };
  workforce: {
    staffAvailabilityToday: DashboardItem;
    leaveRequests: DashboardItem;
    staffParticipantRatioAlerts: DashboardItem;
    serviceHoursDelivered: DashboardItem;
    attendanceRate: DashboardItem;
  };
  strategic: {
    topReferrers: DashboardItem;
    openCasesByStatus: DashboardItem;
    participantSatisfaction: DashboardItem;
  };
}

export const mockDashboardData: DashboardData = {
  quickAlerts: {
    newIncidents: { value: 3, status: "critical" },
    newComplaints: { value: 1, status: "warning" },
    highRiskAlerts: { value: 7, status: "critical" },
    restrictivePracticeAlerts: { value: 2, status: "warning" },
  },
  
  dailyOperations: {
    lateCheckIns: { value: 5, status: "warning" },
    lateCheckOuts: { value: 3, status: "warning" },
    todayCancellationsStaff: { value: 2, status: "info" },
    todayCancellationsClient: { value: 4, status: "warning" },
    shiftCoverageGaps: { value: 1, status: "critical" },
  },
  
  compliance: {
    expiredStaffDocs: { value: 8, status: "critical" },
    staffDocsExpiring30: { value: 12, status: "warning" },
    staffDocsExpiring60: { value: 15, status: "info" },
    staffDocsExpiring90: { value: 18, status: "info" },
    expiredClientDocs: { value: 3, status: "critical" },
    clientDocsExpiring30: { value: 7, status: "warning" },
    clientDocsExpiring60: { value: 9, status: "info" },
    clientDocsExpiring90: { value: 11, status: "info" },
    overdueTasks: { value: 23, status: "warning" },
  },
  
  financial: {
    unvoicedCosts: { value: "$45,230", status: "warning" },
    invoicedCosts: { value: "$123,450", status: "success" },
    outstandingPayments30: { value: "$15,670", status: "warning" },
    outstandingPayments60: { value: "$8,450", status: "critical" },
    outstandingPayments90: { value: "$3,200", status: "critical" },
    pendingApprovals: { value: 6, status: "info" },
    fundingUtilisation: { value: "87%", status: "success" },
  },
  
  workforce: {
    staffAvailabilityToday: { value: "92%", status: "success" },
    leaveRequests: { value: 14, status: "info" },
    staffParticipantRatioAlerts: { value: 2, status: "warning" },
    serviceHoursDelivered: { value: "94%", status: "success" },
    attendanceRate: { value: "96%", status: "success" },
  },
  
  strategic: {
    topReferrers: { value: 15, status: "success" },
    openCasesByStatus: { value: 48, status: "info" },
    participantSatisfaction: { value: "4.2/5", status: "success" },
  },
};

export function generateRandomData(): DashboardData {
  // Simulate real-time data updates
  const variations = {
    quickAlerts: {
      newIncidents: Math.floor(Math.random() * 5),
      newComplaints: Math.floor(Math.random() * 3),
      highRiskAlerts: Math.floor(Math.random() * 10),
      restrictivePracticeAlerts: Math.floor(Math.random() * 4),
    },
    financialAmounts: [
      "$42,150", "$47,890", "$51,200", "$39,670", "$44,330"
    ],
    percentages: [
      "85%", "87%", "89%", "91%", "93%", "95%", "97%"
    ]
  };
  
  return {
    ...mockDashboardData,
    quickAlerts: {
      ...mockDashboardData.quickAlerts,
      newIncidents: { 
        value: variations.quickAlerts.newIncidents, 
        status: variations.quickAlerts.newIncidents > 2 ? "critical" : "warning"
      },
    },
    financial: {
      ...mockDashboardData.financial,
      unvoicedCosts: { 
        value: variations.financialAmounts[Math.floor(Math.random() * variations.financialAmounts.length)], 
        status: "warning"
      },
    },
    workforce: {
      ...mockDashboardData.workforce,
      staffAvailabilityToday: { 
        value: variations.percentages[Math.floor(Math.random() * variations.percentages.length)], 
        status: "success"
      },
    }
  };
}