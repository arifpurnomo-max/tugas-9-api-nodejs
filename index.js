// alur kerja server + mysql
const express = require('express');
// express → untuk membuat server dan mengatur route.
const app = express();
// app adalah server yang akan kita jalankan.
const port = 3000;
//port adalah alamat lokal tempat server bisa diakses (http://localhost:3000).
const mysql = require('mysql');
// mysql → untuk menghubungkan ke database mysql


// memangil/koneksi ke mysql
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: '',
});


// cek koneksi ke database mysql
connection.connect((err) => {
  if (err) {
    console.error('gagal terhubung ke database:', err);
    return;
  }
  console.log('berhasil terhubung ke database');
});

// connection.query('SELECT * FROM tb_buku', (err, results) => {
//   if (err) throw err;
//   console.log(results);
// });

//  Middleware untuk JSON
app.use(express.json());
// Ini wajib supaya POST dan PUT bisa menerima data JSON dari body request.



// route (jalan) untuk menampilkan data
app.get('/tb_buku', (req, res) => {
  connection.query('SELECT * FROM tb_buku', (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});
// Mengambil semua data dari tabel tb_buku.
//Data dikirim dalam bentuk JSON ke client.


// menambahkan data baru ke dalam tabel tb_buku
app.post('/tb_buku', (req, res) => {
  const { judul, pengarang, penerbit, tahun_terbit, jumlah_buku } = req.body;

  const sql = 'INSERT INTO tb_buku (judul, pengarang, penerbit, tahun_terbit, jumlah_buku) VALUES (?, ?, ?, ?, ?)';

  connection.query(sql, [judul, pengarang, penerbit, tahun_terbit, jumlah_buku], (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(201).json({ message: 'Data buku berhasil ditambahkan', id: result.insertId });
    // res.status(201).json({ message: 'User created', userId: results.insertId });
});
});


// Mengambil atau mengubah data buku berdasarkan ID
app.put('/tb_buku/:id', (req, res) => {
  const id = req.params.id;
  const {judul, pengarang, penerbit, tahun_terbit, jumlah_buku} = req.body;

  const sql = 'UPDATE tb_buku SET judul = ?, pengarang = ?, penerbit = ?, tahun_terbit = ?, jumlah_buku = ? WHERE id = ?';
  connection.query(sql, [judul, pengarang, penerbit, tahun_terbit, jumlah_buku, id], (err, result) => {
    if (err) {
      console.error('Error updating data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  res.json({ message: `data buku dengan ID ${id} updated`});
});
});


// menghapus data buku berdasarkan ID
app.delete('/tb_buku/:id', (req, res) => {
  const id = req.params.id;

  const sql = 'DELETE FROM tb_buku WHERE id = ?';
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json({ message: `Data buku dengan ID ${id} berhasil dihapus` });
  });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// const express = require('express');
// const app = express();
// const port = 3000;

// // route (jalan) untuk menampilkan data
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost ${port}`);
// });
