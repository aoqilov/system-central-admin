// ─── Enums ────────────────────────────────────────────────────────────────────

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

// ─── Stats interfaces ─────────────────────────────────────────────────────────

/** Chart uchun bir kunlik ma'lumot — weekly/monthly data massivining har bir elementi */
export interface EmployeeStatsHistory {
  /** X-o'q labeli: "Du" / "2026-06-01" kabi qisqa sana yoki kun nomi */
  date: string;
  /** O'sha kuni necha daqiqa ishlangani (bar chart uchun) */
  workedMinutes?: number;
  /** Operator: o'sha kuni ishlatilgan attraksion soni */
  ridesOperated?: number;
  /** Kassir: o'sha kuni sotilgan chipta soni */
  ticketsSold?: number;
  /** Kassir: o'sha kungi tushum (UZS) */
  revenue?: number;
  /** Security: o'sha kuni qayd etilgan hodisalar soni */
  incidents?: number;
  /** Cleaner: o'sha kuni bajarilgan vazifalar soni */
  tasksDone?: number;
}

/** Xodimning haftalik va oylik tahlili — grafik komponentlariga uzatiladi */
export interface EmployeeAnalytics {
  weekly: {
    /** Hafta boshlanish sanasi (ISO: "2026-06-01") */
    from: string;
    /** Hafta tugash sanasi (ISO: "2026-06-07") */
    to: string;
    /** 7 kunlik ma'lumot massivi — BarChart datasource */
    data: EmployeeStatsHistory[];
  };
  monthly: {
    /** Oyning identifikatori (format: "YYYY-MM") */
    month: string;
    /** Oyning kunlik ma'lumotlari — LineChart yoki AreaChart uchun */
    data: EmployeeStatsHistory[];
  };
}

/** Barcha rollar uchun umumiy — bugungi ish kuni va umumiy statistika */
export interface EmployeeCoreStats {
  /** Bugun necha daqiqa ishlangani (UI: "6h 48m" formatida ko'rsatiladi) */
  workedTodayMinutes?: number;
  /** Kelish vaqti — "HH:mm" formatida (masalan: "08:57") */
  checkIn?: string;
  /** Ketish vaqti — "HH:mm" formatida (masalan: "18:12") */
  checkOut?: string;
  /** Samaradorlik foizi 0–100 (KPI karta uchun) */
  efficiency?: number;
  /** Barcha vaqt davomida ishlagan umumiy daqiqalar soni */
  totalWorkedMinutes?: number;
  /** Davomat foizi 0–100 (kelgan kunlar / ish kunlari) */
  attendanceRate?: number;
}

/** Operator uchun attraksion statistikasi */
export interface OperatorStats {
  /** Bugun ishlatilgan attraksion soni */
  ridesOperatedToday?: number;
  /** Barcha vaqt uchun jami attraksion soni */
  ridesOperatedTotal?: number;
}

/** Kassir uchun sotuv statistikasi */
export interface CashierStats {
  /** Bugun sotilgan chipta soni */
  ticketsSoldToday?: number;
  /** Bugungi tushum (UZS) */
  revenueToday?: number;
}

/** Security uchun xavfsizlik statistikasi */
export interface SecurityStats {
  /** Bugun qayd etilgan hodisalar (voqealar, nizolar) soni */
  incidentsToday?: number;
}

/** Cleaner uchun vazifa statistikasi */
export interface CleanerStats {
  /** Bugun bajarilgan tozalash / tartib vazifalari soni */
  tasksDoneToday?: number;
}

/** Xodimning to'liq statistika bloki — Employee ichida optional field sifatida keladi */
export interface EmployeeStatsUser {
  /** Barcha rollar uchun umumiy ko'rsatkichlar */
  core: EmployeeCoreStats;
  /** Faqat o'z roliga tegishli statistika (rol bo'yicha type narrowing kerak) */
  roleStats?: OperatorStats | CashierStats | SecurityStats | CleanerStats;
  /** Grafik komponentlariga uzatiladigan haftalik va oylik ma'lumotlar */
  analytics: EmployeeAnalytics;
}

