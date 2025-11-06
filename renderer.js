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
