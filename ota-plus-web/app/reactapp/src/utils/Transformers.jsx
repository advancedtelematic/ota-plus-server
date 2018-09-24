
const createAttributeValue = (str) => {
    return str.split(' ').join('-').toLowerCase();
};

export {
    createAttributeValue,
}