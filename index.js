// alur kerja server + mysql
const express = require('express');
// express → untuk membuat server dan mengatur route.
const app = express();
// app adalah server yang akan kita jalankan.
const port = 3000;
//port adalah alamat lokal tempat server bisa diakses (http://localhost:3000).
const mysql = require('mysql');
// mysql → untuk menghubungkan ke database mysql
const cors = require('cors');
// cors → untuk mengizinkan akses dari domain lain (misalnya dari frontend yang berbeda).
app.use(cors());
// app.use(cors()) → mengizinkan semua domain untuk mengakses server ini.

// memangil/koneksi ke mysql
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'login_db',
});

// cek koneksi ke database mysql
connection.connect((err) => {
  if (err) {
    console.error('gagal terhubung ke database:', err);
    return;
  }
  console.log('berhasil terhubung ke database');
});

connection.query('SELECT * FROM users', (err, results) => {
  if (err) throw err;
  console.log(results);
});

//  Middleware untuk JSON
app.use(express.json());
// Ini wajib supaya POST dan PUT bisa menerima data JSON dari body request.

// route (jalan) untuk menampilkan data
app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users ORDER BY id ASC', (err, results) => {
    if (err) {
      console.error('ada kesalahan saat mengambil data:', err);
      return res.status(500).json({ error: 'gagal dalam mengambil data pengguna' });
    }
    res.json(results);
  });
});
// Mengambil semua data dari tabel tb_buku.
//Data dikirim dalam bentuk JSON ke client.

// app.get('/users/:id', (req, res) => {
//   const id = req.params.id;
//   const sql = 'SELECT * FROM users WHERE id = ?';
//   connection.query(sql, [id], (err, results) => {
//     if (err) {
//       console.error('Error fetching data:', err);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//     if (results.length === 0) {
//       return res.status(404).json({ error: 'Data tidak ditemukan' });
//     }
//     res.json(results);
//   });
// });

// GET /users/:id
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Internal Server Error' });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(results[0]);
  });
});
// Mengambil data buku berdasarkan ID

// menambahkan data baru ke dalam tabel tb_buku
app.post('/users', (req, res) => {
  const { name, email, password } = req.body;

  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

  connection.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res
      .status(201)
      .json({ message: 'Data kamu berhasil ditambahkan', id: result.insertId });
    // res.status(201).json({ message: 'User created', userId: results.insertId });
  });
});

// Mengambil atau mengubah data buku berdasarkan ID
app.put('/users/:id', (req, res) => {
  const id = req.params.id;

  const { name, email, password } = req.body;

  const sql = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';

  connection.query(sql, [name, email, password, id], (err, result) => {
    if (err) {
      console.error('Error updating data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json({ message: `data kamu dengan ID ${id} berhasil di updated` });
  });
});

// menghapus data buku berdasarkan ID
app.delete('/users/:id', (req, res) => {
  const id = req.params.id;

  const sql = 'DELETE FROM users WHERE id = ?';
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Data tidak ditemukan' });
    }
    res.json({ message: `Data penguna dengan ID ${id} berhasil dihapus` });
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