// ─── Employee ─────────────────────────────────────────────────────────────────

export interface Employee {
  /** Unikal identifikator (DB primary key) */
  id: number;
  /** Ism */
  firstName: string;
  /** Familiya */
  lastName: string;
  /** firstName + lastName birlashtirilgan to'liq ism (UI da ko'rsatish uchun) */
  fullName?: string;
  /** Yosh (UI da "26 yosh" formatida ko'rsatiladi) */
  age?: number;
  /** Tug'ilgan sana ISO formatida — "1998-07-22" */
  dateOfBirth?: string;
  /** Telefon raqami — "+998901234567" formatida */
  phone?: string;
  /** Telegram username — "@username" formatida */
  telegram_username?: string;
  /** Xodimning lavozimi (EmployeeRole enum) */
  role: EmployeeRole;
  /** Hozirgi holati: faol, nofaol, ta'tilda yoki ishdan bo'shatilgan */
  status: EmployeeStatus;
  /** Oylik maosh (UZS) */
  salary?: number;
  /** Maosh valyutasi — standart "UZS" */
  currency?: string;
  /** Profil rasmi URL — yo'q bo'lsa pravatar.cc fallback ishlatiladi */
  avatarUrl?: string;
  /** Bugungi statistika, grafik ma'lumotlari va rol ko'rsatkichlari */
  statsUser?: EmployeeStatsUser;
  /** Tizimga qo'shilgan sana — ISO "YYYY-MM-DD" */
  createdAt: string;
  /** Oxirgi o'zgartirilgan sana — ISO "YYYY-MM-DD" */
  updatedAt?: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

export const employees: Employee[] = [
  // ── Super Admin ──────────────────────────────────────────────────────────────
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
    statsUser: {
      core: {
        workedTodayMinutes: 480,
        checkIn: "09:00",
        checkOut: "18:00",
        efficiency: 95,
        totalWorkedMinutes: 58800,
        attendanceRate: 98,
      },
      analytics: {
        weekly: {
          from: "2026-06-01",
          to: "2026-06-07",
          data: [
            { date: "Du", workedMinutes: 480 },
            { date: "Se", workedMinutes: 470 },
            { date: "Ch", workedMinutes: 480 },
            { date: "Pa", workedMinutes: 460 },
            { date: "Ju", workedMinutes: 480 },
            { date: "Sh", workedMinutes: 240 },
            { date: "Ya", workedMinutes: 0 },
          ],
        },
        monthly: {
          month: "2026-06",
          data: [
            { date: "2026-06-01", workedMinutes: 480 },
            { date: "2026-06-02", workedMinutes: 470 },
            { date: "2026-06-03", workedMinutes: 480 },
          ],
        },
      },
    },
    createdAt: "2023-01-10",
    updatedAt: "2024-11-01",
  },

