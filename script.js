(function () {
  'use strict';

  // ====== KONFIGURASI (edit di sini) ======
  const CONFIG = {
    TILE_SIZE: 40, NYAWA_AWAL: 5, WAKTU_AWAL: 300, KESEMPATAN_BOSS: 3,
    POIN_BARIKADE: 100, POIN_MONSTER: 50, COOLDOWN_AKSI_MS: 320,
    BONUS_WAKTU_PER_DETIK: 1, BONUS_NYAWA: 50,
    DURASI_LANGKAH_MS: 165, DELAY_TAHAN_TOMBOL_MS: 185, COOLDOWN_API_MS: 500,
    TIMER_JEDA_SAAT_SOAL: true, TAMPILKAN_PENJELASAN_SAAT_BENAR: false,
    DURASI_API_AKTIF_MS: 1600, DURASI_API_PADAM_MS: 1600, DURASI_API_PERINGATAN_MS: 800,
    KUNCI_HIGHSCORE: 'labirin_peluang_highscore',
    KUNCI_POOL_SOAL: 'labirin_peluang_pool_soal',
    DURASI_SHAKE_MS: 350, DURASI_KEDIP_MS: 80, BATAS_WAKTU_GENTING: 30,
    VISUAL: {
      SKALA_SPRITE: 2, RADIUS_CAHAYA_OBOR: 0.9, RADIUS_CAHAYA_PEMAIN: 3.5, RADIUS_CAHAYA_API: 1.4,
      JUMLAH_CINCIN_CAHAYA: 3, OPASITAS_VIGNETTE: 0.94, JARAK_OBOR_DINDING: 6,
      KECEPATAN_NYALA_API: 0.012, KECEPATAN_DENYUT_FINISH: 0.004,
      PERSEN_LUMUT: 22, PERSEN_RETAK: 22, AMPLITUDO_BOB_LANGKAH: 3
    }
  };

  // ====== WARNA (nilainya sama dengan CSS Variables di style.css) ======
  const WARNA = {
    void: '#241a2b', lantaiT: '#d2b98f', lantaiS: '#b39878', lantaiG: '#8f7562', nat: '#8a6a5c',
    capT: '#a89486', capG: '#6f6058', bata: '#7a6250', bataG: '#5f4c40', mortar: '#2e2230',
    lumut: '#5c7a3a', lumutG: '#3f5a2a',
    api1: '#ff8a1f', api2: '#ffd24a', api3: '#ffef9a', apiMerah: '#e0401a', obor: '#3a2a22',
    kayu: '#7a4a30', kayuG: '#5a3222', bingkaiBatu: '#8f8a86', besi: '#cfd3dc', emas: '#f2c14e',
    keluar: '#39ff88', outline: '#2b1b17', hatiKosong: '#4a4a5a', hatiPenuh: '#ef4444'
  };

  // ====== PETA (edit di sini) ======
  // Legenda: 0=lantai, 1=dinding, 2=barikade, 3=api, 4=pintu keluar, 5=posisi awal
  const TILE = { LANTAI: 0, DINDING: 1, BARIKADE: 2, API: 3, FINISH: 4, START: 5 };
  // Peta Labirin 28x16 Persegi Panjang (Rasio 16:9 / Widescreen):
  // Menampilkan denah labirin penuh di layar monitor & mobile landscape tanpa ruang kosong.
  const MAP = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 5, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

  // Peta Arena Boss Babak 2: The Chamber of Fate (28x16 Widescreen)
  // Dilengkapi Pilar & Barikade Tembok Pelindung (Cover System) agar pemain bisa berlindung untuk menghitung soal dengan tenang
  const ARENA_BOSS = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

  // Fungsi Deteksi Zona Perlindungan di Balik Tembok Arena Boss
  function isPetakTerlindungi(c, r) {
    if (S.babak !== 2) return false;
    // 1. Bunker Suci Selatan (r >= 10 && c >= 10 && c <= 17)
    if (r >= 10 && c >= 10 && c <= 17) return true;
    // 2. Bastion Kiri / Barat (c <= 7 && r >= 5 && r <= 9)
    if (c <= 7 && r >= 5 && r <= 9) return true;
    // 3. Bastion Kanan / Timur (c >= 20 && r >= 5 && r <= 9)
    if (c >= 20 && r >= 5 && r <= 9) return true;
    return false;
  }

  // Dekorasi peti harta di ruangan labirin
  const DEKORASI = [
    { kolom: 1, baris: 1, jenis: 'peti' },
    { kolom: 7, baris: 1, jenis: 'peti' },
    { kolom: 15, baris: 1, jenis: 'peti' },
    { kolom: 23, baris: 1, jenis: 'peti' },
    { kolom: 26, baris: 5, jenis: 'peti' },
    { kolom: 2, baris: 6, jenis: 'peti' },
    { kolom: 1, baris: 14, jenis: 'peti' },
    { kolom: 26, baris: 11, jenis: 'peti' }
  ];
  // Daftar monster penjaga labirin (pemain wajib menyerang monster yang menghadang jalan)
  const MONSTER_AWAL = [
    // Ruang 1: Penjaga Koridor Barikade 1 (Wajib Diserang)
    { id: 1, tipe: 'slime', c0: 4, r0: 2, axis: 'x', min: 3, max: 4, stepInterval: 1200 },
    // Ruang 2: Patroli Galeri Utara & Penjaga Barikade 2 (Wajib Diserang)
    { id: 2, tipe: 'imp', c0: 12, r0: 1, axis: 'x', min: 10, max: 16, stepInterval: 1050 },
    { id: 3, tipe: 'slime', c0: 22, r0: 3, axis: 'x', min: 19, max: 24, stepInterval: 1100 },
    { id: 4, tipe: 'imp', c0: 25, r0: 3, axis: 'y', min: 2, max: 3, stepInterval: 1000 },
    // Ruang 3: Lorong Sayap Timur & Penjaga Barikade 3 (Wajib Diserang)
    { id: 5, tipe: 'slime', c0: 24, r0: 6, axis: 'x', min: 22, max: 25, stepInterval: 1150 },
    { id: 6, tipe: 'imp', c0: 18, r0: 6, axis: 'x', min: 18, max: 19, stepInterval: 950 },
    // Ruang 4: Aula Besar Tengah & Penjaga Barikade 4 (Wajib Diserang)
    { id: 7, tipe: 'imp', c0: 10, r0: 7, axis: 'x', min: 8, max: 11, stepInterval: 1100 },
    { id: 8, tipe: 'slime', c0: 4, r0: 7, axis: 'y', min: 6, max: 8, stepInterval: 1000 },
    // Ruang 5: Lorong Bawah Barat Daya & Penjaga Barikade 5 (Wajib Diserang)
    { id: 9, tipe: 'slime', c0: 4, r0: 12, axis: 'x', min: 4, max: 7, stepInterval: 1150 },
    { id: 10, tipe: 'imp', c0: 13, r0: 12, axis: 'x', min: 11, max: 14, stepInterval: 900 },
    // Ruang 6: Penjaga Sanctuary & Gerbang Portal Finish (Wajib Diserang)
    { id: 11, tipe: 'imp', c0: 22, r0: 12, axis: 'x', min: 21, max: 24, stepInterval: 1000 },
    { id: 12, tipe: 'slime', c0: 23, r0: 14, axis: 'x', min: 22, max: 24, stepInterval: 900 }
  ];
  const KOLOM = MAP[0].length, BARIS = MAP.length;

    // ====== BANK SOAL PELUANG (PROBABILITAS) - 60 SOAL (10 SOAL PER KATEGORI) ======
  // 1. Konsep dasar peluang (10 soal)
  // 2. Ruang sampel dan kejadian (10 soal)
  // 3. Peluang teoritis dan empiris (10 soal)
  // 4. Kejadian saling lepas (10 soal)
  // 5. Kejadian saling bebas (10 soal)
  // 6. Peluang gabungan dua kejadian (10 soal)
  const bankSoal = [
    {
      kategori: 'Konsep Dasar Peluang', tingkat: 'mudah',
      pertanyaan: 'Sebuah kantong sihir berisi 6 kristal api dan 4 kristal es. Satu kristal diambil secara acak. Berapa peluang terambil kristal api?',
      opsi: ['[2/5]', '[3/5]', '[1/4]', '[3/4]'], jawabanBenar: 1,
      penjelasan: 'n(Api) = 6, n(S) = 6 + 4 = 10. Peluang P = [6/10] disederhanakan menjadi [3/5].'
    },
    {
      kategori: 'Konsep Dasar Peluang', tingkat: 'mudah',
      pertanyaan: 'Manakah rentang nilai peluang yang benar untuk suatu kejadian A dalam matematika?',
      opsi: ['P(A) > 1', 'P(A) < 0', '0 ≤ P(A) ≤ 1', '-1 ≤ P(A) ≤ 1'], jawabanBenar: 2,
      penjelasan: 'Nilai peluang suatu kejadian selalu berada pada rentang 0 ≤ P(A) ≤ 1 (0 = kemustahilan, 1 = kepastian).'
    },
    {
      kategori: 'Konsep Dasar Peluang', tingkat: 'sedang',
      pertanyaan: 'Peluang seorang petualang terkena jebakan duri adalah [3/8]. Berapa peluang petualang tersebut selamat (tidak terkena jebakan)?',
      opsi: ['[3/8]', '[1/8]', '[7/8]', '[5/8]'], jawabanBenar: 3,
      penjelasan: 'Rumus komplemen: P(Selamat) = 1 - P(Kena) = 1 - [3/8] = [8/8] - [3/8] = [5/8].'
    },
    {
      kategori: 'Konsep Dasar Peluang', tingkat: 'sedang',
      pertanyaan: 'Peti berisi 5 kunci emas, 3 kunci perak, dan 2 kunci perunggu. Satu kunci diambil acak. Berapa peluang terambil BUKAN kunci perunggu?',
      opsi: ['[4/5]', '[1/5]', '[3/10]', '[1/2]'], jawabanBenar: 0,
      penjelasan: 'Bukan perunggu = emas + perak = 5 + 3 = 8 kunci. Total n(S) = 10. P = [8/10] = [4/5]. Atau komplemen: 1 - [2/10] = [4/5].'
    },
    {
      kategori: 'Konsep Dasar Peluang', tingkat: 'mudah',
      pertanyaan: 'Dalam sebuah ruangan dungeon, terdapat 12 pintu dan hanya 1 pintu yang benar menuju jalan keluar. Berapa peluang memilih pintu yang benar?',
      opsi: ['[1/12]', '[1/6]', '[1/2]', '[11/12]'], jawabanBenar: 0,
      penjelasan: 'Hanya ada 1 pintu benar dari total 12 pintu. Maka peluangnya adalah P = [1/12].'
    },
    {
      kategori: 'Konsep Dasar Peluang', tingkat: 'mudah',
      pertanyaan: 'Peluang munculnya mata dadu 7 pada pelemparan sebuah dadu bersisi 6 standar adalah...',
      opsi: ['1', '[1/6]', '0', '[7/6]'], jawabanBenar: 2,
      penjelasan: 'Mata dadu 7 tidak ada pada dadu standar (ruang sampel hanya 1 sampai 6), sehingga ini adalah kejadian mustahil dengan peluang 0.'
    },
    {
      kategori: 'Konsep Dasar Peluang', tingkat: 'sedang',
      pertanyaan: 'Dari 25 ramuan di laboratorium, 15 ramuan penambah darah dan sisanya racun. Berapa peluang seorang petualang mengambil ramuan racun?',
      opsi: ['[3/5]', '[2/5]', '[1/5]', '[4/5]'], jawabanBenar: 1,
      penjelasan: 'Banyak ramuan racun = 25 - 15 = 10. Peluang terambil racun = [10/25] disederhanakan menjadi [2/5].'
    },
    {
      kategori: 'Konsep Dasar Peluang', tingkat: 'mudah',
      pertanyaan: 'Sebuah koin seimbang dilempar satu kali. Berapa peluang munculnya sisi Angka?',
      opsi: ['[1/4]', '[1/2]', '1', '0'], jawabanBenar: 1,
      penjelasan: 'Koin memiliki 2 sisi (Angka dan Gambar). Peluang muncul sisi Angka adalah [1/2].'
    },
    {
      kategori: 'Konsep Dasar Peluang', tingkat: 'sedang',
      pertanyaan: 'Jika peluang hari ini turun hujan salju di puncak gunung labirin adalah 0,28, berapakah peluang hari ini TIDAK turun salju?',
      opsi: ['0,72', '0,82', '0,28', '0,62'], jawabanBenar: 0,
      penjelasan: 'P(Tidak Salju) = 1 - P(Salju) = 1 - 0,28 = 0,72.'
    },
    {
      kategori: 'Konsep Dasar Peluang', tingkat: 'sedang',
      pertanyaan: 'Sebuah toples berisi 8 kelereng merah, 7 kelereng biru, dan 5 kelereng kuning. Satu kelereng diambil acak. Berapa peluang terambil kelereng biru?',
      opsi: ['[7/20]', '[2/5]', '[1/4]', '[3/10]'], jawabanBenar: 0,
      penjelasan: 'n(Biru) = 7, total n(S) = 8 + 7 + 5 = 20. Peluang P = [7/20].'
    },
    {
      kategori: 'Ruang Sampel & Kejadian', tingkat: 'mudah',
      pertanyaan: 'Untuk membuka gerbang sihir, 2 koin perak dan 1 dadu bersisi 6 dilempar bersamaan. Berapa banyak titik sampel pada ruang sampelnya?',
      opsi: ['12', '18', '24', '36'], jawabanBenar: 2,
      penjelasan: 'n(S) = banyak sisi koin 1 x koin 2 x dadu = 2 x 2 x 6 = 24 titik sampel.'
    },
    {
      kategori: 'Ruang Sampel & Kejadian', tingkat: 'sedang',
      pertanyaan: 'Dua buah dadu dilempar bersamaan satu kali. Berapa peluang munculnya mata dadu yang berjumlah 9?',
      opsi: ['[1/9]', '[1/12]', '[5/36]', '[1/6]'], jawabanBenar: 0,
      penjelasan: 'n(S) = 6 x 6 = 36. Pasangan jumlah 9: (3,6), (4,5), (5,4), (6,3) ada 4 titik. Peluang P = [4/36] = [1/9].'
    },
    {
      kategori: 'Ruang Sampel & Kejadian', tingkat: 'sedang',
      pertanyaan: 'Dua buah dadu dilempar bersamaan. Berapa peluang munculnya mata dadu kembar (angka sama pada kedua dadu)?',
      opsi: ['[1/12]', '[1/6]', '[1/36]', '[5/36]'], jawabanBenar: 1,
      penjelasan: 'Mata dadu kembar: (1,1), (2,2), (3,3), (4,4), (5,5), (6,6) ada 6 pasangan. n(S) = 36. Peluang P = [6/36] = [1/6].'
    },
    {
      kategori: 'Ruang Sampel & Kejadian', tingkat: 'sedang',
      pertanyaan: 'Tiga koin dilempar bersamaan sekali. Berapa peluang muncul paling sedikit 2 sisi Gambar?',
      opsi: ['[3/8]', '[1/4]', '[1/2]', '[5/8]'], jawabanBenar: 2,
      penjelasan: 'n(S) = 2^{3} = 8. Titik sampel minimal 2 Gambar: (G,G,A), (G,A,G), (A,G,G), (G,G,G) ada 4 titik. P = [4/8] = [1/2].'
    },
    {
      kategori: 'Ruang Sampel & Kejadian', tingkat: 'mudah',
      pertanyaan: 'Berapa banyak ruang sampel pada pelemparan 4 koin uang logam bersamaan?',
      opsi: ['8', '12', '16', '32'], jawabanBenar: 2,
      penjelasan: 'Banyak titik sampel untuk n koin adalah 2^{n} = 2^{4} = 16.'
    },
    {
      kategori: 'Ruang Sampel & Kejadian', tingkat: 'sedang',
      pertanyaan: 'Dua buah dadu dilempar bersamaan. Berapa banyak titik sampel mata dadu yang berjumlah 10 atau lebih?',
      opsi: ['4', '6', '8', '10'], jawabanBenar: 1,
      penjelasan: 'Jumlah 10: (4,6),(5,5),(6,4) = 3. Jumlah 11: (5,6),(6,5) = 2. Jumlah 12: (6,6) = 1. Total = 3 + 2 + 1 = 6 titik sampel.'
    },
    {
      kategori: 'Ruang Sampel & Kejadian', tingkat: 'sedang',
      pertanyaan: 'Dua dadu dilempar bersamaan sekali. Berapa peluang munculnya mata dadu dengan selisih 2?',
      opsi: ['[1/6]', '[2/9]', '[5/36]', '[1/4]'], jawabanBenar: 1,
      penjelasan: 'Selisih 2: (1,3),(2,4),(3,5),(4,6),(3,1),(4,2),(5,3),(6,4) ada 8 titik sampel. Peluang P = [8/36] = [2/9].'
    },
    {
      kategori: 'Ruang Sampel & Kejadian', tingkat: 'mudah',
      pertanyaan: 'Berapa banyak titik sampel pelemparan sebuah dadu 6 sisi dan 2 koin bersamaan?',
      opsi: ['12', '24', '36', '48'], jawabanBenar: 1,
      penjelasan: 'n(S) = 6 (dadu) x 2 (koin 1) x 2 (koin 2) = 24 titik sampel.'
    },
    {
      kategori: 'Ruang Sampel & Kejadian', tingkat: 'sedang',
      pertanyaan: 'Dua dadu dilempar bersamaan. Berapa peluang jumlah kedua mata dadu kurang dari 5?',
      opsi: ['[1/6]', '[5/36]', '[1/12]', '[1/4]'], jawabanBenar: 0,
      penjelasan: 'Jumlah 2: (1,1) = 1. Jumlah 3: (1,2),(2,1) = 2. Jumlah 4: (1,3),(2,2),(3,1) = 3. Total ada 6 titik sampel. P = [6/36] = [1/6].'
    },
    {
      kategori: 'Ruang Sampel & Kejadian', tingkat: 'mudah',
      pertanyaan: 'Himpunan semua hasil yang mungkin terjadi pada suatu percobaan statistika disebut...',
      opsi: ['Titik sampel', 'Kejadian majemuk', 'Ruang sampel', 'Frekuensi harapan'], jawabanBenar: 2,
      penjelasan: 'Ruang sampel (dilambangkan dengan S) adalah himpunan semua hasil yang mungkin terjadi dari suatu percobaan.'
    },
    {
      kategori: 'Peluang Teoritis & Empiris', tingkat: 'mudah',
      pertanyaan: 'Sebuah koin kuno dilempar 150 kali dan muncul sisi gambar sebanyak 60 kali. Berapa peluang empiris (frekuensi relatif) munculnya gambar?',
      opsi: ['[3/5]', '[1/2]', '[2/5]', '[1/3]'], jawabanBenar: 2,
      penjelasan: 'Peluang empiris = frekuensi kemunculan / total percobaan = [60/150] = [6/15] = [2/5] = 0,4.'
    },
    {
      kategori: 'Peluang Teoritis & Empiris', tingkat: 'sedang',
      pertanyaan: 'Sebuah dadu dilempar sebanyak 180 kali. Berapa frekuensi harapan muncul mata dadu kelipatan 3 (angka 3 atau 6)?',
      opsi: ['30 kali', '60 kali', '90 kali', '120 kali'], jawabanBenar: 1,
      penjelasan: 'Mata kelipatan 3: {3, 6} -> P = [2/6] = [1/3]. Frekuensi Harapan Fh = P x N = [1/3] x 180 = 60 kali.'
    },
    {
      kategori: 'Peluang Teoritis & Empiris', tingkat: 'sedang',
      pertanyaan: 'Peluang ramuan sihir berhasil diracik adalah 0,85. Jika dibuat 200 botol ramuan, berapa frekuensi harapan ramuan yang GAGAL?',
      opsi: ['15 botol', '170 botol', '25 botol', '30 botol'], jawabanBenar: 3,
      penjelasan: 'P(Gagal) = 1 - 0,85 = 0,15. Frekuensi harapan gagal = 0,15 x 200 = 30 botol.'
    },
    {
      kategori: 'Peluang Teoritis & Empiris', tingkat: 'sedang',
      pertanyaan: 'Seorang pemanah membidik sasaran 80 kali dan tepat mengenai sasaran 52 kali. Berapa peluang empiris tembakan pemanah tersebut meleset?',
      opsi: ['[7/20]', '[13/20]', '[2/5]', '[3/10]'], jawabanBenar: 0,
      penjelasan: 'Banyak meleset = 80 - 52 = 28 kali. Peluang empiris meleset = [28/80] disederhanakan dibagi 4 menjadi [7/20].'
    },
    {
      kategori: 'Peluang Teoritis & Empiris', tingkat: 'mudah',
      pertanyaan: 'Sebuah dadu dilempar 300 kali. Berapa frekuensi harapan muncul mata dadu bilangan prima (2, 3, 5)?',
      opsi: ['100 kali', '150 kali', '200 kali', '50 kali'], jawabanBenar: 1,
      penjelasan: 'Prima pada dadu: {2, 3, 5} ada 3 mata, P = [3/6] = [1/2]. Fh = [1/2] x 300 = 150 kali.'
    },
    {
      kategori: 'Peluang Teoritis & Empiris', tingkat: 'sedang',
      pertanyaan: 'Pada percobaan melempar 2 koin sebanyak 100 kali, muncul 2 Angka sebanyak 28 kali. Berapakah nilai peluang empiris munculnya 2 Angka?',
      opsi: ['0,25', '0,28', '0,50', '0,14'], jawabanBenar: 1,
      penjelasan: 'Peluang empiris = frekuensi / total = 28 / 100 = 0,28. (Peluang teoritisnya adalah 1/4 = 0,25).'
    },
    {
      kategori: 'Peluang Teoritis & Empiris', tingkat: 'sedang',
      pertanyaan: 'Dua koin dilempar bersamaan sebanyak 120 kali. Berapakah frekuensi harapan munculnya 1 Angka dan 1 Gambar?',
      opsi: ['30 kali', '60 kali', '90 kali', '40 kali'], jawabanBenar: 1,
      penjelasan: 'Ruang sampel 2 koin: (A,A),(A,G),(G,A),(G,G). Kejadian 1A 1G: {(A,G),(G,A)} -> P = [2/4] = [1/2]. Fh = [1/2] x 120 = 60 kali.'
    },
    {
      kategori: 'Peluang Teoritis & Empiris', tingkat: 'mudah',
      pertanyaan: 'Perbedaan utama antara peluang empiris dan peluang teoritis adalah...',
      opsi: ['Empiris berdasarkan percobaan nyata, teoritis berdasarkan perhitungan matematis ruang sampel', 'Empiris selalu bernilai 1, teoritis bernilai 0', 'Teoritis hanya untuk koin, empiris hanya untuk dadu', 'Keduanya sama persis dan tidak ada perbedaan konsep'], jawabanBenar: 0,
      penjelasan: 'Peluang teoritis dihitung dari rasio n(A)/n(S) secara matematis, sedangkan peluang empiris dihitung dari hasil frekuensi percobaan nyata.'
    },
    {
      kategori: 'Peluang Teoritis & Empiris', tingkat: 'sedang',
      pertanyaan: 'Peluang seorang ksatria menangkis serangan goblin adalah 0,6. Jika diserang 50 kali, berapa kali ksatria tersebut diperkirakan BERHASIL menangkis?',
      opsi: ['20 kali', '25 kali', '30 kali', '35 kali'], jawabanBenar: 2,
      penjelasan: 'Fh = P x N = 0,6 x 50 = 30 kali penangkisan berhasil.'
    },
    {
      kategori: 'Peluang Teoritis & Empiris', tingkat: 'sedang',
      pertanyaan: 'Dalam 50 kali pengundian kartu, kartu pusaka muncul 15 kali. Berapa frekuensi harapan munculnya kartu pusaka jika percobaan diulang 200 kali?',
      opsi: ['45 kali', '50 kali', '60 kali', '75 kali'], jawabanBenar: 2,
      penjelasan: 'Peluang empiris = [15/50] = [3/10]. Untuk 200 kali: Fh = [3/10] x 200 = 60 kali.'
    },
    {
      kategori: 'Kejadian Saling Lepas', tingkat: 'mudah',
      pertanyaan: 'Sebuah dadu bersisi 6 dilempar sekali. Berapa peluang muncul mata dadu prima (2, 3, 5) ATAU mata dadu 4?',
      opsi: ['[1/2]', '[2/3]', '[5/6]', '[1/3]'], jawabanBenar: 1,
      penjelasan: 'A = {2, 3, 5} dan B = {4}. Karena saling lepas (A ∩ B = ∅), P(A ∪ B) = P(A) + P(B) = [3/6] + [1/6] = [4/6] = [2/3].'
    },
    {
      kategori: 'Kejadian Saling Lepas', tingkat: 'sedang',
      pertanyaan: 'Dari satu set kartu remi (52 kartu tanpa joker), diambil 1 kartu acak. Berapa peluang terambil kartu As ATAU kartu bergambar Raja (King)?',
      opsi: ['[2/13]', '[1/13]', '[4/13]', '[8/52]'], jawabanBenar: 0,
      penjelasan: 'Kartu As ada 4 dan King ada 4. Keduanya saling lepas. P(As ∪ King) = [4/52] + [4/52] = [8/52] = [2/13].'
    },
    {
      kategori: 'Kejadian Saling Lepas', tingkat: 'sedang',
      pertanyaan: 'Sebuah kotak berisi gulungan nomor 1 sampai 12. Satu nomor diambil acak. Berapa peluang terambil nomor ganjil ATAU nomor kelipatan 4?',
      opsi: ['[2/3]', '[1/2]', '[3/4]', '[7/12]'], jawabanBenar: 2,
      penjelasan: 'Ganjil = {1, 3, 5, 7, 9, 11} (6 angka). Kelipatan 4 = {4, 8, 12} (3 angka). Saling lepas. P = [6/12] + [3/12] = [9/12] = [3/4].'
    },
    {
      kategori: 'Kejadian Saling Lepas', tingkat: 'sedang',
      pertanyaan: 'Sebuah kantong berisi 10 bola bernomor 1 sampai 10. Diambil 1 bola acak. Berapa peluang terambil bola bernomor kelipatan 3 ATAU kelipatan 5?',
      opsi: ['[2/5]', '[3/5]', '[1/2]', '[3/10]'], jawabanBenar: 2,
      penjelasan: 'Kelipatan 3: {3, 6, 9} (3 bola). Kelipatan 5: {5, 10} (2 bola). Tidak ada nomor persekutuan (saling lepas). P = [3/10] + [2/10] = [5/10] = [1/2].'
    },
    {
      kategori: 'Kejadian Saling Lepas', tingkat: 'mudah',
      pertanyaan: 'Dua kejadian A dan B dikatakan saling lepas (mutually exclusive) jika...',
      opsi: ['P(A ∩ B) = 0 (tidak mungkin terjadi bersamaan)', 'P(A) = P(B)', 'P(A ∩ B) = P(A) x P(B)', 'P(A ∪ B) = 1'], jawabanBenar: 0,
      penjelasan: 'Kejadian saling lepas adalah dua kejadian yang tidak memiliki irisan sama sekali, artinya A ∩ B = ∅ sehingga P(A ∩ B) = 0.'
    },
    {
      kategori: 'Kejadian Saling Lepas', tingkat: 'sedang',
      pertanyaan: 'Dari 52 kartu bridge, diambil 1 kartu. Berapa peluang terambil kartu Hati (Heart) ATAU kartu Sekop (Spade)?',
      opsi: ['[1/4]', '[1/2]', '[3/4]', '[13/52]'], jawabanBenar: 1,
      penjelasan: 'Kartu Hati ada 13, kartu Sekop ada 13. Saling lepas: P = [13/52] + [13/52] = [26/52] = [1/2].'
    },
    {
      kategori: 'Kejadian Saling Lepas', tingkat: 'sedang',
      pertanyaan: 'Sebuah dadu dilempar sekali. Berapa peluang muncul mata dadu 1 ATAU mata dadu genap?',
      opsi: ['[1/2]', '[2/3]', '[5/6]', '[1/3]'], jawabanBenar: 1,
      penjelasan: 'Mata 1: {1} (1 buah). Genap: {2, 4, 6} (3 buah). Saling lepas: P = [1/6] + [3/6] = [4/6] = [2/3].'
    },
    {
      kategori: 'Kejadian Saling Lepas', tingkat: 'sedang',
      pertanyaan: 'Sebuah kantong berisi 4 kelereng merah, 5 hijau, dan 6 putih. Satu kelereng diambil acak. Berapa peluang terambil kelereng merah ATAU putih?',
      opsi: ['[2/3]', '[3/5]', '[4/15]', '[1/3]'], jawabanBenar: 0,
      penjelasan: 'Merah ada 4, Putih ada 6. Total = 15. Saling lepas: P = [4/15] + [6/15] = [10/15] = [2/3].'
    },
    {
      kategori: 'Kejadian Saling Lepas', tingkat: 'sedang',
      pertanyaan: 'Jika P(A) = 0,35 dan P(B) = 0,45 dengan A dan B adalah dua kejadian saling lepas, berapakah nilai P(A ∪ B)?',
      opsi: ['0,1575', '0,70', '0,80', '0,10'], jawabanBenar: 2,
      penjelasan: 'Untuk kejadian saling lepas: P(A ∪ B) = P(A) + P(B) = 0,35 + 0,45 = 0,80.'
    },
    {
      kategori: 'Kejadian Saling Lepas', tingkat: 'sedang',
      pertanyaan: 'Sebuah dadu dilempar sekali. Peluang muncul mata dadu kurang dari 3 ATAU lebih dari 4 adalah...',
      opsi: ['[1/3]', '[1/2]', '[2/3]', '[5/6]'], jawabanBenar: 2,
      penjelasan: 'Kurang dari 3: {1, 2} (2 mata). Lebih dari 4: {5, 6} (2 mata). Saling lepas: P = [2/6] + [2/6] = [4/6] = [2/3].'
    },
    {
      kategori: 'Kejadian Saling Bebas', tingkat: 'sedang',
      pertanyaan: 'Satu koin dan satu dadu dilempar bersamaan. Berapa peluang muncul sisi Angka pada koin DAN mata dadu lebih dari 4 pada dadu?',
      opsi: ['[1/4]', '[1/6]', '[1/3]', '[1/12]'], jawabanBenar: 1,
      penjelasan: 'Kejadian saling bebas: P(Angka) = [1/2]. Mata dadu > 4 adalah {5, 6}, maka P(>4) = [2/6] = [1/3]. P = [1/2] x [1/3] = [1/6].'
    },
    {
      kategori: 'Kejadian Saling Bebas', tingkat: 'sedang',
      pertanyaan: 'Peluang Priestess mengenai monster adalah 0,7 dan peluang Ksatria mengenainya adalah 0,8. Berapa peluang KEDUANYA berhasil menyerang monster bersamaan?',
      opsi: ['0,75', '0,80', '0,56', '1,50'], jawabanBenar: 2,
      penjelasan: 'Karena saling bebas: P(A ∩ B) = P(A) x P(B) = 0,7 x 0,8 = 0,56.'
    },
    {
      kategori: 'Kejadian Saling Bebas', tingkat: 'sulit',
      pertanyaan: 'Peti I berisi 3 batu rubi dan 2 safir. Peti II berisi 4 batu rubi dan 1 safir. Dari tiap peti diambil 1 batu secara terpisah. Berapa peluang terambil keduanya batu rubi?',
      opsi: ['[12/25]', '[7/10]', '[3/5]', '[7/25]'], jawabanBenar: 0,
      penjelasan: 'P(Rubi I) = [3/5], P(Rubi II) = [4/5]. Kejadian saling bebas: P = [3/5] x [4/5] = [12/25].'
    },
    {
      kategori: 'Kejadian Saling Bebas', tingkat: 'sedang',
      pertanyaan: 'Kotak berisi 5 bola merah dan 3 bola putih. Satu bola diambil acak, dicatat warnanya, lalu DIKEMBALIKAN ke kotak. Kemudian diambil 1 bola lagi. Berapa peluang terambil keduanya bola merah?',
      opsi: ['[25/64]', '[5/14]', '[25/56]', '[5/8]'], jawabanBenar: 0,
      penjelasan: 'Karena dikembalikan, pengambilan saling bebas. P(Merah 1) = [5/8], P(Merah 2) = [5/8]. Peluang keduanya merah = [5/8] x [5/8] = [25/64].'
    },
    {
      kategori: 'Kejadian Saling Bebas', tingkat: 'mudah',
      pertanyaan: 'Dua koin dilempar bersamaan satu kali. Berapa peluang muncul keduanya sisi Gambar?',
      opsi: ['[1/2]', '[1/4]', '[3/4]', '[1/8]'], jawabanBenar: 1,
      penjelasan: 'P(G1) = [1/2], P(G2) = [1/2]. Karena saling bebas: P = [1/2] x [1/2] = [1/4].'
    },
    {
      kategori: 'Kejadian Saling Bebas', tingkat: 'sedang',
      pertanyaan: 'Dua dadu dilempar bersamaan. Berapakah peluang muncul mata dadu 6 pada dadu pertama DAN mata dadu ganjil pada dadu kedua?',
      opsi: ['[1/12]', '[1/6]', '[1/4]', '[5/36]'], jawabanBenar: 0,
      penjelasan: 'P(Dadu1 = 6) = [1/6]. P(Dadu2 ganjil) = [3/6] = [1/2]. Saling bebas: P = [1/6] x [1/2] = [1/12].'
    },
    {
      kategori: 'Kejadian Saling Bebas', tingkat: 'sedang',
      pertanyaan: 'Peluang siswa A lulus ujian adalah 0,85 dan peluang siswa B lulus ujian adalah 0,90. Berapa peluang siswa A lulus TETAPI siswa B tidak lulus?',
      opsi: ['0,085', '0,765', '0,050', '0,100'], jawabanBenar: 0,
      penjelasan: 'P(A lulus) = 0,85. P(B tidak lulus) = 1 - 0,90 = 0,10. Saling bebas: P = 0,85 x 0,10 = 0,085.'
    },
    {
      kategori: 'Kejadian Saling Bebas', tingkat: 'mudah',
      pertanyaan: 'Dua kejadian A dan B dikatakan saling bebas (independent) apabila...',
      opsi: ['Terjadinya kejadian A tidak mempengaruhi peluang terjadinya kejadian B', 'Kejadian A dan B tidak bisa terjadi bersamaan', 'Peluang A selalu sama dengan peluang B', 'Jumlah peluang A dan B harus sama dengan 1'], jawabanBenar: 0,
      penjelasan: 'Dua kejadian saling bebas jika terjadinya salah satu kejadian tidak mengubah atau mempengaruhi probabilitas terjadinya kejadian yang lain.'
    },
    {
      kategori: 'Kejadian Saling Bebas', tingkat: 'sedang',
      pertanyaan: 'Dua dadu dilempar bersamaan. Berapa peluang muncul mata dadu prima pada dadu pertama DAN mata dadu prima pada dadu kedua?',
      opsi: ['[1/2]', '[1/4]', '[1/6]', '[3/8]'], jawabanBenar: 1,
      penjelasan: 'P(Prima 1) = [3/6] = [1/2]. P(Prima 2) = [3/6] = [1/2]. Saling bebas: P = [1/2] x [1/2] = [1/4].'
    },
    {
      kategori: 'Kejadian Saling Bebas', tingkat: 'sulit',
      pertanyaan: 'Kotak A berisi 2 bola hitam dan 3 putih. Kotak B berisi 3 bola hitam dan 1 putih. Diambil 1 bola dari masing-masing kotak. Berapa peluang terambil keduanya berbeda warna?',
      opsi: ['[11/20]', '[9/20]', '[3/10]', '[7/20]'], jawabanBenar: 0,
      penjelasan: 'Kasus 1 (Hitam A & Putih B): [2/5] x [1/4] = [2/20]. Kasus 2 (Putih A & Hitam B): [3/5] x [3/4] = [9/20]. Total P = [2/20] + [9/20] = [11/20].'
    },
    {
      kategori: 'Peluang Gabungan Kejadian', tingkat: 'sedang',
      pertanyaan: 'Sebuah dadu dilempar sekali. Berapa peluang muncul mata dadu ganjil ATAU mata dadu prima?',
      opsi: ['[5/6]', '[1/2]', '[1/3]', '[2/3]'], jawabanBenar: 3,
      penjelasan: 'Ganjil A = {1, 3, 5} (n=3). Prima B = {2, 3, 5} (n=3). Irisan A ∩ B = {3, 5} (n=2). P(A ∪ B) = P(A) + P(B) - P(A ∩ B) = [3/6] + [3/6] - [2/6] = [4/6] = [2/3].'
    },
    {
      kategori: 'Peluang Gabungan Kejadian', tingkat: 'sedang',
      pertanyaan: 'Dari 20 kartu bertuliskan nomor 1 sampai 20, diambil 1 kartu acak. Berapa peluang terambil kartu bernomor kelipatan 3 ATAU kelipatan 5?',
      opsi: ['[1/2]', '[9/20]', '[2/5]', '[3/10]'], jawabanBenar: 1,
      penjelasan: 'Kelipatan 3: {3,6,9,12,15,18} (6 buah). Kelipatan 5: {5,10,15,20} (4 buah). Kelipatan 15: {15} (1 buah). P = [6/20] + [4/20] - [1/20] = [9/20].'
    },
    {
      kategori: 'Peluang Gabungan Kejadian', tingkat: 'sulit',
      pertanyaan: 'Dari 52 kartu bridge, diambil 1 kartu acak. Berapa peluang terambil kartu bernomor Genap (2, 4, 6, 8, 10) ATAU kartu bergambar Hati (Heart)?',
      opsi: ['[28/52]', '[8/13]', '[7/13]', '[1/2]'], jawabanBenar: 2,
      penjelasan: 'Kartu genap: 5 nomor x 4 jenis = 20 kartu. Kartu hati: 13 kartu. Irisan (genap & hati): 5 kartu. P = [20/52] + [13/52] - [5/52] = [28/52] = [7/13].'
    },
    {
      kategori: 'Peluang Gabungan Kejadian', tingkat: 'sedang',
      pertanyaan: 'Sebuah dadu dilempar sekali. Berapa peluang muncul mata dadu genap (kelipatan 2) ATAU kelipatan 3?',
      opsi: ['[2/3]', '[5/6]', '[1/2]', '[1/3]'], jawabanBenar: 0,
      penjelasan: 'Genap A = {2, 4, 6} (n=3). Kelipatan 3 B = {3, 6} (n=2). Irisan A ∩ B = {6} (n=1). P(A ∪ B) = [3/6] + [2/6] - [1/6] = [4/6] = [2/3].'
    },
    {
      kategori: 'Peluang Gabungan Kejadian', tingkat: 'sedang',
      pertanyaan: 'Dari 52 kartu bridge, diambil 1 kartu acak. Berapa peluang terambil kartu As ATAU kartu berwarna Merah (Hati / Wajik)?',
      opsi: ['[7/13]', '[15/26]', '[1/2]', '[8/13]'], jawabanBenar: 0,
      penjelasan: 'As: 4 kartu. Merah: 26 kartu. Irisan (As Merah): 2 kartu. P = [4/52] + [26/52] - [2/52] = [28/52] = [7/13].'
    },
    {
      kategori: 'Peluang Gabungan Kejadian', tingkat: 'sedang',
      pertanyaan: 'Sebuah dadu bersisi 6 dilempar sekali. Berapa peluang muncul mata dadu prima ATAU mata dadu genap?',
      opsi: ['[2/3]', '[5/6]', '[1/2]', '1'], jawabanBenar: 1,
      penjelasan: 'Prima: {2, 3, 5} (3). Genap: {2, 4, 6} (3). Irisan: {2} (1). P = [3/6] + [3/6] - [1/6] = [5/6].'
    },
    {
      kategori: 'Peluang Gabungan Kejadian', tingkat: 'mudah',
      pertanyaan: 'Rumus penjumlahan umum untuk peluang gabungan dua kejadian sembarang A atau B (tidak saling lepas) adalah...',
      opsi: ['P(A ∪ B) = P(A) + P(B) - P(A ∩ B)', 'P(A ∪ B) = P(A) + P(B)', 'P(A ∪ B) = P(A) x P(B)', 'P(A ∪ B) = P(A) - P(B)'], jawabanBenar: 0,
      penjelasan: 'Rumus umum penjumlahan peluang adalah P(A ∪ B) = P(A) + P(B) - P(A ∩ B), di mana irisan dikurangkan agar tidak dihitung ganda.'
    },
    {
      kategori: 'Peluang Gabungan Kejadian', tingkat: 'sedang',
      pertanyaan: 'Dalam kelas beranggotakan 30 petualang, 18 mahir pedang, 12 mahir sihir, dan 6 mahir keduanya. Dipilih 1 orang acak. Berapa peluang terpilih petualang yang mahir pedang ATAU sihir?',
      opsi: ['[4/5]', '[3/5]', '[2/3]', '[5/6]'], jawabanBenar: 0,
      penjelasan: 'P(Pedang ∪ Sihir) = [18/30] + [12/30] - [6/30] = [24/30] = [4/5].'
    },
    {
      kategori: 'Peluang Gabungan Kejadian', tingkat: 'sedang',
      pertanyaan: 'Sebuah kartu diambil dari 30 kartu bernomor 1 sampai 30. Berapa peluang terambil kartu kelipatan 4 ATAU kelipatan 6?',
      opsi: ['[1/3]', '[3/10]', '[2/5]', '[7/30]'], jawabanBenar: 0,
      penjelasan: 'Kelipatan 4: {4,8,12,16,20,24,28} (7). Kelipatan 6: {6,12,18,24,30} (5). Kelipatan 12: {12,24} (2). P = [7/30] + [5/30] - [2/30] = [10/30] = [1/3].'
    },
    {
      kategori: 'Peluang Gabungan Kejadian', tingkat: 'sulit',
      pertanyaan: 'Dari 52 kartu bridge, diambil 1 kartu acak. Berapa peluang terambil kartu bergambar orang (J, Q, K) ATAU kartu Sekop (Spade)?',
      opsi: ['[11/26]', '[25/52]', '[1/2]', '[6/13]'], jawabanBenar: 0,
      penjelasan: 'Bergambar (J,Q,K): 12 kartu. Sekop: 13 kartu. Irisan (gambar sekop): 3 kartu. P = [12/52] + [13/52] - [3/52] = [22/52] = [11/26].'
    }
  ];

  function validateBankSoal() {
    bankSoal.forEach((s, i) => {
      if (!s.kategori || !s.tingkat || !s.pertanyaan || !s.penjelasan) console.warn('[bankSoal] soal #' + (i + 1) + ' ada field kosong.');
      if (!Array.isArray(s.opsi) || s.opsi.length !== 4) console.warn('[bankSoal] soal #' + (i + 1) + ' opsi harus berjumlah 4.');
      if (!(s.jawabanBenar >= 0 && s.jawabanBenar <= 3)) console.warn('[bankSoal] soal #' + (i + 1) + ' jawabanBenar di luar range 0-3.');
    });
  }

  // ====== SPRITE PEMAIN 16x16 (matriks berpalet) ======
  const SPRITE_PEMAIN = [
    '......oo........', '.....ohhoo......', '....ohhhhhho....', '...ohhhhhhhho...',
    '...ohhsssshho...', '...osesssseso...', '....osssssso....', '..w.ottttto.bb..',
    '.ww.oatttaobbo..', 'ww..otttttobbo..', '.w..oatttaobb...', '....ottttto.....',
    '....okko.okko...', '....oooo.oooo...', '................', '................'
  ];
  const PALET_SPRITE = { o: '#2b1b17', h: '#f4d36b', s: '#f6d9b0', e: '#2b1b17', t: '#8a5a2b', a: '#d9a441', w: '#cfd8e3', b: '#7b4a2a', k: '#5a3222' };

  // ====== SPRITE MONSTER 16x16 ======
  const SPRITE_SLIME_1 = [
    '................', '......oooo......', '....oovvvvoo....', '...ovvvvvvvvo...',
    '..ovvvvvvvvvvo..', '.ovvvvvvvvvvvvo.', '.ovvvvvvvvvvvvo.', '.ovvroovvroovvo.',
    '.ovvroovvroovvo.', '.ovvvvvvvvvvvvo.', '.ovvvvvyyvvvvvo.', '..ovvvvvvvvvvo..',
    '...ovvvvvvvvo...', '....oooooooo....', '................', '................'
  ];
  const SPRITE_SLIME_2 = [
    '................', '................', '................', '....oooooooo....',
    '..oovvvvvvvvoo..', '.ovvvvvvvvvvvvo.', 'ovvvvvvvvvvvvvvo', 'ovvroovvroovvvvo',
    'ovvroovvroovvvvo', 'ovvvvvvvvvvvvvvo', 'ovvvvvvyyvvvvvvo', '.ovvvvvvvvvvvvo.',
    '..ovvvvvvvvvvo..', '....oooooooo....', '................', '................'
  ];
  const PALET_SLIME = { o: '#1e1030', v: '#8b5cf6', y: '#c4b5fd', r: '#f43f5e' };

  const SPRITE_IMP_1 = [
    '....oo....oo....', '....oro..oro....', '.....orrror.....', '....orrrrrro....',
    '...orwrrorwro...', '...orwrrorwro...', '....orrrrrro....', '.....orrrro.....',
    '....okkkkkko....', '...okkkkkkkko...', '..okkorrrroko...', '..ok.orrrro.ko..',
    '.....okkkko.....', '....ook..koo....', '....oo....oo....', '................'
  ];
  const SPRITE_IMP_2 = [
    '....oo....oo....', '....oro..oro....', '.....orrror.....', '....orrrrrro....',
    '...orwrrorwro...', '...orwrrorwro...', '....orrrrrro....', '.....orrrro.....',
    '....okkkkkko....', '...okkorrrokko..', '..ok.orrrro.ko..', '.....orrrro.....',
    '....okkkkkko....', '.....oo..oo.....', '................', '................'
  ];
  const PALET_IMP = { o: '#180e29', r: '#e11d48', w: '#fef08a', k: '#312e81' };
  const sprSlimes = [], sprImps = [];

  // ====== UTILITAS ======
  const T = CONFIG.TILE_SIZE, V = CONFIG.VISUAL;
  const REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Hash deterministik kolom+baris (bukan Math.random) agar dekorasi tidak berubah tiap frame
  function hash(c, r, s) {
    let h = Math.imul(c + 1, 374761393) ^ Math.imul(r + 1, 668265263) ^ Math.imul((s || 0) + 7, 1103515245);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return (h ^ (h >>> 16)) >>> 0;
  }
  function R(g, x, y, w, h, col) { g.fillStyle = col; g.fillRect(x, y, w, h); }
  // Fisher-Yates Shuffle (in-place)
  function acak(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }
  function svgMatriks(mat, pal, px, kelas) {
    let r = '';
    mat.forEach((baris, y) => baris.split('').forEach((ch, x) => {
      if (pal[ch]) r += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + pal[ch] + '"/>';
    }));
    return '<svg class="' + (kelas || '') + '" viewBox="0 0 ' + mat[0].length + ' ' + mat.length + '" width="' + mat[0].length * px +
      '" height="' + mat.length * px + '" shape-rendering="crispEdges" aria-hidden="true">' + r + '</svg>';
  }
  const IKON_HATI = ['.oo.oo.', 'orwrrro', 'orrrrro', '.orrro.', '..oro..', '...o...'];
  const IKON_KUNCI = ['.oooo.', 'oyyyyo', 'oy..yo', 'oyyyyo', '.oyyo.', '..oyo.', '..oyo.', '..oyyo', '..oyo.', '..oyyo', '..oooo'];

  // Notasi aman: [a/b] pecahan, ^{x} pangkat, _{x} subskrip. Semua teks lewat textContent.
  function notasi(el, teks) {
    el.textContent = '';
    const re = /\[([^\]\/]+)\/([^\]]+)\]|\^\{([^}]+)\}|_\{([^}]+)\}/g;
    let last = 0, m;
    while ((m = re.exec(teks)) !== null) {
      if (m.index > last) el.appendChild(document.createTextNode(teks.slice(last, m.index)));
      let n;
      if (m[1] !== undefined) {
        n = document.createElement('span'); n.className = 'pecahan';
        const a = document.createElement('span'), b = document.createElement('span');
        a.textContent = m[1]; b.textContent = m[2]; n.appendChild(a); n.appendChild(b);
      } else if (m[3] !== undefined) { n = document.createElement('sup'); n.textContent = m[3]; }
      else { n = document.createElement('sub'); n.textContent = m[4]; }
      el.appendChild(n);
      last = re.lastIndex;
    }
    if (last < teks.length) el.appendChild(document.createTextNode(teks.slice(last)));
  }
  function teksPolos(teks) { return teks.replace(/\[([^\]\/]+)\/([^\]]+)\]/g, '$1/$2').replace(/\^\{([^}]+)\}/g, '^$1').replace(/_\{([^}]+)\}/g, '_$1'); }

  // ====== VALIDASI PETA (BFS) ======
  function validasiPeta() {
    let ok = true;
    const err = m => { console.error('[validasiPeta] ' + m); ok = false; };
    let start = [], finish = [], bar = [];
    MAP.forEach((row, r) => row.forEach((v, c) => {
      if (v === TILE.START) start.push([c, r]);
      if (v === TILE.FINISH) finish.push([c, r]);
      if (v === TILE.BARIKADE) bar.push([c, r]);
    }));
    if (start.length !== 1 || finish.length !== 1) { err('Harus ada tepat 1 start (5) dan 1 finish (4).'); return false; }
    // capai(): apakah finish terjangkau; blok = barikade yang dianggap dinding; bolehApi = boleh menginjak api
    function capai(blok, bolehApi) {
      const seen = new Set([start[0].join()]), q = [start[0]];
      while (q.length) {
        const [c, r] = q.shift();
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nc = c + dx, nr = r + dy, v = (MAP[nr] || [])[nc];
          if (v === undefined || v === TILE.DINDING || seen.has(nc + ',' + nr)) continue;
          if (v === TILE.API && !bolehApi) continue;
          if (blok && blok[0] === nc && blok[1] === nr) continue;
          seen.add(nc + ',' + nr); q.push([nc, nr]);
        }
      }
      return seen.has(finish[0].join());
    }
    if (!capai(null, true)) err('Finish tidak bisa dicapai.');
    bar.forEach(b => { if (capai(b, true)) err('Barikade (' + b + ') bisa dilewati lewat jalan memutar.'); });
    // Jebakan api aktif-padam di jalur, bisa dilewati saat padam
    if (bar.length > bankSoal.length) console.warn('[validasiPeta] Jumlah barikade (' + bar.length + ') > jumlah soal (' + bankSoal.length + '). Soal akan berulang.');
    DEKORASI.forEach(d => { if (MAP[d.baris][d.kolom] !== TILE.LANTAI) console.warn('[validasiPeta] Dekorasi di (' + d.kolom + ',' + d.baris + ') tidak berada di tile lantai.'); });
    return ok;
  }

  // ====== STATE ======
  const S = {
    gameState: 'menu', babak: 1, boss: null, kesempatanBoss: 3, maxKesempatanBoss: 3, kol: 0, bar: 0, prevKol: 0, prevBar: 0, arahHadap: 'kanan',
    lives: 0, timeLeft: 0, score: 0, timerInterval: null, petaAktif: null,
    soalAktif: null, barikadeAktif: null, sudahMenjawab: false,
    barikadeHancur: 0, jawabanBenar: 0, jawabanSalah: 0, sedangBergerak: false, waktuKebalApi: 0,
    totalBarikade: 0, anim: null, raf: 0, dpadInterval: null, tahan: [], benarPos: 0, benarTerakhir: false,
    monsters: [], monsterKalah: 0, waktuBisaAksi: 0, sedangDodge: 0, efekSerang: null, partikel: [], arahTerakhir: [1, 0],
    cache: null, obor: [], api: [], barikade: [], finish: null
  };

  const $ = id => document.getElementById(id);
  let canvas, ctx, cache, cctx, luz, lctx, sprPemain, imgPemain = null, imgPemainReady = false;
  let sprFront = null, sprBack = null;
  const sprFrames = [];

  // ====== PENGGAMBARAN STATIS (di-cache) ======
  const dinding = (p, c, r) => { const v = (p[r] || [])[c]; return v === undefined || v === TILE.DINDING; };
  const esVoid = (p, c, r) => {
    if (!dinding(p, c, r)) return false;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (!dinding(p, c + dx, r + dy)) return false;
    return true;
  };

  function gambarLantai(g, c, r) {
    const x = c * T, y = r * T, h = hash(c, r, 1);
    R(g, x, y, T, T, [WARNA.lantaiT, WARNA.lantaiS, WARNA.lantaiT, WARNA.lantaiG][h % 4]);
    R(g, x, y, T, 2, WARNA.nat); R(g, x, y, 2, T, WARNA.nat);
    if (hash(c, r, 2) % 100 < V.PERSEN_RETAK) { R(g, x + 10, y + 8, 8, 2, WARNA.nat); R(g, x + 16, y + 10, 2, 8, WARNA.nat); R(g, x + 18, y + 18, 8, 2, WARNA.nat); }
    if (hash(c, r, 3) % 100 < V.PERSEN_LUMUT) { R(g, x + 3, y + T - 8, 6, 4, WARNA.lumut); R(g, x + 5, y + T - 11, 3, 3, WARNA.lumutG); R(g, x + 10, y + T - 5, 4, 3, WARNA.lumut); }
  }

  function gambarDinding(g, p, c, r) {
    const x = c * T, y = r * T;
    if (!dinding(p, c, r + 1)) { // (a) muka bata + tutup batu tipis
      R(g, x, y, T, T, WARNA.mortar);
      R(g, x, y, T, 10, WARNA.capT); R(g, x, y + 8, T, 2, WARNA.capG);
      for (let i = 0; i < 2; i++) {
        const yy = y + 12 + i * 14, off = (i % 2) * 10;
        for (let bx = -20 + off; bx < T; bx += 20) {
          const x0 = Math.max(bx, 0) + 1, x1 = Math.min(bx + 20, T) - 1;
          if (x1 > x0) R(g, x + x0, yy, x1 - x0, 12, hash(c * 3 + i, r + bx, 4) % 3 === 0 ? WARNA.bataG : WARNA.bata);
        }
      }
      if (hash(c, r, 6) % 100 < 28) { R(g, x + 4, y + 12, 8, 3, WARNA.lumut); R(g, x + 6, y + 15, 3, 4, WARNA.lumutG); }
      if (hash(c, r, 5) % V.JARAK_OBOR_DINDING === 0) { // dudukan obor (nyala digambar dinamis)
        R(g, x + 18, y + 24, 4, 9, WARNA.obor); R(g, x + 15, y + 31, 10, 3, WARNA.obor);
        S.obor.push({ c: c, r: r, fase: (hash(c, r, 7) % 628) / 100 });
      }
    } else if (esVoid(p, c, r)) { // (c) void
      R(g, x, y, T, T, WARNA.void);
    } else { // (b) tutup batu membulat
      R(g, x, y, T, T, WARNA.capT);
      R(g, x, y + 19, T, 2, WARNA.capG); R(g, x + 10 + hash(c, r, 8) % 18, y, 2, 19, WARNA.capG);
      R(g, x + 3 + hash(c, r, 9) % 20, y + 21, 2, 19, WARNA.capG);
      if (esVoid(p, c, r - 1)) R(g, x, y, T, 4, WARNA.capG);
      if (esVoid(p, c, r + 1)) R(g, x, y + T - 4, T, 4, WARNA.capG);
      if (esVoid(p, c - 1, r)) R(g, x, y, 4, T, WARNA.capG);
      if (esVoid(p, c + 1, r)) R(g, x + T - 4, y, 4, T, WARNA.capG);
    }
  }

  function gambarPeti(g, c, r) {
    const x = c * T, y = r * T;
    R(g, x + 9, y + 15, 22, 17, WARNA.outline); R(g, x + 10, y + 16, 20, 15, WARNA.kayu);
    R(g, x + 10, y + 16, 20, 6, '#8a5a3a'); R(g, x + 10, y + 22, 20, 2, WARNA.kayuG);
    R(g, x + 18, y + 21, 4, 6, WARNA.emas); R(g, x + 19, y + 23, 2, 2, WARNA.outline);
    [[5, 35], [33, 34], [35, 29]].forEach(k => { R(g, x + k[0], y + k[1], 4, 3, WARNA.emas); R(g, x + k[0], y + k[1] + 3, 4, 1, WARNA.outline); });
  }

  function bangunCache() {
    if (!cctx || !cache) return;
    const p = S.petaAktif;
    S.obor = []; S.api = []; S.barikade = []; S.finish = null;
    cctx.clearRect(0, 0, cache.width, cache.height);
    for (let r = 0; r < BARIS; r++) for (let c = 0; c < KOLOM; c++) {
      if (p[r][c] === TILE.DINDING) gambarDinding(cctx, p, c, r);
      else {
        gambarLantai(cctx, c, r);
        if (p[r][c] === TILE.API) S.api.push({ c: c, r: r });
        if (p[r][c] === TILE.BARIKADE) S.barikade.push({ c: c, r: r });
        if (p[r][c] === TILE.FINISH) S.finish = { c: c, r: r };
      }
    }
    DEKORASI.forEach(d => { if (d.jenis === 'peti') gambarPeti(cctx, d.kolom, d.baris); });
  }

  // ====== PENGGAMBARAN DINAMIS ======
  function nyalaApi(g, cx, by, w, h, t, ph, merah) {
    const sp = V.KECEPATAN_NYALA_API, s = Math.sin(t * sp + ph), s2 = Math.sin(t * sp * 1.7 + ph * 2);
    const sway = REDUCE ? 0 : Math.round(s * 2);
    [[merah ? WARNA.apiMerah : WARNA.api1, w, h * (1 + 0.1 * s2), sway], [WARNA.api1, w * 0.7, h * 0.75, sway * 0.7],
    [WARNA.api2, w * 0.5, h * 0.55, sway * 0.5], [WARNA.api3, w * 0.25, h * 0.3, 0]].forEach(l => {
      g.fillStyle = l[0]; g.beginPath();
      g.moveTo(cx - l[1] / 2, by); g.lineTo(cx - l[1] * 0.3 + l[3], by - l[2] * 0.6); g.lineTo(cx + l[3], by - l[2]);
      g.lineTo(cx + l[1] * 0.3 + l[3], by - l[2] * 0.6); g.lineTo(cx + l[1] / 2, by); g.closePath(); g.fill();
    });
  }
  function getGrupApi(c, r) {
    return (c + r) % 2;
  }
  function statusApi(nowMs, c, r) {
    const dAktif = CONFIG.DURASI_API_AKTIF_MS || 1600;
    const dPadam = CONFIG.DURASI_API_PADAM_MS || 1600;
    const dPeringatan = CONFIG.DURASI_API_PERINGATAN_MS || 800;
    const siklus = dAktif + dPadam + dPeringatan;
    const offset = getGrupApi(c, r) === 0 ? 0 : Math.floor(siklus / 2);
    const s = (nowMs + offset) % siklus;
    if (s < dAktif) return 'aktif';
    if (s < dAktif + dPadam) return 'padam';
    return 'peringatan';
  }
  function isApiAktif(nowMs, c, r) {
    return statusApi(nowMs, c, r) === 'aktif';
  }
  function gambarApi(g, c, r, nowMs) {
    const x = c * T, y = r * T;
    const st = statusApi(nowMs, c, r);

    // 1. Bingkai Batu Tungku Tanam (Stone Pit Border)
    R(g, x + 6, y + 6, 28, 28, '#261b18');
    R(g, x + 7, y + 7, 26, 26, '#56443c');
    R(g, x + 8, y + 8, 24, 24, '#382b26');
    R(g, x + 9, y + 9, 22, 22, '#150d18');

    // Baut pengait di sudut bingkai batu
    R(g, x + 7, y + 7, 2, 2, '#8a7d76');
    R(g, x + 31, y + 7, 2, 2, '#8a7d76');
    R(g, x + 7, y + 31, 2, 2, '#8a7d76');
    R(g, x + 31, y + 31, 2, 2, '#8a7d76');

    // 2. Ruang Dalam Tungku Berdasarkan Status
    if (st === 'padam') {
      // Arang redup di dalam rongga
      R(g, x + 12, y + 13, 5, 4, '#3d1612');
      R(g, x + 23, y + 21, 5, 4, '#38130f');
      R(g, x + 17, y + 17, 6, 5, '#521e16');
      R(g, x + 19, y + 18, 2, 2, '#7a2818');
    } else if (st === 'peringatan') {
      // Pemanasan membara: kisi-kisi memerah & berdenyut panas
      R(g, x + 10, y + 10, 20, 20, '#5a1910');
      R(g, x + 12, y + 12, 16, 16, '#8f2914');
      R(g, x + 14, y + 14, 12, 12, '#cf4318');
      R(g, x + 17, y + 17, 6, 6, '#f97316');
      const sparkY = Math.round(Math.abs(Math.sin(nowMs * 0.025 + c * 2)) * 8);
      R(g, x + 18, y + 12 - sparkY, 4, 6, '#ffa328');
      R(g, x + 19, y + 13 - sparkY, 2, 3, '#fff385');
    } else {
      // Aktif: Rongga sangat panas di dasar
      R(g, x + 10, y + 10, 20, 20, '#a32b14');
      R(g, x + 13, y + 13, 14, 14, '#e65c19');
      R(g, x + 16, y + 16, 8, 8, '#ffcc40');
    }

    // 3. Kisi-kisi Besi Pemanggang (Grate Bars)
    const warnaBesi = st === 'peringatan' ? '#8a3828' : (st === 'aktif' ? '#5a2218' : '#352c2a');
    const highlightBesi = st === 'peringatan' ? '#d95a32' : (st === 'aktif' ? '#bf4e26' : '#6b5c57');

    // Jeruji horizontal
    R(g, x + 9, y + 15, 22, 2, warnaBesi);
    R(g, x + 9, y + 15, 22, 1, highlightBesi);
    R(g, x + 9, y + 23, 22, 2, warnaBesi);
    R(g, x + 9, y + 23, 22, 1, highlightBesi);

    // Jeruji vertikal
    R(g, x + 15, y + 9, 2, 22, warnaBesi);
    R(g, x + 15, y + 9, 1, 22, highlightBesi);
    R(g, x + 23, y + 9, 2, 22, warnaBesi);
    R(g, x + 23, y + 9, 1, 22, highlightBesi);

    // 4. Kobaran Api Berkobar saat Aktif
    if (st === 'aktif') {
      nyalaApi(g, x + 20, y + 26, 24, 30, nowMs, c * 1.7 + r, true);
    }
  }
  function gambarBarikade(g, c, r, t) {
    const x = c * T, y = r * T, s = 1 + 0.12 * Math.sin(t * 0.004);
    R(g, x, y, T, T, WARNA.outline); R(g, x + 1, y + 1, T - 2, T - 2, WARNA.bingkaiBatu);
    R(g, x + 4, y + 4, T - 8, T - 4, WARNA.outline);
    R(g, x + 5, y + 5, 14, T - 6, WARNA.kayu); R(g, x + 21, y + 5, 14, T - 6, WARNA.kayu);
    R(g, x + 11, y + 5, 2, T - 6, WARNA.kayuG); R(g, x + 27, y + 5, 2, T - 6, WARNA.kayuG);
    R(g, x + 5, y + 10, 30, 2, WARNA.kayuG); R(g, x + 5, y + 30, 30, 2, WARNA.kayuG);
    R(g, x + 14, y + 24, 4, 4, WARNA.besi); R(g, x + 22, y + 24, 4, 4, WARNA.besi);
    const w = 16 * s, h = 14 * s;
    R(g, x + 20 - w / 2 - 1, y + 20 - h / 2 - 1, w + 2, h + 2, WARNA.outline); R(g, x + 20 - w / 2, y + 20 - h / 2, w, h, WARNA.emas);
    g.fillStyle = WARNA.kayuG; g.font = 'bold 12px "Fira Code",monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('?', x + 20, y + 21);
  }
  function gambarFinish(g, c, r, t) {
    const x = c * T, y = r * T, a = 0.65 + 0.35 * Math.sin(t * V.KECEPATAN_DENYUT_FINISH);
    R(g, x, y, T, T, WARNA.bingkaiBatu); R(g, x + 3, y + 3, T - 6, T - 3, WARNA.capG);
    g.fillStyle = WARNA.mortar; g.fillRect(x + 6, y + 16, 28, T - 16); g.beginPath(); g.arc(x + 20, y + 16, 14, Math.PI, 0); g.fill();
    g.globalAlpha = a; g.fillStyle = WARNA.keluar; g.fillRect(x + 11, y + 16, 18, T - 16);
    g.beginPath(); g.arc(x + 20, y + 16, 9, Math.PI, 0); g.fill();
    g.fillStyle = '#eafff2'; g.fillRect(x + 17, y + 12, 6, T - 12); g.globalAlpha = 1;
  }
  function gambarPemain(g, px, py, prog) {
    g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.ellipse(px + 20, py + 36, 11, 4, 0, 0, Math.PI * 2); g.fill();
    const now = performance.now();
    // Indikator visual perlindungan di balik tembok pada Babak 2 (Cover Aura)
    if (S.babak === 2 && isPetakTerlindungi(S.kol, S.bar)) {
      g.save();
      g.strokeStyle = 'rgba(56, 189, 248, ' + (0.5 + 0.3 * Math.sin(now * 0.006)) + ')';
      g.lineWidth = 2.5;
      g.beginPath();
      g.ellipse(px + 20, py + 36, 15, 6, 0, 0, Math.PI * 2);
      g.stroke();
      g.restore();
    }
    const dw = 24, dh = 36;
    const bob = S.sedangBergerak ? -Math.abs(Math.sin((now / 115) * Math.PI)) * 2 : 0;
    const drawX = px + (T - dw) / 2;
    const drawY = py + 2 + bob;

    if (S.arahHadap === 'depan' && sprFront) {
      g.drawImage(sprFront, drawX, drawY);
    } else if (S.arahHadap === 'belakang' && sprBack) {
      g.drawImage(sprBack, drawX, drawY);
    } else if (imgPemainReady && sprFrames.length > 0) {
      const frameIdx = S.sedangBergerak ? Math.floor((now / 115) % 5) : 1;
      const frame = sprFrames[frameIdx];
      if (S.arahHadap === 'kiri') {
        g.save();
        g.translate(px + T / 2, 0);
        g.scale(-1, 1);
        g.drawImage(frame, -dw / 2, drawY);
        g.restore();
      } else {
        g.drawImage(frame, drawX, drawY);
      }
    } else {
      const sz = 16 * V.SKALA_SPRITE;
      if (S.arahHadap === 'kiri') { g.save(); g.translate(px + T / 2, 0); g.scale(-1, 1); g.drawImage(sprPemain, -sz / 2, py + 4 + bob, sz, sz); g.restore(); }
      else g.drawImage(sprPemain, px + (T - sz) / 2, py + 4 + bob, sz, sz);
    }

    // Mini Floating Health Bar di atas Karakter (Liquid Glass & 5 Segmen Darah)
    const barW = 26, barH = 4;
    const barX = px + (T - barW) / 2;
    const barY = py - 4 + bob;
    g.fillStyle = 'rgba(15, 10, 24, 0.78)';
    g.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);
    g.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    g.lineWidth = 1;
    g.strokeRect(barX - 0.5, barY - 0.5, barW + 1, barH + 1);

    const totalHP = CONFIG.NYAWA_AWAL || 5;
    const segGap = 1;
    const segW = (barW - (totalHP - 1) * segGap) / totalHP;
    for (let s = 0; s < totalHP; s++) {
      const sx = barX + s * (segW + segGap);
      if (s < S.lives) {
        g.fillStyle = S.lives <= 1 ? '#ff1e4b' : (s < 2 ? '#f43f5e' : '#ef4444');
        g.fillRect(sx, barY, segW, barH);
        g.fillStyle = 'rgba(255, 255, 255, 0.55)';
        g.fillRect(sx, barY, segW, 1.2);
      } else {
        g.fillStyle = 'rgba(50, 20, 30, 0.65)';
        g.fillRect(sx, barY, segW, barH);
      }
    }
  }

  // Pencahayaan Lentera & Kegelapan Dungeon (Fog of War)
  function lubangCahaya(g, x, y, radius, intensitas) {
    const rPx = radius * T;
    const grad = g.createRadialGradient(x, y, rPx * 0.15, x, y, rPx);
    const alpha = intensitas !== undefined ? intensitas : 1.0;
    grad.addColorStop(0, 'rgba(0,0,0,' + alpha + ')');
    grad.addColorStop(0.55, 'rgba(0,0,0,' + (alpha * 0.9) + ')');
    grad.addColorStop(0.82, 'rgba(0,0,0,' + (alpha * 0.35) + ')');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad;
    g.beginPath();
    g.arc(x, y, rPx, 0, Math.PI * 2);
    g.fill();
  }

  function pendarLantai(g, x, y, radius, warna) {
    const rPx = radius * T;
    const grad = g.createRadialGradient(x, y, 4, x, y, rPx);
    grad.addColorStop(0, warna);
    grad.addColorStop(0.65, warna.replace(/[\d\.]+\)$/, '0.03)'));
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad;
    g.beginPath();
    g.arc(x, y, rPx, 0, Math.PI * 2);
    g.fill();
  }

  function gambarCahaya(t, sumber) {
    const W = cache.width, H = cache.height;
    // 1. Pendaran hangat di lantai bawah
    sumber.forEach(s => pendarLantai(ctx, s.x, s.y, s.r, s.warm));

    // 2. Lapisan Kegelapan Dungeon (Pekat di luar jangkauan cahaya karakter)
    lctx.globalCompositeOperation = 'source-over';
    lctx.clearRect(0, 0, W, H);
    lctx.fillStyle = 'rgba(20, 14, 25, ' + V.OPASITAS_VIGNETTE + ')';
    lctx.fillRect(0, 0, W, H);

    // 3. Potong lubang lentera karakter & sumber cahaya di dungeon
    lctx.globalCompositeOperation = 'destination-out';
    sumber.forEach(s => lubangCahaya(lctx, s.x, s.y, s.r, s.intensitas));

    // 4. Salin lapisan kegelapan ke atas kanvas utama
    ctx.drawImage(luz, 0, 0);
  }

  function render(now) {
    const t = REDUCE ? 0 : now, W = cache.width, H = cache.height;
    // posisi gambar pemain (interpolasi)
    let px = S.kol * T, py = S.bar * T, prog = 0;
    if (S.anim) {
      const a = S.anim; prog = Math.min(1, (now - a.t0) / a.dur);
      const f = a.mundur ? (1 - Math.abs(2 * prog - 1)) * 0.6 : prog;
      px = (a.fx + (a.tx - a.fx) * f) * T; py = (a.fy + (a.ty - a.fy) * f) * T;
      if (prog >= 1) { S.anim = null; S.sedangBergerak = false; px = S.kol * T; py = S.bar * T; }
    }
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(cache, 0, 0); // statis: lantai, dinding, dekorasi
    const sumber = [];
    S.obor.forEach(o => { // nyala obor + sumber cahaya redup
      nyalaApi(ctx, o.c * T + 20, o.r * T + 26, 10, 14, t, o.fase, false);
      sumber.push({ x: o.c * T + 20, y: (o.r + 1) * T, r: V.RADIUS_CAHAYA_OBOR, warm: 'rgba(255,140,40,0.12)', intensitas: 0.35 });
    });
    S.api.forEach(a => {
      gambarApi(ctx, a.c, a.r, now);
      const st = statusApi(now, a.c, a.r);
      if (st === 'aktif') {
        sumber.push({ x: a.c * T + 20, y: a.r * T + 20, r: V.RADIUS_CAHAYA_API * (1 + 0.08 * Math.sin(now * 0.01 + a.c)), warm: 'rgba(255,100,20,0.22)', intensitas: 0.55 });
      } else if (st === 'peringatan') {
        sumber.push({ x: a.c * T + 20, y: a.r * T + 20, r: 0.9, warm: 'rgba(255,60,10,0.12)', intensitas: 0.25 });
      }
    });
    S.barikade.forEach(b => gambarBarikade(ctx, b.c, b.r, now));
    if (S.finish) { gambarFinish(ctx, S.finish.c, S.finish.r, t); sumber.push({ x: S.finish.c * T + 20, y: S.finish.r * T + 20, r: 1.8, warm: 'rgba(57,255,136,0.18)', intensitas: 0.6 }); }


    // Gambar Elemen Babak 2 (Boss Battle)
    if (S.babak === 2 && S.boss) {
      S.boss.altars.forEach(alt => {
        gambarAltar(ctx, alt, now);
        if (!alt.hancur) {
          sumber.push({
            x: alt.c * T + 20, y: alt.r * T + 20,
            r: 2.2,
            warm: 'rgba(56, 189, 248, 0.28)',
            intensitas: 0.8
          });
        }
      });
      S.boss.telegraphs.forEach(tel => gambarTelegraph(ctx, tel, now));
      gambarBoss(ctx, S.boss, now);
      if (S.boss.hp > 0) {
        sumber.push({
          x: (S.boss.x + 1) * T, y: (S.boss.y + 1) * T,
          r: 3.4,
          warm: S.boss.status === 'enrage' ? 'rgba(239, 68, 68, 0.45)' : (S.boss.status === 'vulnerable' ? 'rgba(250, 204, 21, 0.4)' : 'rgba(168, 85, 247, 0.35)'),
          intensitas: 0.95
        });
      }
      S.boss.proyektil.forEach(pr => {
        gambarProyektil(ctx, pr, now);
        sumber.push({
          x: pr.x * T + 20, y: pr.y * T + 20,
          r: 1.1,
          warm: 'rgba(236, 72, 153, 0.35)',
          intensitas: 0.6
        });
      });
    }

    // Gambar Monster
    S.monsters.forEach(m => {
      if (!m.hidup) return;
      let mx = m.c, my = m.r;
      if (m.anim) {
        const p = Math.min(1, (now - m.anim.t0) / m.anim.dur);
        mx = m.anim.fx + (m.anim.tx - m.anim.fx) * p;
        my = m.anim.fy + (m.anim.ty - m.anim.fy) * p;
      }
      const mpx = mx * T, mpy = my * T;
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.beginPath();
      ctx.ellipse(mpx + 20, mpy + 34, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      const fIdx = Math.floor((now / 220) % 2);
      const spr = m.tipe === 'imp' ? sprImps[fIdx] : sprSlimes[fIdx];
      const sw = 28, sh = 28;
      const bob = Math.round(Math.sin(now * 0.008 + m.id) * 2);

      if (spr) {
        if (m.dir < 0) {
          ctx.save();
          ctx.translate(mpx + T / 2, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(spr, -sw / 2, mpy + (T - sh) / 2 + bob, sw, sh);
          ctx.restore();
        } else {
          ctx.drawImage(spr, mpx + (T - sw) / 2, mpy + (T - sh) / 2 + bob, sw, sh);
        }
      }
      sumber.push({
        x: mpx + 20, y: mpy + 20, r: 0.85,
        warm: m.tipe === 'imp' ? 'rgba(225,29,72,0.16)' : 'rgba(139,92,246,0.16)',
        intensitas: 0.25
      });
    });

    // Bayangan Ethereal saat Dodge
    if (now < S.sedangDodge) {
      const dw = 24, dh = 36;
      ctx.save();
      ctx.globalAlpha = 0.45;
      const shadowX = S.prevKol * T + (T - dw) / 2;
      const shadowY = S.prevBar * T + 2;
      let shadowSpr = null;
      if (S.arahHadap === 'depan') shadowSpr = sprFront;
      else if (S.arahHadap === 'belakang') shadowSpr = sprBack;
      else if (sprFrames.length > 1) shadowSpr = sprFrames[1];

      if (shadowSpr) {
        if (S.arahHadap === 'kiri') {
          ctx.translate(S.prevKol * T + T / 2, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(shadowSpr, -dw / 2, shadowY);
        } else {
          ctx.drawImage(shadowSpr, shadowX, shadowY, dw, dh);
        }
      }
      ctx.restore();
    }

    if (!(now < S.waktuKebalApi && Math.floor(now / CONFIG.DURASI_KEDIP_MS) % 2 === 0)) gambarPemain(ctx, px, py, prog);
    const flickerLentera = 1 + 0.03 * Math.sin(now * 0.008) + 0.02 * Math.cos(now * 0.015);
    sumber.push({
      x: px + 20, y: py + 20,
      r: V.RADIUS_CAHAYA_PEMAIN * flickerLentera,
      warm: 'rgba(255, 215, 125, 0.28)',
      intensitas: 1.0
    });

    // Efek Tebasan Serangan (Holy Slash Arc)
    if (S.efekSerang) {
      const e = S.efekSerang;
      const aProg = (now - e.t0) / e.dur;
      if (aProg < 1) {
        ctx.save();
        ctx.translate(e.cx, e.cy);
        ctx.rotate(Math.atan2(e.dy, e.dx));
        const aAlpha = 1 - aProg;
        const rad = 16 + aProg * 10;
        ctx.strokeStyle = 'rgba(56, 189, 248, ' + (aAlpha * 0.85) + ')';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(0, 0, rad, -Math.PI * 0.45, Math.PI * 0.45);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255, 255, 255, ' + aAlpha + ')';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, rad, -Math.PI * 0.4, Math.PI * 0.4);
        ctx.stroke();
        ctx.fillStyle = 'rgba(254, 240, 138, ' + aAlpha + ')';
        for (let k = -2; k <= 2; k++) {
          const sang = k * 0.22;
          ctx.fillRect(Math.cos(sang) * (rad + 4) - 1, Math.sin(sang) * (rad + 4) - 1, 3, 3);
        }
        ctx.restore();
        sumber.push({ x: e.cx, y: e.cy, r: 2.2, warm: 'rgba(56,189,248,0.12)' });
      } else {
        S.efekSerang = null;
      }
    }

    // Partikel Kemenangan Kalahkan Monster
    if (S.partikel && S.partikel.length > 0) {
      for (let i = S.partikel.length - 1; i >= 0; i--) {
        const pt = S.partikel[i];
        const pProg = (now - pt.t0) / pt.dur;
        if (pProg >= 1) {
          S.partikel.splice(i, 1);
          continue;
        }
        const pAlpha = 1 - pProg;
        const curX = pt.x + pt.vx * pProg * 14;
        const curY = pt.y + pt.vy * pProg * 14;
        ctx.fillStyle = pt.warna;
        ctx.globalAlpha = pAlpha;
        ctx.fillRect(curX - 1.5, curY - 1.5, 3, 3);
        ctx.globalAlpha = 1;
      }
    }
    gambarCahaya(t, sumber);
    if (S.modeZoom) {
      const normX = Math.max(12, Math.min(88, ((px + 20) / W) * 100));
      const normY = Math.max(12, Math.min(88, ((py + 20) / W) * 100));
      canvas.style.transformOrigin = normX.toFixed(1) + '% ' + normY.toFixed(1) + '%';
    } else {
      canvas.style.transformOrigin = 'center center';
    }
  }

  // ====== HUD ======
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function updateHUD() {
    const hati = $('hud-hati'); let h = '';
    for (let i = 0; i < CONFIG.NYAWA_AWAL; i++) {
      const pal = { o: WARNA.outline, r: i < S.lives ? WARNA.hatiPenuh : WARNA.hatiKosong, w: i < S.lives ? '#ffb3b3' : WARNA.hatiKosong };
      h += svgMatriks(IKON_HATI, pal, 3, S.lives === 1 && i < S.lives ? 'kritis' : '');
    }
    hati.innerHTML = h; hati.setAttribute('aria-label', 'Nyawa ' + S.lives + ' dari ' + CONFIG.NYAWA_AWAL);
    const w = $('hud-waktu');
    w.textContent = pad2(Math.floor(S.timeLeft / 60)) + ':' + pad2(S.timeLeft % 60);
    w.classList.toggle('genting', S.timeLeft <= CONFIG.BATAS_WAKTU_GENTING);
    $('hud-barikade').textContent = S.barikadeHancur + '/' + S.totalBarikade;
    $('hud-skor').textContent = S.score;
  }
  function umumkan(teks) { $('status-sr').textContent = teks; }
  function shake() {
    const w = $('canvas-wrap'); w.classList.remove('shake'); void w.offsetWidth; w.classList.add('shake');
    setTimeout(() => w.classList.remove('shake'), CONFIG.DURASI_SHAKE_MS);
  }
  function tampil(id, ya) { $(id).classList.toggle('hidden', !ya); }

  // ====== PERGERAKAN & AKSI ======
  function coba(dx, dy) {
    if (S.gameState !== 'bermain' || S.sedangBergerak) return; // satu-satunya pintu input gerak
    const now = performance.now();
    if (now < (S.kunciInputSampai || 0)) return;
    if (dx || dy) S.arahTerakhir = [dx, dy];
    if (dx < 0) S.arahHadap = 'kiri';
    else if (dx > 0) S.arahHadap = 'kanan';
    else if (dy < 0) S.arahHadap = 'belakang';
    else if (dy > 0) S.arahHadap = 'depan';
    const nk = S.kol + dx, nb = S.bar + dy, v = (S.petaAktif[nb] || [])[nk];
    if (v === undefined || v === TILE.DINDING) return;
    if (v === TILE.BARIKADE) { S.barikadeAktif = { kolom: nk, baris: nb }; bukaSoal(); return; }

    // Cek apakah ada monster hidup yang menempati tile tujuan (nk, nb) atau sedang melangkah ke sana
    const monsterPenghadang = S.monsters && S.monsters.find(m => m.hidup && ((m.c === nk && m.r === nb) || (m.anim && m.anim.tx === nk && m.anim.ty === nb)));
    if (monsterPenghadang) {
      // Monster menghalangi jalan! Pemain terpental dan wajib menyerang (Spasi / Serang)
      S.anim = { fx: S.kol, fy: S.bar, tx: nk, ty: nb, t0: now, dur: CONFIG.DURASI_LANGKAH_MS * 1.6, mundur: true };
      S.sedangBergerak = true;
      shake();
      if (now >= S.waktuKebalApi) {
        S.waktuKebalApi = now + 800;
        S.lives--;
        updateHUD();
        umumkan('Monster menghadang jalan! Tekan SPASI atau tombol SERANG!');
        if (S.lives <= 0) gameOver(false, 'monster');
      } else {
        umumkan('Monster menghadang jalan! Tekan SPASI atau tombol SERANG!');
      }
      return;
    }

    if (v === TILE.API) {
      if (isApiAktif(now, nk, nb)) {
        // Pemain menabrak semburan api aktif: pantul balik dan kurangi nyawa
        S.anim = { fx: S.kol, fy: S.bar, tx: nk, ty: nb, t0: now, dur: CONFIG.DURASI_LANGKAH_MS * 2, mundur: true };
        S.sedangBergerak = true;
        if (now >= S.waktuKebalApi) {
          S.waktuKebalApi = now + 800; // durasi kebal 800ms
          S.lives--; updateHUD(); shake(); umumkan('Terbakar jebakan api, nyawa berkurang');
          if (S.lives <= 0) gameOver(false, 'nyawa');
        }
        return;
      }
    }
    S.prevKol = S.kol; S.prevBar = S.bar; S.kol = nk; S.bar = nb;
    S.anim = { fx: S.prevKol, fy: S.prevBar, tx: nk, ty: nb, t0: now, dur: CONFIG.DURASI_LANGKAH_MS, mundur: false };
    S.sedangBergerak = true;
    if (v === TILE.FINISH) { if (S.babak === 1) selesaiBabak1(); else gameOver(true, 'selamat'); }
  }

  // Aksi Serang / Menghindar (Spasi / Tombol Aksi)
  function aksiPemain() {
    if (S.gameState !== 'bermain') return;
    const now = performance.now();
    if (now < S.waktuBisaAksi) return;
    S.waktuBisaAksi = now + CONFIG.COOLDOWN_AKSI_MS;

    let dx = 0, dy = 0;
    if (S.arahTerakhir && (S.arahTerakhir[0] !== 0 || S.arahTerakhir[1] !== 0)) {
      dx = S.arahTerakhir[0]; dy = S.arahTerakhir[1];
    } else {
      if (S.arahHadap === 'kiri') dx = -1;
      else if (S.arahHadap === 'kanan') dx = 1;
      else if (S.arahHadap === 'belakang') dy = -1;
      else if (S.arahHadap === 'depan') dy = 1;
    }


    // Logika Serangan Babak 2 (Boss Battle: Altar & Tubuh Boss)
    if (S.babak === 2 && S.boss && S.boss.hp > 0) {
      // 1. Cek serangan ke Altar Kristal
      for (const altar of S.boss.altars) {
        if (altar.hancur) continue;
        const dist = Math.hypot(altar.c - S.kol, altar.r - S.bar);
        if (dist <= 1.45) {
          if (altar.pos === S.boss.jawabanBenarPos) {
            // ALTAAR BENAR -> PERISAI PECAH!
            altar.hancur = true;
            S.boss.status = 'vulnerable';
            S.boss.stunSampai = now + 5000;
            S.score += 250;
            updateHUD();
            updateBossHUD();
            shake();
            for (let i = 0; i < 16; i++) {
              const ang = (i / 16) * Math.PI * 2;
              S.partikel.push({
                x: altar.c * T + 20, y: altar.r * T + 20,
                vx: Math.cos(ang) * (2 + Math.random() * 2),
                vy: Math.sin(ang) * (2 + Math.random() * 2),
                warna: ['#facc15', '#38bdf8', '#ffffff', '#e9d5ff'][i % 4],
                t0: now, dur: 450
              });
            }
            umumkan('Altar Benar! Perisai Malakor HANCUR! SERANG TUBUHNYA SEKARANG!');
            return;
          } else {
            // ALTAAR SALAH
            shake();
            if (now >= S.waktuKebalApi) {
              S.waktuKebalApi = now + 900;
              S.lives--;
              updateHUD();
              umumkan('Jawaban salah! Altar meledak menyengatmu!');
              if (S.lives <= 0) gameOver(false, 'monster');
            } else {
              umumkan('Jawaban salah! Altar memantulkan serangan!');
            }
            return;
          }
        }
      }

      // 2. Cek serangan ke Tubuh Boss Malakor
      const distToBoss = Math.hypot((S.boss.x + 1) - S.kol, (S.boss.y + 1) - S.bar);
      if (distToBoss <= 2.2) {
        if (S.boss.status === 'vulnerable') {
          S.boss.hp--;
          S.score += 350;
          shake();
          updateBossHUD();
          updateHUD();
          for (let i = 0; i < 16; i++) {
            const ang = Math.random() * Math.PI * 2;
            S.partikel.push({
              x: (S.boss.x + 1) * T, y: (S.boss.y + 1) * T,
              vx: Math.cos(ang) * (2.5 + Math.random() * 2),
              vy: Math.sin(ang) * (2.5 + Math.random() * 2),
              warna: ['#ec4899', '#f43f5e', '#a855f7', '#facc15'][i % 4],
              t0: now, dur: 400
            });
          }
          if (S.boss.hp <= 0) {
            bossKalah();
            return;
          }
          S.boss.status = S.boss.hp <= 1 ? 'enrage' : 'shield';
          S.boss.stunSampai = 0;
          if (S.boss.hp === 3 || S.boss.hp === 2) {
            spawnBossMinions();
          }
          bossSiapkanSoal();
          updateBossHUD();
          umumkan('Malakor terluka! Perisai Void diaktifkan kembali!');
          return;
        } else {
          shake();
          umumkan('Perisai Void kebal! Hancurkan Altar yang benar terlebih dahulu!');
          return;
        }
      }
    }

    const targetK = S.kol + dx, targetB = S.bar + dy;
    let monsterKena = null;
    for (const m of S.monsters) {
      if (!m.hidup) continue;
      if ((m.c === targetK && m.r === targetB) || (m.c === S.kol && m.r === S.bar)) {
        monsterKena = m; break;
      }
    }
    if (!monsterKena) {
      for (const m of S.monsters) {
        if (!m.hidup) continue;
        if (Math.hypot(m.c - S.kol, m.r - S.bar) <= 1.25) {
          monsterKena = m; break;
        }
      }
    }

    // Efek Tebasan Cahaya
    S.efekSerang = {
      cx: S.kol * T + 20 + dx * 18,
      cy: S.bar * T + 20 + dy * 18,
      dx: dx, dy: dy, t0: now, dur: 220
    };

    // Kebal invincibility selama menghindar / menyerang
    S.waktuKebalApi = Math.max(S.waktuKebalApi, now + 450);
    S.sedangDodge = now + 350;

    if (monsterKena) {
      // Monster berhasil diserang dan dikalahkan!
      monsterKena.hidup = false;
      S.monsterKalah++;
      S.score += CONFIG.POIN_MONSTER;
      updateHUD();
      shake();
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        S.partikel.push({
          x: monsterKena.c * T + 20, y: monsterKena.r * T + 20,
          vx: Math.cos(ang) * (1.5 + Math.random() * 1.5),
          vy: Math.sin(ang) * (1.5 + Math.random() * 1.5),
          warna: ['#fef08a', '#38bdf8', '#ffedd5', '#ffffff'][i % 4],
          t0: now, dur: 320
        });
      }
      umumkan('Monster dikalahkan! +' + CONFIG.POIN_MONSTER + ' skor');
    } else {
      // Tidak mengenai monster: lakukan gerak menghindar cepat ke depan jika jalur aman
      const nk = S.kol + dx, nb = S.bar + dy;
      const v = (S.petaAktif[nb] || [])[nk];
      if (v === TILE.LANTAI || (v === TILE.API && !isApiAktif(now, nk, nb))) {
        S.prevKol = S.kol; S.prevBar = S.bar; S.kol = nk; S.bar = nb;
        S.anim = { fx: S.prevKol, fy: S.prevBar, tx: nk, ty: nb, t0: now, dur: 95, mundur: false };
        S.sedangBergerak = true;
        if (v === TILE.FINISH) { if (S.babak === 1) selesaiBabak1(); else gameOver(true, 'selamat'); }
        umumkan('Menghindar ke depan');
      } else {
        umumkan('Tebasan sihir suci');
      }
    }
  }

  // Patroli Monster di Tiap Ruangan
  function updateMonster(now) {
    if (S.gameState !== 'bermain') return;
    for (const m of S.monsters) {
      if (!m.hidup) continue;
      if (m.anim && now >= m.anim.t0 + m.anim.dur) m.anim = null;
      if (now - m.lastStepTime >= m.stepInterval) {
        m.lastStepTime = now;
        let nc = m.c, nr = m.r;
        if (m.axis === 'x') {
          if (m.c + m.dir > m.max || m.c + m.dir < m.min) m.dir = -m.dir;
          nc = m.c + m.dir;
        } else {
          if (m.r + m.dir > m.max || m.r + m.dir < m.min) m.dir = -m.dir;
          nr = m.r + m.dir;
        }
        m.anim = { fx: m.c, fy: m.r, tx: nc, ty: nr, t0: now, dur: 200 };
        m.c = nc; m.r = nr;
      }
    }
  }

  // Deteksi Serangan Tabrakan Monster ke Pemain
  function periksaTabrakanMonster(now) {
    if (S.gameState !== 'bermain' || !S.petaAktif) return;
    for (const m of S.monsters) {
      if (!m.hidup) continue;
      let mx = m.c, my = m.r;
      if (m.anim) {
        const p = Math.min(1, (now - m.anim.t0) / m.anim.dur);
        mx = m.anim.fx + (m.anim.tx - m.anim.fx) * p;
        my = m.anim.fy + (m.anim.ty - m.anim.fy) * p;
      }
      let px = S.kol, py = S.bar;
      if (S.anim) {
        const p = Math.min(1, (now - S.anim.t0) / S.anim.dur);
        px = S.anim.fx + (S.anim.tx - S.anim.fx) * p;
        py = S.anim.fy + (S.anim.ty - S.anim.fy) * p;
      }
      if (Math.hypot(mx - px, my - py) < 0.65) {
        if (now < S.waktuKebalApi) continue; // Sedang kebal atau sedang dodge
        S.waktuKebalApi = now + 900;
        S.lives--; updateHUD(); shake();
        umumkan('Diserang monster! Nyawa berkurang');
        if (S.lives <= 0) gameOver(false, 'monster');
        break;
      }
    }
  }

  function hentikanDpad() {
    clearInterval(S.dpadInterval);
    S.dpadInterval = null;
    document.querySelectorAll('.dp.aktif').forEach(b => b.classList.remove('aktif'));
  }
  function periksaJebakanBerdiri(now) {
    if (S.gameState !== 'bermain' || !S.petaAktif || S.sedangBergerak) return;
    const v = (S.petaAktif[S.bar] || [])[S.kol];
    if (v === TILE.API && isApiAktif(now, S.kol, S.bar)) {
      if (now >= S.waktuKebalApi) {
        S.waktuKebalApi = now + 800; // durasi kebal 800ms
        S.lives--; updateHUD(); shake(); umumkan('Terbakar jebakan api, nyawa berkurang');
        if (S.lives <= 0) gameOver(false, 'nyawa');
      }
    }
  }

  // ====== SISTEM BOSS BABAK 2: MALAKOR THE VOID ARBITER ======
  function initBoss() {
    S.boss = {
      x: 13, y: 6.5,
      hp: 5, maxHp: 5,
      status: 'shield', // 'shield' | 'vulnerable' | 'enrage'
      soalAktif: null,
      altars: [
        { id: 'A', c: 5, r: 4, pos: 0, teks: '', hancur: false },
        { id: 'B', c: 22, r: 4, pos: 1, teks: '', hancur: false },
        { id: 'C', c: 5, r: 11, pos: 2, teks: '', hancur: false },
        { id: 'D', c: 22, r: 11, pos: 3, teks: '', hancur: false }
      ],
      jawabanBenarPos: 0,
      stunSampai: 0,
      waktuSerangBerikutnya: performance.now() + 2500,
      waktuProyektilBerikutnya: performance.now() + 3800,
      proyektil: [],
      telegraphs: []
    };
    S.monsters = [];
    bossSiapkanSoal();
    updateBossHUD();
  }

  function bossSiapkanSoal() {
    if (!S.boss) return;
    const s = ambilSoalBerikutnya();
    S.boss.soalAktif = s;
    const urut = acak([0, 1, 2, 3]);
    S.boss.jawabanBenarPos = urut.indexOf(s.jawabanBenar);
    
    S.boss.altars.forEach((altar, i) => {
      const idxOpsi = urut[i];
      altar.pos = i;
      altar.idxOpsi = idxOpsi;
      altar.teks = s.opsi[idxOpsi];
      altar.hancur = false;
    });

    const elTeks = $('boss-teks-soal');
    if (elTeks) notasi(elTeks, s.pertanyaan);
    updateBossHUD();
  }

  function updateBossHUD() {
    if (!S.boss) return;
    const fill = $('boss-hp-fill');
    if (fill) {
      const pct = Math.max(0, Math.min(100, (S.boss.hp / S.boss.maxHp) * 100));
      fill.style.width = pct + '%';
    }
    const badge = $('boss-fase-badge');
    if (badge) {
      if (S.boss.status === 'vulnerable') {
        badge.textContent = 'PERISAI PECAH (SERANG!)';
        badge.className = 'boss-badge vulnerable';
      } else if (S.boss.hp <= 1) {
        badge.textContent = 'OVERDRIVE / MENGAMUK';
        badge.className = 'boss-badge enrage';
      } else {
        badge.textContent = 'PERISAI TAKDIR';
        badge.className = 'boss-badge';
      }
    }
    const badgeKes = $('boss-kesempatan-badge');
    if (badgeKes) {
      badgeKes.textContent = '✨ ' + (S.kesempatanBoss || 0) + '/' + (S.maxKesempatanBoss || 3);
      badgeKes.setAttribute('title', 'Sisa Kesempatan Bertarung: ' + S.kesempatanBoss + ' dari ' + S.maxKesempatanBoss);
    }
  }

  function spawnBossMinions() {
    // Munculkan 2 minion (1 slime, 1 imp) untuk membantu boss
    const minion1 = { id: 101, tipe: 'slime', c: 9, r: 8, c0: 9, r0: 8, axis: 'y', min: 7, max: 10, dir: 1, stepInterval: 1100, hidup: true, lastStepTime: 0, anim: null };
    const minion2 = { id: 102, tipe: 'imp', c: 18, r: 8, c0: 18, r0: 8, axis: 'y', min: 7, max: 10, dir: -1, stepInterval: 1050, hidup: true, lastStepTime: 0, anim: null };
    S.monsters.push(minion1, minion2);
    // Efek partikel pemanggilan
    const now = performance.now();
    [minion1, minion2].forEach(m => {
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        S.partikel.push({
          x: m.c * T + 20, y: m.r * T + 20,
          vx: Math.cos(ang) * 2, vy: Math.sin(ang) * 2,
          warna: '#a855f7', t0: now, dur: 400
        });
      }
    });
    umumkan('Malakor memanggil bala bantuan bayangan!');
  }

  function updateBoss(now) {
    if (S.gameState !== 'bermain' || S.babak !== 2 || !S.boss || S.boss.hp <= 0) return;
    const b = S.boss;

    // 1. Cek masa stun perisai
    if (b.status === 'vulnerable') {
      if (now >= b.stunSampai) {
        // Stun habis, perisai pulih kembali!
        b.status = b.hp <= 1 ? 'enrage' : 'shield';
        bossSiapkanSoal();
        shake();
        umumkan('Perisai Malakor telah pulih kembali!');
      }
    }

    // 2. Serangan Telegraphed Fire Pillars (Area Denial)
    if (now >= b.waktuSerangBerikutnya) {
      const cooldown = b.hp <= 1 ? 2300 : 3500;
      b.waktuSerangBerikutnya = now + cooldown;
      const kandidat = [];
      const pemainDiCover = isPetakTerlindungi(S.kol, S.bar);
      if (pemainDiCover) {
        // Pemain sedang berlindung di balik tembok: letakkan pilar api di arena terbuka di depan cover
        for (let c = 8; c <= 19; c++) {
          for (let r = 3; r <= 9; r++) {
            if (ARENA_BOSS[r] && ARENA_BOSS[r][c] === 0 && !isPetakTerlindungi(c, r)) {
              kandidat.push([c, r]);
            }
          }
        }
      } else {
        // Pemain di medan terbuka: targetkan petak sekitar pemain yang bukan area perlindungan
        for (let dx = -2; dx <= 2; dx++) {
          for (let dy = -2; dy <= 2; dy++) {
            const tc = S.kol + dx, tr = S.bar + dy;
            if (tc >= 1 && tc < KOLOM - 1 && tr >= 1 && tr < BARIS - 1 && ARENA_BOSS[tr][tc] === 0 && !isPetakTerlindungi(tc, tr)) {
              kandidat.push([tc, tr]);
            }
          }
        }
      }
      acak(kandidat);
      const terpilih = kandidat.slice(0, b.hp <= 1 ? 5 : 3);
      terpilih.forEach(pt => {
        b.telegraphs.push({
          c: pt[0], r: pt[1],
          t0: now,
          durPeringatan: 1100,
          durAktif: 900
        });
      });
    }

    // Periksa dampak serangan telegraphed ke pemain
    for (let i = b.telegraphs.length - 1; i >= 0; i--) {
      const tel = b.telegraphs[i];
      const aktif = (now >= tel.t0 + tel.durPeringatan) && (now < tel.t0 + tel.durPeringatan + tel.durAktif);
      if (aktif && S.kol === tel.c && S.bar === tel.r) {
        if (now >= S.waktuKebalApi) {
          S.waktuKebalApi = now + 800;
          S.lives--;
          updateHUD();
          shake();
          umumkan('Terkena pilar api Malakor! Nyawa berkurang');
          if (S.lives <= 0) gameOver(false, 'monster');
        }
      }
      if (now >= tel.t0 + tel.durPeringatan + tel.durAktif) {
        b.telegraphs.splice(i, 1);
      }
    }

    // 3. Proyektil Bola Sihir Kegelapan (Void Orbs)
    if (b.status !== 'vulnerable' && now >= b.waktuProyektilBerikutnya) {
      const cooldownOrb = b.hp <= 1 ? 2400 : 3600;
      b.waktuProyektilBerikutnya = now + cooldownOrb;
      const bx = (b.x + 1) * T, by = (b.y + 1) * T;
      const px = S.kol * T + 20, py = S.bar * T + 20;
      const angle = Math.atan2(py - by, px - bx);
      const spd = b.hp <= 1 ? 2.4 : 1.8;
      b.proyektil.push({
        x: bx, y: by,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        t0: now,
        dur: 4000
      });
    }

    // Update gerakan proyektil
    for (let i = b.proyektil.length - 1; i >= 0; i--) {
      const pr = b.proyektil[i];
      pr.x += pr.vx;
      pr.y += pr.vy;

      // Cek tabrakan dengan tembok pelindung (Cover Walls)
      const ptc = Math.floor(pr.x / T), ptr = Math.floor(pr.y / T);
      if (ptc >= 0 && ptc < KOLOM && ptr >= 0 && ptr < BARIS && ARENA_BOSS[ptr][ptc] === 1) {
        // Bola sihir menghantam tembok perlindungan dan musnah!
        for (let p = 0; p < 8; p++) {
          const ang = Math.random() * Math.PI * 2;
          S.partikel.push({
            x: pr.x, y: pr.y,
            vx: Math.cos(ang) * (1.5 + Math.random() * 2),
            vy: Math.sin(ang) * (1.5 + Math.random() * 2),
            warna: '#ec4899', t0: now, dur: 280
          });
        }
        b.proyektil.splice(i, 1);
        continue;
      }

      // Cek tabrakan dengan pemain
      const px = S.kol * T + 20, py = S.bar * T + 20;
      if (Math.hypot(pr.x - px, pr.y - py) < 18) {
        if (now >= S.waktuKebalApi) {
          S.waktuKebalApi = now + 900;
          S.lives--;
          updateHUD();
          shake();
          umumkan('Terkena bola sihir Malakor! Nyawa berkurang');
          if (S.lives <= 0) gameOver(false, 'monster');
        }
        b.proyektil.splice(i, 1);
        continue;
      }
      // Hapus jika keluar arena atau habis durasi
      if (now >= pr.t0 + pr.dur || pr.x < T || pr.x > (KOLOM - 1) * T || pr.y < T || pr.y > (BARIS - 1) * T) {
        b.proyektil.splice(i, 1);
      }
    }

    // Status Banner Tip (Cover vs Open Combat)
    const elTip = document.querySelector('.banner-tip');
    if (elTip) {
      if (isPetakTerlindungi(S.kol, S.bar)) {
        elTip.textContent = '🛡️ BERLINDUNG DI BALIK TEMBOK (AMAN UNTUK MENGHITUNG)';
        elTip.style.color = '#38bdf8';
      } else {
        elTip.textContent = '⚔ MEDAN TERBUKA: Tebas Altar (A/B/C/D) yang Benar!';
        elTip.style.color = '#c4b5fd';
      }
    }
  }

  function bossKalah() {
    if (!S.boss) return;
    S.boss.hp = 0;
    updateBossHUD();
    S.score += 1500;
    shake();
    const now = performance.now();
    for (let i = 0; i < 48; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 2 + Math.random() * 6;
      S.partikel.push({
        x: (S.boss.x + 1) * T, y: (S.boss.y + 1) * T,
        vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
        warna: ['#facc15', '#ec4899', '#38bdf8', '#a855f7', '#ffffff'][i % 5],
        t0: now, dur: 900
      });
    }
    setTimeout(() => {
      gameOver(true, 'boss');
    }, 1100);
  }

  // Penggambaran Visual Elemen Boss Babak 2
  function gambarAltar(g, altar, now) {
    const x = altar.c * T, y = altar.r * T;
    // Pedestal Batu
    g.fillStyle = '#2e1c3b';
    g.fillRect(x + 6, y + 20, 28, 16);
    g.fillStyle = '#4a2d59';
    g.fillRect(x + 8, y + 22, 24, 12);
    g.fillStyle = '#a855f7';
    g.fillRect(x + 18, y + 26, 4, 4);

    if (!altar.hancur) {
      // Kristal Mengambang
      const bob = Math.sin(now * 0.005 + altar.pos) * 4;
      const cy = y + 10 + bob;
      g.save();
      g.fillStyle = ['#38bdf8', '#ec4899', '#facc15', '#a855f7'][altar.pos % 4];
      g.shadowColor = g.fillStyle;
      g.shadowBlur = 10;
      g.beginPath();
      g.moveTo(x + 20, cy - 10);
      g.lineTo(x + 27, cy);
      g.lineTo(x + 20, cy + 10);
      g.lineTo(x + 13, cy);
      g.closePath();
      g.fill();
      g.restore();

      // Label Huruf & Jawaban di atas Altar
      g.save();
      g.font = 'bold 11px monospace';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      
      // Background badge teks
      const label = altar.id + ': ' + teksPolos(altar.teks || '');
      const tw = g.measureText(label).width;
      g.fillStyle = 'rgba(15, 10, 25, 0.82)';
      g.strokeStyle = 'rgba(168, 85, 247, 0.6)';
      g.lineWidth = 1;
      g.fillRect(x + 20 - tw / 2 - 5, cy - 25, tw + 10, 14);
      g.strokeRect(x + 20 - tw / 2 - 5, cy - 25, tw + 10, 14);
      
      g.fillStyle = '#fef08a';
      g.fillText(label, x + 20, cy - 18);
      g.restore();
    }
  }

  function gambarTelegraph(g, tel, now) {
    const x = tel.c * T, y = tel.r * T;
    const isWarning = now < tel.t0 + tel.durPeringatan;
    if (isWarning) {
      // Lingkaran sihir merah berkedip
      const p = (now - tel.t0) / tel.durPeringatan;
      const alpha = 0.25 + 0.35 * Math.sin(now * 0.02);
      g.save();
      g.fillStyle = 'rgba(239, 68, 68, ' + alpha + ')';
      g.strokeStyle = '#ef4444';
      g.lineWidth = 2;
      g.fillRect(x + 2, y + 2, T - 4, T - 4);
      g.strokeRect(x + 2, y + 2, T - 4, T - 4);
      g.restore();
    } else {
      // Pilar Api Void menyembur ke atas
      g.save();
      const flk = Math.sin(now * 0.03) * 3;
      const grad = g.createLinearGradient(x + 20, y + 36, x + 20, y - 20);
      grad.addColorStop(0, '#f43f5e');
      grad.addColorStop(0.5, '#a855f7');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      g.fillStyle = grad;
      g.fillRect(x + 6 + flk, y - 18, 28, 54);
      g.restore();
    }
  }

  function gambarProyektil(g, pr, now) {
    g.save();
    g.fillStyle = '#ec4899';
    g.shadowColor = '#f43f5e';
    g.shadowBlur = 12;
    g.beginPath();
    g.arc(pr.x, pr.y, 7, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#ffffff';
    g.beginPath();
    g.arc(pr.x, pr.y, 3, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }

  function gambarBoss(g, b, now) {
    const bx = b.x * T, by = b.y * T;
    const isEnrage = b.hp <= 1;
    const isVulnerable = b.status === 'vulnerable';
    const bob = Math.sin(now * 0.003) * 3;

    g.save();
    // 1. Bayangan Boss
    g.fillStyle = 'rgba(0,0,0,0.45)';
    g.beginPath();
    g.ellipse(bx + 40, by + 74, 32, 10, 0, 0, Math.PI * 2);
    g.fill();

    // 2. Aura Mengamuk saat Enrage
    if (isEnrage) {
      g.fillStyle = 'rgba(239, 68, 68, ' + (0.2 + 0.15 * Math.sin(now * 0.01)) + ')';
      g.beginPath();
      g.arc(bx + 40, by + 40 + bob, 48, 0, Math.PI * 2);
      g.fill();
    }

    // 3. Tubuh Jubah Malakor (Void Robe)
    g.fillStyle = isVulnerable ? '#3b2d54' : '#1f132b';
    g.fillRect(bx + 16, by + 24 + bob, 48, 50);
    g.fillStyle = isEnrage ? '#dc2626' : (isVulnerable ? '#eab308' : '#7c3aed');
    g.fillRect(bx + 26, by + 30 + bob, 28, 44);

    // Tanduk Void / Mahkota Kegelapan
    g.fillStyle = '#0f0817';
    g.fillRect(bx + 18, by + 6 + bob, 8, 20);
    g.fillRect(bx + 54, by + 6 + bob, 8, 20);
    g.fillRect(bx + 24, by + 12 + bob, 32, 22);

    // Mata Menyala
    const eyeCol = isEnrage ? '#ef4444' : (isVulnerable ? '#facc15' : '#38bdf8');
    g.fillStyle = eyeCol;
    g.shadowColor = eyeCol;
    g.shadowBlur = 8;
    g.fillRect(bx + 30, by + 20 + bob, 6, 4);
    g.fillRect(bx + 44, by + 20 + bob, 6, 4);
    g.shadowBlur = 0;

    // 4. Perisai Void (Bola Energi Pelindung)
    if (!isVulnerable) {
      g.strokeStyle = isEnrage ? 'rgba(239, 68, 68, 0.85)' : 'rgba(168, 85, 247, 0.75)';
      g.lineWidth = 3;
      g.fillStyle = isEnrage ? 'rgba(239, 68, 68, 0.15)' : 'rgba(168, 85, 247, 0.15)';
      g.beginPath();
      const rSh = 46 + Math.sin(now * 0.006) * 3;
      g.arc(bx + 40, by + 40 + bob, rSh, 0, Math.PI * 2);
      g.fill();
      g.stroke();
    } else {
      // Efek Bintang Pusing saat Stun
      for (let i = 0; i < 3; i++) {
        const starAng = (now * 0.006) + (i * Math.PI * 2 / 3);
        const sx = bx + 40 + Math.cos(starAng) * 28;
        const sy = by + 12 + Math.sin(starAng) * 8 + bob;
        g.fillStyle = '#facc15';
        g.fillRect(sx - 3, sy - 3, 6, 6);
      }
    }

    // 5. Mini Health Bar di Atas Kepala Boss
    const hpPct = b.hp / b.maxHp;
    g.fillStyle = 'rgba(0,0,0,0.6)';
    g.fillRect(bx + 10, by - 6 + bob, 60, 6);
    g.fillStyle = isEnrage ? '#ef4444' : (isVulnerable ? '#facc15' : '#a855f7');
    g.fillRect(bx + 11, by - 5 + bob, 58 * hpPct, 4);

    g.restore();
  }

  // Transisi dari Babak 1 ke Babak 2
  function selesaiBabak1() {
    S.gameState = 'transisi';
    hentikanDpad();
    S.tahan = [];
    clearInterval(S.timerInterval);
    mulaiConfetti();
    tampil('transisi-modal', true);
    const btn = $('btn-lanjut-boss');
    if (btn) btn.focus();
  }

  function mulaiBabak2() {
    hentikanConfetti();
    tampil('transisi-modal', false);
    tampil('boss-retry-modal', false);
    S.babak = 2;
    S.gameState = 'bermain';
    S.kesempatanBoss = S.kesempatanBoss || CONFIG.KESEMPATAN_BOSS;
    S.maxKesempatanBoss = CONFIG.KESEMPATAN_BOSS;
    S.lives = CONFIG.NYAWA_AWAL; // Pulihkan nyawa penuh (5 HP) saat masuk atau mengulang arena boss
    S.timeLeft += 120; // bonus waktu 2 menit
    tampil('hud-barikade-box', false);
    tampil('hud-boss', true);
    tampil('boss-banner-soal', true);
    S.petaAktif = ARENA_BOSS.map(r => r.slice());
    S.kol = 13; S.bar = 13; S.prevKol = 13; S.prevBar = 13;
    S.arahHadap = 'depan';
    bangunCache();
    initBoss();
    updateHUD();
    updateBossHUD();
    mulaiTimer();
    $('canvas-wrap').focus();
    umumkan('Babak 2 Dimulai! Hancurkan Altar yang bernilai benar untuk meruntuhkan perisai Malakor! Sisa kesempatan: ' + S.kesempatanBoss);
  }

  function tumbangDiBoss(alasan) {
    if (S.gameState === 'boss_revive' || S.gameState === 'hasil') return;
    S.gameState = 'boss_revive';
    clearInterval(S.timerInterval);
    hentikanDpad();
    cancelAnimationFrame(S.raf);
    S.tahan = [];

    S.kesempatanBoss--;
    updateBossHUD();

    const judul = $('boss-retry-judul');
    if (judul) {
      judul.textContent = alasan === 'waktu' ? 'WAKTU ARENA HABIS!' : 'TUMBANG DI ARENA BOSS!';
    }
    const pesan = $('boss-retry-pesan');
    if (pesan) {
      pesan.textContent = alasan === 'waktu'
        ? 'Waktu habis di hadapan Malakor! Cahaya Roh Suci memberimu waktu tambahan dan kesempatan untuk bangkit kembali!'
        : 'Serangan Malakor menumbangkanmu! Namun Berkah Roh Suci melindungimu dari kehancuran total.';
    }

    const tokensWrap = $('boss-retry-tokens');
    if (tokensWrap) {
      let h = '';
      for (let i = 0; i < S.maxKesempatanBoss; i++) {
        const aktif = i < S.kesempatanBoss;
        h += `<span class="token-kristal ${aktif ? 'aktif' : 'padam'}" title="${aktif ? 'Kesempatan Tersedia' : 'Kesempatan Terpakai'}">${aktif ? '💠' : '⚪'}</span>`;
      }
      tokensWrap.innerHTML = h;
    }

    const counter = $('boss-retry-counter');
    if (counter) {
      counter.innerHTML = `Tersisa <strong>${S.kesempatanBoss}</strong> dari ${S.maxKesempatanBoss} Kesempatan`;
    }

    const btnBangkit = $('btn-boss-bangkit');
    if (btnBangkit) {
      btnBangkit.textContent = `✨ BANGKIT DENGAN PERISAI SUCI (Sisa ${S.kesempatanBoss}x)`;
      btnBangkit.focus();
    }

    tampil('boss-retry-modal', true);
    umumkan('Tumbang di Arena Boss. Sisa kesempatan: ' + S.kesempatanBoss + ' dari ' + S.maxKesempatanBoss);
  }

  function bangkitDiBoss() {
    tampil('boss-retry-modal', false);
    S.gameState = 'bermain';
    S.lives = CONFIG.NYAWA_AWAL; // 5 HP
    S.kol = 13; S.bar = 13; S.prevKol = 13; S.prevBar = 13; S.arahHadap = 'depan';
    S.anim = null; S.sedangBergerak = false; S.tahan = [];

    // Bersihkan rintangan proyektil dan pilar api agar aman
    if (S.boss) {
      S.boss.proyektil = [];
      S.boss.telegraphs = [];
    }

    // Jika waktu kritis, berikan waktu minimal 75 detik
    if (S.timeLeft < 75) S.timeLeft = 75;

    // Perisai kebal suci selama 3.2 detik
    const now = performance.now();
    S.waktuKebalApi = now + 3200;

    // Efek partikel kebangkitan suci emas & kristal berkilauan
    for (let i = 0; i < 24; i++) {
      const ang = (i / 24) * Math.PI * 2;
      S.partikel.push({
        x: S.kol * T + 20, y: S.bar * T + 20,
        vx: Math.cos(ang) * (2 + Math.random() * 3),
        vy: Math.sin(ang) * (2 + Math.random() * 3),
        warna: ['#facc15', '#38bdf8', '#ffffff', '#e9d5ff', '#ec4899'][i % 5],
        t0: now, dur: 600
      });
    }

    updateHUD();
    updateBossHUD();
    mulaiTimer();
    S.raf = requestAnimationFrame(loop);
    $('canvas-wrap').focus();
    umumkan('Bangkit dengan Perisai Suci! Bersiaplah menyerang altar!');
  }

  function ulangArenaBoss() {
    tampil('boss-retry-modal', false);
    const sisa = S.kesempatanBoss;
    mulaiBabak2();
    S.kesempatanBoss = sisa;
    updateBossHUD();
    umumkan('Mengulang Arena Boss. Sisa kesempatan: ' + S.kesempatanBoss);
  }

  function loop(now) {
    S.raf = requestAnimationFrame(loop);
    updateMonster(now);
    updateBoss(now);
    periksaJebakanBerdiri(now);
    periksaTabrakanMonster(now);
    const a = S.tahan[S.tahan.length - 1]; if (a) coba(a[0], a[1]); // tombol keyboard ditahan
    render(now);
  }
  function mulaiLoop() { cancelAnimationFrame(S.raf); S.raf = requestAnimationFrame(loop); }

  // ====== SISTEM ANTRIAN SOAL PERSISTEN (NON-REPEATING POOL) ======
  // Menjamin soal yang sudah pernah muncul (dari awal game hingga kalah / main lagi)
  // TIDAK AKAN MUNCUL KEMBALI sampai seluruh 60 soal dalam bank soal habis terpakai.
  let antrianGlobalSoal = null;

  function buatAntrianBaru() {
    const semua = bankSoal.map((_, i) => i);
    const antrian = acak(semua);
    simpanAntrianSoal(antrian);
    return antrian;
  }

  function muatAntrianSoal() {
    try {
      const tersimpan = localStorage.getItem(CONFIG.KUNCI_POOL_SOAL);
      if (tersimpan) {
        const arr = JSON.parse(tersimpan);
        if (Array.isArray(arr) && arr.length > 0 && arr.every(i => Number.isInteger(i) && i >= 0 && i < bankSoal.length)) {
          return arr;
        }
      }
    } catch (_) {}
    return buatAntrianBaru();
  }

  function simpanAntrianSoal(arr) {
    try {
      localStorage.setItem(CONFIG.KUNCI_POOL_SOAL, JSON.stringify(arr));
    } catch (_) {}
  }

  function ambilSoalBerikutnya() {
    if (!antrianGlobalSoal || antrianGlobalSoal.length === 0) {
      antrianGlobalSoal = muatAntrianSoal();
      if (antrianGlobalSoal.length === 0) {
        antrianGlobalSoal = buatAntrianBaru();
      }
    }
    // Hindari soal yang sama berturut-turut jika antrian baru saja di-reset
    if (antrianGlobalSoal.length > 1 && antrianGlobalSoal[0] === S.soalTerakhir) {
      const j = 1 + Math.floor(Math.random() * (antrianGlobalSoal.length - 1));
      const tmp = antrianGlobalSoal[0]; antrianGlobalSoal[0] = antrianGlobalSoal[j]; antrianGlobalSoal[j] = tmp;
    }
    S.soalTerakhir = antrianGlobalSoal.shift();
    simpanAntrianSoal(antrianGlobalSoal);
    return bankSoal[S.soalTerakhir];
  }
  function bukaSoal() {
    S.gameState = 'soal'; hentikanDpad(); S.tahan = []; S.sedangBergerak = false; S.anim = null;
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    const s = ambilSoalBerikutnya(); S.soalAktif = s; S.sudahMenjawab = false;
    const urut = acak([0, 1, 2, 3]); S.benarPos = urut.indexOf(s.jawabanBenar);
    $('soal-kategori').textContent = s.kategori;
    $('soal-nomor').textContent = 'Barikade ' + (S.barikadeHancur + 1) + '/' + S.totalBarikade;
    notasi($('soal-teks'), s.pertanyaan);
    const box = $('soal-opsi'); box.textContent = '';
    urut.forEach((idxAsli, pos) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'opsi';
      const l = document.createElement('b'); l.textContent = 'ABCD'[pos];
      const sp = document.createElement('span'); notasi(sp, s.opsi[idxAsli]);
      b.appendChild(l); b.appendChild(sp); b.addEventListener('click', () => jawab(pos)); box.appendChild(b);
    });
    tampil('question-modal', true);
  }
  function jawab(pos) {
    if (S.gameState !== 'soal' || S.sudahMenjawab) return;
    S.sudahMenjawab = true;
    hentikanDpad(); S.tahan = [];
    document.querySelectorAll('#soal-opsi .opsi').forEach(b => { b.disabled = true; });
    const benar = pos === S.benarPos, s = S.soalAktif; S.benarTerakhir = benar;
    const kotak = $('fb-kotak');
    kotak.className = 'kotak panel ' + (benar ? 'benar' : 'salah');
    if (benar) {
      S.petaAktif[S.barikadeAktif.baris][S.barikadeAktif.kolom] = TILE.LANTAI;
      S.barikadeHancur++; S.jawabanBenar++; S.score += CONFIG.POIN_BARIKADE; bangunCache(); updateHUD();
      $('fb-judul').textContent = 'BARIKADE HANCUR!'; umumkan('Barikade hancur');
      tampil('fb-jawaban', false);
      if (CONFIG.TAMPILKAN_PENJELASAN_SAAT_BENAR) { notasi($('fb-penjelasan'), s.penjelasan); tampil('fb-penjelasan', true); } else tampil('fb-penjelasan', false);
    } else {
      S.lives--; S.jawabanSalah++; updateHUD(); shake(); umumkan('Jawaban salah, nyawa berkurang');
      $('fb-judul').textContent = 'JAWABAN SALAH! Nyawa -1';
      notasi($('fb-jawaban'), 'Jawaban benar: ' + s.opsi[s.jawabanBenar]); tampil('fb-jawaban', true);
      notasi($('fb-penjelasan'), s.penjelasan); tampil('fb-penjelasan', true);
    }
    S.gameState = 'feedback';
    tampil('question-modal', false); tampil('feedback-modal', true);
  }
  function lanjut() {
    if (S.gameState !== 'feedback') return;
    tampil('feedback-modal', false);
    hentikanDpad(); S.tahan = []; S.sedangBergerak = false; S.anim = null;
    S.kunciInputSampai = performance.now() + 250;
    if (!S.benarTerakhir && S.lives <= 0) { gameOver(false, 'nyawa'); return; }
    S.gameState = 'bermain'; $('canvas-wrap').focus();
  }

  // ====== TIMER ======
  function mulaiTimer() {
    clearInterval(S.timerInterval);
    S.timerInterval = setInterval(() => {
      if (document.hidden) return; // jeda saat tab tidak aktif
      const g = S.gameState;
      if (g === 'bermain' || ((g === 'soal' || g === 'feedback') && !CONFIG.TIMER_JEDA_SAAT_SOAL)) {
        S.timeLeft--; updateHUD();
        if (S.timeLeft <= 0) gameOver(false, 'waktu');
      }
    }, 1000);
  }

  // ====== SISTEM CONFETTI MERIAH ======
  let confettiCanvas = null, cfCtx = null, confettiParticles = [], confettiRaf = null;
  function initConfetti() {
    confettiCanvas = $('confettiCanvas');
    if (!confettiCanvas) return;
    cfCtx = confettiCanvas.getContext('2d');
    function resizeCf() {
      if (!confettiCanvas) return;
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCf);
    resizeCf();
  }

  function mulaiConfetti() {
    if (!confettiCanvas) initConfetti();
    if (!confettiCanvas || !cfCtx) return;
    confettiCanvas.classList.remove('hidden');
    cancelAnimationFrame(confettiRaf);
    confettiParticles = [];

    const W = confettiCanvas.width, H = confettiCanvas.height;
    const WARNA_CONFETTI = ['#facc15', '#10b981', '#ec4899', '#06b6d4', '#f43f5e', '#a855f7', '#fb923c', '#ffffff'];

    for (let i = 0; i < 90; i++) {
      const ang = -Math.PI * (0.18 + Math.random() * 0.45);
      const spd = 14 + Math.random() * 18;
      confettiParticles.push({
        x: W * 0.15 + (Math.random() - 0.5) * 60, y: H + 10,
        vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
        w: 9 + Math.random() * 9, h: 14 + Math.random() * 10,
        warna: WARNA_CONFETTI[Math.floor(Math.random() * WARNA_CONFETTI.length)],
        rot: Math.random() * Math.PI * 2, rotSpd: (Math.random() - 0.5) * 0.3,
        rotY: Math.random() * Math.PI * 2, rotYSpd: 0.08 + Math.random() * 0.14,
        drag: 0.985, grav: 0.4 + Math.random() * 0.15
      });
    }

    for (let i = 0; i < 90; i++) {
      const ang = -Math.PI * (0.55 + Math.random() * 0.45);
      const spd = 14 + Math.random() * 18;
      confettiParticles.push({
        x: W * 0.85 + (Math.random() - 0.5) * 60, y: H + 10,
        vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
        w: 9 + Math.random() * 9, h: 14 + Math.random() * 10,
        warna: WARNA_CONFETTI[Math.floor(Math.random() * WARNA_CONFETTI.length)],
        rot: Math.random() * Math.PI * 2, rotSpd: (Math.random() - 0.5) * 0.3,
        rotY: Math.random() * Math.PI * 2, rotYSpd: 0.08 + Math.random() * 0.14,
        drag: 0.985, grav: 0.4 + Math.random() * 0.15
      });
    }

    for (let i = 0; i < 70; i++) {
      confettiParticles.push({
        x: Math.random() * W, y: -20 - Math.random() * 300,
        vx: (Math.random() - 0.5) * 3.5, vy: 2 + Math.random() * 5,
        w: 8 + Math.random() * 8, h: 12 + Math.random() * 10,
        warna: WARNA_CONFETTI[Math.floor(Math.random() * WARNA_CONFETTI.length)],
        rot: Math.random() * Math.PI * 2, rotSpd: (Math.random() - 0.5) * 0.22,
        rotY: Math.random() * Math.PI * 2, rotYSpd: 0.07 + Math.random() * 0.12,
        drag: 0.995, grav: 0.24
      });
    }

    function loopCf() {
      cfCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      const cH = confettiCanvas.height;
      let masihAda = false;

      for (let i = 0; i < confettiParticles.length; i++) {
        const p = confettiParticles[i];
        p.vx *= p.drag; p.vy = p.vy * p.drag + p.grav;
        p.x += p.vx; p.y += p.vy;
        p.rot += p.rotSpd; p.rotY += p.rotYSpd;

        if (p.y < cH + 50) {
          masihAda = true;
          cfCtx.save();
          cfCtx.translate(p.x, p.y);
          cfCtx.rotate(p.rot);
          cfCtx.scale(1, Math.cos(p.rotY));
          cfCtx.fillStyle = p.warna;
          cfCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          cfCtx.restore();
        }
      }

      if (masihAda) {
        confettiRaf = requestAnimationFrame(loopCf);
      }
    }
    loopCf();
  }

  function hentikanConfetti() {
    cancelAnimationFrame(confettiRaf);
    if (cfCtx && confettiCanvas) {
      cfCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      confettiCanvas.classList.add('hidden');
    }
    confettiParticles = [];
  }

  // ====== ALUR GAME ======
  function bacaRekor() { try { return parseInt(localStorage.getItem(CONFIG.KUNCI_HIGHSCORE), 10) || 0; } catch (e) { return 0; } }
  function simpanRekor(n) { try { localStorage.setItem(CONFIG.KUNCI_HIGHSCORE, String(n)); } catch (e) { /* localStorage diblokir */ } }

  function mulaiGame() {
    hentikanConfetti();
    clearInterval(S.timerInterval); hentikanDpad(); cancelAnimationFrame(S.raf);
    S.babak = 1;
    S.boss = null;
    tampil('hud-boss', false);
    tampil('boss-banner-soal', false);
    tampil('hud-barikade-box', true);
    S.petaAktif = MAP.map(r => r.slice());
    S.petaAktif.forEach((row, r) => row.forEach((v, c) => { if (v === TILE.START) { S.kol = c; S.bar = r; row[c] = TILE.LANTAI; } }));
    S.prevKol = S.kol; S.prevBar = S.bar; S.arahHadap = 'depan';
    S.totalBarikade = MAP.reduce((n, row) => n + row.filter(v => v === TILE.BARIKADE).length, 0);
    Object.assign(S, {
      lives: CONFIG.NYAWA_AWAL, timeLeft: CONFIG.WAKTU_AWAL, score: 0, barikadeHancur: 0, jawabanBenar: 0, jawabanSalah: 0,
      kesempatanBoss: CONFIG.KESEMPATAN_BOSS, maxKesempatanBoss: CONFIG.KESEMPATAN_BOSS,
      antrianSoal: [], soalTerakhir: -1, soalAktif: null, barikadeAktif: null, sudahMenjawab: false, sedangBergerak: false,
      waktuKebalApi: 0, anim: null, tahan: [], arahTerakhir: [1, 0],
      monsters: MONSTER_AWAL.map(m => ({ ...m, c: m.c0, r: m.r0, dir: 1, hidup: true, lastStepTime: 0, anim: null })),
      monsterKalah: 0, waktuBisaAksi: 0, sedangDodge: 0, efekSerang: null, partikel: []
    });
    const isMobile = window.innerWidth <= 900 || ('ontouchstart' in window);
    S.modeZoom = isMobile;
    if (canvas) canvas.classList.toggle('mode-zoom', S.modeZoom);
    const bz = $('btn-zoom');
    if (bz) bz.innerHTML = S.modeZoom ? '<span>🗺️</span>' : '<span>🔍</span>';
    bangunCache(); updateHUD();
    ['main-menu', 'result-screen', 'boss-retry-modal', 'transisi-modal'].forEach(id => tampil(id, false));
    ['question-modal', 'feedback-modal'].forEach(id => tampil(id, false));
    tampil('game-screen', true); S.gameState = 'bermain';
    mulaiTimer(); mulaiLoop(); $('canvas-wrap').focus();
  }
  function gameOver(menang, alasan) {
    if (S.gameState === 'hasil') return;
    if (!menang && S.babak === 2 && S.kesempatanBoss > 1) {
      tumbangDiBoss(alasan);
      return;
    }
    if (!menang && S.babak === 2 && S.kesempatanBoss <= 1) {
      alasan = 'boss';
    }
    S.gameState = 'hasil'; clearInterval(S.timerInterval); hentikanDpad(); cancelAnimationFrame(S.raf); S.tahan = [];
    let skor = S.barikadeHancur * CONFIG.POIN_BARIKADE + S.monsterKalah * CONFIG.POIN_MONSTER;
    if (menang) skor += S.timeLeft * CONFIG.BONUS_WAKTU_PER_DETIK + S.lives * CONFIG.BONUS_NYAWA;
    S.score = skor;
    const rekorBaru = skor > bacaRekor(); if (rekorBaru) simpanRekor(skor);
    ['question-modal', 'feedback-modal', 'game-screen', 'boss-retry-modal', 'transisi-modal'].forEach(id => tampil(id, false));
    $('res-judul').textContent = menang ? 'MISI BERHASIL' : 'TERTANGKAP!';
    $('res-alasan').textContent = menang
      ? 'Kamu menembus labirin dan membebaskan rekanmu!'
      : (alasan === 'boss'
        ? 'Kamu telah mengerahkan segenap tenaga, namun seluruh 3x kesempatan di hadapan Malakor telah habis!'
        : (alasan === 'monster' ? 'Kamu tumbang diserang oleh monster labirin!' : (alasan === 'waktu' ? 'Waktu habis.' : 'Nyawa habis.')));
    $('res-skor').textContent = skor; $('res-waktu').textContent = Math.max(0, S.timeLeft) + ' detik'; $('res-nyawa').textContent = Math.max(0, S.lives);
    $('res-barikade').textContent = S.barikadeHancur + '/' + S.totalBarikade;
    if ($('res-monster')) $('res-monster').textContent = S.monsterKalah;
    $('res-benar').textContent = S.jawabanBenar; $('res-salah').textContent = S.jawabanSalah;
    tampil('res-rekor', rekorBaru); tampil('result-screen', true);
    if (menang) mulaiConfetti(); else hentikanConfetti();
    $('btn-restart').focus();
  }
  function keMenu() {
    hentikanConfetti();
    S.gameState = 'menu';['result-screen', 'game-screen'].forEach(id => tampil(id, false));
    $('highscore-menu').textContent = bacaRekor(); tampil('main-menu', true);
  }

  // ====== INISIALISASI (listener dipasang satu kali) ======
  document.addEventListener('DOMContentLoaded', function () {
    const btnBoss = $('btn-lanjut-boss'); if (btnBoss) btnBoss.addEventListener('click', mulaiBabak2);
    const btnBangkit = $('btn-boss-bangkit'); if (btnBangkit) btnBangkit.addEventListener('click', bangkitDiBoss);
    const btnUlang = $('btn-boss-ulang'); if (btnUlang) btnUlang.addEventListener('click', ulangArenaBoss);
    const btnMenyerah = $('btn-boss-menyerah'); if (btnMenyerah) btnMenyerah.addEventListener('click', () => {
      tampil('boss-retry-modal', false);
      gameOver(false, 'boss');
    });
    initConfetti();
    canvas = $('gameCanvas'); ctx = canvas.getContext('2d');
    const W = KOLOM * T; canvas.width = W; canvas.height = BARIS * T;
    cache = document.createElement('canvas'); cache.width = W; cache.height = BARIS * T; cctx = cache.getContext('2d');
    luz = document.createElement('canvas'); luz.width = W; luz.height = BARIS * T; lctx = luz.getContext('2d');
    [ctx, cctx, lctx].forEach(g => { g.imageSmoothingEnabled = false; });
    sprPemain = document.createElement('canvas'); sprPemain.width = 16; sprPemain.height = 16;
    const sg = sprPemain.getContext('2d');
    SPRITE_PEMAIN.forEach((row, y) => row.split('').forEach((ch, x) => { if (PALET_SPRITE[ch]) R(sg, x, y, 1, 1, PALET_SPRITE[ch]); }));

    // Siapkan sprite monster Slime & Imp
    [SPRITE_SLIME_1, SPRITE_SLIME_2].forEach(spr => {
      const fc = document.createElement('canvas'); fc.width = 16; fc.height = 16;
      const fg = fc.getContext('2d');
      spr.forEach((row, y) => row.split('').forEach((ch, x) => { if (PALET_SLIME[ch]) R(fg, x, y, 1, 1, PALET_SLIME[ch]); }));
      sprSlimes.push(fc);
    });
    [SPRITE_IMP_1, SPRITE_IMP_2].forEach(spr => {
      const fc = document.createElement('canvas'); fc.width = 16; fc.height = 16;
      const fg = fc.getContext('2d');
      spr.forEach((row, y) => row.split('').forEach((ch, x) => { if (PALET_IMP[ch]) R(fg, x, y, 1, 1, PALET_IMP[ch]); }));
      sprImps.push(fc);
    });

    imgPemain = new Image();
    imgPemain.onload = function () {
      const fw = 160, fh = 296;
      const targetW = 24, targetH = 36;
      for (let i = 0; i < 5; i++) {
        const fc = document.createElement('canvas');
        fc.width = targetW;
        fc.height = targetH;
        const fctx = fc.getContext('2d');
        fctx.imageSmoothingEnabled = true;
        fctx.drawImage(imgPemain, i * fw, 0, fw, fh, 0, 0, targetW, targetH);
        sprFrames.push(fc);
      }
      imgPemainReady = true;
    };
    imgPemain.onerror = function () {
      if (imgPemain.src.indexOf('Aset/') !== -1) {
        imgPemain.src = 'priestess_walk.png';
      }
    };
    imgPemain.src = 'Aset/priestess_walk.png';

    const imgFront = new Image();
    imgFront.onload = function () {
      const fc = document.createElement('canvas');
      fc.width = 24; fc.height = 36;
      const fctx = fc.getContext('2d');
      fctx.imageSmoothingEnabled = true;
      fctx.drawImage(imgFront, 0, 0, imgFront.width, imgFront.height, 0, 0, 24, 36);
      sprFront = fc;
    };
    imgFront.onerror = function () {
      if (imgFront.src.indexOf('Aset/') !== -1) {
        imgFront.src = 'priestess_front.png';
      }
    };
    imgFront.src = 'Aset/priestess_front.png';

    const imgBack = new Image();
    imgBack.onload = function () {
      const fc = document.createElement('canvas');
      fc.width = 24; fc.height = 36;
      const fctx = fc.getContext('2d');
      fctx.imageSmoothingEnabled = true;
      fctx.drawImage(imgBack, 0, 0, imgBack.width, imgBack.height, 0, 0, 24, 36);
      sprBack = fc;
    };
    imgBack.onerror = function () {
      if (imgBack.src.indexOf('Aset/') !== -1) {
        imgBack.src = 'priestess_back.png';
      }
    };
    imgBack.src = 'Aset/priestess_back.png';

    $('ikon-kunci').innerHTML = svgMatriks(IKON_KUNCI, { o: WARNA.outline, y: WARNA.emas }, 2);

    validateBankSoal(); validasiPeta();
    $('highscore-menu').textContent = bacaRekor();

    $('btn-mulai').addEventListener('click', mulaiGame);
    $('btn-restart').addEventListener('click', mulaiGame);
    $('btn-menu').addEventListener('click', keMenu);
    $('btn-lanjut').addEventListener('click', lanjut);

    // Keyboard
    const ARAH = { w: [0, -1], arrowup: [0, -1], s: [0, 1], arrowdown: [0, 1], a: [-1, 0], arrowleft: [-1, 0], d: [1, 0], arrowright: [1, 0] };
    document.addEventListener('keydown', e => {
      const k = e.key.toLowerCase();
      if (S.gameState === 'bermain') {
        if (ARAH[k] || k === ' ') e.preventDefault();
        if (ARAH[k] && !e.repeat) {
          S.arahTerakhir = ARAH[k];
          S.tahan = S.tahan.filter(a => a !== ARAH[k]);
          S.tahan.push(ARAH[k]);
          coba(ARAH[k][0], ARAH[k][1]);
        }
        if (k === ' ' && !e.repeat) {
          aksiPemain();
        }
      } else if (S.gameState === 'soal' || S.gameState === 'feedback') {
        // Kunci total tombol WASD, Panah & Spasi saat dialog pertanyaan / feedback tampil
        if (ARAH[k] || k === ' ') {
          e.preventDefault();
          return;
        }
        if (S.gameState === 'soal') {
          // Hanya izinkan angka 1, 2, 3, 4 jika ingin menjawab lewat keyboard
          const i = '1234'.indexOf(k);
          if (k.length === 1 && i >= 0) { e.preventDefault(); jawab(i); }
        } else if (S.gameState === 'feedback') {
          if (k === 'enter') { e.preventDefault(); lanjut(); }
        }
      }
    });
    document.addEventListener('keyup', e => { const a = ARAH[e.key.toLowerCase()]; if (a) S.tahan = S.tahan.filter(x => x !== a); });
    window.addEventListener('blur', () => { S.tahan = []; hentikanDpad(); });

    // D-Pad Virtual Thumbpad (Fluid Pointer Capture & Multi-Touch)
    const dpadEl = $('dpad');
    let pointerArahAktif = null;
    let dxAktif = 0, dyAktif = 0;

    function pasangArah(dx, dy, targetBtn) {
      if (dx === dxAktif && dy === dyAktif && S.dpadInterval) return;
      dxAktif = dx; dyAktif = dy;
      document.querySelectorAll('.dp.aktif').forEach(b => b.classList.remove('aktif'));
      if (targetBtn) targetBtn.classList.add('aktif');
      if (navigator.vibrate) try { navigator.vibrate(12); } catch (_) {}
      if (S.gameState === 'bermain') coba(dx, dy);
      clearInterval(S.dpadInterval);
      S.dpadInterval = setInterval(() => {
        if (S.gameState === 'bermain' && (dxAktif !== 0 || dyAktif !== 0)) {
          coba(dxAktif, dyAktif);
        } else {
          hentikanDpad();
        }
      }, CONFIG.DELAY_TAHAN_TOMBOL_MS);
    }

    if (dpadEl) {
      dpadEl.addEventListener('pointerdown', e => {
        e.preventDefault();
        if (S.gameState !== 'bermain') return;
        const btn = e.target.closest('.dp');
        if (!btn) return;
        pointerArahAktif = e.pointerId;
        try { dpadEl.setPointerCapture(e.pointerId); } catch (_) {}
        pasangArah(+btn.dataset.dx, +btn.dataset.dy, btn);
      });

      dpadEl.addEventListener('pointermove', e => {
        if (e.pointerId !== pointerArahAktif || S.gameState !== 'bermain') return;
        e.preventDefault();
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const btn = el ? el.closest('.dp') : null;
        if (btn) {
          pasangArah(+btn.dataset.dx, +btn.dataset.dy, btn);
        }
      });

      const lepasDpad = e => {
        if (e.pointerId === pointerArahAktif) {
          try { dpadEl.releasePointerCapture(e.pointerId); } catch (_) {}
          pointerArahAktif = null;
          dxAktif = 0; dyAktif = 0;
          hentikanDpad();
        }
      };
      dpadEl.addEventListener('pointerup', lepasDpad);
      dpadEl.addEventListener('pointercancel', lepasDpad);
      dpadEl.addEventListener('contextmenu', e => e.preventDefault());
    }

    // Tombol Aksi Serang / Menghindar di HP (Multi-Touch Terisolasi)
    const btnAksi = $('btn-aksi');
    let pointerAksiAktif = null;
    if (btnAksi) {
      btnAksi.addEventListener('pointerdown', e => {
        e.preventDefault();
        pointerAksiAktif = e.pointerId;
        try { btnAksi.setPointerCapture(e.pointerId); } catch (_) {}
        btnAksi.classList.add('aktif');
        if (navigator.vibrate) try { navigator.vibrate(24); } catch (_) {}
        if (S.gameState === 'bermain') aksiPemain();
      });
      const lepasAksi = e => {
        if (e.pointerId === pointerAksiAktif) {
          try { btnAksi.releasePointerCapture(e.pointerId); } catch (_) {}
          pointerAksiAktif = null;
          btnAksi.classList.remove('aktif');
        }
      };
      btnAksi.addEventListener('pointerup', lepasAksi);
      btnAksi.addEventListener('pointercancel', lepasAksi);
      btnAksi.addEventListener('contextmenu', e => e.preventDefault());
    }

    // Tombol Layar Penuh (Native Fullscreen + Pseudo-Fullscreen untuk HP/iOS)
    function perbaruiIkonFs(aktif) {
      const btnFs = $('btn-fullscreen');
      if (!btnFs) return;
      btnFs.innerHTML = aktif ? '<span>🗗</span>' : '<span>⛶</span>';
      btnFs.title = aktif ? 'Keluar Layar Penuh (F / Esc)' : 'Layar Penuh (F)';
    }

    function toggleLayarPenuh() {
      const doc = document;
      const docEl = document.documentElement;
      const isNative = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement);
      const isPseudo = doc.body.classList.contains('layar-penuh-aktif');

      if (!isNative && !isPseudo) {
        const req = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.webkitRequestFullScreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
        if (req) {
          try {
            const p = req.call(docEl);
            if (p && p.then) {
              p.then(() => {
                if (screen.orientation && screen.orientation.lock) {
                  screen.orientation.lock('landscape').catch(() => {});
                }
              }).catch(() => {
                doc.body.classList.add('layar-penuh-aktif');
                perbaruiIkonFs(true);
              });
            } else {
              if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock('landscape').catch(() => {});
              }
            }
          } catch (_) {
            doc.body.classList.add('layar-penuh-aktif');
            perbaruiIkonFs(true);
          }
        } else {
          doc.body.classList.add('layar-penuh-aktif');
          perbaruiIkonFs(true);
        }
        window.scrollTo(0, 1);
      } else {
        if (isNative) {
          const exit = doc.exitFullscreen || doc.webkitExitFullscreen || doc.webkitCancelFullScreen || doc.mozCancelFullScreen || doc.msExitFullscreen;
          if (exit) exit.call(doc).catch(() => {});
        }
        doc.body.classList.remove('layar-penuh-aktif');
        perbaruiIkonFs(false);
      }
    }

    // Tombol Zoom / Mode Fokus HP (Z)
    function toggleZoom() {
      S.modeZoom = !S.modeZoom;
      if (canvas) canvas.classList.toggle('mode-zoom', S.modeZoom);
      const bz = $('btn-zoom');
      if (bz) {
        bz.innerHTML = S.modeZoom ? '<span>🗺️</span>' : '<span>🔍</span>';
        bz.title = S.modeZoom ? 'Tampilan Peta Penuh (Z)' : 'Perbesar Karakter (Z)';
      }
      if (navigator.vibrate) try { navigator.vibrate(15); } catch (_) {}
    }
    const btnZoom = $('btn-zoom');
    if (btnZoom) {
      btnZoom.addEventListener('click', toggleZoom);
      btnZoom.addEventListener('touchend', e => { e.preventDefault(); toggleZoom(); });
    }

    const btnFs = $('btn-fullscreen');
    if (btnFs) {
      btnFs.addEventListener('click', toggleLayarPenuh);
      btnFs.addEventListener('touchend', e => { e.preventDefault(); toggleLayarPenuh(); });
      ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange'].forEach(ev => {
        document.addEventListener(ev, () => {
          const aktif = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.body.classList.contains('layar-penuh-aktif'));
          perbaruiIkonFs(aktif);
        });
      });
    }
    document.addEventListener('keydown', e => {
      if (e.key.toLowerCase() === 'f' && !e.repeat && (S.gameState === 'bermain' || S.gameState === 'menu')) {
        toggleLayarPenuh();
      }
      if (e.key.toLowerCase() === 'z' && !e.repeat && S.gameState === 'bermain') {
        toggleZoom();
      }
    });
    keMenu();
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('autostart')) {
      setTimeout(mulaiGame, 150);
    }
  });

})();