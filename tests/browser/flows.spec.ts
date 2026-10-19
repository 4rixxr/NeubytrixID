import { test, expect, Page } from '@playwright/test';
import path from 'node:path';
import { defaultMaterials } from '../../src/data/defaultData';
async function guest(page: Page, goal = 'SNBT') {
  await page.goto('/');
  if (goal !== 'SNBT') await page.locator('.nb-goal-card').filter({ hasText: goal }).click();
  await page.getByRole('button', { name: `Mulai belajar ${goal}`, exact: true }).click();
  await page.getByRole('textbox', { name: 'Nama panggilan' }).fill('Pelajar Uji');
  await page.getByRole('button', { name: 'Lanjut', exact: true }).click();
  await page.getByRole('button', { name: 'Lanjut', exact: true }).click();
  await page.getByRole('button', { name: 'Mulai belajar', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Halo, Pelajar. Siap belajar?' })).toBeVisible();
}
async function state(page: Page) { return page.evaluate(() => { const user = JSON.parse(localStorage.getItem('neubytrix-current-user')!); return JSON.parse(localStorage.getItem(`neubytrix-data-${user.code.toUpperCase()}`)!); }); }
async function nav(page: Page, tab: string) {
  const menu = page.locator('#mobile-menu-toggle-btn');
  if (await menu.isVisible()) await menu.click();
  await page.locator(`#sidebar-link-${tab}`).click();
}
const fixtures = path.resolve('tests/fixtures');
test('landing controls, feature examples, FAQ and theme work', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Dari catatan,/ })).toBeVisible();
  await page.getByRole('tab', { name: '02 Uji pemahaman' }).click();
  await page.getByRole('button', { name: /Lebih banyak cahaya hijau dipantulkan/ }).click();
  await expect(page.getByText('Benar. Cahaya hijau yang dipantulkan itulah yang terlihat oleh mata.')).toBeVisible();
  await page.getByRole('tab', { name: '01 Baca materinya' }).click();
  await expect(page.locator('.nb-note-equation')).toBeVisible();
  await page.getByRole('button', { name: 'Balik flashcard contoh' }).click();
  await expect(page.getByText('Mitokondria menghasilkan sebagian besar ATP melalui respirasi sel.')).toBeVisible();
  await page.getByRole('tab', { name: 'Latihan kuis' }).click();
  await page.locator('.nb-quiz-demo').getByRole('button', { name: /Mitokondria/ }).click();
  await expect(page.getByText(/Tepat! Mitokondria/)).toBeVisible();
  await page.getByText('Bisa dicoba tanpa akun?', { exact: true }).click();
  await expect(page.getByText(/Bisa. Pilih tujuan belajar/)).toBeVisible();
  await page.getByRole('button', { name: 'Aktifkan tema gelap' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.reload(); await expect(page.locator('html')).toHaveClass(/dark/);
  expect(errors).toEqual([]);
});
test('guest onboarding preserves level, zero stats, check-in and refresh', async ({ page }) => {
  await guest(page, 'Kuliah');
  let data = await state(page); expect(data.profile.schoolLevel).toBe('Kuliah'); expect(data.profile.grade).toBe('Semester 1'); expect(data.profile.xp).toBe(0); expect(data.profile.totalStudyMinutes).toBe(0);
  await page.locator('#claim-checkin-btn').click();
  await expect(page.locator('#claim-checkin-btn')).toBeDisabled();
  await expect(page.locator('#header-xp-pill')).toHaveText('25 XP');
  await page.reload(); await expect(page.locator('#header-xp-pill')).toHaveText('25 XP');
  expect((await state(page)).profile.onboardingCompleted).toBe(true);
});
test('local registration, logout and password login preserve account progress', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: 'Masuk', exact: true }).click();
  await page.getByRole('button', { name: 'Belum punya profil? Buat profil' }).click();
  await page.getByLabel('Nama panggilan', { exact: true }).fill('Profil Uji'); await page.getByLabel('Password', { exact: true }).fill('password-uji-123');
  await page.getByRole('button', { name: 'Buat profil perangkat', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Profilmu sudah siap.' })).toBeVisible();
  const code = await page.locator('.nb-auth-code').innerText();
  expect(await page.evaluate(() => Object.values(localStorage).join('').includes('password-uji-123'))).toBe(false);
  await page.getByRole('button', { name: 'Atur tujuan belajar', exact: true }).click();
  await page.getByRole('button', { name: 'Lanjut', exact: true }).click(); await page.getByRole('button', { name: 'Lanjut', exact: true }).click(); await page.getByRole('button', { name: 'Mulai belajar', exact: true }).click();
  await page.locator('#claim-checkin-btn').click(); await page.locator('#sidebar-logout-btn').click();
  await page.getByRole('button', { name: 'Masuk', exact: true }).click(); await page.getByLabel('Kode profil perangkat').fill(code); await page.getByLabel('Password', { exact: true }).fill('password-uji-123'); await page.getByRole('dialog').getByRole('button', { name: 'Masuk ke ruang belajar', exact: true }).click();
  await expect(page.locator('#header-xp-pill')).toHaveText('25 XP');
});
test('unknown login fails and dialog closes with Escape', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: 'Masuk', exact: true }).click(); await page.getByLabel('Kode profil perangkat').fill('NBT-DOES-NOT-EXIST'); await page.getByLabel('Password', { exact: true }).fill('anything'); await page.getByRole('dialog').getByRole('button', { name: 'Masuk ke ruang belajar', exact: true }).click(); await expect(page.getByRole('alert')).toContainText('tidak cocok'); await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('quiz correct count is not doubled and XP is awarded once', async ({ page }) => {
  await guest(page); await nav(page, 'quiz');
  const questions = defaultMaterials[0].quizQuestions;
  for (let i = 0; i < questions.length; i++) {
    await page.getByRole('button', { name: questions[i].options[questions[i].correctIndex], exact: true }).click();
    await page.getByRole('button', { name: i < questions.length - 1 ? 'Soal Selanjutnya →' : 'Lihat Hasil Akhir', exact: true }).click();
  }
  await expect(page.locator('#quiz-completed-view').getByText('100%', { exact: true })).toBeVisible();
  const data = await state(page); expect(data.studyStats.correctQuestionsCount).toBe(questions.length); expect(data.studyStats.questionsAnswered).toBe(questions.length); expect(data.studyStats.accuracy).toBe(100); expect(data.profile.xp).toBe(questions.length * 25); expect(data.profile.materialsLearned).toBe(1);
});
test('flashcard requires reveal and cannot repeatedly award XP', async ({ page }) => {
  await guest(page); await nav(page, 'flashcards');
  await expect(page.getByRole('button', { name: 'Sudah paham', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Balik flashcard', exact: true }).click(); await page.getByRole('button', { name: 'Sudah paham', exact: true }).click();
  expect((await state(page)).profile.xp).toBe(20);
  await nav(page, 'home'); await nav(page, 'flashcards');
  await expect(page.getByText(defaultMaterials[0].flashcards[0].question, { exact: true })).toHaveCount(0);
  expect((await state(page)).studyStats.flashcardsReviewed).toBe(1);
});
test('profile edit does not roll back XP and persists across refresh', async ({ page }) => {
  await guest(page); await page.locator('#claim-checkin-btn').click(); await nav(page, 'settings'); await page.getByLabel('Nama panggilan', { exact: true }).fill('Nama Baru'); await page.getByRole('button', { name: 'Simpan profil', exact: true }).click(); await expect(page.getByRole('status')).toContainText('Profil berhasil disimpan'); expect((await state(page)).profile.xp).toBe(25); await page.reload(); await expect(page.getByRole('heading', { name: 'Halo, Nama. Siap belajar?' })).toBeVisible();
});
test('timer runs, pauses, survives menu change and resets without XP', async ({ page }) => {
  await guest(page); await page.clock.install();
  await page.locator('#pomodoro-toggle-btn').click(); await page.clock.runFor(2200); await expect(page.getByTestId('focus-time')).toHaveText('24:58');
  await nav(page, 'materi'); await page.clock.runFor(1100); await nav(page, 'home'); await expect(page.getByTestId('focus-time')).toHaveText('24:57');
  await page.locator('#pomodoro-toggle-btn').click(); await page.clock.runFor(2000); await expect(page.getByTestId('focus-time')).toHaveText('24:57');
  await page.locator('#pomodoro-reset-btn').click(); await expect(page.getByTestId('focus-time')).toHaveText('25:00'); expect((await state(page)).profile.xp).toBe(0);
});
test('AI failure is visible, keeps the question and does not give XP', async ({ page }) => {
  await guest(page); await nav(page, 'ai'); await page.getByRole('textbox', { name: 'Pertanyaan untuk Neuby AI' }).fill('Jelaskan sel'); await page.getByRole('button', { name: 'Kirim pertanyaan' }).click(); await expect(page.getByRole('alert')).toContainText('belum diaktifkan'); await expect(page.getByRole('textbox', { name: 'Pertanyaan untuk Neuby AI' })).toHaveValue('Jelaskan sel'); expect((await state(page)).profile.xp).toBe(0); expect((await state(page)).studyStats.aiQuestionsAsked).toBe(0);
});
test('successful AI response renders Markdown and awards one reward (mocked provider)', async ({ page }) => {
  await guest(page); await page.route('**/api/gemini/chat', route => route.fulfill({ json: { response: '## Konsep uji\n\n**Mitokondria** menghasilkan ATP.', modelUsed: 'test-provider', sources: [] } })); await nav(page, 'ai'); await page.getByRole('textbox', { name: 'Pertanyaan untuk Neuby AI' }).fill('Jelaskan sel'); await page.getByRole('button', { name: 'Kirim pertanyaan' }).click(); await expect(page.getByRole('heading', { name: 'Konsep uji' })).toBeVisible(); expect((await state(page)).profile.xp).toBe(25); expect((await state(page)).studyStats.aiQuestionsAsked).toBe(1);
  await page.getByRole('button', { name: 'Lepaskan dokumen' }).click(); await expect(page.locator('#tutor-document')).toHaveValue('');
});
for (const ext of ['txt', 'pdf', 'docx', 'pptx']) test(`real ${ext.toUpperCase()} extraction saves source when AI is unconfigured`, async ({ page }) => {
  await guest(page); await nav(page, 'materi'); await page.locator('input[type="file"]').setInputFiles(path.join(fixtures, `catatan.${ext}`)); await expect(page.getByRole('status')).toContainText('Teks disimpan di perangkat', { timeout: 30000 }); const data = await state(page); expect(data.materials[0].rawText).toContain('Mitokondria'); expect(data.materials[0].flashcards.length).toBe(0); expect(data.materials[0].quizQuestions.length).toBe(0); expect(data.materials[0].analysisStatus).toBe('pending');
});
test('unsupported file and no-result search have visible states', async ({ page }) => {
  await guest(page); await nav(page, 'materi'); await page.locator('input[type="file"]').setInputFiles({ name: 'virus.exe', mimeType: 'application/octet-stream', buffer: Buffer.from('not a study document') }); await expect(page.getByRole('alert')).toContainText('Format tidak didukung'); await page.getByRole('textbox', { name: 'Cari materi' }).fill('zzzzzz-no-material'); await expect(page.getByText('Tidak ada materi yang cocok.')).toBeVisible();
});
test('mobile layout, menu and learning views fit narrow screens', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 }); await page.goto('/'); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); await page.getByRole('button', { name: 'Buka navigasi' }).click(); await expect(page.getByRole('link', { name: 'Tujuan belajar' })).toBeVisible(); await page.getByRole('button', { name: 'Buka navigasi' }).click(); await guest(page); await nav(page, 'settings'); await expect(page.getByRole('heading', { name: 'Pengaturan', exact: true })).toBeVisible(); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); await nav(page, 'ai'); await expect(page.getByRole('button', { name: 'Kirim pertanyaan' })).toBeVisible(); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('production does not serve server source or source maps', async ({ request }) => {
  expect((await request.get('/server.cjs')).status()).toBe(404); expect((await request.get('/server.cjs.map')).status()).toBe(404); expect((await request.get('/api/missing')).status()).toBe(404);
});
