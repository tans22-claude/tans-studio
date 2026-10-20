// Data terpusat untuk section Creative Workspace.
// Ganti / tambah entri di sini untuk memakai proyek portofolio asli.
// `image` dan `video` harus menunjuk ke file yang benar-benar ada di /public.

export const WORKSPACE_TOTAL_DURATION = 32;
export const WORKSPACE_FPS = 24;

export const WORKSPACE_PROJECTS = [
  {
    id: "nocturne-chronicles",
    index: "01",
    title: "Nocturne Chronicles",
    category: "COLOR & MOTION",
    client: "Spec / Short Film",
    role: "Editor & Colorist",
    year: "2025",
    description:
      "Gradasi sinematik bernuansa nocturne: bayangan violet dingin, highlight tembaga, dan grain 35mm yang dijaga tetap organik di seluruh pipeline ACES.",
    format: "2.39:1 · 4K DCI",
    runtime: "00:02:14",
    status: "MASTERED",
    accent: "#A78BFA",
    image: "/desaind/perang.webp",
    focal: "center 45%",
    video: "/videos/vidio/1017-web.webm",
    tools: ["DaVinci Resolve Studio", "ACES 1.3", "35mm Grain"],
    timeline: { start: 0, duration: 6.4 },
    titleClip: { start: 0.6, duration: 2 },
    caseStudy: {
      summary:
        "Membangun identitas visual untuk potongan sinema yang hidup di antara cahaya kota dan interior gelap.",
      brief:
        "Arah awalnya sederhana: membuat malam terasa hangat, bukan sekadar gelap. Saya memulai dari plate netral dan memetakan sumber cahaya praktis di setiap shot agar keputusan warna punya alasan naratif.",
      approach:
        "Setiap node dibangun berlapis: primary balance, isolasi kulit, lalu look teatrikal dengan halation halus. Bayangan didorong ke violet dingin sementara highlight dipertahankan tembaga, sehingga kontras terasa filmik tanpa kehilangan detail.",
      outcome:
        "Master 4K DCI dengan black level dalam namun tetap terbaca, dilengkapi still frame untuk key art dan potongan teaser vertikal.",
      deliverables: [
        "Master ProRes 4444 XQ",
        "Teaser 16:9 & 9:16",
        "Look LUT .cube",
        "Still frames terpilih",
      ],
    },
  },
  {
    id: "putri-asing",
    index: "02",
    title: "Putri Asing",
    category: "EDITORIAL",
    client: "Independent Editorial",
    role: "Retoucher & Colorist",
    year: "2025",
    description:
      "Retouching potret editorial yang menjaga tekstur kulit, karakter subjek, dan ketenangan tone di bawah proof D65.",
    format: "4:5 · 45 MP",
    runtime: "STILL",
    status: "FINAL FRAME",
    accent: "#FB923C",
    image: "/desaind/putriasing.webp",
    focal: "center 32%",
    video: null,
    tools: ["Affinity Photo 2", "Capture One", "D65 Proof"],
    timeline: { start: 6.8, duration: 5.2 },
    titleClip: { start: 7.2, duration: 1.7 },
    caseStudy: {
      summary:
        "Pendekatan retouching yang memperkuat karakter subjek tanpa menghapus bukti bahwa ini adalah manusia.",
      brief:
        "Foto ini perlu terasa seperti cetakan editorial, bukan render. Tantangannya adalah membersihkan gangguan teknis tanpa membuat pori, bayangan halus, atau ekspresi alami ikut hilang.",
      approach:
        "Frequency separation 16-bit dipakai untuk pori dan detail halus, dilanjutkan dodge & burn selektif. Warna kulit dikalibrasi di bawah proof D65, lalu kontras ditahan tetap lembut agar hasil akhirnya tenang.",
      outcome:
        "Final frame 45 MP yang siap cetak dan konsisten ketika dipotong ke format media sosial, dengan panduan tone untuk rangkaian berikutnya.",
      deliverables: [
        "Master TIFF 16-bit",
        "Proof CMYK",
        "Crop 4:5 & 9:16",
        "Skin tone guide",
      ],
    },
  },
  {
    id: "coffee-noir",
    index: "03",
    title: "Coffee Noir",
    category: "COMMERCIAL",
    client: "Coffee Noir / Product",
    role: "Retoucher & Art Direction",
    year: "2025",
    description:
      "Seri product editorial dengan atmosfer noir hangat, dibangun dari pencahayaan studio yang terkontrol dan clean-up presisi.",
    format: "4:5 · 50 MP",
    runtime: "STILL",
    status: "DELIVERED",
    accent: "#F59E0B",
    image: "/desaind/coffe.jpg",
    focal: "center 48%",
    video: null,
    tools: ["Affinity Photo 2", "Studio Lighting", "CMYK Proof"],
    timeline: { start: 12.4, duration: 5 },
    titleClip: { start: 12.8, duration: 1.6 },
    caseStudy: {
      summary:
        "Product editorial untuk seri kopi specialty, dengan tekstur material sebagai bintang utama.",
      brief:
        "Klien menginginkan kesan premium yang tidak dingin. Saya memilih arah noir hangat: permukaan gelap, pantulan terkontrol, dan cahaya yang cukup untuk memperlihatkan tekstur tanpa terlihat seperti katalog.",
      approach:
        "Pencahayaan studio dibentuk per permukaan, lalu beberapa exposure digabung untuk mengontrol highlight. Clean-up produk dilakukan terpisah dari color grade agar retouching tidak merusak karakter material.",
      outcome:
        "Satu set visual hero dan detail yang konsisten untuk kampanye digital serta kemasan edisi terbatas.",
      deliverables: [
        "Hero image 50 MP",
        "Detail macro set",
        "Packaging crop",
        "CMYK proof",
      ],
    },
  },
  {
    id: "vogue-dusk",
    index: "04",
    title: "Vogue Dusk",
    category: "EDITORIAL",
    client: "Vogue Dusk / Fashion",
    role: "Colorist & Retoucher",
    year: "2025",
    description:
      "Arah warna senja untuk editorial fashion: netral hangat, aksen tembaga, dan saturasi rendah yang menjaga fokus pada siluet.",
    format: "4:5 · 45 MP",
    runtime: "STILL",
    status: "APPROVED",
    accent: "#C4B5FD",
    image: "/desaind/meee.webp",
    focal: "center 30%",
    video: null,
    tools: ["Affinity Photo 2", "ACEScg", "Soft Proof"],
    timeline: { start: 17.8, duration: 5.2 },
    titleClip: { start: 18.2, duration: 1.8 },
    caseStudy: {
      summary:
        "Rangkaian editorial fashion yang dibangun dari satu pertanyaan: seberapa banyak warna yang bisa dihilangkan sebelum mood-nya ikut hilang?",
      brief:
        "Seri ini memiliki material dan siluet yang kuat. Palet yang terlalu ramai akan mengalihkan perhatian, jadi arah visual diarahkan ke netral hangat dengan satu aksen tembaga yang konsisten.",
      approach:
        "Kulit dijaga pada saturasi rendah, sementara bayangan diberi sedikit kehangatan agar tidak terasa kotor. Grain halus ditambahkan setelah retouching supaya hasil akhir tidak plastis.",
      outcome:
        "Rangkaian final yang kohesif untuk spread editorial dan konten sosial, dengan tone yang stabil di berbagai layar.",
      deliverables: [
        "Editorial selects",
        "Master TIFF",
        "Social crops",
        "Tone sheet",
      ],
    },
  },
  {
    id: "frame-fifty",
    index: "05",
    title: "Frame Fifty",
    category: "KEY ART",
    client: "Frame Fifty / Identity",
    role: "Designer & Colorist",
    year: "2025",
    description:
      "Key art dan sistem grafis bernuansa brutalist, disusun di atas grid ketat dengan tipografi berkarakter dan material beton.",
    format: "4:5 · Vector + 3D",
    runtime: "STILL",
    status: "ARCHIVED",
    accent: "#FDBA74",
    image: "/desaind/Frame 50.webp",
    focal: "center 40%",
    video: null,
    tools: ["Affinity Designer 2", "Blender", "Print Spec"],
    timeline: { start: 23.4, duration: 6.2 },
    titleClip: { start: 23.8, duration: 2 },
    caseStudy: {
      summary:
        "Key art dan sistem visual yang harus tetap terbaca dari poster teater sampai thumbnail berukuran kecil.",
      brief:
        "Identitas ini berangkat dari grid, beton, dan tipografi yang hampir terlalu besar. Tantangannya adalah menjaga komposisi tetap brutal tanpa mengorbankan hierarki informasi.",
      approach:
        "Sistem dibangun dari modul grid yang sama di semua format. Tekstur material dibuat minimal, lalu color grade diarahkan ke netral hangat agar grafis tetap menjadi fokus utama.",
      outcome:
        "Key art poster, varian cover, dan panduan visual yang dapat diperluas ke format cetak maupun digital.",
      deliverables: [
        "Key art poster",
        "Cover variants",
        "Social kit",
        "Print-ready PDF/X-4",
      ],
    },
  },
];
