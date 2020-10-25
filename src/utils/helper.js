function* idGenerate() {
    let id = 1;

    while (true) yield id++;
}
const iterator = idGenerate();

function generateRandomRGBColor() {
    const maxValue = 200;

    const r = generateRandomNumber(0, maxValue);
    const g = generateRandomNumber(0, maxValue);
    const b = generateRandomNumber(0, maxValue);

    return `rgb(${ r }, ${ g }, ${ b })`;
}

function generateRandomNumber(min = 0, max = 1) {
    return min + Math.round(Math.random() * max);
}
export const createShape = (minWeight, maxWeight, scaleStep) => {
    const weight = generateRandomNumber(minWeight, maxWeight - 1);
    const type = generateRandomNumber(1, 2);
    const left = generateRandomNumber(0, 40);
    const color = generateRandomRGBColor();
    const top = 0;
    const scale = 1 + scaleStep * (weight - 1);
    const id = iterator.next().value;
    const shape = { id, color, left, scale, top, type, weight };
    return shape;
}

export const shapeQuantity = (shapes = [], leftSide = false) => {
    return shapes.reduce((total, current) => {
        const left = leftSide ? (50 - current.left) : current.left;

        total += current.weight * left;

        return total;
    }, 0);
}