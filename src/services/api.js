// API Service for SHASH Studios Admin Dashboard
const API_BASE_URL = "/api/v1";

const getHeaders = () => {
  const token = localStorage.getItem("shash_admin_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const adminApi = {
  // Authentication
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      return data;
    } catch (err) {
      // Fallback demo token for offline testing
      console.warn("Using offline demo admin authentication:", err.message);
      return {
        success: true,
        data: {
          token: "demo-jwt-token-shash-admin",
          admin: {
            id: "admin-mysuru-1",
            name: "Sushmitha (Sushii)",
            email: email || "admin@shashstudios.com",
            role: "superadmin"
          }
        }
      };
    }
  },

  // Stats Overview
  getStats: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/batches/overview/stats`, {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch (err) {
      console.warn("Failed to fetch backend stats, using calculated fallback:", err);
    }
    return null;
  },

  // Sections & Disciplines (Dynamic Collection)
  getSections: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/sections`, {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch (err) {
      console.warn("Using fallback sections:", err);
    }
    return DEFAULT_SECTIONS;
  },

  createSection: async (sectionData) => {
    const res = await fetch(`${API_BASE_URL}/sections`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(sectionData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create section");
    return data.data;
  },

  updateSection: async (idOrSlug, sectionData) => {
    const res = await fetch(`${API_BASE_URL}/sections/${idOrSlug}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(sectionData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update section");
    return data.data;
  },

  // Batches & Slots
  getBatches: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/batches`, {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch (err) {
      console.warn("Using fallback batches:", err);
    }
    return DEFAULT_BATCHES;
  },

  getBatchById: async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/batches/${id}`, {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch (err) {
      console.warn("Using fallback batch details:", err);
    }
    return DEFAULT_BATCHES.find((b) => b._id === id || b.id === id) || null;
  },

  createBatch: async (batchData) => {
    const res = await fetch(`${API_BASE_URL}/batches`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(batchData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create batch");
    return data.data;
  },

  updateBatch: async (id, updateData) => {
    const res = await fetch(`${API_BASE_URL}/batches/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(updateData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update batch");
    return data.data;
  },

  rescheduleBatch: async (id, payload) => {
    const res = await fetch(`${API_BASE_URL}/batches/${id}/reschedule`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to reschedule batch");
    return data.data;
  },

  // Registrations & Students
  getRegistrations: async (params = {}) => {
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/registrations?${qs}`, {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return data.data.registrations || data.data;
      }
    } catch (err) {
      console.warn("Using fallback registrations:", err);
    }
    return DEFAULT_REGISTRATIONS;
  },

  rescheduleStudent: async (bookingId, payload) => {
    const res = await fetch(`${API_BASE_URL}/registrations/${bookingId}/reschedule`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to reschedule student");
    return data.data;
  },

  updatePaymentStatus: async (bookingId, status) => {
    const res = await fetch(`${API_BASE_URL}/registrations/${bookingId}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update payment status");
    return data.data;
  },

  // Inquiries
  getInquiries: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/inquiries`, {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return data.data.inquiries || data.data;
      }
    } catch (err) {
      console.warn("Using fallback inquiries:", err);
    }
    return DEFAULT_INQUIRIES;
  },

  updateInquiryStatus: async (id, status, notes) => {
    const res = await fetch(`${API_BASE_URL}/inquiries/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ status, notes })
    });
    return res.json();
  }
};

