export const dataMarch = {
  meta: {
    title: "Ежемесячный отчет по результатам работы",
    period: "Март 2026",
    manager: "Бизнес менеджер: Мельникова Анастасия Викторовна"
  },

  economic: {
    minTargetPercent: 75,

    portable: {
      summary: {
        plan: 2230000,
        fact: 1693602,
        percent: 76,
        prevPercent: 81,
        applesPlan: 15,
        applesFact: 8,
        prevApplesFact: 9,
        prevApplesStores: 5
      },
      stores: [
        { name: "Березники Мира 82 Т2 Универсам Семья", plan: 190000, fact: 122897, percent: 64, trafficDelta: 5, conversionDelta: -1, avgPriceDelta: -37 },
        { name: "Березники Пятилетки 41 Т2 ТЦ ЦУМ", plan: 420000, fact: 85696, percent: 20, trafficDelta: -1, conversionDelta: -55, avgPriceDelta: -58 },
        { name: "Березники Пятилетки 87а Т2 ТЦ Миллениум", plan: 125000, fact: 74142, percent: 59, trafficDelta: 3, conversionDelta: 4, avgPriceDelta: -45 },
        { name: "Березники Юбилейная 26а Т2", plan: 195000, fact: 165029, percent: 84, trafficDelta: -7, conversionDelta: -40, avgPriceDelta: 70 },
        { name: "Кунгур Бачурина 56А Т2 ЦЛ Лидер", plan: 40000, fact: 47549, percent: 119, trafficDelta: -13, conversionDelta: -9, avgPriceDelta: 58 },
        { name: "Кунгур Карла Маркса 17А Т2", plan: 150000, fact: 87372, percent: 58, trafficDelta: -6, conversionDelta: -38, avgPriceDelta: -29 },
        { name: "Кунгур Пугачева 25 Т2", plan: 165000, fact: 114901, percent: 69, trafficDelta: 15, conversionDelta: -53, avgPriceDelta: 5 },
        { name: "Соликамск 20 лет Победы 117 Т2 ТЦ ЦУМ", plan: 450000, fact: 546518, percent: 121, trafficDelta: 11, conversionDelta: -5, avgPriceDelta: 28 },
        { name: "Соликамск Северная 48 Т2 ТЦ Бисмарк Авеню", plan: 270000, fact: 223507, percent: 83, trafficDelta: 15, conversionDelta: -38, avgPriceDelta: 3 },
        { name: "Соликамск Северная 55 Т2 ТЦ Европа", plan: 225000, fact: 225991, percent: 100, trafficDelta: 1, conversionDelta: -34, avgPriceDelta: 76 }
      ],
      sellOut: {
        plan: 16,
        fact: 3,
        percent: 19,
        prevPlan: 9,
        prevFact: 4,
        prevPercent: 44,
        activeStores: 2
      }
    },
    accessoriesServices: {
      summary: {
        accessoriesPlan: 859926,
        accessoriesFact: 592642,
        servicesPlan: 243138,
        servicesFact: 204134,
        totalPercent: 72,
        prevTotalPercent: 70,
        extraShareCurrent: 71,
        extraSharePrev: 70,
        attachCurrent: 3.2,
        attachPrev: 3.03,
        packagesCurrent: 32,
        packagesPrev: 30,
        accessoriesAvgPriceCurrent: 1047,
        accessoriesAvgPricePrev: 1133,
        accessoriesShareCurrent: 35,
        accessoriesSharePrev: 36,
        servicesAvgPriceCurrent: 1052,
        servicesAvgPricePrev: 1058,
        servicesShareCurrent: 12.1,
        servicesSharePrev: 11.4
      },
      stores: [
        { name: "Березники Мира 82 Т2 Универсам Семья", accessoriesFact: 93905, accessoriesPercent: 74, accessoriesAvgPrice: 854, servicesFact: 21060, servicesPercent: 95, packages: 3, extraSharePercent: 77, attach: 4.89 },
        { name: "Березники Пятилетки 41 Т2 ТЦ ЦУМ", accessoriesFact: 58245, accessoriesPercent: 35, accessoriesAvgPrice: 1022, servicesFact: 20158, servicesPercent: 38, packages: 2, extraSharePercent: 36, attach: 2.11 },
        { name: "Березники Пятилетки 87а Т2 ТЦ Миллениум", accessoriesFact: 42511, accessoriesPercent: 86, accessoriesAvgPrice: 904, servicesFact: 12233, servicesPercent: 89, packages: 1, extraSharePercent: 89, attach: 1.6 },
        { name: "Березники Юбилейная 26а Т2", accessoriesFact: 55788, accessoriesPercent: 72, accessoriesAvgPrice: 1213, servicesFact: 18878, servicesPercent: 76, packages: 1, extraSharePercent: 76, attach: 4.29 },
        { name: "Кунгур Бачурина 56А Т2 ЦЛ Лидер", accessoriesFact: 39301, accessoriesPercent: 86, accessoriesAvgPrice: 1228, servicesFact: 8977, servicesPercent: 91, packages: 2, extraSharePercent: 91, attach: 1.0 },
        { name: "Кунгур Карла Маркса 17А Т2", accessoriesFact: 55029, accessoriesPercent: 98, accessoriesAvgPrice: 1251, servicesFact: 20445, servicesPercent: 100, packages: 5, extraSharePercent: 100, attach: 2.75 },
        { name: "Кунгур Пугачева 25 Т2", accessoriesFact: 42836, accessoriesPercent: 59, accessoriesAvgPrice: 974, servicesFact: 26438, servicesPercent: 68, packages: 5, extraSharePercent: 68, attach: 2.62 },
        { name: "Соликамск 20 лет Победы 117 Т2 ТЦ ЦУМ", accessoriesFact: 92086, accessoriesPercent: 76, accessoriesAvgPrice: 1083, servicesFact: 33564, servicesPercent: 77, packages: 7, extraSharePercent: 77, attach: 4.05 },
        { name: "Соликамск Северная 48 Т2 ТЦ Бисмарк Авеню", accessoriesFact: 46202, accessoriesPercent: 54, accessoriesAvgPrice: 906, servicesFact: 14130, servicesPercent: 58, packages: 2, extraSharePercent: 58, attach: 3.08 },
        { name: "Соликамск Северная 55 Т2 ТЦ Европа", accessoriesFact: 66739, accessoriesPercent: 108, accessoriesAvgPrice: 1335, servicesFact: 28251, servicesPercent: 116, packages: 4, extraSharePercent: 116, attach: 2.92 }
      ]
    },

    credits: {
      summary: {
        planRevenue: 972869,
        factRevenue: 862145,
        percent: 88,
        planShare: 25,
        factShare: 30,
        prevShare: 27,
        prevPercent: 107,
        planApplications: 136,
        prevApplications: 28,
        applications: 38
      },
      stores: [
        { name: "Березники Мира 82 Т2 Универсам Семья", factRevenue: 43527, shareFact: 16, applications: 2, hasCredits: true },
        { name: "Березники Пятилетки 41 Т2 ТЦ ЦУМ", factRevenue: 1200, shareFact: 1, applications: 1, hasCredits: false },
        { name: "Березники Пятилетки 87а Т2 ТЦ Миллениум", factRevenue: 20419, shareFact: 15, applications: 1, hasCredits: true },
        { name: "Березники Юбилейная 26а Т2", factRevenue: 158249, shareFact: 56, applications: 2, hasCredits: true },
        { name: "Кунгур Бачурина 56А Т2 ЦЛ Лидер", factRevenue: 22580, shareFact: 20, applications: 1, hasCredits: true },
        { name: "Кунгур Карла Маркса 17А Т2", factRevenue: 1800, shareFact: 1, applications: 3, hasCredits: false },
        { name: "Кунгур Пугачева 25 Т2", factRevenue: 4490, shareFact: 2, applications: 1, hasCredits: false },
        { name: "Соликамск 20 лет Победы 117 Т2 ТЦ ЦУМ", factRevenue: 246918, shareFact: 31, applications: 5, hasCredits: true },
        { name: "Соликамск Северная 48 Т2 ТЦ Бисмарк Авеню", factRevenue: 112319, shareFact: 35, applications: 2, hasCredits: true },
        { name: "Соликамск Северная 55 Т2 ТЦ Европа", factRevenue: 250644, shareFact: 64, applications: 3, hasCredits: true }
      ]
    }
  },

  operator: {
    grading: {
      full: 90,
      medium: 75,
      low: 50
    },

    sims: {
      summary: {
        plan: 2380,
        fact: 2517,
        percent: 106,
        convPlan: 7.6,
        convFact: 7.7,
        prevPercent: 99,
        prevConv: 6.8,
        inactiveCurrent: 26,
        inactivePrev: 35,
        unconfirmedCurrent: 3,
        unconfirmedPrev: 7
      },
      stores: [
        { name: "Березники Мира 82 Т2 Универсам Семья", percent: 130, convPlan: 7.4, convFact: 8.7, metPlan: true },
        { name: "Березники Пятилетки 41 Т2 ТЦ ЦУМ", percent: 107, convPlan: 5.4, convFact: 6.5, metPlan: true },
        { name: "Березники Пятилетки 87а Т2 ТЦ Миллениум", percent: 116, convPlan: 5.8, convFact: 7.4, metPlan: true },
        { name: "Березники Юбилейная 26а Т2", percent: 113, convPlan: 6.5, convFact: 9.7, metPlan: true },
        { name: "Кунгур Бачурина 56А Т2 ЦЛ Лидер", percent: 116, convPlan: 4.9, convFact: 6.6, metPlan: true },
        { name: "Кунгур Карла Маркса 17А Т2", percent: 101, convPlan: 7.8, convFact: 11.5, metPlan: true },
        { name: "Кунгур Пугачева 25 Т2", percent: 89, convPlan: 6.7, convFact: 7.1, metPlan: false },
        { name: "Соликамск 20 лет Победы 117 Т2 ТЦ ЦУМ", percent: 109, convPlan: 8.7, convFact: 9.9, metPlan: true },
        { name: "Соликамск Северная 48 Т2 ТЦ Бисмарк Авеню", percent: 91, convPlan: 5.1, convFact: 5.5, metPlan: false },
        { name: "Соликамск Северная 55 Т2 ТЦ Европа", percent: 99, convPlan: 4.6, convFact: 6.1, metPlan: false }
      ]
    },

    mnp: {
      summary: {
        plan: 567,
        fact: 686,
        percent: 121,
        prevPercent: 106,
        applications: 977,
        applicationsShare: 38.8
      },
      stores: [
        { name: "Березники Мира 82 Т2 Универсам Семья", plan: 85, requests: 161, fact: 123, applicationsShare: 49.1, percent: 145, metPlan: true },
        { name: "Березники Пятилетки 41 Т2 ТЦ ЦУМ", plan: 121, requests: 180, fact: 126, applicationsShare: 45.3, percent: 104, metPlan: true },
        { name: "Березники Пятилетки 87а Т2 ТЦ Миллениум", plan: 39, requests: 62, fact: 39, applicationsShare: 40.8, percent: 100, metPlan: true },
        { name: "Березники Юбилейная 26а Т2", plan: 27, requests: 63, fact: 48, applicationsShare: 37.7, percent: 178, metPlan: true },
        { name: "Кунгур Бачурина 56А Т2 ЦЛ Лидер", plan: 13, requests: 46, fact: 35, applicationsShare: 37.1, percent: 269, metPlan: true },
        { name: "Кунгур Карла Маркса 17А Т2", plan: 60, requests: 142, fact: 93, applicationsShare: 47.3, percent: 155, metPlan: true },
        { name: "Кунгур Пугачева 25 Т2", plan: 62, requests: 106, fact: 80, applicationsShare: 40.5, percent: 129, metPlan: true },
        { name: "Соликамск 20 лет Победы 117 Т2 ТЦ ЦУМ", plan: 62, requests: 116, fact: 86, applicationsShare: 30.4, percent: 139, metPlan: true },
        { name: "Соликамск Северная 48 Т2 ТЦ Бисмарк Авеню", plan: 55, requests: 63, fact: 31, applicationsShare: 29.4, percent: 56, metPlan: false },
        { name: "Соликамск Северная 55 Т2 ТЦ Европа", plan: 43, requests: 38, fact: 25, applicationsShare: 19.9, percent: 58, metPlan: false }
      ]
    },
    abonGold: {
      summary: {
        plan: 140,
        fact: 344,
        goldFact: 344,
        subscriptionsFact: 0,
        percent: 246,
        prevGoldPercent: 336,
        subscriptionsStoresOnly: 0
      },
      stores: [
        { name: "Березники Мира 82 Т2 Универсам Семья", plan: 15, fact: 38, gold: 38, subscriptions: 0, percent: 253, metPlan: true },
        { name: "Березники Пятилетки 41 Т2 ТЦ ЦУМ", plan: 21, fact: 69, gold: 69, subscriptions: 0, percent: 329, metPlan: true },
        { name: "Березники Пятилетки 87а Т2 ТЦ Миллениум", plan: 8, fact: 22, gold: 22, subscriptions: 0, percent: 275, metPlan: true },
        { name: "Березники Юбилейная 26а Т2", plan: 9, fact: 11, gold: 11, subscriptions: 0, percent: 122, metPlan: true },
        { name: "Кунгур Бачурина 56А Т2 ЦЛ Лидер", plan: 6, fact: 23, gold: 23, subscriptions: 0, percent: 383, metPlan: true },
        { name: "Кунгур Карла Маркса 17А Т2", plan: 18, fact: 60, gold: 60, subscriptions: 0, percent: 333, metPlan: true },
        { name: "Кунгур Пугачева 25 Т2", plan: 17, fact: 28, gold: 28, subscriptions: 0, percent: 165, metPlan: true },
        { name: "Соликамск 20 лет Победы 117 Т2 ТЦ ЦУМ", plan: 21, fact: 47, gold: 47, subscriptions: 0, percent: 224, metPlan: true },
        { name: "Соликамск Северная 48 Т2 ТЦ Бисмарк Авеню", plan: 14, fact: 17, gold: 17, subscriptions: 0, percent: 121, metPlan: true },
        { name: "Соликамск Северная 55 Т2 ТЦ Европа", plan: 11, fact: 29, gold: 29, subscriptions: 0, percent: 264, metPlan: true }
      ]
    },

    upsale: {
      summary: {
        plan: 92,
        fact: 75,
        percent: 82,
        prevAllStoresMet: true
      },
      stores: [
        { name: "Березники Мира 82 Т2 Универсам Семья", percent: 71, metPlan: false },
        { name: "Березники Пятилетки 41 Т2 ТЦ ЦУМ", percent: 33, metPlan: false },
        { name: "Березники Пятилетки 87а Т2 ТЦ Миллениум", percent: 0, metPlan: false },
        { name: "Березники Юбилейная 26а Т2", percent: 0, metPlan: false },
        { name: "Кунгур Бачурина 56А Т2 ЦЛ Лидер", percent: 25, metPlan: false },
        { name: "Кунгур Карла Маркса 17А Т2", percent: 54, metPlan: false },
        { name: "Кунгур Пугачева 25 Т2", percent: 38, metPlan: false },
        { name: "Соликамск 20 лет Победы 117 Т2 ТЦ ЦУМ", percent: 96, metPlan: false },
        { name: "Соликамск Северная 48 Т2 ТЦ Бисмарк Авеню", percent: 214, metPlan: true },
        { name: "Соликамск Северная 55 Т2 ТЦ Европа", percent: 75, metPlan: false }
      ]
    },

    ya: {
      summary: {
        plan: 77,
        fact: 26,
        percent: 34,
        prevZeroNotClosedStores: 4
      },
      stores: [
        { name: "Березники Мира 82 Т2 Универсам Семья", percent: 20, metPlan: false },
        { name: "Березники Пятилетки 41 Т2 ТЦ ЦУМ", percent: 20, metPlan: false },
        { name: "Березники Пятилетки 87а Т2 ТЦ Миллениум", percent: 0, metPlan: false },
        { name: "Березники Юбилейная 26а Т2", percent: 29, metPlan: false },
        { name: "Кунгур Бачурина 56А Т2 ЦЛ Лидер", percent: 100, metPlan: true },
        { name: "Кунгур Карла Маркса 17А Т2", percent: 88, metPlan: false },
        { name: "Кунгур Пугачева 25 Т2", percent: 63, metPlan: false },
        { name: "Соликамск 20 лет Победы 117 Т2 ТЦ ЦУМ", percent: 17, metPlan: false },
        { name: "Соликамск Северная 48 Т2 ТЦ Бисмарк Авеню", percent: 0, metPlan: false },
        { name: "Соликамск Северная 55 Т2 ТЦ Европа", percent: 45, metPlan: false }
      ]
    },

    ftp: {
      summary: {
        plan: 119,
        fact: 241,
        percent: 203,
        prevAllStoresMet: true
      },
      stores: [
        { name: "Березники Мира 82 Т2 Универсам Семья", percent: 158, metPlan: true },
        { name: "Березники Пятилетки 41 Т2 ТЦ ЦУМ", percent: 168, metPlan: true },
        { name: "Березники Пятилетки 87а Т2 ТЦ Миллениум", percent: 133, metPlan: true },
        { name: "Березники Юбилейная 26а Т2", percent: 150, metPlan: true },
        { name: "Кунгур Бачурина 56А Т2 ЦЛ Лидер", percent: 320, metPlan: true },
        { name: "Кунгур Карла Маркса 17А Т2", percent: 133, metPlan: true },
        { name: "Кунгур Пугачева 25 Т2", percent: 250, metPlan: true },
        { name: "Соликамск 20 лет Победы 117 Т2 ТЦ ЦУМ", percent: 206, metPlan: true },
        { name: "Соликамск Северная 48 Т2 ТЦ Бисмарк Авеню", percent: 255, metPlan: true },
        { name: "Соликамск Северная 55 Т2 ТЦ Европа", percent: 310, metPlan: true }
      ]
    },

    subscriptions: {
      summary: {
        plan: 31145,
        fact: 35625,
        percent: 114,
        prevAllStoresMet: true
      },
      stores: [
        { name: "Березники Мира 82 Т2 Универсам Семья", percent: 101, metPlan: true },
        { name: "Березники Пятилетки 41 Т2 ТЦ ЦУМ", percent: 103, metPlan: true },
        { name: "Березники Пятилетки 87а Т2 ТЦ Миллениум", percent: 202, metPlan: true },
        { name: "Березники Юбилейная 26а Т2", percent: 133, metPlan: true },
        { name: "Кунгур Бачурина 56А Т2 ЦЛ Лидер", percent: 142, metPlan: true },
        { name: "Кунгур Карла Маркса 17А Т2", percent: 137, metPlan: true },
        { name: "Кунгур Пугачева 25 Т2", percent: 105, metPlan: true },
        { name: "Соликамск 20 лет Победы 117 Т2 ТЦ ЦУМ", percent: 109, metPlan: true },
        { name: "Соликамск Северная 48 Т2 ТЦ Бисмарк Авеню", percent: 106, metPlan: true },
        { name: "Соликамск Северная 55 Т2 ТЦ Европа", percent: 113, metPlan: true }
      ]
    },

    shpd: {
      summary: {
        plan: 19,
        fact: 14,
        percent: 74,
        forecast: 74,
        requests: 30,
        prevAllStoresInvolved: true,
        prevNotMetConnectionsStores: 2
      },
      stores: [
        { name: "Березники Мира 82 Т2 Универсам Семья", plan: 2, requests: 3, fact: 1, percent: 50, metPlan: false },
        { name: "Березники Пятилетки 41 Т2 ТЦ ЦУМ", plan: 2, requests: 4, fact: 2, percent: 100, metPlan: true },
        { name: "Березники Пятилетки 87а Т2 ТЦ Миллениум", plan: 2, requests: 3, fact: 1, percent: 50, metPlan: false },
        { name: "Березники Юбилейная 26а Т2", plan: 1, requests: 1, fact: 1, percent: 100, metPlan: true },
        { name: "Кунгур Бачурина 56А Т2 ЦЛ Лидер", plan: 1, requests: 3, fact: 0, percent: 0, metPlan: false },
        { name: "Кунгур Карла Маркса 17А Т2", plan: 2, requests: 3, fact: 0, percent: 0, metPlan: false },
        { name: "Кунгур Пугачева 25 Т2", plan: 1, requests: 1, fact: 1, percent: 100, metPlan: true },
        { name: "Соликамск 20 лет Победы 117 Т2 ТЦ ЦУМ", plan: 3, requests: 4, fact: 5, percent: 167, metPlan: true },
        { name: "Соликамск Северная 48 Т2 ТЦ Бисмарк Авеню", plan: 2, requests: 3, fact: 1, percent: 50, metPlan: false },
        { name: "Соликамск Северная 55 Т2 ТЦ Европа", plan: 3, requests: 5, fact: 2, percent: 67, metPlan: false }
      ]
    },

    cs: {
      summary: {
        plan: 172021,
        fact: 162110,
        percent: 94,
        forecast: 94,
        prevPlanClosed: true,
        prevAllStoresMet: true
      },
      stores: [
        { name: "Березники Мира 82 Т2 Универсам Семья", percent: 49, fact: 12980, metPlan: false },
        { name: "Березники Пятилетки 41 Т2 ТЦ ЦУМ", percent: 115, fact: 23470, metPlan: true },
        { name: "Березники Пятилетки 87а Т2 ТЦ Миллениум", percent: 25, fact: 4000, metPlan: false },
        { name: "Березники Юбилейная 26а Т2", percent: 98, fact: 7990, metPlan: false },
        { name: "Кунгур Бачурина 56А Т2 ЦЛ Лидер", percent: 87, fact: 6490, metPlan: false },
        { name: "Кунгур Карла Маркса 17А Т2", percent: 105, fact: 16470, metPlan: true },
        { name: "Кунгур Пугачева 25 Т2", percent: 105, fact: 12490, metPlan: true },
        { name: "Соликамск 20 лет Победы 117 Т2 ТЦ ЦУМ", percent: 102, fact: 24990, metPlan: true },
        { name: "Соликамск Северная 48 Т2 ТЦ Бисмарк Авеню", percent: 132, fact: 28960, metPlan: true },
        { name: "Соликамск Северная 55 Т2 ТЦ Европа", percent: 120, fact: 24270, metPlan: true }
      ]
    }
  },

  administrative: {
    hr: {
      staffPlan: 28,
      staffFact: 28,
      staffCompletionPercent: 100,
      recommendationPlan: 1,
      recommendationFact: 1,
      recommendationCompletionPercent: 100,
      traineesCount: 3,
      leavingCount: 2
    },
    vmr: {
      ozScore: 83.2,
      target: 77,
      stores: [
        { name: "Березники Мира 82", score: 86.67 },
        { name: "Березники Пятилетки 41", score: 66.67 },
        { name: "Березники Пятилетки 87", score: 76.67 },
        { name: "Березники Юбилейная 26", score: 80 },
        { name: "Кунгур Бачурина 56", score: 81.67 },
        { name: "Кунгур Карла Маркса 17", score: 75 },
        { name: "Кунгур Пугачева 25", score: 90 },
        { name: "Соликамск 20 лет Победы 117", score: 91.67 },
        { name: "Соликамск Северная 46", score: 80 },
        { name: "Соликамск Северная 55", score: 91.67 }
      ],
      failedStores: [
        { name: "Березники Пятилетки 41", score: 66.67 },
        { name: "Березники Пятилетки 87", score: 76.67 },
        { name: "Кунгур Карла Маркса 17", score: 75 }
      ]
    },
    payments: {
      summary: {
        bankCardPlanPercent: 25,
        bankCardSharePercent: 28.1,
        bankCardRub: 596747,
        prevBankCardSharePercent: 31.1,
        prevBankCardRub: 1366551,
        invoiceTargetPercent: 40,
        invoiceSharePercent: 39.5,
        invoiceRub: 838571,
        prevInvoiceSharePercent: 40.8,
        prevInvoiceRub: 940722,
        cashSharePercent: 34.3,
        cashRub: 727284,
        prevCashSharePercent: 28.4,
        prevCashRub: 1250999
      },
      stores: [
        { name: "Березники Пятилетки 41 Т2 ТЦ ЦУМ", invoicePercent: 39.5, invoiceRub: 105372, cashPercent: 38.9, bankCardPercent: 36.8 },
        { name: "Кунгур Пугачева 25 Т2", invoicePercent: 38.5, invoiceRub: 86163, cashPercent: 38.1, bankCardPercent: 35.0 },
        { name: "Березники Юбилейная 26а Т2", invoicePercent: 17.0, invoiceRub: 26319, cashPercent: 17.3, bankCardPercent: 34.0 },
        { name: "Соликамск 20 лет Победы 117 Т2 ТЦ ЦУМ", invoicePercent: 27.8, invoiceRub: 137152, cashPercent: 31.9, bankCardPercent: 32.8 },
        { name: "Кунгур Карла Маркса 17А Т2", invoicePercent: 39.5, invoiceRub: 70338, cashPercent: 52.6, bankCardPercent: 27.8 },
        { name: "Березники Мира 82 Т2 Универсам Семья", invoicePercent: 43.4, invoiceRub: 92339, cashPercent: 43.2, bankCardPercent: 26.7 },
        { name: "Соликамск Северная 48 Т2 ТЦ Бисмарк Авеню", invoicePercent: 34.9, invoiceRub: 64125, cashPercent: 36.4, bankCardPercent: 25.7 },
        { name: "Соликамск Северная 55 Т2 ТЦ Европа", invoicePercent: 40.4, invoiceRub: 77550, cashPercent: 20.0, bankCardPercent: 20.7 },
        { name: "Березники Пятилетки 87а Т2 ТЦ Миллениум", invoicePercent: 63.3, invoiceRub: 67252, cashPercent: 41.5, bankCardPercent: 18.0 },
        { name: "Кунгур Бачурина 56А Т2 ЦЛ Лидер", invoicePercent: 100.0, invoiceRub: 111961, cashPercent: 33.9, bankCardPercent: 0.0 }
      ],
      description: "Показатель отражает структуру способов оплаты и долю инвойса по каждой ТТ."
    }
  },

  focus: {
    march: [
      "Сим-карты — работа с акциями, прокачать все ТТ",
      "ЦС — закрыть план на 100%",
      "Аксы + услуги — вовлеченность всех ТТ в акции"
    ],
    april: [
      "ЦС — закрыть план на 100%",
      "Обучение сотрудников работе с процедурами и предложению сим",
      "Работа с кредитными заявками"
    ]
  }
};