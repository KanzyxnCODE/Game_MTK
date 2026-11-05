(function () {
  'use strict';

  // ====== KONFIGURASI (edit di sini) ======
  const CONFIG = {
    TILE_SIZE: 40, NYAWA_AWAL: 5, WAKTU_AWAL: 300,
    POIN_BARIKADE: 100, POIN_MONSTER: 50, COOLDOWN_AKSI_MS: 320,
    BONUS_WAKTU_PER_DETIK: 1, BONUS_NYAWA: 50,
    DURASI_LANGKAH_MS: 165, DELAY_TAHAN_TOMBOL_MS: 185, COOLDOWN_API_MS: 500,
    TIMER_JEDA_SAAT_SOAL: true, TAMPILKAN_PENJELASAN_SAAT_BENAR: false,
    DURASI_API_AKTIF_MS: 1600, DURASI_API_PADAM_MS: 1600, DURASI_API_PERINGATAN_MS: 800,
    KUNCI_HIGHSCORE: 'labirin_peluang_highscore',
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
  // Peta Labirin 21x21 yang luas & menantang:
  // Lorong lega dengan pintu gerbang jebakan api wajib di setiap zona menuju barikade & finish.
  const MAP = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 5, 0, 0, 0, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 3, 1, 1],
    [1, 1, 3, 1, 1, 1, 0, 4, 3, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];
  // Dekorasi non-logika (peti di lorong & ruang harta)
  const DEKORASI = [
    { kolom: 3, baris: 1, jenis: 'peti' },
    { kolom: 7, baris: 1, jenis: 'peti' },
    { kolom: 14, baris: 1, jenis: 'peti' },
    { kolom: 19, baris: 4, jenis: 'peti' },
    { kolom: 16, baris: 10, jenis: 'peti' },
    { kolom: 6, baris: 10, jenis: 'peti' },
    { kolom: 1, baris: 17, jenis: 'peti' },
    { kolom: 6, baris: 19, jenis: 'peti' },
    { kolom: 16, baris: 18, jenis: 'peti' },
    { kolom: 11, baris: 14, jenis: 'peti' }
  ];
  // Daftar monster penunggu di setiap ruangan dungeon (tipe: slime / imp)
  const MONSTER_AWAL = [
    // Ruang 1: Ruang Awal (Start Chamber)
    { id: 1, tipe: 'slime', c0: 3, r0: 3, axis: 'x', min: 2, max: 4, stepInterval: 1250 },
    // Ruang 2: Lorong Depan Barikade 1
    { id: 2, tipe: 'slime', c0: 7, r0: 3, axis: 'x', min: 6, max: 7, stepInterval: 1200 },
    // Ruang 3: Galeri Utara (Northern Gallery)
    { id: 3, tipe: 'imp', c0: 13, r0: 1, axis: 'x', min: 10, max: 16, stepInterval: 1150 },
    { id: 4, tipe: 'slime', c0: 18, r0: 3, axis: 'y', min: 2, max: 5, stepInterval: 1200 },
    // Ruang 4: Aula Besar Tengah (Central Grand Hall)
    { id: 5, tipe: 'imp', c0: 16, r0: 10, axis: 'x', min: 14, max: 18, stepInterval: 1150 },
    { id: 6, tipe: 'slime', c0: 6, r0: 12, axis: 'x', min: 4, max: 8, stepInterval: 1200 },
    // Ruang 5: Kripta Barat (Western Crypt)
    { id: 7, tipe: 'slime', c0: 2, r0: 14, axis: 'x', min: 1, max: 3, stepInterval: 1200 },
    // Ruang 6: Lorong Bawah Selatan (Southern Corridor)
    { id: 8, tipe: 'imp', c0: 5, r0: 19, axis: 'x', min: 2, max: 7, stepInterval: 1150 },
    { id: 9, tipe: 'slime', c0: 16, r0: 19, axis: 'x', min: 15, max: 19, stepInterval: 1200 },
    // Ruang 7: Halaman Makam (South-East Court)
    { id: 10, tipe: 'imp', c0: 18, r0: 16, axis: 'x', min: 17, max: 19, stepInterval: 1150 },
    // Ruang 8: Kuil Suci Finish (Inner Sanctum)
    { id: 11, tipe: 'imp', c0: 11, r0: 15, axis: 'x', min: 10, max: 12, stepInterval: 1100 }
  ];
  const KOLOM = MAP[0].length, BARIS = MAP.length;

  // ====== BANK SOAL (edit di sini) ======
  // Cara menambah soal (sampai 50 atau lebih): salin satu objek, isi field-nya, dan tambahkan koma.
  // jawabanBenar = index 0-3 pada array opsi. Barikade mengambil soal dari antrean acak (tanpa pengulangan
  // sampai semua soal terpakai). Notasi: [a/b] = pecahan, ^{x} = pangkat, _{x} = subskrip.
  const bankSoal = [
    {
      kategori: 'Ruang Sampel', tingkat: 'mudah',
      pertanyaan: 'Gerbang sandi dibuka dengan melempar 1 koin dan 1 dadu bersamaan. Berapa banyak anggota ruang sampelnya?',
      opsi: ['8', '12', '6', '36'], jawabanBenar: 1,
      penjelasan: 'n(S) = banyak sisi koin x banyak sisi dadu = 2 x 6 = 12. (8 hasil dari 2+6 dan 36 dari 6x6 adalah kesalahan umum.)'
    },
    {
      kategori: 'Peluang Kejadian', tingkat: 'mudah',
      pertanyaan: 'Peti berisi 5 kunci emas, 3 kunci perak, dan 2 kunci perunggu. Satu kunci diambil acak. Berapa peluang terambil kunci emas?',
      opsi: ['[5/8]', '[3/10]', '[1/2]', '[1/5]'], jawabanBenar: 2,
      penjelasan: 'P(A) = n(A)/n(S) dengan n(A) = 5 dan n(S) = 5+3+2 = 10. Maka P = [5/10] = [1/2].'
    },
    {
      kategori: 'Peluang Komplemen', tingkat: 'sedang',
      pertanyaan: 'Peluang menebak sandi obor dengan benar adalah [2/9]. Berapa peluang tebakan itu salah?',
      opsi: ['[2/9]', '[5/9]', '[1/9]', '[7/9]'], jawabanBenar: 3,
      penjelasan: 'Rumus komplemen: P(A\u2019) = 1 - P(A) = 1 - [2/9] = [9/9] - [2/9] = [7/9].'
    },
    {
      kategori: 'Frekuensi Harapan', tingkat: 'sedang',
      pertanyaan: 'Untuk membuka gembok, dadu dilempar 120 kali. Berapa frekuensi harapan muncul mata dadu 6?',
      opsi: ['20', '24', '60', '120'], jawabanBenar: 0,
      penjelasan: 'Fh = P(A) x banyak percobaan = [1/6] x 120 = 20.'
    },
    {
      kategori: 'Permutasi', tingkat: 'sedang',
      pertanyaan: 'Ada 5 kunci berbeda. Berapa cara menyusun 3 kunci pada 3 lubang gembok berurutan (urutan diperhatikan)?',
      opsi: ['10', '60', '120', '125'], jawabanBenar: 1,
      penjelasan: 'P(n,r) = n!/(n-r)! sehingga P(5,3) = 5!/2! = 120/2 = 60. Bukan 5^{3} = 125 (itu untuk pengulangan) dan bukan 10 (itu kombinasi).'
    },
    {
      kategori: 'Kombinasi', tingkat: 'sedang',
      pertanyaan: 'Dari 6 rekan, akan dipilih 3 orang sebagai penjaga obor tanpa memperhatikan urutan. Berapa banyak cara memilihnya?',
      opsi: ['120', '216', '20', '18'], jawabanBenar: 2,
      penjelasan: 'C(n,r) = n!/(r!(n-r)!) sehingga C(6,3) = 6!/(3! x 3!) = 720/36 = 20. (120 adalah permutasi P(6,3).)'
    },
    {
      kategori: 'Aplikasi Gabungan', tingkat: 'sulit',
      pertanyaan: 'Peti berisi 4 kunci merah dan 3 kunci biru. Dua kunci diambil sekaligus. Berapa peluang keduanya merah?',
      opsi: ['[4/7]', '[16/49]', '[1/7]', '[2/7]'], jawabanBenar: 3,
      penjelasan: 'n(S) = C(7,2) = 21 dan n(A) = C(4,2) = 6. Maka P = [6/21] = [2/7]. (16/49 salah karena kunci tidak dikembalikan.)'
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
    gameState: 'menu', kol: 0, bar: 0, prevKol: 0, prevBar: 0, arahHadap: 'kanan',
    lives: 0, timeLeft: 0, score: 0, timerInterval: null, petaAktif: null,
    antrianSoal: [], soalTerakhir: -1, soalAktif: null, barikadeAktif: null, sudahMenjawab: false,
    barikadeHancur: 0, jawabanBenar: 0, jawabanSalah: 0, sedangBergerak: false, waktuKebalApi: 0,
    totalBarikade: 0, anim: null, raf: 0, dpadInterval: null, tahan: [], benarPos: 0, benarTerakhir: false,
    monsters: [], monsterKalah: 0, waktuBisaAksi: 0, sedangDodge: 0, efekSerang: null, partikel: [], arahTerakhir: [1, 0],
    cache: null, obor: [], api: [], barikade: [], finish: null
  };

  let $, canvas, ctx, cache, cctx, luz, lctx, sprPemain, imgPemain = null, imgPemainReady = false;
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
    const W = cache.width;
    // 1. Pendaran hangat di lantai bawah
    sumber.forEach(s => pendarLantai(ctx, s.x, s.y, s.r, s.warm));

    // 2. Lapisan Kegelapan Dungeon (Pekat di luar jangkauan cahaya karakter)
    lctx.globalCompositeOperation = 'source-over';
    lctx.clearRect(0, 0, W, W);
    lctx.fillStyle = 'rgba(20, 14, 25, ' + V.OPASITAS_VIGNETTE + ')';
    lctx.fillRect(0, 0, W, W);

    // 3. Potong lubang lentera karakter & sumber cahaya di dungeon
    lctx.globalCompositeOperation = 'destination-out';
    sumber.forEach(s => lubangCahaya(lctx, s.x, s.y, s.r, s.intensitas));

    // 4. Salin lapisan kegelapan ke atas kanvas utama
    ctx.drawImage(luz, 0, 0);
  }

  function render(now) {
    const t = REDUCE ? 0 : now, W = cache.width;
    // posisi gambar pemain (interpolasi)
    let px = S.kol * T, py = S.bar * T, prog = 0;
    if (S.anim) {
      const a = S.anim; prog = Math.min(1, (now - a.t0) / a.dur);
      const f = a.mundur ? (1 - Math.abs(2 * prog - 1)) * 0.6 : prog;
      px = (a.fx + (a.tx - a.fx) * f) * T; py = (a.fy + (a.ty - a.fy) * f) * T;
      if (prog >= 1) { S.anim = null; S.sedangBergerak = false; px = S.kol * T; py = S.bar * T; }
    }
    ctx.clearRect(0, 0, W, W);
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
    if (v === TILE.FINISH) gameOver(true, 'selamat');
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
        if (v === TILE.FINISH) gameOver(true, 'selamat');
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
  function loop(now) {
    S.raf = requestAnimationFrame(loop);
    updateMonster(now);
    periksaJebakanBerdiri(now);
    periksaTabrakanMonster(now);
    const a = S.tahan[S.tahan.length - 1]; if (a) coba(a[0], a[1]); // tombol keyboard ditahan
    render(now);
  }
  function mulaiLoop() { cancelAnimationFrame(S.raf); S.raf = requestAnimationFrame(loop); }

  // ====== SOAL ======
  function ambilSoalBerikutnya() {
    if (S.antrianSoal.length === 0) {
      S.antrianSoal = acak(bankSoal.map((_, i) => i));
      if (S.antrianSoal.length > 1 && S.antrianSoal[0] === S.soalTerakhir) { // hindari soal sama berurutan
        const j = 1 + Math.floor(Math.random() * (S.antrianSoal.length - 1));
        const tmp = S.antrianSoal[0]; S.antrianSoal[0] = S.antrianSoal[j]; S.antrianSoal[j] = tmp;
      }
    }
    S.soalTerakhir = S.antrianSoal.shift();
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
    S.petaAktif = MAP.map(r => r.slice()); // deep copy; MAP asli tidak berubah
    S.petaAktif.forEach((row, r) => row.forEach((v, c) => { if (v === TILE.START) { S.kol = c; S.bar = r; row[c] = TILE.LANTAI; } }));
    S.prevKol = S.kol; S.prevBar = S.bar; S.arahHadap = 'depan';
    S.totalBarikade = MAP.reduce((n, row) => n + row.filter(v => v === TILE.BARIKADE).length, 0);
    Object.assign(S, {
      lives: CONFIG.NYAWA_AWAL, timeLeft: CONFIG.WAKTU_AWAL, score: 0, barikadeHancur: 0, jawabanBenar: 0, jawabanSalah: 0,
      antrianSoal: [], soalTerakhir: -1, soalAktif: null, barikadeAktif: null, sudahMenjawab: false, sedangBergerak: false,
      waktuKebalApi: 0, anim: null, tahan: [], arahTerakhir: [1, 0],
      monsters: MONSTER_AWAL.map(m => ({ ...m, c: m.c0, r: m.r0, dir: 1, hidup: true, lastStepTime: 0, anim: null })),
      monsterKalah: 0, waktuBisaAksi: 0, sedangDodge: 0, efekSerang: null, partikel: []
    });
    bangunCache(); updateHUD();
    ['main-menu', 'result-screen'].forEach(id => tampil(id, false));
    ['question-modal', 'feedback-modal'].forEach(id => tampil(id, false));
    tampil('game-screen', true); S.gameState = 'bermain';
    mulaiTimer(); mulaiLoop(); $('canvas-wrap').focus();
  }
  function gameOver(menang, alasan) {
    if (S.gameState === 'hasil') return;
    S.gameState = 'hasil'; clearInterval(S.timerInterval); hentikanDpad(); cancelAnimationFrame(S.raf); S.tahan = [];
    let skor = S.barikadeHancur * CONFIG.POIN_BARIKADE + S.monsterKalah * CONFIG.POIN_MONSTER;
    if (menang) skor += S.timeLeft * CONFIG.BONUS_WAKTU_PER_DETIK + S.lives * CONFIG.BONUS_NYAWA;
    S.score = skor;
    const rekorBaru = skor > bacaRekor(); if (rekorBaru) simpanRekor(skor);
    ['question-modal', 'feedback-modal', 'game-screen'].forEach(id => tampil(id, false));
    $('res-judul').textContent = menang ? 'MISI BERHASIL' : 'TERTANGKAP!';
    $('res-alasan').textContent = menang ? 'Kamu menembus labirin dan membebaskan rekanmu!' : (alasan === 'monster' ? 'Kamu tumbang diserang oleh monster labirin!' : (alasan === 'waktu' ? 'Waktu habis.' : 'Nyawa habis.'));
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
    $ = id => document.getElementById(id);
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
    });
    keMenu();
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('autostart')) {
      setTimeout(mulaiGame, 150);
    }
    if (urlParams.has('test_finish')) {
      setTimeout(() => { mulaiGame(); gameOver(true, 'selamat'); }, 300);
    }
  });

})();