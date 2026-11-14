/**
 * Backend undangan digital memakai Google Sheets.
 * Cara pasang: lihat README-PUBLIKASI.md (Langkah 2).
 *
 * Tiga sheet dibuat otomatis saat pertama dipakai:
 *   RSVP   -> Waktu | Nama | Status | Jumlah | Pesan
 *   Ucapan -> ID | Waktu | Nama | Ucapan
 *   Tamu   -> ID | Nama
 */
const ADMIN_PASSWORD = 'Karin'; // Kata sandi dasbor admin. Tersimpan di sini, bukan di index.html.

const HEADERS = {
  RSVP: ['Waktu', 'Nama', 'Status', 'Jumlah', 'Pesan'],
  Ucapan: ['ID', 'Waktu', 'Nama', 'Ucapan'],
  Tamu: ['ID', 'Nama'],
};

function sheet_(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName(name);
  if (!s) {
    s = ss.insertSheet(name);
    s.appendRow(HEADERS[name]);
    s.setFrozenRows(1);
    s.getRange(1, 1, 1, HEADERS[name].length).setFontWeight('bold');
  }
  return s;
}

// Membersihkan teks dan mencegah sel dibaca sebagai rumus.
function clean_(v, max) {
  let t = String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
  return /^[=+\-@]/.test(t) ? ' ' + t : t;
}

function rows_(name) {
  const s = sheet_(name);
  const n = s.getLastRow() - 1;
  return n > 0 ? s.getRange(2, 1, n, HEADERS[name].length).getValues() : [];
}

function iso_(d) { return d instanceof Date ? d.toISOString() : String(d); }

function auth_(pw) {
  if (pw !== ADMIN_PASSWORD) {
    Utilities.sleep(1000); // memperlambat tebakan sandi
    throw new Error('Sandi salah');
  }
}

function findRow_(s, id) {
  const ids = s.getRange(1, 1, s.getLastRow(), 1).getValues().map(String);
  const i = ids.indexOf(String(id));
  if (i < 1) throw new Error('Data tidak ditemukan');
  return i + 1;
}

function wishesList_(limit) {
  return rows_('Ucapan').reverse().slice(0, limit || 100)
    .map(r => ({ id: r[0], created_at: iso_(r[1]), name: r[2], message: r[3] }));
}

function handle_(r) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    switch (r.action) {
      case 'total':
        return rows_('RSVP').filter(x => x[2] === 'hadir').reduce((a, x) => a + (Number(x[3]) || 0), 0);

      case 'rsvp': {
        const name = clean_(r.name, 100);
        if (!name) throw new Error('Nama wajib diisi');
        const status = r.status === 'hadir' ? 'hadir' : 'tidak_hadir';
        const pax = status === 'hadir' ? Math.min(20, Math.max(1, parseInt(r.pax, 10) || 1)) : 0;
        sheet_('RSVP').appendRow([new Date(), name, status, pax, clean_(r.message, 500)]);
        return true;
      }

      case 'wish': {
        const name = clean_(r.name, 100), msg = clean_(r.message, 500);
        if (!name || !msg) throw new Error('Nama dan ucapan wajib diisi');
        sheet_('Ucapan').appendRow([Utilities.getUuid(), new Date(), name, msg]);
        return true;
      }

      case 'wishes':
        return wishesList_(100);

      // ---- Khusus admin ----
      case 'admin_load':
        auth_(r.password);
        return {
          rsvps: rows_('RSVP').reverse().map(x => ({ created_at: iso_(x[0]), name: x[1], status: x[2], pax: x[3], message: x[4] })),
          guests: rows_('Tamu').map(x => ({ id: x[0], name: x[1] })),
          wishes: wishesList_(500),
        };

      case 'guest_add': {
        auth_(r.password);
        const name = clean_(r.name, 100);
        if (!name) throw new Error('Nama wajib diisi');
        const id = Utilities.getUuid();
        sheet_('Tamu').appendRow([id, name]);
        return { id: id, name: name };
      }

      case 'guest_edit': {
        auth_(r.password);
        const s = sheet_('Tamu');
        s.getRange(findRow_(s, r.id), 2).setValue(clean_(r.name, 100));
        return true;
      }

      case 'guest_del': {
        auth_(r.password);
        const s = sheet_('Tamu');
        s.deleteRow(findRow_(s, r.id));
        return true;
      }

      case 'wish_del': {
        auth_(r.password);
        const s = sheet_('Ucapan');
        s.deleteRow(findRow_(s, r.id));
        return true;
      }

      default:
        throw new Error('Aksi tidak dikenal');
    }
  } finally {
    lock.releaseLock();
  }
}

function doPost(e) {
  let out;
  try {
    out = { ok: true, data: handle_(JSON.parse(e.postData.contents)) };
  } catch (err) {
    out = { ok: false, error: String(err && err.message || err) };
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true, data: 'API undangan aktif' }))
    .setMimeType(ContentService.MimeType.JSON);
}
