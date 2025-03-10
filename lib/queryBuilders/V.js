import checkDot from "./checkDot.js";

export default function (id = '') {
    this.query += `${checkDot(this.query)}V('${id}')`;
    return this;
}