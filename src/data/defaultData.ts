import { Material, UserProfile, Achievement, TimelineMilestone, SubjectMastery } from '../types';

export const initialProfile: UserProfile = {
  id: 'user_default',
  name: 'Pelajar',
  email: '',
  schoolLevel: 'SMP',
  grade: 'Kelas 8',
  targets: ['Meningkatkan nilai', 'Persiapan ujian', 'Membangun kebiasaan belajar'],
  learningStyles: ['Tanya jawab dengan AI', 'Flashcard', 'Latihan soal'],
  dailyStudyTime: '30 menit/hari',
  xp: 0,
  level: 1,
  levelTitle: 'Pemula (Siswa Baru)',
  streakDays: 0,
  target6MonthProgress: 0,
  isDarkMode: true,
  isLiquidGlass: false,
  onboardingCompleted: false,
  totalStudyMinutes: 0,
  quizzesCompleted: 0,
  materialsLearned: 0,
  tutorStyle: 'friendly',
  soundEffects: true,
};

export const defaultProfile = initialProfile;

export const defaultMaterials: Material[] = [
  {
    id: 'mat-1',
    title: 'Sistem Pencernaan Manusia: Organ, Enzim & Absorpsi',
    subject: 'Ilmu Pengetahuan Alam (IPA)',
    schoolLevel: 'SMP',
    grade: 'Kelas 8',
    fileType: 'PDF',
    originalFileName: 'IPA_Bab4_Sistem_Pencernaan_Revisi.pdf',
    uploadDate: 'Kemarin, 14:20',
    pagesOrSlides: 18,
    mainConceptsCount: 6,
    keyTermsCount: 12,
    rawText: `Sistem pencernaan manusia terbagi menjadi pencernaan mekanik dan kimiawi. Saluran pencernaan meliputi mulut, kerongkongan (esofagus), lambung, usus halus, usus besar, dan anus. Di dalam mulut terjadi pencernaan mekanik oleh gigi serta kimiawi oleh enzim ptialin (amilase) yang mengubah amilum menjadi maltosa. Di lambung diproduksi asam klorida (HCl) untuk membunuh kuman dan mengaktifkan pepsinogen menjadi pepsin yang memecah protein menjadi pepton. Enzim renin mengendapkan kasein susu. Usus halus terdiri atas duodenum (usus 12 jari), jejunum, dan ileum. Enzim dari pankreas (amilase, tripsin, lipase) dan empedu dari hati mencerna makanan lebih lanjut. Di ileum terjadi penyerapan sari makanan melalui jonjot usus (vili). Di usus besar terjadi penyerapan air dan pembusukan sisa makanan oleh bakteri Escherichia coli.`,
    summary: {
      simpleOverview: 'Sistem pencernaan adalah proses pemecahan makanan secara mekanik dan kimiawi dari mulut hingga usus besar agar nutrisi dapat diserap oleh sel tubuh dan sisa makanan dibuang.',
      bulletPoints: [
        'Pencernaan mekanik dilakukan oleh gigi di mulut dan gerak peristaltik di lambung & kerongkongan.',
        'Pencernaan kimiawi dibantu enzim: Ptialin (mulut), Pepsin & Renin (lambung), Amilase, Tripsin, Lipase (usus halus/pankreas).',
        'Usus halus adalah pusat utama penyerapan nutrisi melalui vili (jonjot usus).',
        'Usus besar berfungsi meregulasi kadar air dan pembusukan sisa makanan dibantu bakteri baik E. coli.'
      ],
      keyTerms: [
        { term: 'Ptialin', definition: 'Enzim amilase di ludah yang mengubah karbohidrat (amilum) menjadi maltosa.' },
        { term: 'Peristaltik', definition: 'Gerakan meremas dan mendorong makanan di sepanjang saluran pencernaan.' },
        { term: 'Pepsin', definition: 'Enzim lambung pengurai protein menjadi peptida sederhana (pepton).' },
        { term: 'Vili Usus', definition: 'Lipatan mikroskopis di dinding usus halus untuk memperluas area penyerapan sari makanan.' },
        { term: 'Cairan Empedu', definition: 'Cairan penghasilan hati yang mengemulsi lemak agar mudah diuraikan enzim lipase.' }
      ]
    },
    flashcards: [
      {
        id: 'fc-101',
        question: 'Apa fungsi utama enzim ptialin (amilase ludah) di rongga mulut?',
        answer: 'Mengubah amilum (karbohidrat kompleks) menjadi glukosa/maltosa secara kimiawi.',
        hint: 'Fokus pada pencernaan zat tepung saat mengunyah nasi.',
        difficulty: 'mudah',
        status: 'mastered'
      },
      {
        id: 'fc-102',
        question: 'Mengapa lambung menghasilkan asam klorida (HCl)?',
        answer: 'Untuk membunuh bakteri patogen pada makanan dan mengaktifkan pepsinogen menjadi enzim pepsin aktif.',
        hint: 'Lingkungan sangat asam (pH 1.5 - 2.0).',
        difficulty: 'sedang',
        status: 'learning'
      },
      {
        id: 'fc-103',
        question: 'Di bagian organ mana penyerapan sari-sari makanan utama terjadi?',
        answer: 'Usus halus, khususnya pada bagian ileum melalui jonjot-jonjot usus (vili).',
        hint: 'Bukan di lambung, melainkan saluran berikutnya yang berlipat-lipat.',
        difficulty: 'mudah',
        status: 'mastered'
      },
      {
        id: 'fc-104',
        question: 'Apa peran empedu dalam proses pencernaan lipid/lemak?',
        answer: 'Empedu mengemulsi lemak menjadi tetesan kecil agar enzim lipase pankreas dapat memecahnya menjadi asam lemak & gliserol.',
        hint: 'Dihasilkan di organ hati, disimpan di kantung empedu.',
        difficulty: 'sulit',
        status: 'learning'
      },
      {
        id: 'fc-105',
        question: 'Apa fungsi utama usus besar (kolon) sebelum sisa makanan dikeluarkan?',
        answer: 'Menyerap kelebihan air & mineral serta membentuk feses dengan bantuan bakteri E. coli.',
        hint: 'Berhubungan dengan rehidrasi dan pembusukan feses.',
        difficulty: 'sedang',
        status: 'good'
      },
      {
        id: 'fc-106',
        question: 'Apa yang dimaksud dengan gerakan peristaltik pada kerongkongan (esofagus)?',
        answer: 'Gerakan meremas dan mendorong bolus makanan secara bergelombang dari faring menuju lambung.',
        hint: 'Gerakan otot tak sadar sepanjang saluran cerna.',
        difficulty: 'mudah',
        status: 'mastered'
      },
      {
        id: 'fc-107',
        question: 'Apa perbedaan fungsi enzim pepsin dan enzim renin di dalam lambung?',
        answer: 'Pepsin memecah protein menjadi pepton, sedangkan renin mengendapkan protein kasein dari susu.',
        hint: 'Keduanya bekerja dalam suasana asam di getah lambung.',
        difficulty: 'sedang',
        status: 'learning'
      },
      {
        id: 'fc-108',
        question: 'Sebutkan 3 bagian usus halus secara anatomis berurutan dari atas ke bawah!',
        answer: 'Duodenum (usus 12 jari), Jejunum (usus kosong), dan Ileum (usus penyerapan).',
        hint: 'Panjang totalnya sekitar 6 hingga 7 meter pada orang dewasa.',
        difficulty: 'sedang',
        status: 'good'
      },
      {
        id: 'fc-109',
        question: 'Apa peran menguntungkan bakteri Escherichia coli (E. coli) pada usus besar manusia?',
        answer: 'Membantu pembusukan sisa makanan serta menyintesis vitamin K dan biotin bagi tubuh.',
        hint: 'Bakteri komensal/simbiosis mutualisme pada saluran akhir pencernaan.',
        difficulty: 'sulit',
        status: 'unseen'
      }
    ],
    quizQuestions: [
      {
        id: 'qz-101',
        topic: 'Organ Pencernaan',
        difficulty: 'mudah',
        question: 'Pencernaan mekanik dan kimiawi pertama kali terjadi bersamaan pada organ...',
        options: ['Kerongkongan', 'Mulut', 'Lambung', 'Usus Halus'],
        correctIndex: 1,
        explanation: 'Di mulut terjadi pencernaan mekanik oleh gigi/lidah dan pencernaan kimiawi oleh enzim amilase/ptialin ludah.'
      },
      {
        id: 'qz-102',
        topic: 'Enzim Lambung',
        difficulty: 'sedang',
        question: 'Jika produksi asam lambung (HCl) terganggu, proses yang paling terpengaruh secara langsung adalah...',
        options: [
          'Pengubahan amilum menjadi maltosa',
          'Aktivasi pepsinogen menjadi pepsin untuk mencerna protein',
          'Penyerapan vitamin larut lemak di usus besar',
          'Pengemulsian lemak oleh cairan empedu'
        ],
        correctIndex: 1,
        explanation: 'HCl berfungsi mengasamkan lambung dan mengubah pepsinogen inaktif menjadi enzim pepsin aktif pemecah protein.'
      },
      {
        id: 'qz-103',
        topic: 'Penyerapan Nutrisi',
        difficulty: 'sedang',
        question: 'Struktur vili (jonjot usus) pada usus halus memiliki fungsi adaptif utama yaitu...',
        options: [
          'Membendung laju makanan agar tidak cepat keluar',
          'Memperluas bidang permukaan absorbsi sari-sari makanan',
          'Memproduksi lendir pelindung dari asam lambung',
          'Membunuh bakteri patogen yang masuk lewat makanan'
        ],
        correctIndex: 1,
        explanation: 'Vili dan mikrovili melipatgandakan luas permukaan usus halus secara drastis hingga seukuran lapangan tenis untuk memaksimalkan penyerapan nutrisi.'
      },
      {
        id: 'qz-104',
        topic: 'Gangguan Pencernaan',
        difficulty: 'sulit',
        question: 'Penderita yang mengalami peradangan pada apendiks (usus buntu) biasanya merasakan nyeri akut pada kuadran abdomen bagian...',
        options: ['Kiri atas', 'Kanan atas', 'Kiri bawah', 'Kanan bawah'],
        correctIndex: 3,
        explanation: 'Apendiks terletak di persimpangan antara usus halus dan sekum usus besar di perut kanan bawah (titik McBurney).'
      }
    ],
    conceptMap: [
      { id: 'c1', label: 'Rongga Mulut', description: 'Gigi (mekanik) & Enzim Ptialin (kimiawi)', connections: ['Esofagus'] },
      { id: 'c2', label: 'Esofagus', description: 'Gerak peristaltik mendorong bolus makanan', connections: ['Lambung'] },
      { id: 'c3', label: 'Lambung', description: 'Asam HCl, Pepsin, Renin mencerna protein', connections: ['Usus Halus', 'Pankreas & Empedu'] },
      { id: 'c4', label: 'Pankreas & Empedu', description: 'Enzim Tripsin, Lipase, Amilase & Emulsi lemak', connections: ['Usus Halus'] },
      { id: 'c5', label: 'Usus Halus (Vili)', description: 'Absorpsi karbohidrat, protein, lemak ke darah', connections: ['Usus Besar'] },
      { id: 'c6', label: 'Usus Besar & Anus', description: 'Penyerapan air, simbiotik E. coli, defekasi', connections: [] }
    ],
    aiExplanation: `Hai! Bayangkan sistem pencernaanmu seperti pabrik daur ulang canggih. Makanan masuk lewat pintu gerbang (mulut) yang dihancurkan mesin pemotong (gigi) dan disemprot pelunak kimia (ptialin). Lalu meluncur lewat pipa perosotan fleksibel (kerongkongan) ke dalam tangki pencampur asam super kuat (lambung). Setelah jadi bubur halus, dialirkan ke lorong pemilah nutrisi berjuta saringan (usus halus dan vili). Air berlebih diserap kembali di stasiun akhir (usus besar), dan ampas yang tak terpakai dibuang bersih!`,
    mastered: false
  },
  {
    id: 'mat-2',
    title: 'Persamaan & Fungsi Kuadrat: Nilai Diskriminan dan Titik Puncak',
    subject: 'Matematika',
    schoolLevel: 'SMP',
    grade: 'Kelas 9',
    fileType: 'PPTX',
    originalFileName: 'Matematika_FungsiKuadrat_Bab3.pptx',
    uploadDate: '3 hari lalu',
    pagesOrSlides: 24,
    mainConceptsCount: 5,
    keyTermsCount: 8,
    rawText: `Bentuk umum fungsi kuadrat adalah f(x) = ax² + bx + c dengan a ≠ 0. Nilai diskriminan D dihitung dengan rumus D = b² - 4ac. Jika D > 0, grafik memotong sumbu X di dua titik berlainan. Jika D = 0, grafik menyinggung sumbu X di satu titik. Jika D < 0, grafik tidak memotong sumbu X. Titik puncak parabola ditentukan oleh koordinat (-b/(2a), -D/(4a)). Jika a > 0 parabola terbuka ke atas (memiliki titik minimum), jika a < 0 parabola terbuka ke bawah (memiliki titik maksimum).`,
    summary: {
      simpleOverview: 'Fungsi kuadrat menghasilkan grafik berbentuk kurva parabola simetris. Sifat grafik sangat ditentukan oleh nilai koefisien a dan diskriminan D.',
      bulletPoints: [
        'Bentuk umum: y = ax² + bx + c (a tidak boleh nol).',
        'Arah kurva: a > 0 kurva mangkok tersenyum (ke atas), a < 0 kurva cemberut (ke bawah).',
        'Diskriminan D = b² - 4ac menentukan banyaknya titik potong grafik dengan sumbu X.',
        'Sumbu simetri: x = -b / (2a); Nilai optimum y = -D / (4a).'
      ],
      keyTerms: [
        { term: 'Parabola', definition: 'Kurva mulus simetris yang menjadi representasi grafis fungsi kuadrat.' },
        { term: 'Diskriminan (D)', definition: 'Nilai pembeda (b² - 4ac) penentu karakteristik akar persamaan kuadrat.' },
        { term: 'Sumbu Simetri', definition: 'Garis vertikal yang membagi kurva parabola menjadi dua bagian cermin sempurna.' },
        { term: 'Titik Ekstrim (Puncak)', definition: 'Titik tertinggi atau terendah tempat kurva berbalik arah.' }
      ]
    },
    flashcards: [
      {
        id: 'fc-201',
        question: 'Tuliskan rumus diskriminan (D) untuk persamaan kuadrat ax² + bx + c = 0!',
        answer: 'D = b² - 4ac',
        hint: 'Kombinasi b kuadrat dikurangi 4 dikali a dan c.',
        difficulty: 'mudah',
        status: 'mastered'
      },
      {
        id: 'fc-202',
        question: 'Bagaimana posisi grafik fungsi kuadrat terhadap sumbu X jika nilai D = 0?',
        answer: 'Grafik menyinggung sumbu X di tepat satu titik koordinat (memiliki akar kembar).',
        hint: 'Tidak memotong dua titik, tapi hanya menyentuh.',
        difficulty: 'sedang',
        status: 'mastered'
      },
      {
        id: 'fc-203',
        question: 'Apa rumus absis sumbu simetri parabola?',
        answer: 'x = -b / (2a)',
        hint: 'Minus koefisien linear dibagi 2 kali koefisien kuadrat.',
        difficulty: 'mudah',
        status: 'good'
      },
      {
        id: 'fc-204',
        question: 'Bagaimana karakteristik grafik fungsi kuadrat jika nilai diskriminan D > 0?',
        answer: 'Grafik memotong sumbu X di dua titik nyata yang berlainan.',
        hint: 'Memiliki 2 akar riil berbeda.',
        difficulty: 'mudah',
        status: 'good'
      }
    ],
    quizQuestions: [
      {
        id: 'qz-201',
        topic: 'Karakteristik Parabola',
        difficulty: 'mudah',
        question: 'Pada fungsi kuadrat f(x) = -2x² + 4x - 5, arah bukaan parabola adalah...',
        options: ['Terbuka ke kanan', 'Terbuka ke kiri', 'Terbuka ke bawah', 'Terbuka ke atas'],
        correctIndex: 2,
        explanation: 'Karena nilai koefisien a = -2 (a < 0), maka grafik parabola menghadap ke bawah dan memiliki titik puncak maksimum.'
      },
      {
        id: 'qz-202',
        topic: 'Menghitung Diskriminan',
        difficulty: 'sedang',
        question: 'Nilai diskriminan dari persamaan x² - 6x + 9 = 0 adalah...',
        options: ['-18', '0', '36', '72'],
        correctIndex: 1,
        explanation: 'D = b² - 4ac = (-6)² - 4(1)(9) = 36 - 36 = 0. Artinya memiliki 1 akar riil kembar.'
      }
    ],
    conceptMap: [
      { id: 'm1', label: 'Bentuk y = ax² + bx + c', description: 'Persamaan kurva kuadrat', connections: ['Nilai a', 'Diskriminan D'] },
      { id: 'm2', label: 'Nilai a', description: 'a > 0 (cekung atas), a < 0 (cekung bawah)', connections: ['Titik Puncak'] },
      { id: 'm3', label: 'Diskriminan D', description: 'D > 0 (2 titik), D = 0 (1 titik), D < 0 (melayang)', connections: [] }
    ],
    aiExplanation: `Pikirkan kurva kuadrat seperti lintasan bola basket yang kamu lempar ke ring. Bola meluncur naik, mencapai titik puncak tertinggi, lalu melengkung turun ke bawah.`,
    mastered: true
  },
  {
    id: 'mat-3',
    title: 'Teks Eksplanasi: Struktur Logis, Kaidah Bahasa & Fenomena Alam',
    subject: 'Bahasa Indonesia',
    schoolLevel: 'SMP',
    grade: 'Kelas 8',
    fileType: 'DOCX',
    originalFileName: 'Materi_Bahasa_Indonesia_Eksplanasi.docx',
    uploadDate: '5 hari lalu',
    pagesOrSlides: 12,
    mainConceptsCount: 4,
    keyTermsCount: 7,
    rawText: `Teks eksplanasi adalah teks yang bertujuan menjelaskan proses terjadinya suatu fenomena alam, sosial, ilmu pengetahuan, atau budaya berdasarkan hubungan sebab-akibat (kausalitas) dan urutan waktu (kronologis). Struktur teks eksplanasi terdiri atas: 1. Pernyataan Umum, 2. Rangkaian Kejadian, dan 3. Ulasan/Interpretasi.`,
    summary: {
      simpleOverview: 'Teks eksplanasi menjawab pertanyaan "mengapa" dan "bagaimana" suatu peristiwa atau fenomena di dunia nyata dapat terjadi.',
      bulletPoints: [
        'Fokus pada peristiwa faktual tanpa ada opini fiktif.',
        'Struktur baku: Pernyataan Umum -> Deretan Penjelas (Sebab-Akibat) -> Interpretasi (Simpulan).',
        'Menggunakan kata hubung sebab-akibat (karena, akibatnya) dan urutan waktu (selanjutnya).'
      ],
      keyTerms: [
        { term: 'Kausalitas', definition: 'Hubungan timbal balik antara penyebab suatu peristiwa dan akibat yang ditimbulkannya.' },
        { term: 'Kronologis', definition: 'Penyusunan urutan peristiwa berdasarkan garis waktu terjadinya.' }
      ]
    },
    flashcards: [
      {
        id: 'fc-301',
        question: 'Sebutkan 3 bagian struktur utama teks eksplanasi secara berurutan!',
        answer: '1. Pernyataan Umum, 2. Rangkaian Kejadian (Sebab-Akibat), 3. Ulasan / Interpretasi.',
        hint: 'Dimulai dari pengenalan awal hingga penutup kesimpulan.',
        difficulty: 'mudah',
        status: 'good'
      },
      {
        id: 'fc-302',
        question: 'Manakah contoh konjungsi kausalitas yang sering digunakan dalam teks eksplanasi?',
        answer: 'Karena, oleh sebab itu, sehingga, akibatnya, dikarenakan.',
        hint: 'Kata penghubung yang menerangkan alasan terjadinya efek.',
        difficulty: 'mudah',
        status: 'mastered'
      }
    ],
    quizQuestions: [
      {
        id: 'qz-301',
        topic: 'Struktur Teks',
        difficulty: 'sedang',
        question: 'Bagian teks eksplanasi yang menjelaskan latar belakang umum topik yang akan dibahas disebut...',
        options: ['Deretan Penjelas', 'Pernyataan Umum', 'Interpretasi', 'Orientasi Tokoh'],
        correctIndex: 1,
        explanation: 'Pernyataan umum berada di paragraf pembuka untuk memperkenalkan fenomena alam/sosial yang akan diuraikan prosesnya.'
      }
    ],
    conceptMap: [
      { id: 't1', label: 'Teks Eksplanasi', description: 'Menjelaskan Bagaimana & Mengapa', connections: ['Struktur', 'Kaidah Kebahasaan'] }
    ],
    aiExplanation: `Teks eksplanasi itu ibarat video tutorial ilmiah di YouTube. Di awal pengenalan topik, di tengah proses penjelasannya, dan di akhir kesimpulannya!`,
    mastered: true
  }
];

