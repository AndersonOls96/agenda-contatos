const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const { app } = require('electron')


class Database {
    constructor() {
        const userDataPath = app.getPath('userData')
        this.dbPath = path.join(userDataPath, 'contacts.db')
        this.db = null
    }

    init() {
        this.db = new sqlite3.Database(this.dbPath, (err) => {
            if (err) {
                console.error('Erro ao abrir banco de dados', err)
            } else {
                console.log('Banco de dados conectado')
                this.createTable()
            }
        })
    }

    createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT,
                phone TEXT,
                company TEXT,
                position TEXT,
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `

        this.db.run(sql, (err) => {
            if (err) {
                console.error('Erro ao criar tabela', err)
            } else {
                console.log("Tabela criada/verificada com sucesso")
            }
        })
    }

    getContacts(searchTerm = '') {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM contacts '
            let params = []

            if (searchTerm) {
                sql += 'WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ?'
                const term = `%${searchTerm}%`
                params = [term, term, term, term]
            }

            sql += 'ORDER BY name ASC'

            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    getContact(id) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM contacts WHERE id = ?', [id], (err, row) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(row)
                }
            })
        })
    }

    addContact(contact) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO contacts (name, email, phone, company, position, notes)
                VALUES (?, ?, ?, ?, ?, ?)
            `

            const params = [
                contact.name,
                contact.email,
                contact.phone,
                contact.company,
                contact.position,
                contact.notes
            ]

            this.db.run(sql, params, function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve({ id: this.lastID })
                }
            })
        })
    }

    updateContact(id, contact) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE contacts
                SET name = ?, email = ?, phone = ?, company = ?, position = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `

            const params = [
                contact.name,
                contact.email,
                contact.phone,
                contact.company,
                contact.position,
                contact.notes,
                id
            ]

            this.db.run(sql, params, function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve({ changes: this.changes })
                }
            })
        })
    }

    deleteContact(id) {
        return new Promise((resolve, reject) =>{
            this.db.run('DELETE FROM contacts WHERE id = ?', [id], function(err){
                if(err){
                    reject(err)
                }else{
                    resolve({ changes: this.changes })
                }
            })
        })
    }
}

module.exports = Database