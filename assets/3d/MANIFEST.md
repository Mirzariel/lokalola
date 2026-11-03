# MANIFEST - model 3D web Lokalola (konsep v0.6-T)

Model TAMPILAN untuk browser (`<model-viewer>`), bukan CAD tervalidasi. Bagian dalam yang tak terlihat dipangkas dan mesh dikurangi; bentuk luar dipertahankan. Tidak ada pengaduk di digester (sesuai v0.6-T). Status: konsep, belum diuji fisik.

## Berkas
| Berkas | Isi |
|---|---|
| `lokalola.glb` | GLB Draco, 750.364 byte (±733 KB), meter, Y-atas. |
| `poster.webp` | Poster fallback 1600x900, 64.808 byte, latar #0b0c0e. |
| `MANIFEST.md` | berkas ini |

## Perintah build (satu perintah, .blend sumber hanya dibaca, tidak pernah disimpan)
```powershell
& "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" -b "C:\Users\Mirzariel\Downloads\Design Lokalola\blender\lokalola_product\lokalola_product.blend" --python "C:\Users\Mirzariel\Downloads\Design Lokalola\blender\lokalola_product\scripts\18_export_web.py"
```
Opsi setelah `--`: `--out <folder>` (bawaan `website\assets\3d`), `--report <json>`, `--no-clip`, `--keep-hidden`. Waktu ±40-60 dtk.
`poster.webp` TIDAK dibuat oleh skrip ini: dirender terpisah dari GLB hasil impor ulang (Cycles GPU OptiX via `studio.enable_gpu()`, tampak awal di bawah), lalu dikonversi ke WebP dengan PIL.

## Isi GLB (hasil baca ulang JSON glTF dan impor ulang di Blender)
- Segitiga: **213.584** (sumber: 1.239.456 pada objek koleksi PROD_*). 58 node, 52 mesh, 21 material, 3 tekstur (PNG tertanam), 1 animasi.
- Ekstensi: `KHR_draco_mesh_compression` (wajib; model-viewer memuat dekoder sendiri), `KHR_materials_transmission`, `KHR_materials_ior`.
- Material PBR (21): white_powder, white_panel, warm_grey, graphite, steel_brushed (metalik), orange, red_safety, yellow_safety, hdpe_tank, insulation, pe_black, pvc_grey, pipe_band_ochre, oil, glass / polycarbonate / polycarbonate_milky / water (transmisi, tembus), lattice_jaring (alfa BLEND), logo_lockup_terang, logo_icon (alfa BLEND). Warna = nilai Principled model (tanpa kompensasi AgX). Roughness/metalik diambil dari nilai bawaan node, sehingga variasi sikat/orange-peel prosedural hilang.
- Animasi: **`pisahkan_modul`**, 2,5 dtk (0 - 2,5 dtk, 76 sampel 30 fps), ease-in-out (kurva bezier 2 kunci = smoothstep, terukur dari impor ulang). t=0 rakitan utuh, t=2,5 terpisah. Sisa node: akar `lokalola` (menggeser jejak ke pusat, tanah y=0) lalu 5 node kelompok.
- Pusat model: jejak digeser (x -5,036; z +2,055 dalam glTF) agar pusat jejak = (0, 0, 0). Kotak batas rakitan: x -5,04..5,04, y 0..4,34, z -3,25..3,25 m. Terpisah: x -8,24..8,24, z -3,25..5,65 m.

## Pembagian skid (diverifikasi terhadap modul_bbox.json dan tag_map.csv)
| Node | Isi | Geser akhir glTF (x, y, z) |
|---|---|---|
| `skid_a_digester_modulgas_ibc` | digester DG-301, modul gas (jaring, atap, kantong biogas, RS-101), IBC, APAR-1, detektor modul gas | (-3,2, 0, 0) |
| `skid_b_stasiun_umpan_M1` | skid M1 + gantri/hopper umpan, pijakan CR-301, tanda UMPAN BASAH + logo | (0, 0, +3,0) |
| `skid_c_retort_bay_cerobong_bin` | retort, bay BX-101, cerobong, bin arang, APAR-2, tanda RETORT + ikon logo | (+3,2, 0, 0) |
| `skid_d_panel_operator` | panel PN-701 + kolom + tapak + tombol henti darurat ES-1 | (+1,6, 0, +2,4) |
| `konektor_pipa_G104` | pipa G-104 + tiang + bollard + penanda pipa | menyusut ke 1e-4 (bukan nol persis) dalam ±1,1 dtk pertama, lalu tetap |