export const defaultAchievements: Achievement[] = [
  {
    id: 'ach-1',
    title: 'First Lesson 🎖️',
    icon: 'Award',
    description: 'Menyelesaikan sesi belajar materi pertama di Neubytrix.id.',
    unlocked: false,
    xpReward: 100
  },
  {
    id: 'ach-2',
    title: '7 Day Streak 🔥',
    icon: 'Flame',
    description: 'Melakukan check-in 7 hari berturut-turut.',
    unlocked: false,
    xpReward: 350
  },
  {
    id: 'ach-3',
    title: 'Mastered 10 Topics 🧠',
    icon: 'Brain',
    description: 'Menguasai 10 topik materi dengan nilai akurasi di atas 80%.',
    unlocked: false,
    xpReward: 500
  },
  {
    id: 'ach-4',
    title: 'Quiz Master 🏆',
    icon: 'Trophy',
    description: 'Menyelesaikan 5 kuis dan mempelajari pembahasannya.',
    unlocked: false,
    xpReward: 400
  },
  {
    id: 'ach-5',
    title: '100 Flashcards 🗂️',
    icon: 'Layers',
    description: 'Meninjau 100 kartu flashcard sesuai jadwal pengulangan.',
    unlocked: false,
    xpReward: 300
  },
  {
    id: 'ach-6',
    title: 'Curious Learner ✨',
    icon: 'Sparkles',
    description: 'Mengajukan 25 pertanyaan mendalam kepada Neubytrix AI Tutor.',
    unlocked: false,
    xpReward: 200
  }
];