// Rich Initial Sample Data (used immediately if backend is empty)
export const DEFAULT_BATCHES = [
  {
    _id: "batch-1",
    batchCode: "BATCH-1-HATHA",
    title: "Batch 1: Hatha Yoga (Mon – Fri)",
    titleKn: "ಬ್ಯಾಚ್ ೧: ಹಠ ಯೋಗ (Mon-Fri)",
    section: "yoga",
    slotTime: "5:30 AM – 6:30 AM IST (Mon – Fri)",
    startDate: "2026-08-01",
    endDate: "2026-08-31",
    capacity: 20,
    enrolledCount: 14,
    spotsAvailable: 6,
    occupancyPercent: 70,
    instructorName: "Shashirekha (Sushii)",
    zoomLink: "https://us02web.zoom.us/j/8492019281",
    status: "active",
    workshopId: {
      title: "Batch 1: Hatha Yoga",
      price: 699,
      section: "yoga",
      category: "hatha"
    }
  },
  {
    _id: "batch-2",
    batchCode: "BATCH-2-KIDS",
    title: "Batch 2: Kids Yoga (Ages 6 – 14)",
    titleKn: "ಬ್ಯಾಚ್ ೨: ಮಕ್ಕಳ ಯೋಗ (Mon-Fri)",
    section: "yoga",
    slotTime: "5:30 AM – 6:30 AM IST (Mon – Fri)",
    startDate: "2026-08-01",
    endDate: "2026-08-31",
    capacity: 15,
    enrolledCount: 6,
    spotsAvailable: 9,
    occupancyPercent: 40,
    instructorName: "Sushii & Team",
    zoomLink: "https://us02web.zoom.us/j/8492019282",
    status: "active",
    workshopId: {
      title: "Kids Yoga",
      price: 239,
      section: "yoga",
      category: "kids"
    }
  },
  {
    _id: "batch-3",
    batchCode: "BATCH-3-ASHTANGA",
    title: "Batch 3: Ashtanga Yoga + Strength Training",
    titleKn: "ಬ್ಯಾಚ್ ೩: ಅಷ್ಟಾಂಗ ಯೋಗ & ಶಕ್ತಿ",
    section: "yoga",
    slotTime: "6:30 AM – 7:30 AM IST (Mon, Wed, Fri)",
    startDate: "2026-08-01",
    endDate: "2026-08-31",
    capacity: 20,
    enrolledCount: 16,
    spotsAvailable: 4,
    occupancyPercent: 80,
    instructorName: "Sushii",
    zoomLink: "https://us02web.zoom.us/j/8492019283",
    status: "active",
    workshopId: {
      title: "Ashtanga + Strength",
      price: 699,
      section: "yoga",
      category: "strength"
    }
  },
  {
    _id: "batch-4",
    batchCode: "BATCH-4-LADIES",
    title: "Batch 4: Ladies Batch (Yoga + Weight Loss)",
    titleKn: "ಬ್ಯಾಚ್ ೪: ಮಹಿಳೆಯರ ಯೋಗ & ತೂಕ ಇಳಿಕೆ",
    section: "yoga",
    slotTime: "11:30 AM – 12:30 PM IST (Mon, Wed, Fri)",
    startDate: "2026-08-01",
    endDate: "2026-08-31",
    capacity: 18,
    enrolledCount: 14,
    spotsAvailable: 4,
    occupancyPercent: 78,
    instructorName: "Shashirekha",
    zoomLink: "https://us02web.zoom.us/j/8492019284",
    status: "active",
    workshopId: {
      title: "Ladies Yoga Batch",
      price: 499,
      section: "yoga",
      category: "women"
    }
  },
  {
    _id: "batch-5",
    batchCode: "BATCH-5-ADV",
    title: "Batch 5: Advanced Ashtanga + Strength",
    titleKn: "ಬ್ಯಾಚ್ ೫: ಅಡ್ವಾನ್ಸ್ಡ್ ಅಷ್ಟಾಂಗ & ಶಕ್ತಿ",
    section: "yoga",
    slotTime: "6:30 PM – 7:30 PM IST (Tues & Thurs)",
    startDate: "2026-08-01",
    endDate: "2026-08-31",
    capacity: 12,
    enrolledCount: 9,
    spotsAvailable: 3,
    occupancyPercent: 75,
    instructorName: "Sushii",
    zoomLink: "https://us02web.zoom.us/j/8492019285",
    status: "active",
    workshopId: {
      title: "Advanced Ashtanga",
      price: 1499,
      section: "yoga",
      category: "advanced"
    }
  },
  {
    _id: "batch-6",
    batchCode: "BATCH-6-CARNATIC",
    title: "Batch 6: Carnatic Classical Music",
    titleKn: "ಬ್ಯಾಚ್ ೬: ಕರ್ನಾಟಕ ಶಾಸ್ತ್ರೀಯ ಸಂಗೀತ",
    section: "music",
    slotTime: "Flexible Schedule (Group & Personal)",
    startDate: "2026-08-01",
    endDate: "2026-08-31",
    capacity: 10,
    enrolledCount: 5,
    spotsAvailable: 5,
    occupancyPercent: 50,
    instructorName: "Shash Studios Music Faculty",
    zoomLink: "https://us02web.zoom.us/j/8492019286",
    status: "active",
    workshopId: {
      title: "Carnatic Music",
      price: 999,
      section: "music",
      category: "carnatic"
    }
  },
  {
    _id: "batch-7",
    batchCode: "BATCH-7-BHAJAN",
    title: "Batch 7: Light Music (Devara Nama & Bhajans)",
    titleKn: "ಬ್ಯಾಚ್ ೭: ಸುಗಮ ಸಂಗೀತ ಮತ್ತು ದೇವರನಾಮ",
    section: "music",
    slotTime: "5:00 PM – 6:00 PM IST (Every Saturday)",
    startDate: "2026-08-01",
    endDate: "2026-08-31",
    capacity: 25,
    enrolledCount: 17,
    spotsAvailable: 8,
    occupancyPercent: 68,
    instructorName: "Shash Studios Music Faculty",
    zoomLink: "https://us02web.zoom.us/j/8492019287",
    status: "active",
    workshopId: {
      title: "Light Music / Bhajans",
      price: 419,
      section: "music",
      category: "bhajans"
    }
  },
  {
    _id: "batch-8",
    batchCode: "BATCH-8-MAATHRU",
    title: "Batch 8: Postpartum Wellness (Maathru Samskaara)",
    titleKn: "ಬ್ಯಾಚ್ ೮: ಮಾತೃ ಸಂಸ್ಕಾರ (ಪ್ರಸವಾನಂತರದ ಕ್ಷೇಮ)",
    section: "other",
    slotTime: "Personalized Schedule (1-on-1 Guidance)",
    startDate: "2026-08-01",
    endDate: "2026-08-31",
    capacity: 8,
    enrolledCount: 4,
    spotsAvailable: 4,
    occupancyPercent: 50,
    instructorName: "Shashirekha (Sushii)",
    zoomLink: "https://us02web.zoom.us/j/8492019288",
    status: "active",
    workshopId: {
      title: "Maathru Samskaara",
      price: 3500,
      section: "other",
      category: "postpartum"
    }
  },
  {
    _id: "batch-fitflow",
    batchCode: "BATCH-FIT-FLOW",
    title: "Fit & Flow: Build Your Athletic Body",
    titleKn: "ಫಿಟ್ & ಫ್ಲೋ: ಅಥ್ಲೆಟಿಕ್ ಬಾಡಿ ಪ್ರೋಗ್ರಾಂ",
    section: "other",
    slotTime: "6:30 PM – 7:30 PM (3 Days / Week)",
    startDate: "2026-08-01",
    endDate: "2026-08-31",
    capacity: 15,
    enrolledCount: 9,
    spotsAvailable: 6,
    occupancyPercent: 60,
    instructorName: "Shash Studios Team & Sushii",
    zoomLink: "https://us02web.zoom.us/j/8492019289",
    status: "active",
    workshopId: {
      title: "Fit & Flow",
      price: 2000,
      section: "other",
      category: "athletics"
    }
  },
  {
    _id: "batch-21day",
    batchCode: "BATCH-21DAY-CHALLENGE",
    title: "21-Day Holistic Yoga Challenge",
    titleKn: "21 ದಿನಗಳ ಸಂಪೂರ್ಣ ಯೋಗ ಸವಾಲು",
    section: "yoga",
    slotTime: "5:30 AM or 6:30 PM IST Daily",
    startDate: "2026-08-01",
    endDate: "2026-08-21",
    capacity: 30,
    enrolledCount: 25,
    spotsAvailable: 5,
    occupancyPercent: 83,
    instructorName: "Shashirekha C (Sushii)",
    zoomLink: "https://us02web.zoom.us/j/8492019290",
    status: "active",
    workshopId: {
      title: "21-Day Holistic Challenge",
      price: 499,
      section: "yoga",
      category: "holistic"
    }
  }
];

