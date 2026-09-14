export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
export type CollectionFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type InterestMethod = 'UPFRONT' | 'FLAT' | 'REDUCING_BALANCE';
export type LoanStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'ACTIVE'
  | 'PARTIALLY_PAID'
  | 'COMPLETED'
  | 'OVERDUE'
  | 'CLOSED'
  | 'CANCELLED';

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface Customer {
  id: number;
  customerCode: string;
  firstName: string;
  lastName?: string;
  mobileNumber: string;
  alternateMobileNumber?: string;
  email?: string;
  gender?: string;
  dateOfBirth?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  identificationType?: string;
  identificationNumber?: string;
  status: CustomerStatus;
}

export type CustomerInput = Omit<Customer, 'id' | 'customerCode'>;

export interface LoanProduct {
  id: number;
  productCode: string;
  productName: string;
  collectionFrequency: CollectionFrequency;
  interestMethod: InterestMethod;
  defaultInterestRate: number;
  defaultTermCount: number;
  minAmount?: number;
  maxAmount?: number;
  active: boolean;
}

export interface Loan {
  id: number;
  loanNumber: string;
  customerId: number;
  customerName?: string;
  loanProductId: number;
  productName?: string;
  collectionFrequency: CollectionFrequency;
  interestMethod: InterestMethod;
  principalAmount: number;
  interestRate: number;
  interestAmount: number;
  disbursedAmount: number;
  collectionAmount?: number;
  termCount?: number;
  remainingTermCount?: number;
  startDate: string;
  maturityDate?: string;
  outstandingPrincipal: number;
  outstandingInterest: number;
  totalCollected: number;
  status: LoanStatus;
}

export interface LoanSchedule {
  id: number;
  installmentNumber: number;
  dueDate: string;
  principalDue: number;
  interestDue: number;
  totalDue: number;
  paidAmount: number;
  status: string;
}

export interface CollectionTransaction {
  id: number;
  transactionReference: string;
  loanId: number;
  customerId: number;
  scheduleId?: number;
  collectionDate: string;
  dueAmount: number;
  paidAmount: number;
  principalAmount: number;
  interestAmount: number;
  outstandingBalance: number;
  paymentMode: string;
  collectorId?: number;
  remarks?: string;
  status: string;
}

export interface PagedResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export type ChitStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE';

export interface ChitScheme {
  id: number;
  chitCode: string;
  name: string;
  chitAmount: number;
  memberCount: number;
  monthlyContribution: number;
  durationMonths: number;
  startDate: string;
  currentRound: number;
  status: ChitStatus;
}

export type ChitSchemeInput = Omit<ChitScheme, 'id' | 'chitCode' | 'currentRound'>;

export interface ChitMember {
  id: number;
  chitId: number;
  customerId: number;
  customerCode?: string;
  customerName: string;
  joinedDate: string;
  contributionAmount: number;
  amountPaid: number;
  amountPending: number;
  status: string;
}

export interface ChitRound {
  id: number;
  chitId: number;
  roundNumber: number;
  collectionDate: string;
  totalDue: number;
  totalCollected: number;
  totalPending: number;
  winnerMemberId?: number;
  winnerName?: string;
  bidAmount?: number;
  deductionAmount?: number;
  payoutAmount?: number;
  payoutDate?: string;
  status: string;
}

export interface ChitContribution {
  id: number;
  roundId: number;
  memberId: number;
  memberName: string;
  dueAmount: number;
  paidAmount: number;
  paidDate?: string;
  paymentMode?: string;
  transactionReference?: string;
  status: PaymentStatus;
}

export interface DashboardKpis {
  totalCustomers: number;
  activeCustomers: number;
  activeLoans: number;
  totalLoanAmount: number;
  totalAmountCollected: number;
  totalPrincipalCollected: number;
  totalInterestCollected: number;
  totalOutstandingAmount: number;
  todayCollection: number;
  todayPendingCollection: number;
  dailyCollection: number;
  weeklyCollection: number;
  monthlyCollection: number;
  activeChits: number;
  totalChitCollection: number;
  pendingChitPayments: number;
}

export type ReportType =
  | 'customer-loans' | 'active-loans' | 'completed-loans' | 'outstanding-loans'
  | 'overdue-loans' | 'outstanding-balance' | 'daily-collections' | 'weekly-collections'
  | 'monthly-collections' | 'date-range-collections' | 'collector-collections'
  | 'principal-collection' | 'interest-collection' | 'customer-statement'
  | 'active-chits' | 'member-chits' | 'pending-chit-payments' | 'chit-history'
  | 'monthly-chit-collection';

export interface ReportFilters {
  from?: string;
  to?: string;
  customerId?: number;
  loanType?: string;
  chitId?: number;
  collectorId?: number;
  status?: string;
}

export interface ReportResult {
  columns: string[];
  rows: Record<string, string | number | boolean | null>[];
  totalRows: number;
}

export interface CustomerFinancialProfile {
  customer: Customer;
  activeLoans: Loan[];
  completedLoans: Loan[];
  activeChits: ChitScheme[];
  completedChits: ChitScheme[];
  totalBorrowedAmount: number;
  totalPrincipalPaid: number;
  totalInterestPaid: number;
  outstandingPrincipal: number;
  monthlyContributions: number;
  pendingContributions: number;
  chitHistory?: ChitRound[];
}

export interface BusinessSettings {
  defaultCurrency: string;
  timezone: string;
  dailyInterestRate: number;
  weeklyInterestRate: number;
  monthlyInterestRate: number;
  gracePeriodDays: number;
  defaultLoanDuration: number;
  defaultChitAmount: number;
  defaultChitMembers: number;
  receiptPrefix: string;
}

export interface AuditEntry {
  id: number;
  occurredAt: string;
  actorName: string;
  actorRole?: string;
  action: string;
  entityType: string;
  entityId: string;
  transactionReference?: string;
  summary: string;
  beforeValue?: unknown;
  afterValue?: unknown;
}

export interface AuditFilters {
  from?: string;
  to?: string;
  actor?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  page?: number;
  size?: number;
}

export interface FinanceAttachment {
  id: number;
  entityType: string;
  entityId: string;
  fileName: string;
  contentType?: string;
  fileSize?: number;
  downloadUrl?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface StaffMember {
  userId: number;
  userName: string;
  firstName: string;
  lastName?: string;
}

export interface FinancePermission {
  id: number;
  permissionCode: string;
  description?: string;
}

export interface FinanceRole {
  id: number;
  roleCode: string;
  roleName: string;
  description?: string;
  active: boolean;
  permissions: FinancePermission[];
}

export interface FinanceUser {
  userId: number;
  userName: string;
  firstName: string;
  lastName?: string;
  email?: string;
  active: boolean;
  userGroupId?: number;
  roles: Array<Pick<FinanceRole, 'id' | 'roleCode' | 'roleName' | 'active'>>;
}
