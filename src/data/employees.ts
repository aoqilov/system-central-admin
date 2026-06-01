export enum EmployeeRole {
  ADMIN = "SUPER_ADMIN",
  OPERATOR = "OPERATOR_ATTRACTION",
  CASHIER = "CASHIER",
  SECURITY = "SECURITY",
  CLEANER = "CLEANER",
}

export enum EmployeeStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  FIRED = "FIRED",
  VACATION = "VACATION",
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  fullName?: string;

  age?: number;
  dateOfBirth?: string;

  phone?: string;
  telegram_username?: string;

  role: EmployeeRole;
  status: EmployeeStatus;

  salary?: number;
  currency?: string;

  avatarUrl?: string;

  createdAt: string;
  updatedAt?: string;
}

export const employees: Employee[] = [
  // Super Admin
  {
    id: 1,
    firstName: "Jasur",
    lastName: "Toshmatov",
    fullName: "Jasur Toshmatov",
    age: 34,
    dateOfBirth: "1990-03-12",
    phone: "+998901234567",
    telegram_username: "@jasur_admin",
    role: EmployeeRole.ADMIN,
    status: EmployeeStatus.ACTIVE,
    salary: 5000000,
    currency: "UZS",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    createdAt: "2023-01-10",
    updatedAt: "2024-11-01",
  },

  // Kassirlar
  {
    id: 2,
    firstName: "Malika",
    lastName: "Yusupova",
    fullName: "Malika Yusupova",
    age: 26,
    dateOfBirth: "1998-07-22",
    phone: "+998902345678",
    telegram_username: "@malika_kassir",
    role: EmployeeRole.CASHIER,
    status: EmployeeStatus.ACTIVE,
    salary: 2500000,
    currency: "UZS",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    createdAt: "2023-03-15",
    updatedAt: "2024-10-20",
  },
  {
    id: 3,
    firstName: "Dilnoza",
    lastName: "Rahimova",
    fullName: "Dilnoza Rahimova",
    age: 24,
    dateOfBirth: "2000-11-05",
    phone: "+998903456789",
    telegram_username: "@dilnoza_kassir",
    role: EmployeeRole.CASHIER,
    status: EmployeeStatus.ACTIVE,
    salary: 2500000,
    currency: "UZS",
    avatarUrl: "https://i.pravatar.cc/150?img=9",
    createdAt: "2023-06-01",
    updatedAt: "2024-09-15",
  },

  // Cleanerlar
  {
    id: 4,
    firstName: "Bahodir",
    lastName: "Xoliqov",
    fullName: "Bahodir Xoliqov",
    age: 30,
    dateOfBirth: "1994-02-18",
    phone: "+998904567890",
    role: EmployeeRole.CLEANER,
    status: EmployeeStatus.ACTIVE,
    salary: 1800000,
    currency: "UZS",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    createdAt: "2023-04-10",
  },
  {
    id: 5,
    firstName: "Nargiza",
    lastName: "Mirzayeva",
    fullName: "Nargiza Mirzayeva",
    age: 28,
    dateOfBirth: "1996-09-30",
    phone: "+998905678901",
    role: EmployeeRole.CLEANER,
    status: EmployeeStatus.VACATION,
    salary: 1800000,
    currency: "UZS",
    avatarUrl: "https://i.pravatar.cc/150?img=16",
    createdAt: "2023-05-20",
  },

  // Securitylar
  {
    id: 6,
    firstName: "Otabek",
    lastName: "Sobirov",
    fullName: "Otabek Sobirov",
    age: 32,
    dateOfBirth: "1992-06-14",
    phone: "+998906789012",
    role: EmployeeRole.SECURITY,
    status: EmployeeStatus.ACTIVE,
    salary: 2200000,
    currency: "UZS",
    avatarUrl: "https://i.pravatar.cc/150?img=20",
    createdAt: "2023-02-28",
    updatedAt: "2024-08-10",
  },
  {
    id: 7,
    firstName: "Sherzod",
    lastName: "Qodirov",
    fullName: "Sherzod Qodirov",
    age: 29,
    dateOfBirth: "1995-12-03",
    phone: "+998907890123",
    role: EmployeeRole.SECURITY,
    status: EmployeeStatus.ACTIVE,
    salary: 2200000,
    currency: "UZS",
    avatarUrl: "https://i.pravatar.cc/150?img=22",
    createdAt: "2023-07-11",
  },

  // Operatorlar
  {
    id: 8,
    firstName: "Sardor",
    lastName: "Nabiyev",
    fullName: "Sardor Nabiyev",
    age: 27,
    dateOfBirth: "1997-04-09",
    phone: "+998908901234",
    telegram_username: "@sardor_op",
    role: EmployeeRole.OPERATOR,
    status: EmployeeStatus.ACTIVE,
    salary: 2000000,
    currency: "UZS",
    avatarUrl: "https://i.pravatar.cc/150?img=30",
    createdAt: "2023-08-01",
  },
  {
    id: 9,
    firstName: "Umida",
    lastName: "Hasanova",
    fullName: "Umida Hasanova",
    age: 25,
    dateOfBirth: "1999-01-27",
    phone: "+998909012345",
    telegram_username: "@umida_op",
    role: EmployeeRole.OPERATOR,
    status: EmployeeStatus.ACTIVE,
    salary: 2000000,
    currency: "UZS",
    avatarUrl: "https://i.pravatar.cc/150?img=35",
    createdAt: "2023-08-15",
  },
  {
    id: 10,
    firstName: "Bobur",
    lastName: "Ergashev",
    fullName: "Bobur Ergashev",
    age: 23,
    dateOfBirth: "2001-08-19",
    phone: "+998900123456",
    role: EmployeeRole.OPERATOR,
    status: EmployeeStatus.INACTIVE,
    salary: 2000000,
    currency: "UZS",
    avatarUrl: "https://i.pravatar.cc/150?img=40",
    createdAt: "2024-01-05",
  },
  {
    id: 11,
    firstName: "Kamola",
    lastName: "Tursunova",
    fullName: "Kamola Tursunova",
    age: 26,
    dateOfBirth: "1998-05-11",
    phone: "+998901112233",
    telegram_username: "@kamola_op",
    role: EmployeeRole.OPERATOR,
    status: EmployeeStatus.ACTIVE,
    salary: 2000000,
    currency: "UZS",
    avatarUrl: "https://i.pravatar.cc/150?img=44",
    createdAt: "2024-02-20",
  },
  {
    id: 12,
    firstName: "Firdavs",
    lastName: "Alimov",
    fullName: "Firdavs Alimov",
    age: 31,
    dateOfBirth: "1993-10-07",
    phone: "+998902223344",
    telegram_username: "@firdavs_op",
    role: EmployeeRole.OPERATOR,
    status: EmployeeStatus.ACTIVE,
    salary: 2000000,
    currency: "UZS",
    avatarUrl: "https://i.pravatar.cc/150?img=50",
    createdAt: "2024-03-10",
  },
];