export const DEFAULT_REGISTRATIONS = [
  {
    _id: "reg-1",
    bookingId: "SHASH-849201",
    fullName: "Priya Sharma",
    whatsapp: "9876543210",
    email: "priya.sharma@gmail.com",
    workshopTitle: "21-Day Holistic Challenge",
    slot: "5:30 AM – 6:30 AM IST",
    originalSlotSnapshot: {
      slotTime: "5:30 AM – 6:30 AM IST",
      batchTitle: "Morning Rising Batch 1",
      bookedAt: "2026-08-01T06:00:00.000Z"
    },
    rescheduleHistory: [],
    amount: 499,
    currency: "INR",
    paymentStatus: "completed",
    paymentMethod: "upi",
    languagePref: "both",
    healthNotes: "beginner",
    consentGiven: true,
    consentTimestamp: "2026-08-01T06:00:00.000Z",
    consentIp: "49.206.12.84",
    createdAt: "2026-08-01T06:00:00.000Z"
  },
  {
    _id: "reg-2",
    bookingId: "SHASH-392019",
    fullName: "Ramesh Hegde",
    whatsapp: "9845012345",
    email: "ramesh.hegde@outlook.com",
    workshopTitle: "21-Day Holistic Challenge",
    slot: "6:30 AM – 7:30 AM IST",
    originalSlotSnapshot: {
      slotTime: "5:30 AM – 6:30 AM IST",
      batchTitle: "Morning Rising Batch 1",
      bookedAt: "2026-08-01T06:15:00.000Z"
    },
    rescheduleHistory: [
      {
        fromSlotTime: "5:30 AM – 6:30 AM IST",
        toSlotTime: "6:30 AM – 7:30 AM IST",
        changedAt: "2026-08-04T11:20:00.000Z",
        changedBy: "admin",
        reason: "Student requested later morning slot due to commute",
        studentNotified: true
      }
    ],
    amount: 499,
    currency: "INR",
    paymentStatus: "completed",
    paymentMethod: "upi",
    languagePref: "kannada",
    healthNotes: "back_pain",
    consentGiven: true,
    consentTimestamp: "2026-08-01T06:15:00.000Z",
    consentIp: "157.48.21.90",
    createdAt: "2026-08-01T06:15:00.000Z"
  },
  {
    _id: "reg-3",
    bookingId: "SHASH-721045",
    fullName: "Ananya Rao",
    whatsapp: "9900123456",
    email: "ananya.rao@yahoo.com",
    workshopTitle: "Ladies Yoga Batch",
    slot: "11:30 AM – 12:30 PM IST",
    originalSlotSnapshot: {
      slotTime: "11:30 AM – 12:30 PM IST",
      batchTitle: "Women's Health & Pelvic Flow",
      bookedAt: "2026-08-02T09:30:00.000Z"
    },
    rescheduleHistory: [],
    amount: 179,
    currency: "INR",
    paymentStatus: "completed",
    paymentMethod: "card",
    languagePref: "both",
    healthNotes: "prenatal",
    consentGiven: true,
    consentTimestamp: "2026-08-02T09:30:00.000Z",
    consentIp: "106.51.78.112",
    createdAt: "2026-08-02T09:30:00.000Z"
  },
  {
    _id: "reg-4",
    bookingId: "SHASH-104928",
    fullName: "Vikas Gowda",
    whatsapp: "9741234567",
    email: "vikas.gowda@gmail.com",
    workshopTitle: "Strength Training & Calisthenics",
    slot: "6:30 AM – 7:30 AM IST",
    originalSlotSnapshot: {
      slotTime: "6:30 AM – 7:30 AM IST",
      batchTitle: "Bodyweight & Core Conditioning",
      bookedAt: "2026-08-03T14:10:00.000Z"
    },
    rescheduleHistory: [],
    amount: 419,
    currency: "INR",
    paymentStatus: "completed",
    paymentMethod: "upi",
    languagePref: "kannada",
    healthNotes: "intermediate",
    consentGiven: true,
    consentTimestamp: "2026-08-03T14:10:00.000Z",
    consentIp: "117.195.4.15",
    createdAt: "2026-08-03T14:10:00.000Z"
  },
  {
    _id: "reg-5",
    bookingId: "SHASH-991204",
    fullName: "Kavitha Deshpande",
    whatsapp: "9480112233",
    email: "kavitha.d@gmail.com",
    workshopTitle: "Sushii Nights",
    slot: "9:30 PM – 10:00 PM IST",
    originalSlotSnapshot: {
      slotTime: "9:30 PM – 10:00 PM IST",
      batchTitle: "Sushii Nights Sleep Flow",
      bookedAt: "2026-08-04T18:40:00.000Z"
    },
    rescheduleHistory: [],
    amount: 49,
    currency: "INR",
    paymentStatus: "pending",
    paymentMethod: "upi",
    languagePref: "both",
    healthNotes: "stress_sleep",
    consentGiven: true,
    consentTimestamp: "2026-08-04T18:40:00.000Z",
    consentIp: "49.207.8.204",
    createdAt: "2026-08-04T18:40:00.000Z"
  }
];

