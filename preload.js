const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getContacts: (searchTerm) => ipcRenderer.invoke('get-contacts', searchTerm),
    getContact: (id) => ipcRenderer.invoke('get-contact', id),
    addContact: (contact) => ipcRenderer.invoke('add-contact', contact),
    updateContact: (id, contact) => ipcRenderer.invoke('update-contact', id, contact),
    deleteContact: (id) => ipcRenderer.invoke('delete-contact', id)
})