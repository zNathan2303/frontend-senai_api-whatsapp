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

    contatoContainer.addEventListener('click', () => {
        alterarConteudoDaBarraSuperior(contato.nome, contato.imagem)
        carregarConversa(obterPerfilAtual(), contato.numero)
    })

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

function alterarConteudoDaBarraSuperior(nome, imagem) {
    const foto = document.getElementById('foto-barra-superior')
    const nomeText = document.getElementById('nome-barra-superior')

    foto.src = imagem
    foto.onerror = () => {
        foto.src = './img/contato-placeholder.svg'
        foto.classList.add('foto-placeholder')
    }
    nomeText.textContent = nome
}

function criarPerfil(perfil) {
    const perfis = document.getElementById('perfis')

    const perfilContainer = document.createElement('div')
    const foto = document.createElement('img')
    const nick = document.createElement('p')

    nick.textContent = perfil.nickname
    foto.src = perfil['profile-image']
    foto.onerror = () => {
        foto.src = './img/contato-placeholder.svg'
    }

    perfilContainer.classList.add('perfil')

    perfilContainer.dataset.account = perfil.account
    perfilContainer.dataset.nickname = perfil.nickname
    perfilContainer.dataset.image = perfil['profile-image']
    perfilContainer.dataset.number = perfil.number
    perfilContainer.dataset.background = perfil.background

    perfilContainer.addEventListener('click', () => {
        carregarContatos(perfil.number)
        sessionStorage.setItem('perfil', perfil.number)
        document.documentElement.style.setProperty('--selacao-de-perfil', 'none')
        document.documentElement.style.setProperty('--background-color', perfil.background)
    })

    perfilContainer.append(foto, nick)
    perfis.append(perfilContainer)
}

async function carregarContatos(numero) {
    const contatos = await obterConteudo(`https://backend-senai-api-whatsapp.onrender.com/v1/whatsapp/contatos/${numero}`)
    document.getElementById('contatos').replaceChildren()
    contatos.contatos.forEach(criarContato)
}

async function carregarConversa(numero, numeroContato) {
    const mensagens = await obterConteudo(`https://backend-senai-api-whatsapp.onrender.com/v1/whatsapp/mensagens/conversa/${numero}?numero=${numeroContato}`)
    document.getElementById('conversa').replaceChildren()
    for (let i = mensagens.mensagens.length - 1; i >= 0; i--) {
        criarMensagem(mensagens.mensagens[i])
    }
    if (document.getElementById('mensagem-iniciar-conversa'))
        document.getElementById('mensagem-iniciar-conversa').remove()
}

async function carregarPerfis() {
    const data = await obterConteudo('https://backend-senai-api-whatsapp.onrender.com/v1/whatsapp')
    document.getElementById('perfis').replaceChildren()
    data.usuarios.forEach(criarPerfil)
}

function obterPerfilAtual() {
    return sessionStorage.getItem('perfil')
}

document.getElementById('input-mensagem').addEventListener('input', conteudo => {
    if (conteudo.target.value) {
        document.getElementById('botao-enviar').classList.add('contem-texto')
        document.getElementById('botao-enviar-icon').classList.add('contem-texto')
    } else {
        document.getElementById('botao-enviar').classList.remove('contem-texto')
        document.getElementById('botao-enviar-icon').classList.remove('contem-texto')
    }
})

document.getElementById('botao-enviar').addEventListener('click', () => {
    document.getElementById('botao-enviar').classList.remove('contem-texto')
    document.getElementById('botao-enviar-icon').classList.remove('contem-texto')
    document.getElementById('input-mensagem').value = ''
    window.alert('O backend não recebe mensagens! (não possui endpoint POST)')
})

document.getElementById('input-pesquisa-geral').addEventListener('input', conteudo => {
    if (conteudo.target.value) {
        document.documentElement.style.setProperty('--limpar-input-pesquisa-geral', 'block')
    } else {
        document.documentElement.style.setProperty('--limpar-input-pesquisa-geral', 'none')
    }
})

document.getElementById('limpar-input-pesquisa-geral').addEventListener('click', () => {
    document.documentElement.style.setProperty('--limpar-input-pesquisa-geral', 'none')
    document.getElementById('input-pesquisa-geral').value = ''
})

carregarPerfis()