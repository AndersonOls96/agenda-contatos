const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const Database = require('./database')

let mainWindow
let db

function createWindow(){
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        icon:path.join(__dirname, 'assets', 'icone.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    })

    mainWindow.loadFile('index.html')
}

app.whenReady().then(() =>{
    db = new Database()
    db.init()

    createWindow()

    app.on('activate', () =>{
        if(BrowserWindow.getAllWindows().length === 0){
            createWindow()
        }
    })
})

//IPC Handlers
ipcMain.handle('get-contacts', async (event, searchTerm) =>{
    return db.getContacts(searchTerm)
})

ipcMain.handle('get-contact', async (event, id) =>{
    return db.getContact(id)
})

ipcMain.handle('add-contact', async (event, contact) =>{
    return db.addContact(contact)
})

ipcMain.handle('update-contact', async (event, id, contact) =>{
    return db.updateContact(id, contact)
})

ipcMain.handle('delete-contact', async (event, id) =>{
    return db.deleteContact(id)
})