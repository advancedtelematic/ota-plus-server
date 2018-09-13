
const removeVersion = (name, hash) => {
    return name.substring(name.indexOf(`-${hash}`), -1);
};

export {
    removeVersion,
}