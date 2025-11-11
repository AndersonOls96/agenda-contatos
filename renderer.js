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

function openAddModal(){
    isEditMode = false
    document.getElementById('modal-title').textContent = 'Novo contato'
    contactForm.reset()
    contactModal.classList.add('show')
}

async function openEditModal(){
    if (!currentContactId) return

    try{
        const contact = await window.electronAPI.getContact(currentContactId)

        isEditMode = true
        document.getElementById('modal-title').textContent = 'Editar Contato'

        inputName.value = contact.name || ''
        inputEmail.value = contact.email || ''
        inputPhone.value = contact.phone || ''
        inputCompany.value = contact.company || ''
        inputPosition.value = contact.position || ''
        inputNotes.value = contact.notes || ''

        contactModal.classList.add('show')
    }catch(error){
        console.error('Erro ao carregar contato:', error)
    }
}


function closeModal(){
    contactModal.classList.remove('show')
    contactForm.reset()
}

async function saveContact(event){
    event.preventDefault();

    const contact = {
        name: inputName.value.trim(),
        email: inputEmail.value.trim(),
        phone: inputPhone.value.trim(),
        company: inputCompany.value.trim(),
        position: inputPosition.value.trim(),
        notes: inputNotes.value.trim()
    }

    if (!contact.name){
        alert('O nome é obrigatório!')
        return
    }

    try{
        if (isEditMode && currentContactId){
            await window.electronAPI.updateContact()(currentContactId, contact)
            showContactDetail(currentContactId)
        }else{
            const result = await window.electronAPI.addContact(contact)
            currentContactId = result.id
            showContactDetail(result.id)
        }

        closeModal()
        loadContacts()
    }catch(error){
        console.error('Erro ao salvar contato', error)
        alert('Erro ao salvar contato. Tente novamente.')
    }
}

async function deleteContact(){
    if (!currentContactId) return;

    const confirmed = confirm('Tem certeza que deseja excluir este contato?')
    if(!confirmed) return

    try{
        await window.electronAPI.deleteContact(currentContactId)

        currentContactId = null
        welcomeScreen.style.display = 'flex'
        contactDetail.style.display = 'none'

        loadContacts(searchInput.value)
    }catch(error){
        console.error('Erro ao deletar contato:', error)
        alert('Erro ao deletar contato. Tente novamente.')
    }
}


btnAdd.addEventListener('click', openAddModal)
btnDelete.addEventListener('click', deleteContact)
btnCloseModal.addEventListener('click', closeModal)
contactForm.addEventListener('submit', saveContact)
loadContacts()