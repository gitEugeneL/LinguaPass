// const GATEWAY = 'http://localhost:5224';  local -> local (http)
// const GATEWAY = 'https://localhost:7161'; local -> local (https)
const GATEWAY = 'http://localhost:5000'; // local -> docker

export const IDENTITY = `${GATEWAY}/auth`;

export const COURSE = `${GATEWAY}/course`;

export const ACCOUNT = `${GATEWAY}/account`;

export const PROGRESS = `${GATEWAY}/progress`;

export const STORAGE = `${GATEWAY}/storage`;
