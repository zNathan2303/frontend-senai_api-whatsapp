'use strict'

export async function obterConteudo(url) {
    const response = await fetch(url)
    const data = await response.json()
    return data
}