  // ── Kassirlar ─────────────────────────────────────────────────────────────────
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
    statsUser: {
      core: {
        workedTodayMinutes: 450,
        checkIn: "09:05",
        checkOut: "17:35",
        efficiency: 88,
        totalWorkedMinutes: 47520,
        attendanceRate: 94,
      },
      roleStats: {
        ticketsSoldToday: 134,
        revenueToday: 4020000,
      } satisfies CashierStats,
      analytics: {
        weekly: {
          from: "2026-06-01",
          to: "2026-06-07",
          data: [
            { date: "Du", ticketsSold: 120, revenue: 3600000 },
            { date: "Se", ticketsSold: 134, revenue: 4020000 },
            { date: "Ch", ticketsSold: 110, revenue: 3300000 },
            { date: "Pa", ticketsSold: 145, revenue: 4350000 },
            { date: "Ju", ticketsSold: 160, revenue: 4800000 },
            { date: "Sh", ticketsSold: 200, revenue: 6000000 },
            { date: "Ya", ticketsSold: 0, revenue: 0 },
          ],
        },
        monthly: {
          month: "2026-06",
          data: [
            { date: "2026-06-01", ticketsSold: 120, revenue: 3600000 },
            { date: "2026-06-02", ticketsSold: 134, revenue: 4020000 },
            { date: "2026-06-03", ticketsSold: 110, revenue: 3300000 },
          ],
        },
      },
    },
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
    statsUser: {
      core: {
        workedTodayMinutes: 420,
        checkIn: "09:15",
        checkOut: "17:15",
        efficiency: 82,
        totalWorkedMinutes: 38400,
        attendanceRate: 90,
      },
      roleStats: {
        ticketsSoldToday: 98,
        revenueToday: 2940000,
      } satisfies CashierStats,
      analytics: {
        weekly: {
          from: "2026-06-01",
          to: "2026-06-07",
          data: [
            { date: "Du", ticketsSold: 90, revenue: 2700000 },
            { date: "Se", ticketsSold: 98, revenue: 2940000 },
            { date: "Ch", ticketsSold: 85, revenue: 2550000 },
            { date: "Pa", ticketsSold: 105, revenue: 3150000 },
            { date: "Ju", ticketsSold: 112, revenue: 3360000 },
            { date: "Sh", ticketsSold: 130, revenue: 3900000 },
            { date: "Ya", ticketsSold: 0, revenue: 0 },
          ],
        },
        monthly: {
          month: "2026-06",
          data: [
            { date: "2026-06-01", ticketsSold: 90, revenue: 2700000 },
            { date: "2026-06-02", ticketsSold: 98, revenue: 2940000 },
            { date: "2026-06-03", ticketsSold: 85, revenue: 2550000 },
          ],
        },
      },
    },
    createdAt: "2023-06-01",
    updatedAt: "2024-09-15",
  },

  // ── Cleanerlar ────────────────────────────────────────────────────────────────
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
    statsUser: {
      core: {
        workedTodayMinutes: 420,
        checkIn: "08:00",
        checkOut: "16:00",
        efficiency: 78,
        totalWorkedMinutes: 42000,
        attendanceRate: 92,
      },
      roleStats: {
        tasksDoneToday: 14,
      } satisfies CleanerStats,
      analytics: {
        weekly: {
          from: "2026-06-01",
          to: "2026-06-07",
          data: [
            { date: "Du", tasksDone: 12 },
            { date: "Se", tasksDone: 14 },
            { date: "Ch", tasksDone: 11 },
            { date: "Pa", tasksDone: 15 },
            { date: "Ju", tasksDone: 13 },
            { date: "Sh", tasksDone: 10 },
            { date: "Ya", tasksDone: 0 },
          ],
        },
        monthly: {
          month: "2026-06",
          data: [
            { date: "2026-06-01", tasksDone: 12 },
            { date: "2026-06-02", tasksDone: 14 },
            { date: "2026-06-03", tasksDone: 11 },
          ],
        },
      },
    },
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
    statsUser: {
      core: {
        workedTodayMinutes: 0,
        attendanceRate: 88,
        totalWorkedMinutes: 36000,
      },
      roleStats: {
        tasksDoneToday: 0,
      } satisfies CleanerStats,
      analytics: {
        weekly: {
          from: "2026-06-01",
          to: "2026-06-07",
          data: [
            { date: "Du", tasksDone: 0 },
            { date: "Se", tasksDone: 0 },
            { date: "Ch", tasksDone: 0 },
            { date: "Pa", tasksDone: 0 },
            { date: "Ju", tasksDone: 0 },
            { date: "Sh", tasksDone: 0 },
            { date: "Ya", tasksDone: 0 },
          ],
        },
        monthly: {
          month: "2026-06",
          data: [
            { date: "2026-06-01", tasksDone: 11 },
            { date: "2026-06-02", tasksDone: 13 },
            { date: "2026-06-03", tasksDone: 0 },
          ],
        },
      },
    },
    createdAt: "2023-05-20",
  },

  // ── Securitylar ───────────────────────────────────────────────────────────────
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
    statsUser: {
      core: {
        workedTodayMinutes: 480,
        checkIn: "08:00",
        checkOut: "20:00",
        efficiency: 91,
        totalWorkedMinutes: 52800,
        attendanceRate: 97,
      },
      roleStats: {
        incidentsToday: 1,
      } satisfies SecurityStats,
      analytics: {
        weekly: {
          from: "2026-06-01",
          to: "2026-06-07",
          data: [
            { date: "Du", incidents: 0 },
            { date: "Se", incidents: 1 },
            { date: "Ch", incidents: 0 },
            { date: "Pa", incidents: 2 },
            { date: "Ju", incidents: 0 },
            { date: "Sh", incidents: 1 },
            { date: "Ya", incidents: 0 },
          ],
        },
        monthly: {
          month: "2026-06",
          data: [
            { date: "2026-06-01", incidents: 0 },
            { date: "2026-06-02", incidents: 1 },
            { date: "2026-06-03", incidents: 0 },
          ],
        },
      },
    },
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
    statsUser: {
      core: {
        workedTodayMinutes: 480,
        checkIn: "08:05",
        checkOut: "20:05",
        efficiency: 87,
        totalWorkedMinutes: 48000,
        attendanceRate: 95,
      },
      roleStats: {
        incidentsToday: 0,
      } satisfies SecurityStats,
      analytics: {
        weekly: {
          from: "2026-06-01",
          to: "2026-06-07",
          data: [
            { date: "Du", incidents: 1 },
            { date: "Se", incidents: 0 },
            { date: "Ch", incidents: 0 },
            { date: "Pa", incidents: 1 },
            { date: "Ju", incidents: 0 },
            { date: "Sh", incidents: 0 },
            { date: "Ya", incidents: 0 },
          ],
        },
        monthly: {
          month: "2026-06",
          data: [
            { date: "2026-06-01", incidents: 1 },
            { date: "2026-06-02", incidents: 0 },
            { date: "2026-06-03", incidents: 0 },
          ],
        },
      },
    },
    createdAt: "2023-07-11",
  },

  // ── Operatorlar ───────────────────────────────────────────────────────────────
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
    statsUser: {
      core: {
        workedTodayMinutes: 408,
        checkIn: "08:57",
        checkOut: "18:12",
        efficiency: 87,
        totalWorkedMinutes: 44880,
        attendanceRate: 96,
      },
      roleStats: {
        ridesOperatedToday: 52,
        ridesOperatedTotal: 1245,
      } satisfies OperatorStats,
      analytics: {
        weekly: {
          from: "2026-06-01",
          to: "2026-06-07",
          data: [
            { date: "Du", ridesOperated: 45 },
            { date: "Se", ridesOperated: 52 },
            { date: "Ch", ridesOperated: 38 },
            { date: "Pa", ridesOperated: 60 },
            { date: "Ju", ridesOperated: 75 },
            { date: "Sh", ridesOperated: 90 },
            { date: "Ya", ridesOperated: 70 },
          ],
        },
        monthly: {
          month: "2026-06",
          data: [
            { date: "2026-06-01", ridesOperated: 45 },
            { date: "2026-06-02", ridesOperated: 52 },
            { date: "2026-06-03", ridesOperated: 38 },
          ],
        },
      },
    },
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
    statsUser: {
      core: {
        workedTodayMinutes: 430,
        checkIn: "09:02",
        checkOut: "18:15",
        efficiency: 84,
        totalWorkedMinutes: 41280,
        attendanceRate: 93,
      },
      roleStats: {
        ridesOperatedToday: 47,
        ridesOperatedTotal: 980,
      } satisfies OperatorStats,
      analytics: {
        weekly: {
          from: "2026-06-01",
          to: "2026-06-07",
          data: [
            { date: "Du", ridesOperated: 40 },
            { date: "Se", ridesOperated: 47 },
            { date: "Ch", ridesOperated: 35 },
            { date: "Pa", ridesOperated: 55 },
            { date: "Ju", ridesOperated: 68 },
            { date: "Sh", ridesOperated: 80 },
            { date: "Ya", ridesOperated: 60 },
          ],
        },
        monthly: {
          month: "2026-06",
          data: [
            { date: "2026-06-01", ridesOperated: 40 },
            { date: "2026-06-02", ridesOperated: 47 },
            { date: "2026-06-03", ridesOperated: 35 },
          ],
        },
      },
    },
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
    statsUser: {
      core: {
        workedTodayMinutes: 0,
        attendanceRate: 72,
        totalWorkedMinutes: 28800,
      },
      roleStats: {
        ridesOperatedToday: 0,
        ridesOperatedTotal: 540,
      } satisfies OperatorStats,
      analytics: {
        weekly: {
          from: "2026-06-01",
          to: "2026-06-07",
          data: [
            { date: "Du", ridesOperated: 30 },
            { date: "Se", ridesOperated: 0 },
            { date: "Ch", ridesOperated: 0 },
            { date: "Pa", ridesOperated: 0 },
            { date: "Ju", ridesOperated: 0 },
            { date: "Sh", ridesOperated: 0 },
            { date: "Ya", ridesOperated: 0 },
          ],
        },
        monthly: {
          month: "2026-06",
          data: [
            { date: "2026-06-01", ridesOperated: 30 },
            { date: "2026-06-02", ridesOperated: 0 },
            { date: "2026-06-03", ridesOperated: 0 },
          ],
        },
      },
    },
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
    statsUser: {
      core: {
        workedTodayMinutes: 445,
        checkIn: "09:00",
        checkOut: "18:25",
        efficiency: 90,
        totalWorkedMinutes: 38880,
        attendanceRate: 95,
      },
      roleStats: {
        ridesOperatedToday: 61,
        ridesOperatedTotal: 876,
      } satisfies OperatorStats,
      analytics: {
        weekly: {
          from: "2026-06-01",
          to: "2026-06-07",
          data: [
            { date: "Du", ridesOperated: 55 },
            { date: "Se", ridesOperated: 61 },
            { date: "Ch", ridesOperated: 48 },
            { date: "Pa", ridesOperated: 70 },
            { date: "Ju", ridesOperated: 82 },
            { date: "Sh", ridesOperated: 95 },
            { date: "Ya", ridesOperated: 72 },
          ],
        },
        monthly: {
          month: "2026-06",
          data: [
            { date: "2026-06-01", ridesOperated: 55 },
            { date: "2026-06-02", ridesOperated: 61 },
            { date: "2026-06-03", ridesOperated: 48 },
          ],
        },
      },
    },
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
    statsUser: {
      core: {
        workedTodayMinutes: 460,
        checkIn: "08:45",
        checkOut: "18:30",
        efficiency: 93,
        totalWorkedMinutes: 36480,
        attendanceRate: 97,
      },
      roleStats: {
        ridesOperatedToday: 68,
        ridesOperatedTotal: 720,
      } satisfies OperatorStats,
      analytics: {
        weekly: {
          from: "2026-06-01",
          to: "2026-06-07",
          data: [
            { date: "Du", ridesOperated: 58 },
            { date: "Se", ridesOperated: 68 },
            { date: "Ch", ridesOperated: 52 },
            { date: "Pa", ridesOperated: 74 },
            { date: "Ju", ridesOperated: 88 },
            { date: "Sh", ridesOperated: 100 },
            { date: "Ya", ridesOperated: 80 },
          ],
        },
        monthly: {
          month: "2026-06",
          data: [
            { date: "2026-06-01", ridesOperated: 58 },
            { date: "2026-06-02", ridesOperated: 68 },
            { date: "2026-06-03", ridesOperated: 52 },
          ],
        },
      },
    },
    createdAt: "2024-03-10",
  },
];
