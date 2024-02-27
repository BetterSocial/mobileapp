# Helio PR Checklist

## Please review all of the following checks before making PR

- [ ] Jika menambahkan sebuah komponen, apakah sudah dipastikan tidak ada komponen yang redundant, baik secara UI maupun fungsional?
- [ ] Periksa apakah komponen yang dibuat reusable (contoh: membuat komponen View untuk membuat Divider antar section)
- [ ] Periksa untuk penggunaan state management yang baik dan benar (contoh: Context, useState), terutama penggunaan local state untuk optimistic UI (Pengoperan state dan data melalui props dari parent ke children dan sebaliknya)
- [ ] Pastikan komponen yang dibuat sudah sesuai dengan module yang ada terutama penamaan dan penempatan untuk meningkatkan readability dan maintainability.
- [ ] Implementasi fallback error untuk menangani kesalahan tak terduga, mencegah aplikasi mengalami crash
- [ ] Evaluasi kompleksitas kode dan perbaiki logika yang kompleks dengan memecahnya menjadi fungsi atau komponen yang lebih kecil dan lebih mudah dimengerti.
- [ ] Apakah sudah resolve semua komentar dari CodeRabbit🐇?
- [ ] Apakah semua unit tests sudah Pass/Success? (Tidak ada bypass)
- [ ] Periksa semua perubahan teks Bahasa Inggris approved oleh Bastian?
- [ ] Apakah sudah menggunakan normalized.dimen/ normalizeFontSize untuk semua perubahan style?
- [ ] Pastikan untuk mengikuti [guidelines pembuatan komponen Guidelines About Loading and Layout](https://docs.google.com/document/d/1GHbvEtFrQmEQXYBV9dLrPI654n2DbPwS1qjedajLSiw/edit)

### Author's comment

if you have any unchecked items, please explain the reason why.