Catatan pembagian: jejak CAD (modul_bbox.json) cocok dengan empat kelompok di atas (digester x 1,65-3,55; modul gas 0,2-3,7; stasiun umpan 3,92-5,68; retort 8,73-10,05; PN-701 8,67-8,97). Perbedaan dari kelompok CAD di tag_map.csv: perangkat listrik, gas, dan keselamatan ikut modul tempat mereka berdiri (mis. BAT-601/BC-501 ikut retort, PS-201 ikut M1, ES-1 ikut panel, APAR-1 ikut modul gas, APAR-2 ikut retort). Lengan gantri M1 menjorok ke atas corong digester secara denah; saat terpisah keduanya saling menjauh. Cek tembus: tumpang tindih segitiga antar-skid = 0 pada 12 titik waktu (0 - 100%, kurva smoothstep), termasuk keadaan awal.
Pilihan pipa penghubung: **diskalakan hampir nol** (bukan ikut skid), karena pipa 5 m itu terpasang di lapangan dan sambungannya lepas bila skid bergeser. Hasilnya tidak ada pipa melayang; bollard/tiang ikut menyusut.

## Yang dibuang atau diganti
- Dibuang: koleksi studio/lantai (STUDIO_floor, lampu, kamera), manekin ORANG_*, seluruh DIAG_* (zona 5 m, dimensi, alur 2D/3D, label, skala/teks skala BAR), studi B.* yang ditolak, tidak ada lanskap/lahan di PROD_*. Dikonfirmasi: tidak ada nama objek non-mesin pada GLB.
- Dibuang karena tak terlihat dari luar (uji sinar dari tak hingga, kaca/jaring/decal dianggap tembus, kamera di atas tanah): 64 objek / 511.280 segitiga, di antaranya flight auger RT-501 (350.798), isi tangki digester, tabung/poros/tutup auger, motor+sprocket, burner+api, pipa/pemanas dalam retort, tangki campur TK-201 dan pompa dalam M1, sensor kecil di dalam. Hanya tingkat objek (permukaan dalam objek yang terlihat tidak dipangkas).
- Diganti: 6 panel jaring prosedural -> bingkai baja (4 batang) + 1 bidang alfa dengan ubin 64 px berulang (lubang 24 mm, pitch 30 mm, fase kisi sama dengan shader asli; alfa menjadi rata-rata opasitas saat jauh). Teks TANDA.* (font) -> mesh ekstrusi 2 mm. Decal logo (UV benar, 2 segitiga) dipertahankan sebagai bidang bertekstur, ditinggikan 1,5 mm lagi (anti z-fight); tekstur diperkecil 2x. Simbol bahaya segitiga dipertahankan, ditinggikan 2 mm.
- Reduksi: remove-doubles 30 um, dissolve planar 0,8 derajat, decimate collapse dengan target 120 + 4200 x dimensi terbesar (m) segitiga/objek, shading halus sudut 30 derajat. 339 objek sumber -> 52 mesh (digabung per skid dan material; objek tetap terpisah: lihat hotspot).

## Hotspot (sistem glTF, Y-atas, meter, `x y z`; pusat kotak batas objek hasil impor ulang GLB pada t=0)
`data-position` model-viewer = sistem koordinat ini. Peta ke Blender/CAD: glTF (x, y, z) = (x_cad - 5,036, z_cad, -(y_cad - 2,055)).
theta 0 = kamera di sisi +z (sisi operator/selatan). Radius dihitung dengan fov vertikal 45 derajat (bawaan model-viewer).

