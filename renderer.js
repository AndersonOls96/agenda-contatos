let currentContactId = null
let isEditMode = false

//Elementos do DOM
const contactsList = document.getElementById('contactsList')
const searchInput = document.getElementById('searchInput')
const welcomeScreen = document.getElementById('welcomeScreen')
const contactDetail = document.getElementById('contactDetail')
const contactModal = document.getElementById('contactModal')
const contactForm = document.getElementById('contactForm')

// Botões
const btnAdd = document.getElementById('btnAdd')
const btnEdit = document.getElementById('btnEdit')
const btnDelete = document.getElementById('btnDelete')
const btnCloseModal = document.getElementById('btnCloseModal')
const btnCancel = document.getElementById('btnCancel')

//Campos de formulário
const inputName = document.getElementById('inputName')
const inputEmail = document.getElementById('inputEmail')
const inputPhone = document.getElementById('inputPhone')
const inputCompany = document.getElementById('inputCompany')
const inputPosition = document.getElementById('inputPosition')
const inputNotes = document.getElementById('inputNotes')


//Elementos de detalhe
const contactName = document.getElementById('contactName')
const contactEmail = document.getElementById('contactEmail')
const contactPhone = document.getElementById('contactPhone')
const contactCompany = document.getElementById('contactCompany')
const contactPosition = document.getElementById('contactPosition')
const contactNotes = document.getElementById('contactNotes')

//Carregar contatos
async function loadContacts(searchTerm = ''){
    try{
        const contacts = await window.electronAPI.getContacts(searchTerm)
        displayContacts(contacts)
    }catch(error){
        console.error('Erro ao carregar contatos:', error)
        contactsList.innerHTML = `
        <div class="no-contacts"> Erro ao carregar contatos </div>
        ` 
    }
}

function displayContacts(contacts){
    if(contacts.length === 0){
        contactsList.innerHTML = `
        <div class="no-contacts"> Nenhum contato encontrado</div>
        `
        return
    }

    contactsList.innerHTML = contacts.map(contact =>`
        <div class="contact-item ${contact.id === currentContactId ? 'active' : ''}" data-id="${contact.id}">
            <div class="contact-item-name">${contact.name}</div>
            <div class="contact-item-info">
                ${contact.company || contact.email || contact.phone || "Sem informações adicionais"}
            </div>
        </div>
        `).join('')

        document.querySelectorAll('.contact-item').forEach(item =>{
            item.addEventListener('click', () =>{
                const id = parseInt(item.dataset.id)
                showContactDetail(id)
            })
        })
}

async function showContactDetail(id){
    try{
        const contact = await window.electronAPI.getContact(id)

        currentContactId = id
        contactName.textContent = contact.name
        contactEmail.textContent = contact.email || '-'
        contactPhone.textContent = contact.phone || '-'
        contactCompany.textContent = contact.company || '-'
        contactPosition.textContent = contact.position || '-'
        contactNotes.textContent = contact.notes || '-'

        welcomeScreen.style.display = 'none'
        contactDetail.style.display = 'block'

        document.querySelectorAll('.contact-item').forEach(item =>{
            item.classList.toggle('active', parseInt(item.dataset.id) === id)
        })
    }catch(error){
        console.error('Erro ao carregar detalhes:', error)
    }
}

loadContacts()