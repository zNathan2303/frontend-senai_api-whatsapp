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

function criarMensagem(mensagem) {
    const conversa = document.getElementById('conversa')

    const areaMensagem = document.createElement('div')
    const areaTexto = document.createElement('div')
    const mensagemText = document.createElement('div')
    const horario = document.createElement('p')

    mensagemText.textContent = mensagem.conteudo
    horario.textContent = mensagem.horario

    areaMensagem.classList.add('area-mensagem')
    areaTexto.classList.add('area-texto')
    horario.classList.add('horario')
    mensagemText.classList.add('mensagem')
    if (mensagem.remetente == 'me')
        areaTexto.classList.add('minha-mensagem')

    areaTexto.append(mensagemText, horario)
    areaMensagem.append(areaTexto)
    conversa.append(areaMensagem)
}

async function carregarContatos(numero) {
    const contatos = await obterConteudo(`https://backend-senai-api-whatsapp.onrender.com/v1/whatsapp/contatos/${numero}`)
    contatos.contatos.forEach(criarContato)
}

async function carregarConversa(numero, numeroContato) {
    const mensagens = await obterConteudo(`https://backend-senai-api-whatsapp.onrender.com/v1/whatsapp/mensagens/conversa/${numero}?numero=${numeroContato}`)
    for (let i = mensagens.mensagens.length - 1; i >= 0; i--) {
        criarMensagem(mensagens.mensagens[i])
    }
}

carregarContatos(11987876567)
carregarConversa(11987876567, 26999999963)