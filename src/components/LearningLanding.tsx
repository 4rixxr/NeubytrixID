import React, { useState } from 'react';
import { ArrowUpRight, ArrowRight, Check, X, Menu, Moon, Sun, RotateCw, Plus, Minus } from 'lucide-react';
import { ThemeMode } from '../types';

export type LearningGoal = 'SNBT' | 'Kuliah' | 'Sekolah' | 'Ujian Mandiri' | 'PPPK' | 'SKD';

export function Brand({ onClick }: { onClick?: () => void }) {
  return <button type="button" className="nb-brand" onClick={onClick} aria-label="NeubytrixID, beranda"><span className="nb-mark" aria-hidden="true">n<span>.</span></span><span>neubytrix<span className="nb-brand-id">ID</span></span></button>;
}

const goals: { name: LearningGoal; detail: string }[] = [
  { name: 'SNBT', detail: 'Penalaran, literasi, dan pengetahuan kuantitatif.' },
  { name: 'Kuliah', detail: 'Catatan perkuliahan, konsep, dan persiapan ujian.' },
  { name: 'Sekolah', detail: 'Materi harian dan latihan untuk SD sampai SMA/SMK.' },
];
const modes = [
  { id: 'flashcard', label: 'Flashcards', number: '01', title: 'Yang sudah dipahami,\ntetap diingat.', body: 'Tutup catatanmu sebentar. Coba ingat jawabannya, lalu balik kartunya. Konsep yang masih sulit akan muncul lagi lebih cepat.', note: 'Jadwal pengulangan mengikuti hasil review kamu.' },
  { id: 'tutor', label: 'AI Tutor', number: '02', title: 'Satu pertanyaan bisa\nmembuka pemahaman.', body: 'Bawa pertanyaan dari materi yang sedang dibaca. Minta penjelasan langkah demi langkah, contoh lain, atau alasan di balik sebuah jawaban.', note: 'Percakapan dan analisis membutuhkan layanan AI aktif.' },
  { id: 'quiz', label: 'Latihan kuis', number: '03', title: 'Cari tahu bagian\nyang sudah kamu kuasai.', body: 'Kerjakan soal, baca pembahasannya, lalu lihat bagian yang perlu dipelajari lagi. Hasil latihan masuk ke progres belajarmu.', note: 'Mulai dari soal pada materi contoh yang tersedia.' },
];

function StudyExample() {
  const [tab, setTab] = useState<'read' | 'practice'>('read');
  const [choice, setChoice] = useState<number | null>(null);
  return <div className="nb-notebook" aria-label="Contoh sesi belajar">
    <div className="nb-notebook-top"><span className="nb-example-label"><span /> Contoh sesi belajar</span><span>Biologi / 01</span></div>
    <div className="nb-notebook-tabs" role="tablist" aria-label="Contoh sesi fotosintesis">
      <button role="tab" id="note-read-tab" aria-controls="note-content" aria-selected={tab === 'read'} onClick={() => setTab('read')}>01 <span>Baca materinya</span></button>
      <button role="tab" id="note-practice-tab" aria-controls="note-content" aria-selected={tab === 'practice'} onClick={() => setTab('practice')}>02 <span>Uji pemahaman</span></button>
    </div>
    <div className="nb-notebook-body" id="note-content" role="tabpanel" aria-labelledby={tab === 'read' ? 'note-read-tab' : 'note-practice-tab'}>
      <div className="nb-note-meta"><span>CATATAN BELAJAR</span><span>BAB 03</span></div>
      <h2>Bagaimana tumbuhan<br /><em>membuat makanan?</em></h2>
      {tab === 'read' ? <>
        <p className="nb-note-paragraph">Melalui fotosintesis, tumbuhan mengubah energi cahaya menjadi energi kimia yang tersimpan dalam <mark>glukosa.</mark></p>
        <div className="nb-note-equation"><span>Cahaya matahari</span><div><span>6CO₂ + 6H₂O</span><ArrowRight size={25} strokeWidth={1.2} /><span>C₆H₁₂O₆ + 6O₂</span></div><small>Di kloroplas, dengan bantuan klorofil.</small></div>
        <div className="nb-margin-note"><span>Ingat ini</span><p>Klorofil menyerap terutama cahaya merah dan biru. Lebih banyak cahaya hijau dipantulkan ke mata kita.</p></div>
        <button className="nb-note-next" onClick={() => setTab('practice')}>Sudah baca? Coba satu pertanyaan <ArrowRight size={17} /></button>
      </> : <div className="nb-note-practice"><span className="nb-note-question-label">PERTANYAAN 01 / 01</span><h3>Mengapa daun tampak berwarna hijau?</h3>{['Lebih banyak cahaya hijau dipantulkan.', 'Klorofil hanya menyerap cahaya hijau.', 'Glukosa memberi warna hijau pada daun.'].map((text, index) => <button key={text} className={choice === index ? (index === 0 ? 'is-correct' : 'is-incorrect') : ''} onClick={() => setChoice(index)}><span>{String.fromCharCode(65 + index)}</span>{text}</button>)}{choice !== null && <p role="status" className="nb-note-feedback">{choice === 0 ? 'Benar. Cahaya hijau yang dipantulkan itulah yang terlihat oleh mata.' : 'Coba lagi. Perhatikan warna cahaya yang dipantulkan oleh daun.'}</p>}<button className="nb-note-next" onClick={() => setTab('read')}>Baca ulang catatan <RotateCw size={15} /></button></div>}
    </div>
    <div className="nb-notebook-foot"><span>Materi → Pemahaman → Latihan</span><span>neubytrixID</span></div>
  </div>;
}