| Hotspot (objek) | data-position | camera-target | camera-orbit |
|---|---|---|---|
| Digester (`digester_tangki`) | `-2.439 1.175 0.655` | `-2.439m 1.175m 0.655m` | `-20deg 80deg 6m` |
| Modul gas (`modul_gas_rangka`; kantong biogas `-2.519 1.07 -2.065`) | `-3.239 1.07 -2.045` | `-3.239m 1.07m -2.045m` | `-35deg 80deg 5.5m` |
| Stasiun umpan (`stasiun_umpan_selubung`) | `-0.236 0.645 1.308` | `-0.236m 0.645m 1.308m` | `-12deg 84deg 4.5m` |
| Retort (`retort_selubung`) | `4.357 1.12 0.155` | `4.357m 1.4m 0.155m` | `20deg 78deg 7m` |
| Cerobong (`cerobong`) | `4.907 3.095 -1.035` | `4.907m 3.095m -1.035m` | `25deg 72deg 7m` |
| Bin arang (`bin_arang`) | `4.567 0.301 1.395` | `4.567m 0.301m 1.395m` | `30deg 80deg 3.5m` |
| Panel operator (`panel_operator`) | `3.786 1.245 3.042` | `3.786m 1.245m 3.042m` | `-15deg 80deg 3m` |
| Logo M1 (`LOGO_M1_lockup`) | `0.164 0.64 1.761` | `0.164m 0.64m 1.761m` | `-12deg 86deg 2.4m` |
| **Tampak awal** (rakitan utuh) | - | `0m 1.4m 0m` | `-28deg 78deg 11m` |
| Tampak terpisah (akhir klip) | - | `0m 1.4m 0.6m` | `-28deg 78deg 17m` |

Pusat objek pada keadaan terpisah (t=2,5 dtk) = pusat t=0 + geser skid (tabel pembagian).

Contoh pemakaian:
```html
<model-viewer src="assets/3d/lokalola.glb" poster="assets/3d/poster.webp" camera-controls
  animation-name="pisahkan_modul" exposure="1.15" shadow-intensity="1"
  camera-target="0m 1.4m 0m" camera-orbit="-28deg 78deg 11m" max-camera-orbit="auto 100deg auto"></model-viewer>
```
Klip: `mv.pause(); mv.currentTime = t` (0 - 2,5) untuk scrub sesuai gulir. `max-camera-orbit` phi <= 100 derajat dianjurkan: sisi bawah tidak dipangkas, tetapi pemeriksaan keterlihatan hanya dari kamera di atas tanah.

## Verifikasi yang dijalankan
- GLB diimpor ulang di Blender 5.2 bersih (headless, proses terpisah, tanpa simpan) dan dirender EEVEE dari tampak awal, terpisah, tengah klip, belakang, timur, dan close-up digester, modul gas (jaring), stasiun umpan + logo, retort + ikon logo, bin, cerobong, panel. Dilihat: tidak ada bagian hilang, tidak ada normal terbalik yang tampak, tidak ada lantai/diagram, logo terbaca, jaring terbaca tembus, kaca tidak hitam.
- Poster dirender Cycles GPU (OptiX) dari GLB impor ulang; latar piksel sudut terukur (12, 11, 14) vs #0b0c0e = (11, 12, 14) (selisih WebP lossy, +-1 per kanal).

## Cacat tersisa dan yang TIDAK dijalankan
- **model-viewer di peramban tidak diuji** (NOT RUN): percobaan memuat halaman uji lokal di panel peramban gagal (mendapat 404 dari server lain di port itu). Transmisi kaca, urutan alfa BLEND (jaring/logo/kaca saling tumpang pada sudut miring), `exposure` dan perilaku `camera-target` dalam koordinat model hanya diverifikasi lewat Blender, bukan viewer.
- Putih (sRGB ±0,80-0,85 pada model) tampil abu terang pada pencahayaan netral model-viewer; `exposure` 1,15 hanya saran, belum diuji. Kubah digester tampak krem (material HDPE model 0,88 sRGB).
- Kaca IBC tampak hampir buram biru muda di pratinjau EEVEE (transmisi layar-ruang); tembusnya di model-viewer belum terlihat.
- Variasi permukaan prosedural (sikat baja, orange-peel, bevel shader) tidak ikut; tepi tajam kini hanya dari geometri.
- Bagian dalam objek yang terlihat tidak dipangkas (hanya objek utuh yang tak terlihat dibuang); cakupan sinar adalah sampel acak (160 segitiga/objek), bukan bukti 100% bahwa tidak ada objek kecil yang terbuang padahal terlihat dari celah sempit.
- Gantri umpan M1 dan corong digester terpisah saat klip jalan (memang sambungan lapangan); pipa G-104 hilang selama klip.
- Teks kecil (50-110 mm) dan decal dapat berkedip pada jarak jauh.
- Ini bukan CAD tervalidasi; jangan dipakai untuk klaim kinerja, keselamatan, atau harga.
