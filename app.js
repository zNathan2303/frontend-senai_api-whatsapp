'use strict'

import { obterConteudo } from './modulo/fetch.js'

function criarContato(contato) {
    const contatos = document.getElementById('contatos')

    const contatoContainer = document.createElement('div')
    const foto = document.createElement('img')
    const info = document.createElement('div')
    const nome = document.createElement('span')
    const descricao = document.createElement('span')

    foto.src = contato.imagem
    foto.onerror = () => {
        foto.src = './img/contato-placeholder.svg'
        foto.classList.add('foto-placeholder')
    }
    nome.textContent = contato.nome
    descricao.textContent = contato.descricao

    contatoContainer.classList.add('contato')
    info.classList.add('info')
    nome.classList.add('nome')
    descricao.classList.add('descricao')

    info.append(nome, descricao)
    contatoContainer.append(foto, info)
    contatos.append(contatoContainer)
}

async function carregarContatos() {
    const contatos = await obterConteudo('https://backend-senai-api-whatsapp.onrender.com/v1/whatsapp/contatos/11987876567')
    contatos.contatos.forEach(criarContato)
}

carregarContatos()
