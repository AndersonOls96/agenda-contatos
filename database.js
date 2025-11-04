const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const { app } = require('electron')

class Database{
    constructor(){
        const userDataPath = app.getPath('userData')
        this.dbPath = path.join(userDataPath, 'contacts.db')
        this.db = null
    }

    init(){
        this.db = new sqlite3.Database(this.dbPath, (err)=>{
            if(err){
                console.error('Erro ao abrir banco de dados', err)
            }else{
                console.log('Banco de dados conectado')
                this.createTable()
            }
        })
    }

    createTable(){
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

        this.db.run(sql, (err) =>{
            if (err){
                console.error('Erro ao criar tabela', err)
            }else{
                console.log("Tabela criada/verificada com sucesso")
            }
        })
    }
}