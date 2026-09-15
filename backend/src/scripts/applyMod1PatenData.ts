import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ALL_MOD1_DATA = [
  {
    "character": "試",
    "id": 3212,
    "baseMeaning": "mencoba atau menguji sesuatu untuk mengetahui hasil, kemampuan, kualitas, fungsi, atau kecocokannya.",
    "categories": [
      {
        "title": "Aktivitas Pengujian",
        "description": "Kelompok ini menunjukkan makna yang berkaitan dengan kegiatan menguji kemampuan, pengetahuan, atau kelayakan melalui ujian maupun pertanyaan. Seperti terdapat pada jukugo berikut ini:",
        "jukugos": [
          {
            "word": "試験",
            "reading": "しけん",
            "meaning": "ujian",
            "penjelasan": "Hubungan makna antar kanji 試 dan 験 menjadi 試験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan menguji untuk mengetahui atau membuktikan kemampuan, pengetahuan, atau hasil tertentu.”",
            "nodes": [
              {
                "jokugo": "試",
                "arti": "mencoba, menguji"
              },
              {
                "jokugo": "験",
                "arti": "menguji, membuktikan melalui pengalaman atau pengujian"
              }
            ]
          },
          {
            "word": "入試",
            "reading": "にゅうし",
            "meaning": "ujian masuk",
            "penjelasan": "Hubungan makna antar kanji 入 dan 試 menjadi 入試, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ujian yang dilakukan untuk menentukan apakah seseorang dapat masuk ke sekolah, universitas, atau lembaga tertentu.”",
            "nodes": [
              {
                "jokugo": "入",
                "arti": "masuk, memasuki"
              },
              {
                "jokugo": "試",
                "arti": "mencoba, menguji"
              }
            ]
          },
          {
            "word": "追試",
            "reading": "ついし",
            "meaning": "ujian susulan",
            "penjelasan": "Hubungan makna antar kanji 追 dan 試 menjadi 追試, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ujian tambahan atau ujian susulan yang dilakukan setelah ujian utama.”",
            "nodes": [
              {
                "jokugo": "追",
                "arti": "mengikuti, menyusul, menambahkan"
              },
              {
                "jokugo": "試",
                "arti": "ujian, pengujian"
              }
            ]
          },
          {
            "word": "試問",
            "reading": "しもん",
            "meaning": "ujian lisan / pengujian melalui pertanyaan",
            "penjelasan": "Hubungan makna antar kanji 試 dan 問 menjadi 試問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengujian yang dilakukan dengan memberikan pertanyaan untuk mengetahui kemampuan atau pengetahuan seseorang.”",
            "nodes": [
              {
                "jokugo": "試",
                "arti": "mencoba, menguji"
              },
              {
                "jokugo": "問",
                "arti": "bertanya, pertanyaan"
              }
            ]
          }
        ]
      },
      {
        "title": "Penggunaan",
        "description": "Kelompok ini menunjukkan makna yang berkaitan dengan mencoba menggunakan, mengenakan, atau menaiki sesuatu untuk mengetahui fungsi, kenyamanan, atau kecocokannya. Seperti terdapat pada jukugo berikut ini:",
        "jukugos": [
          {
            "word": "試着",
            "reading": "しちゃく",
            "meaning": "coba pakaian",
            "penjelasan": "Hubungan makna antar kanji 試 dan 着 menjadi 試着, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba mengenakan pakaian untuk mengetahui ukuran, penampilan, atau kecocokannya.”",
            "nodes": [
              {
                "jokugo": "試",
                "arti": "mencoba, menguji"
              },
              {
                "jokugo": "着",
                "arti": "memakai, mengenakan"
              }
            ]
          },
          {
            "word": "試用",
            "reading": "しよう",
            "meaning": "uji coba",
            "penjelasan": "Hubungan makna antar kanji 試 dan 用 menjadi 試用, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba menggunakan sesuatu untuk mengetahui fungsi, kualitas, atau kesesuaiannya.”",
            "nodes": [
              {
                "jokugo": "試",
                "arti": "mencoba, menguji"
              },
              {
                "jokugo": "用",
                "arti": "menggunakan, memakai"
              }
            ]
          },
          {
            "word": "試乗",
            "reading": "しじょう",
            "meaning": "test drive / coba kendaraan",
            "penjelasan": "Hubungan makna antar kanji 試 dan 乗 menjadi 試乗, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba menaiki atau mengendarai kendaraan untuk mengetahui kondisi, kenyamanan, atau performanya.”",
            "nodes": [
              {
                "jokugo": "試",
                "arti": "mencoba, menguji"
              },
              {
                "jokugo": "乗",
                "arti": "menaiki, mengendarai"
              }
            ]
          }
        ]
      },
      {
        "title": "Konsumsi",
        "description": "Kelompok ini menunjukkan makna yang berkaitan dengan mencoba makanan atau minuman melalui kegiatan mencicipi untuk mengetahui rasa atau kualitasnya. Seperti terdapat pada jukugo berikut ini:",
        "jukugos": [
          {
            "word": "試食",
            "reading": "ししょく",
            "meaning": "uji rasa / mencicipi makanan",
            "penjelasan": "Hubungan makna antar kanji 試 dan 食 menjadi 試食, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba atau mencicipi makanan untuk mengetahui rasa atau kualitasnya.”",
            "nodes": [
              {
                "jokugo": "試",
                "arti": "mencoba, menguji"
              },
              {
                "jokugo": "食",
                "arti": "makan, makanan"
              }
            ]
          },
          {
            "word": "試飲",
            "reading": "しいん",
            "meaning": "coba minuman",
            "penjelasan": "Hubungan makna antar kanji 試 dan 飲 menjadi 試飲, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba atau mencicipi minuman untuk mengetahui rasa atau kualitasnya.”",
            "nodes": [
              {
                "jokugo": "試",
                "arti": "mencoba, menguji"
              },
              {
                "jokugo": "飲",
                "arti": "minum"
              }
            ]
          }
        ]
      },
      {
        "title": "Bahan Pengujian",
        "description": "Kelompok ini menunjukkan makna yang berkaitan dengan bahan yang digunakan dalam proses pemeriksaan atau pengujian. Seperti terdapat pada jukugo berikut ini:",
        "jukugos": [
          {
            "word": "試薬",
            "reading": "しやく",
            "meaning": "reagen uji / bahan uji",
            "penjelasan": "Hubungan makna antar kanji 試 dan 薬 menjadi 試薬, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bahan kimia atau reagen yang digunakan untuk melakukan suatu pengujian.”",
            "nodes": [
              {
                "jokugo": "試",
                "arti": "mencoba, menguji"
              },
              {
                "jokugo": "薬",
                "arti": "obat, bahan kimia"
              }
            ]
          }
        ]
      },
      {
        "title": "Produksi dan Pengembangan",
        "description": "Kelompok ini menunjukkan makna yang berkaitan dengan membuat atau memproduksi sesuatu secara percobaan untuk mengetahui hasil, fungsi, atau kualitasnya sebelum dikembangkan lebih lanjut. Seperti terdapat pada jukugo berikut ini:",
        "jukugos": [
          {
            "word": "試作",
            "reading": "しさく",
            "meaning": "prototipe / pembuatan percobaan",
            "penjelasan": "Hubungan makna antar kanji 試 dan 作 menjadi 試作, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba membuat suatu benda atau produk sebagai percobaan untuk menilai bentuk, fungsi, atau kualitasnya.”",
            "nodes": [
              {
                "jokugo": "試",
                "arti": "mencoba, menguji"
              },
              {
                "jokugo": "作",
                "arti": "membuat, menghasilkan"
              }
            ]
          },
          {
            "word": "試製",
            "reading": "しせい",
            "meaning": "produksi uji / pembuatan percobaan",
            "penjelasan": "Hubungan makna antar kanji 試 dan 製 menjadi 試製, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “membuat atau memproduksi sesuatu secara percobaan untuk menguji hasilnya sebelum produksi sebenarnya.”",
            "nodes": [
              {
                "jokugo": "試",
                "arti": "mencoba, menguji"
              },
              {
                "jokugo": "製",
                "arti": "membuat, memproduksi"
              }
            ]
          }
        ]
      },
      {
        "title": "Kompetisi dan Keterampilan",
        "description": "Kelompok ini menunjukkan makna yang berkaitan dengan pengujian atau pembandingan kemampuan dan keterampilan melalui pertandingan maupun pelaksanaan suatu teknik. Seperti terdapat pada jukugo berikut ini:",
        "jukugos": [
          {
            "word": "試合",
            "reading": "しあい",
            "meaning": "pertandingan",
            "penjelasan": "Hubungan makna antar kanji 試 dan 合 menjadi 試合, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan mempertemukan dua pihak untuk menguji atau membandingkan kemampuan dalam suatu pertandingan.”",
            "nodes": [
              {
                "jokugo": "試",
                "arti": "mencoba, menguji"
              },
              {
                "jokugo": "合",
                "arti": "bertemu, berhadapan"
              }
            ]
          },
          {
            "word": "試技",
            "reading": "しぎ",
            "meaning": "uji keterampilan",
            "penjelasan": "Hubungan makna antar kanji 試 dan 技 menjadi 試技, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pelaksanaan atau percobaan suatu teknik untuk menunjukkan atau menguji keterampilan.”",
            "nodes": [
              {
                "jokugo": "試",
                "arti": "mencoba, menguji"
              },
              {
                "jokugo": "技",
                "arti": "keterampilan, teknik"
              }
            ]
          }
        ]
      },
      {
        "title": "Media",
        "description": "Kelompok ini menunjukkan makna yang berkaitan dengan mencoba melihat, mendengarkan, atau membaca suatu karya atau media sebelum dinikmati atau digunakan lebih lanjut. Seperti terdapat pada jukugo berikut ini:",
        "jukugos": [
          {
            "word": "試写",
            "reading": "ししゃ",
            "meaning": "pratinjau film / pemutaran uji",
            "penjelasan": "Hubungan makna antar kanji 試 dan 写 menjadi 試写, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menayangkan atau melihat film sebagai percobaan sebelum ditampilkan secara umum.”",
            "nodes": [
              {
                "jokugo": "試",
                "arti": "mencoba, menguji"
              },
              {
                "jokugo": "写",
                "arti": "memotret, menyalin, menayangkan gambar"
              }
            ]
          },
          {
            "word": "試聴",
            "reading": "しちょう",
            "meaning": "mendengar contoh / mencoba mendengarkan",
            "penjelasan": "Hubungan makna antar kanji 試 dan 聴 menjadi 試聴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba mendengarkan musik, rekaman, atau media suara untuk mengetahui isi atau kualitasnya.”",
            "nodes": [
              {
                "jokugo": "試",
                "arti": "mencoba, menguji"
              },
              {
                "jokugo": "聴",
                "arti": "mendengarkan"
              }
            ]
          },
          {
            "word": "試読",
            "reading": "しどく",
            "meaning": "membaca contoh / mencoba membaca",
            "penjelasan": "Hubungan makna antar kanji 試 dan 読 menjadi 試読, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba membaca suatu tulisan atau karya untuk mengetahui isi atau kualitasnya sebelum membaca lebih lanjut.”",
            "nodes": [
              {
                "jokugo": "試",
                "arti": "mencoba, menguji"
              },
              {
                "jokugo": "読",
                "arti": "membaca"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "character": "験",
    "id": 3213,
    "baseMeaning": "pengalaman, pengujian, atau verifikasi.",
    "categories": [
      {
        "title": "Pengujian / Pembuktian",
        "description": "Kelompok ini menunjukkan makna yang berkaitan dengan kegiatan menguji, menjalani pengujian, atau membuktikan sesuatu melalui percobaan.",
        "jukugos": [
          {
            "word": "試験",
            "reading": "しけん",
            "meaning": "ujian / pengujian",
            "penjelasan": "Hubungan makna antar kanji 試 dan 験 menjadi 試験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “suatu kegiatan pengujian yang dilakukan untuk mengetahui atau mengukur pengetahuan, kemampuan, maupun hasil seseorang atau sesuatu”, sehingga mengandung makna ujian atau pengujian.",
            "nodes": [
              {
                "jokugo": "試",
                "arti": "mencoba, menguji"
              },
              {
                "jokugo": "験",
                "arti": "menguji, memverifikasi hasil"
              }
            ]
          },
          {
            "word": "受験",
            "reading": "じゅけん",
            "meaning": "mengikuti ujian",
            "penjelasan": "Hubungan makna antar kanji 受 dan 験 menjadi 受験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menjalani atau mengikuti suatu proses pengujian”, sehingga mengandung makna mengikuti ujian.",
            "nodes": [
              {
                "jokugo": "受",
                "arti": "menerima, menjalani"
              },
              {
                "jokugo": "験",
                "arti": "ujian, pengujian"
              }
            ]
          },
          {
            "word": "実験",
            "reading": "じっけん",
            "meaning": "eksperimen / percobaan",
            "penjelasan": "Hubungan makna antar kanji 実 dan 験 menjadi 実験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melakukan pengujian atau percobaan secara nyata untuk mengetahui dan membuktikan suatu hasil”, sehingga mengandung makna eksperimen atau percobaan.",
            "nodes": [
              {
                "jokugo": "実",
                "arti": "nyata, sebenarnya"
              },
              {
                "jokugo": "験",
                "arti": "menguji, membuktikan"
              }
            ]
          },
          {
            "word": "治験",
            "reading": "ちけん",
            "meaning": "uji klinis",
            "penjelasan": "Hubungan makna antar kanji 治 dan 験 menjadi 治験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengujian yang dilakukan dalam bidang pengobatan untuk mengetahui dan memastikan efektivitas serta keamanan suatu obat atau metode pengobatan”, sehingga mengandung makna uji klinis.",
            "nodes": [
              {
                "jokugo": "治",
                "arti": "mengobati, pengobatan"
              },
              {
                "jokugo": "験",
                "arti": "menguji, memverifikasi"
              }
            ]
          }
        ]
      },
      {
        "title": "Pengalaman",
        "description": "Kelompok ini menunjukkan makna yang berkaitan dengan sesuatu yang dialami atau dijalani secara langsung sehingga seseorang memperoleh pengetahuan atau pemahaman.",
        "jukugos": [
          {
            "word": "経験",
            "reading": "けいけん",
            "meaning": "pengalaman",
            "penjelasan": "Hubungan makna antar kanji 経 dan 験 menjadi 経験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sesuatu yang dilalui atau dijalani sehingga seseorang memperoleh pengetahuan atau pemahaman dari apa yang dialaminya”, sehingga mengandung makna pengalaman.",
            "nodes": [
              {
                "jokugo": "経",
                "arti": "melalui, menjalani"
              },
              {
                "jokugo": "験",
                "arti": "mengalami, memperoleh pengetahuan melalui pengalaman"
              }
            ]
          },
          {
            "word": "体験",
            "reading": "たいけん",
            "meaning": "pengalaman langsung",
            "penjelasan": "Hubungan makna antar kanji 体 dan 験 menjadi 体験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengalami sendiri suatu peristiwa atau kegiatan secara langsung”, sehingga mengandung makna pengalaman langsung.",
            "nodes": [
              {
                "jokugo": "体",
                "arti": "tubuh, diri sendiri"
              },
              {
                "jokugo": "験",
                "arti": "mengalami"
              }
            ]
          }
        ]
      },
      {
        "title": "Verifikasi / Pemeriksaan",
        "description": "Kelompok ini menunjukkan makna yang berkaitan dengan kegiatan memeriksa kembali untuk memastikan kebenaran suatu hasil.",
        "jukugos": [
          {
            "word": "験算",
            "reading": "けんざん",
            "meaning": "pemeriksaan ulang perhitungan",
            "penjelasan": "Hubungan makna antar kanji 験 dan 算 menjadi 験算, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memeriksa atau menghitung kembali suatu perhitungan untuk memastikan bahwa hasilnya benar”, sehingga mengandung makna pemeriksaan ulang perhitungan.",
            "nodes": [
              {
                "jokugo": "験",
                "arti": "memeriksa, memverifikasi"
              },
              {
                "jokugo": "算",
                "arti": "menghitung, perhitungan"
              }
            ]
          }
        ]
      },
      {
        "title": "Hasil / Efek / Bukti",
        "description": "Kelompok ini menunjukkan makna yang berkaitan dengan hasil atau efek yang tampak dan dapat menjadi tanda atau bukti dari suatu proses.",
        "jukugos": [
          {
            "word": "効験",
            "reading": "こうけん",
            "meaning": "efek / khasiat",
            "penjelasan": "Hubungan makna antar kanji 効 dan 験 menjadi 効験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “hasil atau efek yang tampak sebagai tanda bahwa sesuatu bekerja atau memberikan hasil”, sehingga mengandung makna efek atau khasiat.",
            "nodes": [
              {
                "jokugo": "効",
                "arti": "efek, khasiat"
              },
              {
                "jokugo": "験",
                "arti": "hasil, tanda, bukti"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "character": "問",
    "id": 3214,
    "baseMeaning": "bertanya, menanyakan, mempertanyakan, atau mempermasalahkan sesuatu; dalam makna perluasannya juga dapat menunjukkan tindakan mengunjungi atau menengok.",
    "categories": [
      {
        "title": "Bertanya / Mengajukan Pertanyaan",
        "description": "Kelompok ini berkaitan dengan kegiatan bertanya atau mengajukan pertanyaan kepada orang lain maupun kepada diri sendiri. Kanji 問 menunjukkan makna “bertanya atau menanyakan”. Seperti terdapat dalam jukugo berikut ini:",
        "jukugos": [
          {
            "word": "質問",
            "reading": "しつもん",
            "meaning": "pertanyaan",
            "penjelasan": "Hubungan makna antar kanji 質 dan 問 menjadi 質問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pertanyaan yang diajukan untuk memperoleh informasi atau penjelasan mengenai sesuatu.”",
            "nodes": [
              {
                "jokugo": "質",
                "arti": "menanyakan, mencari kepastian"
              },
              {
                "jokugo": "問",
                "arti": "bertanya, menanyakan"
              }
            ]
          },
          {
            "word": "自問",
            "reading": "じもん",
            "meaning": "bertanya pada diri sendiri",
            "penjelasan": "Hubungan makna antar kanji 自 dan 問 menjadi 自問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bertanya atau mempertanyakan sesuatu kepada diri sendiri.”",
            "nodes": [
              {
                "jokugo": "自",
                "arti": "diri sendiri"
              },
              {
                "jokugo": "問",
                "arti": "bertanya, menanyakan"
              }
            ]
          },
          {
            "word": "発問",
            "reading": "はつもん",
            "meaning": "mengajukan pertanyaan",
            "penjelasan": "Hubungan makna antar kanji 発 dan 問 menjadi 発問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengemukakan atau mengajukan suatu pertanyaan kepada orang lain.”",
            "nodes": [
              {
                "jokugo": "発",
                "arti": "mengeluarkan, mengemukakan"
              },
              {
                "jokugo": "問",
                "arti": "bertanya, pertanyaan"
              }
            ]
          },
          {
            "word": "反問",
            "reading": "はんもん",
            "meaning": "pertanyaan balik",
            "penjelasan": "Hubungan makna antar kanji 反 dan 問 menjadi 反問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengajukan pertanyaan kembali sebagai tanggapan terhadap pertanyaan yang diterima.”",
            "nodes": [
              {
                "jokugo": "反",
                "arti": "berbalik, kembali"
              },
              {
                "jokugo": "問",
                "arti": "bertanya, pertanyaan"
              }
            ]
          }
        ]
      },
      {
        "title": "Tanya Jawab",
        "description": "Kelompok ini berkaitan dengan kegiatan bertanya dan memberikan jawaban. Kanji 問 menunjukkan makna “bertanya”, sedangkan pasangannya menunjukkan tindakan menjawab. Seperti terdapat dalam jukugo berikut ini:",
        "jukugos": [
          {
            "word": "問答",
            "reading": "もんどう",
            "meaning": "tanya jawab",
            "penjelasan": "Hubungan makna antar kanji 問 dan 答 menjadi 問答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan saling bertanya dan menjawab mengenai suatu hal.”",
            "nodes": [
              {
                "jokugo": "問",
                "arti": "bertanya, pertanyaan"
              },
              {
                "jokugo": "答",
                "arti": "menjawab, jawaban"
              }
            ]
          }
        ]
      },
      {
        "title": "Soal / Pertanyaan",
        "description": "Kelompok ini berkaitan dengan sesuatu yang menjadi pertanyaan, soal, atau masalah yang perlu dijawab maupun diselesaikan. Kanji 問 menunjukkan makna “pertanyaan atau sesuatu yang dipermasalahkan”. Seperti terdapat dalam jukugo berikut ini:",
        "jukugos": [
          {
            "word": "問題",
            "reading": "もんだい",
            "meaning": "masalah",
            "penjelasan": "Hubungan makna antar kanji 問 dan 題 menjadi 問題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “suatu hal yang menjadi persoalan atau masalah yang perlu dipikirkan dan diselesaikan.”",
            "nodes": [
              {
                "jokugo": "問",
                "arti": "pertanyaan, masalah"
              },
              {
                "jokugo": "題",
                "arti": "topik, pokok persoalan"
              }
            ]
          },
          {
            "word": "設問",
            "reading": "せつもん",
            "meaning": "pertanyaan",
            "penjelasan": "Hubungan makna antar kanji 設 dan 問 menjadi 設問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pertanyaan atau soal yang disusun dan diberikan untuk dijawab.”",
            "nodes": [
              {
                "jokugo": "設",
                "arti": "menyusun, menetapkan"
              },
              {
                "jokugo": "問",
                "arti": "pertanyaan, soal"
              }
            ]
          },
          {
            "word": "試問",
            "reading": "しもん",
            "meaning": "ujian lisan",
            "penjelasan": "Hubungan makna antar kanji 試 dan 問 menjadi 試問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengujian yang dilakukan dengan memberikan pertanyaan kepada seseorang”, sehingga mengandung makna ujian lisan.",
            "nodes": [
              {
                "jokugo": "試",
                "arti": "mencoba, menguji"
              },
              {
                "jokugo": "問",
                "arti": "bertanya, pertanyaan"
              }
            ]
          },
          {
            "word": "難問",
            "reading": "なんもん",
            "meaning": "pertanyaan sulit",
            "penjelasan": "Hubungan makna antar kanji 難 dan 問 menjadi 難問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pertanyaan atau soal yang sulit untuk dijawab atau diselesaikan.”",
            "nodes": [
              {
                "jokugo": "難",
                "arti": "sulit, kesulitan"
              },
              {
                "jokugo": "問",
                "arti": "pertanyaan, soal"
              }
            ]
          }
        ]
      },
      {
        "title": "Pemeriksaan dengan Pertanyaan",
        "description": "Kelompok ini berkaitan dengan kegiatan memeriksa atau memastikan sesuatu melalui pertanyaan maupun pengecekan. Kanji 問 menunjukkan makna “menanyakan”. Seperti terdapat dalam jukugo berikut ini:",
        "jukugos": [
          {
            "word": "問診",
            "reading": "もんしん",
            "meaning": "wawancara medis",
            "penjelasan": "Hubungan makna antar kanji 問 dan 診 menjadi 問診, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menanyakan kondisi atau gejala seseorang untuk keperluan pemeriksaan dan diagnosis medis.”",
            "nodes": [
              {
                "jokugo": "問",
                "arti": "bertanya, menanyakan"
              },
              {
                "jokugo": "診",
                "arti": "memeriksa, mendiagnosis"
              }
            ]
          },
          {
            "word": "検問",
            "reading": "けんもん",
            "meaning": "pemeriksaan",
            "penjelasan": "Hubungan makna antar kanji 検 dan 問 menjadi 検問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melakukan pemeriksaan atau pengecekan terhadap seseorang atau sesuatu, termasuk dengan menanyakan keterangan.”",
            "nodes": [
              {
                "jokugo": "検",
                "arti": "memeriksa, mengecek"
              },
              {
                "jokugo": "問",
                "arti": "bertanya, menanyakan"
              }
            ]
          }
        ]
      },
      {
        "title": "Mempertanyakan / Meminta Pertanggungjawaban",
        "description": "Kelompok ini berkaitan dengan kegiatan mempertanyakan, mempermasalahkan, atau meminta pertanggungjawaban mengenai suatu hal. Kanji 問 menunjukkan makna “mempertanyakan atau mempermasalahkan”. Seperti terdapat dalam jukugo berikut ini:",
        "jukugos": [
          {
            "word": "問責",
            "reading": "もんせき",
            "meaning": "meminta pertanggungjawaban",
            "penjelasan": "Hubungan makna antar kanji 問 dan 責 menjadi 問責, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mempertanyakan dan meminta seseorang bertanggung jawab atas suatu tindakan atau keadaan.”",
            "nodes": [
              {
                "jokugo": "問",
                "arti": "mempertanyakan, meminta penjelasan"
              },
              {
                "jokugo": "責",
                "arti": "tanggung jawab, kewajiban"
              }
            ]
          },
          {
            "word": "不問",
            "reading": "ふもん",
            "meaning": "tidak dipermasalahkan",
            "penjelasan": "Hubungan makna antar kanji 不 dan 問 menjadi 不問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tidak mempertanyakan atau tidak mempermasalahkan suatu hal.”",
            "nodes": [
              {
                "jokugo": "不",
                "arti": "tidak"
              },
              {
                "jokugo": "問",
                "arti": "mempertanyakan, mempermasalahkan"
              }
            ]
          }
        ]
      },
      {
        "title": "Mengunjungi",
        "description": "Kelompok ini menunjukkan perluasan makna kanji 問 yang berkaitan dengan tindakan mengunjungi atau menengok seseorang maupun suatu tempat. Seperti terdapat dalam jukugo berikut ini:",
        "jukugos": [
          {
            "word": "訪問",
            "reading": "ほうもん",
            "meaning": "kunjungan",
            "penjelasan": "Hubungan makna antar kanji 訪 dan 問 menjadi 訪問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan mendatangi atau mengunjungi seseorang maupun suatu tempat.”",
            "nodes": [
              {
                "jokugo": "訪",
                "arti": "mengunjungi, mendatangi"
              },
              {
                "jokugo": "問",
                "arti": "mengunjungi, menengok"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "character": "題",
    "id": 3215,
    "baseMeaning": "soal atau hal yang perlu diselesaikan; topik, tema, atau judul yang menunjukkan pokok suatu hal.",
    "categories": [
      {
        "title": "Soal/Tugas/Masalah",
        "description": "Kelompok ini menunjukkan makna yang berkaitan dengan soal, tugas, atau persoalan yang perlu diberikan, dikerjakan, dijawab, maupun diselesaikan. Seperti terdapat dalam jukugo berikut ini:",
        "jukugos": [
          {
            "word": "問題",
            "reading": "もんだい",
            "meaning": "masalah / soal",
            "penjelasan": "Hubungan makna antar kanji 問 dan 題 menjadi 問題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “soal yang menuntut jawaban atau persoalan yang perlu dipikirkan dan diselesaikan.”",
            "nodes": [
              {
                "jokugo": "問",
                "arti": "bertanya, menanyakan"
              },
              {
                "jokugo": "題",
                "arti": "soal, persoalan"
              }
            ]
          },
          {
            "word": "課題",
            "reading": "かだい",
            "meaning": "tugas / persoalan",
            "penjelasan": "Hubungan makna antar kanji 課 dan 題 menjadi 課題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tugas atau persoalan yang diberikan untuk dikerjakan atau diselesaikan.”",
            "nodes": [
              {
                "jokugo": "課",
                "arti": "memberikan atau membebankan tugas"
              },
              {
                "jokugo": "題",
                "arti": "soal, persoalan"
              }
            ]
          },
          {
            "word": "宿題",
            "reading": "しゅくだい",
            "meaning": "pekerjaan rumah",
            "penjelasan": "Hubungan makna antar kanji 宿 dan 題 menjadi 宿題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tugas yang dibawa pulang untuk dikerjakan di luar waktu pembelajaran.”",
            "nodes": [
              {
                "jokugo": "宿",
                "arti": "tempat menginap; bermalam"
              },
              {
                "jokugo": "題",
                "arti": "soal, tugas"
              }
            ]
          },
          {
            "word": "出題",
            "reading": "しゅつだい",
            "meaning": "pemberian soal / membuat soal",
            "penjelasan": "Hubungan makna antar kanji 出 dan 題 menjadi 出題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengeluarkan atau memberikan soal untuk dijawab.”",
            "nodes": [
              {
                "jokugo": "出",
                "arti": "mengeluarkan, memberikan"
              },
              {
                "jokugo": "題",
                "arti": "soal, pertanyaan"
              }
            ]
          },
          {
            "word": "例題",
            "reading": "れいだい",
            "meaning": "contoh soal",
            "penjelasan": "Hubungan makna antar kanji 例 dan 題 menjadi 例題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “soal yang digunakan sebagai contoh.”",
            "nodes": [
              {
                "jokugo": "例",
                "arti": "contoh"
              },
              {
                "jokugo": "題",
                "arti": "soal, pertanyaan"
              }
            ]
          },
          {
            "word": "難題",
            "reading": "なんだい",
            "meaning": "masalah sulit",
            "penjelasan": "Hubungan makna antar kanji 難 dan 題 menjadi 難題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “persoalan atau masalah yang sulit untuk dijawab atau diselesaikan.”",
            "nodes": [
              {
                "jokugo": "難",
                "arti": "sulit, sukar"
              },
              {
                "jokugo": "題",
                "arti": "soal, persoalan"
              }
            ]
          }
        ]
      },
      {
        "title": "Tema/Topik",
        "description": "Kelompok ini menunjukkan makna yang berkaitan dengan pokok atau hal yang menjadi pusat pembicaraan, pemikiran, pembahasan, maupun diskusi. Seperti terdapat dalam jukugo berikut ini:",
        "jukugos": [
          {
            "word": "主題",
            "reading": "しゅだい",
            "meaning": "tema utama",
            "penjelasan": "Hubungan makna antar kanji 主 dan 題 menjadi 主題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tema atau pokok utama yang menjadi pusat suatu pembahasan atau karya.”",
            "nodes": [
              {
                "jokugo": "主",
                "arti": "utama, pokok"
              },
              {
                "jokugo": "題",
                "arti": "tema, topik"
              }
            ]
          },
          {
            "word": "話題",
            "reading": "わだい",
            "meaning": "topik pembicaraan",
            "penjelasan": "Hubungan makna antar kanji 話 dan 題 menjadi 話題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “topik atau pokok yang menjadi bahan pembicaraan.”",
            "nodes": [
              {
                "jokugo": "話",
                "arti": "berbicara, pembicaraan"
              },
              {
                "jokugo": "題",
                "arti": "topik, pokok"
              }
            ]
          },
          {
            "word": "論題",
            "reading": "ろんだい",
            "meaning": "topik pembahasan / perdebatan",
            "penjelasan": "Hubungan makna antar kanji 論 dan 題 menjadi 論題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tema atau topik yang menjadi bahan pembahasan, argumentasi, atau perdebatan.”",
            "nodes": [
              {
                "jokugo": "論",
                "arti": "membahas, berargumentasi"
              },
              {
                "jokugo": "題",
                "arti": "tema, topik"
              }
            ]
          },
          {
            "word": "議題",
            "reading": "ぎだい",
            "meaning": "agenda / topik pembahasan",
            "penjelasan": "Hubungan makna antar kanji 議 dan 題 menjadi 議題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “topik atau persoalan yang diajukan untuk dibahas dalam suatu pertemuan atau rapat.”",
            "nodes": [
              {
                "jokugo": "議",
                "arti": "membahas, berunding"
              },
              {
                "jokugo": "題",
                "arti": "topik, persoalan"
              }
            ]
          }
        ]
      },
      {
        "title": "Judul",
        "description": "Kelompok ini menunjukkan makna yang berkaitan dengan judul, penamaan, atau tulisan yang menunjukkan isi suatu karya, tulisan, maupun presentasi. Seperti terdapat dalam jukugo berikut ini:",
        "jukugos": [
          {
            "word": "題名",
            "reading": "だいめい",
            "meaning": "judul",
            "penjelasan": "Hubungan makna antar kanji 題 dan 名 menjadi 題名, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “nama atau judul yang diberikan pada suatu karya atau tulisan.”",
            "nodes": [
              {
                "jokugo": "題",
                "arti": "judul"
              },
              {
                "jokugo": "名",
                "arti": "nama"
              }
            ]
          },
          {
            "word": "表題",
            "reading": "ひょうだい",
            "meaning": "judul",
            "penjelasan": "Hubungan makna antar kanji 表 dan 題 menjadi 表題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “judul yang ditampilkan sebagai penanda isi suatu karya atau tulisan.”",
            "nodes": [
              {
                "jokugo": "表",
                "arti": "permukaan, menampilkan"
              },
              {
                "jokugo": "題",
                "arti": "judul"
              }
            ]
          },
          {
            "word": "副題",
            "reading": "ふくだい",
            "meaning": "subjudul",
            "penjelasan": "Hubungan makna antar kanji 副 dan 題 menjadi 副題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “judul tambahan yang melengkapi judul utama.”",
            "nodes": [
              {
                "jokugo": "副",
                "arti": "tambahan, sekunder"
              },
              {
                "jokugo": "題",
                "arti": "judul"
              }
            ]
          },
          {
            "word": "演題",
            "reading": "えんだい",
            "meaning": "judul / topik presentasi",
            "penjelasan": "Hubungan makna antar kanji 演 dan 題 menjadi 演題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “judul atau topik yang disampaikan dalam ceramah, pidato, atau presentasi.”",
            "nodes": [
              {
                "jokugo": "演",
                "arti": "menyampaikan, mempertunjukkan"
              },
              {
                "jokugo": "題",
                "arti": "judul, topik"
              }
            ]
          },
          {
            "word": "題字",
            "reading": "だいじ",
            "meaning": "tulisan judul",
            "penjelasan": "Hubungan makna antar kanji 題 dan 字 menjadi 題字, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “huruf atau tulisan yang digunakan sebagai judul.”",
            "nodes": [
              {
                "jokugo": "題",
                "arti": "judul"
              },
              {
                "jokugo": "字",
                "arti": "huruf, tulisan"
              }
            ]
          }
        ]
      },
      {
        "title": "Bahan/Tema karya",
        "description": "Kelompok ini menunjukkan makna yang berkaitan dengan bahan, pokok, atau tema yang digunakan sebagai dasar untuk menghasilkan suatu karya. Seperti terdapat dalam jukugo berikut ini:",
        "jukugos": [
          {
            "word": "題材",
            "reading": "だいざい",
            "meaning": "bahan / tema karya",
            "penjelasan": "Hubungan makna antar kanji 題 dan 材 menjadi 題材, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bahan atau tema yang dijadikan dasar untuk membuat suatu karya.”",
            "nodes": [
              {
                "jokugo": "題",
                "arti": "tema, pokok"
              },
              {
                "jokugo": "材",
                "arti": "bahan, material"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "character": "答",
    "id": 3216,
    "baseMeaning": "menjawab, memberikan jawaban, tanggapan, atau balasan terhadap pertanyaan maupun sesuatu yang diterima.",
    "categories": [
      {
        "title": "Jawaban/Tanggapan",
        "description": "",
        "jukugos": [
          {
            "word": "回答",
            "reading": "かいとう",
            "meaning": "jawaban",
            "penjelasan": "Hubungan makna antar kanji 回 dan 答, menunjukan bahwa gabungan kedua kanji itu  mengandung makna “jawaban yang diberikan terhadap suatu pertanyaan atau perminataan informasi” (kanji pedia, 2026).",
            "nodes": [
              {
                "jokugo": "回",
                "arti": "mengembalikan"
              },
              {
                "jokugo": "答",
                "arti": "jawaban"
              }
            ]
          },
          {
            "word": "解答",
            "reading": "かいとう",
            "meaning": "soal jawaban",
            "penjelasan": "Hubungan makna antar kanji 解 dan 答,  menunjukan bahwa gabungan kedua kanji itu  mengandung makna “jawaban yang digunakan untuk menyelesaikan soal atau permasalahan”.",
            "nodes": [
              {
                "jokugo": "解",
                "arti": "menyelesaikan"
              },
              {
                "jokugo": "答",
                "arti": "jawaban"
              }
            ]
          },
          {
            "word": "応答",
            "reading": "おうとう",
            "meaning": "tanggapan/respons",
            "penjelasan": "Hubungan makna antar kanji 応dan 答, menunjukan bahwa gabungan kedua kanji itu  mengandung makna”respons yang diberikan terhadap pertanyaan, panggilan, atau komunikasi”",
            "nodes": [
              {
                "jokugo": "応",
                "arti": "menanggapi"
              },
              {
                "jokugo": "答",
                "arti": "jawaban"
              }
            ]
          },
          {
            "word": "返答",
            "reading": "へんとう",
            "meaning": "jawaban, balasan",
            "penjelasan": "Hubungan makna antar kanji 返 dan 答 menjadi 返答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan jawaban atau balasan kembali kepada orang lain.”",
            "nodes": [
              {
                "jokugo": "返",
                "arti": "mengembalikan, membalas"
              },
              {
                "jokugo": "答",
                "arti": "menjawab, jawaban"
              }
            ]
          },
          {
            "word": "問答",
            "reading": "もんどう",
            "meaning": "tanya jawab",
            "penjelasan": "Hubungan makna antar kanji 問 dan 答 menjadi 問答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan bertanya dan menjawab antar dua pihak.”",
            "nodes": [
              {
                "jokugo": "問",
                "arti": "bertanya, pertanyaan"
              },
              {
                "jokugo": "答",
                "arti": "menjawab, jawaban"
              }
            ]
          },
          {
            "word": "自答",
            "reading": "じとう",
            "meaning": "menjawab sendiri",
            "penjelasan": "Hubungan makna antar kanji 自 dan 答 menjadi 自答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menjawab sendiri terhadap pertanyaan atau persoalan yang dipikirkan.”",
            "nodes": [
              {
                "jokugo": "自",
                "arti": "diri sendiri"
              },
              {
                "jokugo": "答",
                "arti": "menjawab, jawaban"
              }
            ]
          },
          {
            "word": "答弁",
            "reading": "とうべん",
            "meaning": "jawaban, penjelasan resmi",
            "penjelasan": "Hubungan makna antar kanji 答 dan 弁 menjadi 答弁, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan jawaban atau penjelasan terhadap pertanyaan, terutama dalam situasi resmi.”",
            "nodes": [
              {
                "jokugo": "答",
                "arti": "menjawab, jawaban"
              },
              {
                "jokugo": "弁",
                "arti": "menjelaskan, menyampaikan dengan kata-kata"
              }
            ]
          }
        ]
      },
      {
        "title": "Hasil Jawaban",
        "description": "Kelompok ini menunjukkan makna yang berkaitan dengan jawaban sebagai hasil dari proses menjawab, memecahkan persoalan, atau menentukan jawaban. Seperti pada jukugo berikut ini:",
        "jukugos": [
          {
            "word": "答案",
            "reading": "とうあん",
            "meaning": "lembar jawaban",
            "penjelasan": "Hubungan makna antar kanji 答 dan 案, menunjukan bahwa gabungan kedua kanji itu  mengandung makna “lembar jawaban untuk menuliskan jawaban dalam ujian atau latihan”",
            "nodes": [
              {
                "jokugo": "答",
                "arti": "jawaban"
              },
              {
                "jokugo": "案",
                "arti": "naskah"
              }
            ]
          },
          {
            "word": "解答",
            "reading": "かいとう",
            "meaning": "jawaban, penyelesaian",
            "penjelasan": "Hubungan makna antar kanji 解 dan 答 menjadi 解答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “jawaban yang diperoleh melalui proses memecahkan atau menyelesaikan suatu persoalan.”",
            "nodes": [
              {
                "jokugo": "解",
                "arti": "memecahkan, menjelaskan"
              },
              {
                "jokugo": "答",
                "arti": "jawaban"
              }
            ]
          },
          {
            "word": "正答",
            "reading": "せいとう",
            "meaning": "jawaban benar",
            "penjelasan": "Hubungan makna antar kanji 正 dan 答 menjadi 正答, menunjukan bahwa gabungan kedua kanji tersebut membentuk makna “jawaban yang benar atau tepat.”",
            "nodes": [
              {
                "jokugo": "正",
                "arti": "benar"
              },
              {
                "jokugo": "答",
                "arti": "jawaban"
              }
            ]
          },
          {
            "word": "確答",
            "reading": "かくとう",
            "meaning": "jawaban yang pasti",
            "penjelasan": "Hubungan makna antar kanji 確 dan 答 menjadi 確答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “jawaban yang pasti dan jelas.”",
            "nodes": [
              {
                "jokugo": "確",
                "arti": "pasti, jelas"
              },
              {
                "jokugo": "答",
                "arti": "jawaban"
              }
            ]
          }
        ]
      },
      {
        "title": "Cara menjawab",
        "description": "Kelompok ini menunjukkan makna yang berkaitan dengan cara atau bentuk ketika seseorang memberikan jawaban. Seperti berikut ini:",
        "jukugos": [
          {
            "word": "口答",
            "reading": "こうとう",
            "meaning": "jawaban lisan",
            "penjelasan": "Hubungan makna antar kanji 口 dan 答 menjadi 口答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan jawaban secara lisan.”",
            "nodes": [
              {
                "jokugo": "口",
                "arti": "mulut, lisan"
              },
              {
                "jokugo": "答",
                "arti": "menjawab, jawaban"
              }
            ]
          },
          {
            "word": "直答",
            "reading": "ちょくとう",
            "meaning": "jawaban langsung",
            "penjelasan": "Hubungan makna antar kanji 直 dan 答 menjadi 直答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan jawaban secara langsung.”",
            "nodes": [
              {
                "jokugo": "直",
                "arti": "langsung, tanpa perantar"
              },
              {
                "jokugo": "答",
                "arti": "menjawab, jawaban"
              }
            ]
          },
          {
            "word": "筆答",
            "reading": "ひっとう",
            "meaning": "jawaban tertulis",
            "penjelasan": "Hubungan makna antar kanji 筆 dan 答 menjadi 筆答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan jawaban melalui tulisan.”",
            "nodes": [
              {
                "jokugo": "筆",
                "arti": "pena, tulisan"
              },
              {
                "jokugo": "答",
                "arti": "menjawab, jawaban"
              }
            ]
          }
        ]
      },
      {
        "title": "Balasan",
        "description": "Kelompok ini menunjukkan makna yang berkaitan dengan tindakan membalas ucapan, penghormatan, atau perlakuan yang diterima dari orang lain. Seperti pada jukugo berikut ini:",
        "jukugos": [
          {
            "word": "答辞",
            "reading": "とうじ",
            "meaning": "ucapan, pidato balasan",
            "penjelasan": "Hubungan makna antar kanji 答 dan 辞 menjadi 答辞, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ucapan atau pidato yang disampaikan sebagai balasan terhadap ucapan dari pihak lain.”",
            "nodes": [
              {
                "jokugo": "答",
                "arti": "menjawab, membalas"
              },
              {
                "jokugo": "辞",
                "arti": "kata-kata, ucapan"
              }
            ]
          },
          {
            "word": "答礼",
            "reading": "とうれい",
            "meaning": "membalas penghormatan",
            "penjelasan": "Hubungan makna antar kanji 答 dan 礼 menjadi 答礼, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “membalas salam, penghormatan, atau kesopanan yang diterima dari orang lain.”",
            "nodes": [
              {
                "jokugo": "答",
                "arti": "menjawab, membalas"
              },
              {
                "jokugo": "礼",
                "arti": "salam, penghormatan"
              }
            ]
          }
        ]
      }
    ]
  }
];

async function applyKanji(kData: typeof ALL_MOD1_DATA[0]) {
  const { character, id, baseMeaning, categories } = kData;
  console.log(`\n========================================`);
  console.log(`Memproses Kanji ${character} (ID: ${id})...`);

  const kanji = await prisma.kanji.findFirst({ where: { character } });
  if (!kanji) {
    console.error(`Kanji ${character} tidak ditemukan!`);
    return;
  }

  // 1. Update baseMeaning
  await prisma.kanji.update({
    where: { id: kanji.id },
    data: { baseMeaning }
  });
  console.log(`  - baseMeaning diupdate: "${baseMeaning.slice(0, 50)}..."`);

  // 2. Kumpulkan target kata yang valid
  const targetWords = new Set<string>();
  categories.forEach(c => c.jukugos.forEach(j => targetWords.add(j.word)));

  // 3. Bersihkan jukugo usang yang tidak ada di data paten
  const existingJukugos = await prisma.jukugo.findMany({ where: { kanjiId: kanji.id } });
  for (const exJk of existingJukugos) {
    if (!targetWords.has(exJk.word)) {
      await prisma.kategoriKanji.deleteMany({ where: { jokugoId: exJk.id } });
      await prisma.semanticRelation.deleteMany({ where: { jukugoId: exJk.id } });
      await prisma.jukugo.delete({ where: { id: exJk.id } });
      console.log(`  - Menghapus jukugo usang: ${exJk.word}`);
    }
  }

  // 4. Hapus SELURUH KanjiGraphEdge buatan untuk kanji ini (agar bebas dari cross-link acak & garis duplikat)
  await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId: kanji.id } });
  console.log(`  - KanjiGraphEdge dibersihkan`);

  // 5. Bersihkan pemetaan KategoriKanji lama
  const currentJukugos = await prisma.jukugo.findMany({ where: { kanjiId: kanji.id } });
  await prisma.kategoriKanji.deleteMany({
    where: { jokugoId: { in: currentJukugos.map(j => j.id) } }
  });

  // 6. Bersihkan SemanticRelation lama untuk kanji ini
  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });

  // 7. Update MasterCategory, Jukugo, KategoriKanji, dan SemanticRelation
  const allWordsForQuiz: string[] = [];
  const groupsForQuiz: Record<string, string[]>[] = [];

  for (const cat of categories) {
    let masterCat = await prisma.masterCategory.findFirst({ where: { name: cat.title } });
    if (!masterCat) {
      masterCat = await prisma.masterCategory.create({
        data: { name: cat.title, description: cat.description || null }
      });
    } else if (cat.description) {
      await prisma.masterCategory.update({
        where: { id: masterCat.id },
        data: { description: cat.description }
      });
    }

    const catWordList: string[] = [];

    for (const jkItem of cat.jukugos) {
      catWordList.push(jkItem.word);
      if (!allWordsForQuiz.includes(jkItem.word)) {
        allWordsForQuiz.push(jkItem.word);
      }

      let dbJukugo = await prisma.jukugo.findFirst({
        where: { kanjiId: kanji.id, word: jkItem.word, meaning: jkItem.meaning }
      });

      if (!dbJukugo) {
        dbJukugo = await prisma.jukugo.create({
          data: {
            kanjiId: kanji.id,
            word: jkItem.word,
            reading: jkItem.reading,
            meaning: jkItem.meaning
          }
        });
      } else {
        await prisma.jukugo.update({
          where: { id: dbJukugo.id },
          data: {
            reading: jkItem.reading,
            meaning: jkItem.meaning
          }
        });
      }

      // KategoriKanji
      await prisma.kategoriKanji.create({
        data: {
          jokugoId: dbJukugo.id,
          categoryId: masterCat.id
        }
      });

      // SemanticRelation & Nodes
      const semRel = await prisma.semanticRelation.create({
        data: {
          kanjiId: kanji.id,
          jukugoId: dbJukugo.id,
          penjelasan: jkItem.penjelasan
        }
      });

      for (const node of jkItem.nodes) {
        await prisma.semanticRelationNode.create({
          data: {
            semanticId: semRel.id,
            jokugo: node.jokugo,
            arti: node.arti
          }
        });
      }
    }

    groupsForQuiz.push({ [cat.title]: catWordList });
  }

  // 8. Update Grouping Quiz
  const groupingQuiz = await prisma.quiz.findFirst({
    where: { kanjiId: kanji.id, type: "grouping" }
  });

  const quizData = {
    kanjiId: kanji.id,
    type: "grouping",
    question: `Kelompokkan jukugo kanji ${character} berikut berdasarkan kategori maknanya:`,
    words: JSON.stringify(allWordsForQuiz),
    groups: JSON.stringify(groupsForQuiz),
    explanation: `Jukugo kanji ${character} terbagi ke dalam kategori makna: ${categories.map(c => c.title).join(", ")}.`,
  };

  if (groupingQuiz) {
    await prisma.quiz.update({
      where: { id: groupingQuiz.id },
      data: quizData
    });
  } else {
    await prisma.quiz.create({
      data: quizData
    });
  }

  console.log(`  ✅ Selesai memperbarui Kanji ${character} (Total Kategori: ${categories.length}, Total Jukugo: ${allWordsForQuiz.length})`);
}

async function main() {
  console.log("Memulai penerapan data paten Modul 1 (Kanji 試, 験, 問, 題, 答)...");
  for (const kData of ALL_MOD1_DATA) {
    await applyKanji(kData);
  }
  console.log("\n🎉 SEMUA DATA PATEN MODUL 1 TELAH SUKSES DIAPLIKASIKAN KE DATABASE!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
