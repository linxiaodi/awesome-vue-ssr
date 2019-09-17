import http from 'http-api'

export const getIndex = () => http('homepage')

export const getDetail = () => http('list/detail')

export const getAuthor = () => http('author')