export function LearningLanding({ theme, onToggleTheme, onStart, onLogin, onDashboard, signedIn }: { theme: ThemeMode; onToggleTheme: () => void; onStart: (goal: LearningGoal) => void; onLogin: () => void; onDashboard: () => void; signedIn: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [goal, setGoal] = useState<LearningGoal>('SNBT');
  const [mode, setMode] = useState('flashcard');
  const [flipped, setFlipped] = useState(false);
  const [answer, setAnswer] = useState<number | null>(null);
  const selected = modes.find(m => m.id === mode)!;
  const activeGoal = goals.find(item => item.name === goal);
  return <div className="nb-landing">
    <a href="#main-content" className="nb-skip">Lewati ke konten</a>
    <header className="nb-nav"><div className="nb-container nb-nav-inner">
      <Brand onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
      <nav className={`nb-nav-links ${menuOpen ? 'is-open' : ''}`} aria-label="Navigasi utama">
        <a href="#mulai" onClick={() => setMenuOpen(false)}>Tujuan belajar</a><a href="#fitur" onClick={() => setMenuOpen(false)}>Cara belajar</a><a href="#faq" onClick={() => setMenuOpen(false)}>Pertanyaan umum</a>
      </nav>
      <div className="nb-nav-actions"><button className="nb-icon-button" onClick={onToggleTheme} aria-label={theme === 'light' ? 'Aktifkan tema gelap' : 'Aktifkan tema terang'}>{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button><button className="nb-login" onClick={signedIn ? onDashboard : onLogin}>{signedIn ? 'Ruang belajar' : 'Masuk'} <ArrowUpRight size={16} /></button><button className="nb-icon-button nb-mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Buka navigasi">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button></div>
    </div></header>
    <main id="main-content">
      <section className="nb-hero nb-container" id="mulai">
        <div className="nb-hero-copy"><div className="nb-eyebrow"><span className="nb-rule" /> RUANG BELAJAR PRIBADI</div>
          <h1>Dari catatan,<br />jadi <em>pemahaman.</em></h1>
          <p className="nb-hero-description">Bawa materi sekolah, kuliah, atau persiapan SNBT. Pelajari konsepnya, uji pemahamanmu, lalu ulangi yang masih sulit.</p>
          <div className="nb-goal-heading"><h2>Kamu lagi belajar untuk apa?</h2></div>
          <div className="nb-goal-grid" role="group" aria-label="Pilih tujuan belajar">{goals.map(({ name }, i) => <button key={name} className={`nb-goal-card ${goal === name ? 'is-selected' : ''}`} aria-pressed={goal === name} onClick={() => setGoal(name)}><span className="nb-goal-number">0{i + 1}</span><span>{name}</span><ArrowUpRight size={18} /></button>)}</div>
          <p className="nb-goal-description" aria-live="polite">{activeGoal?.detail || `Persiapan ${goal} dengan materi dan latihanmu sendiri.`}</p>
          <div className="nb-hero-actions"><button className="nb-primary nb-start" onClick={() => onStart(goal)}>Mulai belajar {goal}<ArrowRight size={18} /></button><span>Materi contoh tersedia.<br />Bisa dicoba tanpa akun.</span></div>
          <div className="nb-specific"><span>Tujuan lainnya</span>{(['Ujian Mandiri', 'PPPK', 'SKD'] as LearningGoal[]).map(name => <button key={name} aria-pressed={goal === name} className={goal === name ? 'active' : ''} onClick={() => setGoal(name)}>{name}<ArrowUpRight size={12} /></button>)}</div>
        </div>
        <StudyExample />
      </section>
      <div className="nb-method-line nb-container"><span>SESUAI ALUR BELAJARMU</span><p>Baca & pahami <ArrowRight size={16} /> Uji yang kamu ingat <ArrowRight size={16} /> Ulangi yang perlu</p><a href="#fitur">Lihat caranya <ArrowDown /></a></div>
      <section className="nb-problems" id="cara-belajar"><div className="nb-container">
        <div className="nb-section-heading"><span className="nb-section-index">01 / KENALI HAMBATANNYA</span><h2>Belajar lama belum tentu<br />membuat semuanya <em>jelas.</em></h2></div>
        <div className="nb-problem-grid">{[
          ['01', 'Hafal, tapi belum paham.', 'Saat bentuk soalnya berubah, rumus yang dihafal terasa tidak cukup.', 'Urai konsepnya, lalu coba contoh lain.'],
          ['02', 'Materinya belum pas.', 'Bagian yang sulit buatmu bisa berbeda dari yang sulit bagi temanmu.', 'Mulai dari catatan dan pertanyaan sendiri.'],
          ['03', 'Sulit menjaga ritme.', 'Materi menumpuk, sementara waktu dan energi untuk belajar terbatas.', 'Pecah jadi sesi fokus dan pengulangan.'],
        ].map(([num, title, body, end]) => <article className="nb-problem" key={num}><span className="nb-problem-number">{num}</span><h3>{title}</h3><p>{body}</p><div className="nb-problem-end"><span />{end}</div></article>)}</div>
      </div></section>
      <section className="nb-feature-section nb-container" id="fitur">
        <div className="nb-feature-heading"><span className="nb-section-index">02 / CARA BELAJARNYA</span><h2>Baca. Uji. <em>Ulangi.</em></h2><p>Pilih alat yang kamu butuhkan.<br />Tetap di materi yang sedang kamu pelajari.</p></div>
        <div className="nb-feature-layout"><div className="nb-feature-aside"><div className="nb-mode-tabs" role="tablist" aria-label="Contoh fitur">{modes.map(({ id, label, number }) => <button role="tab" id={`tab-${id}`} aria-controls="feature-panel" aria-selected={mode === id} key={id} onClick={() => { setMode(id); setAnswer(null); setFlipped(false); }}><span>{number}</span>{label}<ArrowUpRight size={20} /></button>)}</div><div className="nb-showcase-copy"><h3>{selected.title}</h3><p>{selected.body}</p><button className="nb-text-link" onClick={() => onStart(goal)}>Coba di ruang belajar <ArrowUpRight size={17} /></button></div></div>
        <div className="nb-showcase" id="feature-panel" role="tabpanel" aria-labelledby={`tab-${mode}`}>
          <div className="nb-demo-toolbar"><span>NEUBYTRIX / {selected.label.toUpperCase()}</span><span className="nb-demo-badge">DEMO INTERAKTIF</span></div>
          {mode === 'flashcard' && <div className="nb-flash-demo"><div className="nb-demo-card-label"><span>Biologi · Sel dan organel</span><span>01 / 04</span></div><button className={`nb-demo-flash ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)} aria-label="Balik flashcard contoh"><span className="nb-flash-side">{flipped ? 'JAWABAN' : 'COBA INGAT'}</span><span className="nb-flash-question">{flipped ? 'Mitokondria menghasilkan sebagian besar ATP melalui respirasi sel.' : 'Apa fungsi utama mitokondria?'}</span><span className="nb-flash-flip"><RotateCw size={15} />{flipped ? 'Lihat pertanyaan' : 'Balik untuk melihat jawaban'}</span></button><div className="nb-demo-progress"><span /><span /><span /><span /></div></div>}
          {mode === 'tutor' && <div className="nb-tutor-demo"><div className="nb-demo-message user"><span>KAMU</span>Kenapa daun berwarna hijau?</div><div className="nb-demo-message"><span>NEUBY AI · CONTOH PENJELASAN</span>Daun memiliki pigmen klorofil. Pigmen ini menyerap banyak cahaya merah dan biru, sedangkan lebih banyak cahaya hijau dipantulkan. Itulah warna yang kita lihat.<strong>Bayangkan daun seperti penyaring cahaya.</strong></div><button className="nb-demo-input" onClick={() => onStart(goal)}>Tulis pertanyaanmu sendiri <ArrowUpRight size={17} /></button></div>}
          {mode === 'quiz' && <div className="nb-quiz-demo"><span className="nb-mini-label">COBA SATU SOAL</span><h4>Organel yang menghasilkan sebagian besar ATP adalah…</h4>{['Nukleus', 'Mitokondria', 'Badan Golgi'].map((a, i) => <button key={a} className={answer === i ? (i === 1 ? 'correct' : 'incorrect') : ''} onClick={() => setAnswer(i)}><span>{String.fromCharCode(65 + i)}</span>{a}{answer === i && (i === 1 ? <Check size={16} /> : <X size={16} />)}</button>)}{answer !== null && <p role="status">{answer === 1 ? 'Tepat! Mitokondria berperan dalam respirasi sel untuk menghasilkan ATP.' : 'Belum tepat. Coba ingat tempat utama terjadinya respirasi sel.'}</p>}</div>}
          <p className="nb-feature-note">{selected.note}</p>
        </div></div>
      </section>
      <section className="nb-compare nb-container"><div className="nb-compare-heading"><span className="nb-section-index">03 / DARI KEBIASAAN KE PEMAHAMAN</span><h2>Apa yang <em>berubah?</em></h2></div><div className="nb-table-wrap"><table><thead><tr><th>Dalam proses belajar</th><th>Biasanya</th><th>Dengan NeubytrixID</th></tr></thead><tbody>{[
        ['Memahami', 'Membaca catatan berulang kali', 'Rangkuman dan penjelasan dari materimu'],
        ['Menguji', 'Mengerjakan soal, lalu melihat nilai', 'Latihan dengan pembahasan setiap jawaban'],
        ['Mengingat', 'Mengulang semua menjelang ujian', 'Review flashcard sesuai jadwal pengulangan'],
        ['Menjaga ritme', 'Menunggu waktu luang', 'Sesi fokus, target belajar, dan check-in'],
      ].map(row => <tr key={row[0]}><th scope="row">{row[0]}</th><td data-label="BIASANYA">{row[1]}</td><td data-label="DENGAN NEUBYTRIXID"><Check size={16} />{row[2]}</td></tr>)}</tbody></table></div></section>
      <section className="nb-faq nb-container" id="faq"><div><span className="nb-section-index">SEBELUM MULAI</span><h2>Ada yang ingin<br />kamu <em>tanyakan?</em></h2></div><div>{[
        ['Bisa dicoba tanpa akun?', 'Bisa. Pilih tujuan belajar dan atur preferensimu. Materi contoh, flashcard, kuis, dan timer dapat dipakai langsung. Progres profil perangkat disimpan di browser ini.'],
        ['Materi apa yang bisa digunakan?', 'Gunakan materi contoh atau unggah PDF dengan teks, DOCX, PPTX, TXT, dan Markdown. Foto catatan serta PDF hasil scan membutuhkan layanan AI yang sudah dikonfigurasi.'],
        ['Apakah semua fitur membutuhkan internet?', 'Kuis dan flashcard materi yang sudah tersedia dapat digunakan tanpa memanggil AI. Analisis materi, pembacaan foto, dan percakapan Neuby AI memerlukan internet serta konfigurasi layanan AI.'],
        ['Bagaimana progres belajarku disimpan?', 'Progres disimpan per profil di browser ini. Dokumen dapat disinkronkan ke akun Google jika layanan cloud dikonfigurasi. Jangan hapus data browser sebelum mengekspor cadangan progres di Pengaturan.'],
      ].map(([q, a]) => <details key={q}><summary>{q}<Plus className="nb-faq-plus" size={20} /><Minus className="nb-faq-minus" size={20} /></summary><p>{a}</p></details>)}</div></section>
      <section className="nb-final-cta"><div className="nb-container"><div><span className="nb-section-index">CATATAN PERTAMAMU SUDAH MENUNGGU.</span><h2>Mulai dari<br /><em>satu materi.</em></h2></div><div><p>Pilih tujuan. Buka materinya.<br />Sisihkan waktu untuk memahami.</p><button className="nb-primary" onClick={() => onStart(goal)}>Masuk ke ruang belajar<ArrowUpRight size={20} /></button></div></div></section>
    </main>
    <footer className="nb-footer nb-container"><Brand onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} /><span>Materi. Latihan. Pemahaman.</span><span>© {new Date().getFullYear()} NeubytrixID</span></footer>
  </div>;
}
function ArrowDown() { return <ArrowRight size={16} style={{ transform: 'rotate(90deg)' }} />; }
