/* not bound to style, should be computed */

export function computeInOffsetByIndex(x,y,index) {
	let outx = x - 1;
	let outy = y + ((93 + (index * 35))/2) -2;

	return {x:outx, y:outy};
}

export function computeOutOffsetByIndex(x,y,index) {

	let outx = x + 310;
    let outy = y + ((93 + (index * 35))/2);

	return {x:outx, y:outy};

}