export const defaultTimeline: TimelineMilestone[] = [
  {
    month: 1,
    title: 'Membangun Kebiasaan Belajar',
    status: 'in_progress',
    description: 'Membentuk ritme harian minimal 5-30 menit dan pengenalan materi semester.',
    targets: [
      { text: 'Aktivasi profil dan diagnostik awal', completed: false },
      { text: 'Streak belajar 14 hari berturut-turut', completed: false },
      { text: 'Selesaikan 5 modul ringkasan pertama', completed: false }
    ]
  },
  {
    month: 2,
    title: 'Menguasai Materi Dasar',
    status: 'upcoming',
    description: 'Memperkuat fondasi konsep matematika, sains, dan bahasa dengan flashcard.',
    targets: [
      { text: 'Kuasai 50 kartu istilah penting', completed: false },
      { text: 'Skor kuis dasar minimal 75%', completed: false },
      { text: 'Review materi mingguan bersama AI Tutor', completed: false }
    ]
  },
  {
    month: 3,
    title: 'Memperkuat Materi Sulit',
    status: 'upcoming',
    description: 'Fokus intensif pada bab-bab yang sering salah dijawab (Sistem Pencernaan & Aljabar).',
    targets: [
      { text: 'Bedah topik kelemahan hasil analisis AI', completed: false },
      { text: 'Tanya jawab interaktif mendalam dengan AI', completed: false },
      { text: 'Latihan soal tingkat kesulitan sedang & sulit', completed: false }
    ]
  },
  {
    month: 4,
    title: 'Latihan Soal & Bank Soal',
    status: 'upcoming',
    description: 'Simulasi variasi soal HOTS (Higher Order Thinking Skills) dan manajemen waktu.',
    targets: [
      { text: 'Selesaikan 10 paket latihan soal bertarget', completed: false },
      { text: 'Uji hafalan dengan mode active recall', completed: false },
      { text: 'Tingkatkan akurasi jawaban > 85%', completed: false }
    ]
  },
  {
    month: 5,
    title: 'Simulasi Ujian Semester',
    status: 'upcoming',
    description: 'Tryout berbasis timer dengan kondisi ujian sebenarnya dan evaluasi terperinci.',
    targets: [
      { text: 'Tryout komprehensif 3 mata pelajaran', completed: false },
      { text: 'Review lembar jawaban dan kesalahan umum', completed: false },
      { text: 'Pemantapan konsep kilat sebelum ujian', completed: false }
    ]
  },
  {
    month: 6,
    title: 'Evaluasi Akhir & Peningkatan Nilai',
    status: 'upcoming',
    description: 'Pencapaian target nilai rapor semester dan review perkembangan 6 bulan.',
    targets: [
      { text: 'Analisis kenaikan nilai sekolah', completed: false },
      { text: 'Sertifikasi kemajuan kompetensi Neubytrix.id', completed: false },
      { text: 'Menyusun roadmap belajar semester berikutnya', completed: false }
    ]
  }
];

export const defaultSubjectMastery: SubjectMastery[] = [
  { subject: 'Matematika', percentage: 0, grade: 'Pemula', color: 'from-amber-500 to-orange-500', masteredTopics: 0, totalTopics: 10 },
  { subject: 'Ilmu Pengetahuan Alam (IPA)', percentage: 0, grade: 'Pemula', color: 'from-emerald-500 to-teal-500', masteredTopics: 0, totalTopics: 10 },
  { subject: 'Bahasa Indonesia', percentage: 0, grade: 'Pemula', color: 'from-blue-500 to-indigo-500', masteredTopics: 0, totalTopics: 10 },
  { subject: 'Bahasa Inggris', percentage: 0, grade: 'Pemula', color: 'from-purple-500 to-violet-500', masteredTopics: 0, totalTopics: 10 }
];
