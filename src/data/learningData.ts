export interface QuizItem {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  schoolLevel: string;
}

export interface Flashcard {
  id: string;
  subject: string;
  question: string;
  answer: string;
  tag: string;
}

export interface SubjectModule {
  id: string;
  title: string;
  subject: string;
  level: string;
  grade: string;
  progress: number;
  icon: string;
  color: string;
  description: string;
  topicsCount: number;
}

export const sampleModules: SubjectModule[] = [
  {
    id: 'mat-smp-8-pyt',
    title: 'Teorema Pythagoras & Segitiga',
    subject: 'Matematika',
    level: 'SMP',
    grade: 'Kelas 8',
    progress: 80,
    icon: '📐',
    color: 'from-blue-600 to-indigo-600',
    description: 'Konsep dasar segitiga siku-siku, tripel pythagoras, dan penerapan soal cerita.',
    topicsCount: 5,
  },
  {
    id: 'mat-smp-8-spldv',
    title: 'Sistem Persamaan Linear Dua Variabel (SPLDV)',
    subject: 'Matematika',
    level: 'SMP',
    grade: 'Kelas 8',
    progress: 60,
    icon: '📊',
    color: 'from-indigo-600 to-purple-600',
    description: 'Metode eliminasi, substitusi, dan grafik untuk memecahkan persoalan aljabar.',
    topicsCount: 6,
  },
  {
    id: 'ipa-smp-8-gerak',
    title: 'Sistem Gerak pada Manusia & Hukum Newton',
    subject: 'Ilmu Pengetahuan Alam',
    level: 'SMP',
    grade: 'Kelas 8',
    progress: 75,
    icon: '🦴',
    color: 'from-emerald-600 to-teal-600',
    description: 'Struktur rangka, otot, sendi, dan prinsip gaya gerak menurut hukum fisika.',
    topicsCount: 7,
  },
  {
    id: 'ipa-smp-8-cerna',
    title: 'Sistem Pencernaan & Nutrisi Makanan',
    subject: 'Ilmu Pengetahuan Alam',
    level: 'SMP',
    grade: 'Kelas 8',
    progress: 90,
    icon: '🧬',
    color: 'from-cyan-600 to-blue-600',
    description: 'Enzim pencernaan, proses metabolisme, dan uji zat makanan.',
    topicsCount: 4,
  },
  {
    id: 'eng-smp-8-recount',
    title: 'Recount Text & Past Tense',
    subject: 'Bahasa Inggris',
    level: 'SMP',
    grade: 'Kelas 8',
    progress: 50,
    icon: '📖',
    color: 'from-amber-600 to-orange-600',
    description: 'Writing personal experiences using simple past tense and chronological connectors.',
    topicsCount: 4,
  },
  {
    id: 'ina-smp-8-eksplanasi',
    title: 'Teks Eksplanasi & Fenomena Alam',
    subject: 'Bahasa Indonesia',
    level: 'SMP',
    grade: 'Kelas 8',
    progress: 65,
    icon: '📝',
    color: 'from-rose-600 to-pink-600',
    description: 'Menganalisis sebab-akibat terjadinya peristiwa alam atau sosial.',
    topicsCount: 5,
  },
];

export const sampleQuizzes: QuizItem[] = [
  {
    id: 'q1',
    subject: 'Matematika (Pythagoras)',
    question: 'Sebuah segitiga siku-siku memiliki panjang sisi siku-siku 6 cm dan 8 cm. Berapakah panjang sisi miring (hipotenusa)?',
    options: ['9 cm', '10 cm', '12 cm', '14 cm'],
    correctIndex: 1,
    explanation: 'Sesuai Teorema Pythagoras: c² = a² + b² = 6² + 8² = 36 + 64 = 100, sehingga c = √100 = 10 cm (Tripel Pythagoras 3-4-5 dikalikan 2).',
    schoolLevel: 'SMP',
  },
  {
    id: 'q2',
    subject: 'IPA (Fisika)',
    question: 'Sebuah benda tetap diam atau bergerak lurus beraturan jika resultan gaya yang bekerja sama dengan nol. Pernyataan ini merupakan bunyi...',
    options: ['Hukum I Newton', 'Hukum II Newton', 'Hukum III Newton', 'Hukum Gravitasi Universal'],
    correctIndex: 0,
    explanation: 'Hukum I Newton (Kelembaman/Inersia) menyatakan bahwa benda akan mempertahankan keadaannya jika ΣF = 0.',
    schoolLevel: 'SMP',
  },
  {
    id: 'q3',
    subject: 'IPA (Biologi)',
    question: 'Enzim yang berfungsi mengubah amilum (karbohidrat) menjadi maltosa di dalam rongga mulut adalah...',
    options: ['Enzim Pepsin', 'Enzim Ptialin (Amilase)', 'Enzim Renin', 'Enzim Tripsin'],
    correctIndex: 1,
    explanation: 'Kelenjar ludah memproduksi enzim ptialin (amilase ludah) untuk memecah pati/amilum menjadi gula yang lebih sederhana di rongga mulut.',
    schoolLevel: 'SMP',
  },
  {
    id: 'q4',
    subject: 'Bahasa Indonesia',
    question: 'Bagian struktur teks eksplanasi yang berisi penjelasan terperinci mengenai proses terjadinya suatu peristiwa disebut...',
    options: ['Pernyataan Umum', 'Deretan Penjelas', 'Interpretasi / Ulasan', 'Orientasi'],
    correctIndex: 1,
    explanation: 'Deretan penjelas memaparkan urutan sebab-akibat bagaimana atau mengapa suatu peristiwa dapat terjadi secara kronologis.',
    schoolLevel: 'SMP',
  },
];

export const sampleFlashcards: Flashcard[] = [
  {
    id: 'f1',
    subject: 'Matematika',
    question: 'Apa rumus keliling dan luas lingkaran dengan jari-jari r?',
    answer: 'Keliling = 2 × π × r (atau π × d)\nLuas = π × r²',
    tag: 'Geometri',
  },
  {
    id: 'f2',
    subject: 'IPA',
    question: 'Apa perbedaan pembuluh darah Arteri dan Vena?',
    answer: '• Arteri (Nadi): Membawa darah keluar dari jantung, dinding tebal & elastis, aliran cepat.\n• Vena (Balik): Membawa darah menuju jantung, dinding tipis, memiliki banyak katup.',
    tag: 'Sirkulasi Darah',
  },
  {
    id: 'f3',
    subject: 'IPA',
    question: 'Sebutkan 3 macam Hukum Newton tentang Gerak!',
    answer: '1. Hukum I: Inersia (ΣF = 0)\n2. Hukum II: Percepatan (F = m × a)\n3. Hukum III: Aksi-Reaksi (F aksi = - F reaksi)',
    tag: 'Fisika',
  },
  {
    id: 'f4',
    subject: 'Bahasa Inggris',
    question: 'Kapan kita menggunakan "Past Continuous Tense"?',
    answer: 'Untuk menyatakan aksi yang sedang berlangsung di masa lampau ketika kejadian lain terjadi (Rumus: S + was/were + V-ing).',
    tag: 'Grammar',
  },
];