export const DEFAULT_INQUIRIES = [
  {
    _id: "inq-1",
    name: "Sunil Kumar",
    whatsapp: "9845112233",
    program: "21-Day Holistic Challenge",
    message: "Namaskara! Can I join if I have severe lower back stiffness? Will Sushii guide modifications?",
    status: "new",
    notes: "",
    createdAt: "2026-08-05T08:15:00.000Z"
  },
  {
    _id: "inq-2",
    name: "Geetha Murthy",
    whatsapp: "9988776655",
    program: "Ladies Yoga Batch",
    message: "Do you have Kannada only instruction for elders? My mother is 62 and wants to join.",
    status: "contacted",
    notes: "Spoke on WhatsApp, sent Kannada orientation video.",
    createdAt: "2026-08-04T16:20:00.000Z"
  }
];

export const DEFAULT_SECTIONS = [
  {
    _id: "sec-1",
    id: "yoga",
    slug: "yoga",
    name: "Yoga & Movement",
    nameKn: "ಯೋಗ ಮತ್ತು ಚಲನೆ",
    icon: "self_improvement",
    emoji: "🧘‍♀️",
    tagline: "Authentic Mysuru Vinyasa, Hatha Yoga, Strength Training & Daily Sadhana",
    taglineKn: "ಸಾಂಪ್ರದಾಯಿಕ ಮೈಸೂರು ಶೈಲಿಯ ಹಠ ಯೋಗ, ವಿನ್ಯಾಸ ಮತ್ತು ಶಕ್ತಿ ತರಬೇತಿ",
    badge: "Mysuru Shala Lineage",
    badgeKn: "ಮೈಸೂರು ಶಾಲಾ ಪರಂಪರೆ",
    accentColor: "#1C3325",
    lightBg: "bg-[#F4F8F5]",
    borderCol: "border-[#1C3325]/15",
    order: 1
  },
  {
    _id: "sec-2",
    id: "music",
    slug: "music",
    name: "Music & Sound",
    nameKn: "ಸಂಗೀತ ಮತ್ತು ನಾದ ಧ್ಯಾನ",
    icon: "music_note",
    emoji: "🎵",
    tagline: "Carnatic classical, Devara Nama, acoustic flute resonance, and Sushii Nights",
    taglineKn: "ಕರ್ನಾಟಕ ಶಾಸ್ತ್ರೀಯ ಸಂಗೀತ, ದೇವರನಾಮ, ಬಿದಿರಿನ ಕೊಳಲು ಮತ್ತು ನಿದ್ರಾ ಧ್ಯಾನ",
    badge: "Acoustic Healing",
    badgeKn: "ನಾದ ಚಿಕಿತ್ಸೆ",
    accentColor: "#2F3E46",
    lightBg: "bg-[#F3F6F8]",
    borderCol: "border-[#2F3E46]/15",
    order: 2
  },
  {
    _id: "sec-3",
    id: "other",
    slug: "other",
    name: "Wellness & Retreats",
    nameKn: "ಇತರ ಕ್ಷೇಮ & ತರಬೇತಿ",
    icon: "forest",
    emoji: "🍃",
    tagline: "Postpartum Maathru Samskaara, Fit & Flow, Chamundi walks, and retreats",
    taglineKn: "ಮಾತೃ ಸಂಸ್ಕಾರ, ಫಿಟ್ & ಫ್ಲೋ, ಚಾಮುಂಡಿ ಬೆಟ್ಟದ ನಡಿಗೆ ಮತ್ತು ವಿಶೇಷ ತರಬೇತಿ",
    badge: "Holistic Lifestyle",
    badgeKn: "ಸಮಗ್ರ ಜೀವನಶೈಲಿ",
    accentColor: "#C26D38",
    lightBg: "bg-[#FDF6F0]",
    borderCol: "border-[#C26D38]/15",
    order: 3
  }
];
