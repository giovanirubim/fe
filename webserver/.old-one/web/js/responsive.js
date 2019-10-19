import * as css from '/js/css-var.js';
let workspace = null;
const nCols = 4;
const nRows = 4;
const resetDynamicMeasures = () => {

	const sx = workspace.sx();
	const sy = workspace.sy();
	const space_x = Math.floor(sx*0.04);
	const space_y = Math.round(sx*0.04);
	const inner = sx*0.75;
	const padding_y = Math.round(sx*0.1);
	const cell_sy = Math.round(sx*0.13);

	const cell_sx = Math.floor(inner/nCols);
	const inner_sx = cell_sx*nCols + space_x*(nCols - 1);
	const padding_x = Math.floor((sx - inner_sx)*0.5);

	for (let i=1; i<=nCols; ++i) {
		css.setPx(`sx-${i}`, i*cell_sx + (i - 1)*space_x);
	}
	for (let i=1; i<=nRows; ++i) {
		css.setPx(`sy-${i}`, i*cell_sy + (i - 1)*space_y);
	}
	css.setPx({
		'ws-padding-x': padding_x,
		'ws-padding-y': padding_y,
		'ws-space-x': space_x,
		'ws-space-y': space_y,
		'cell-title-sy': Math.ceil(cell_sy*0.3),
		'input-font-size': cell_sy*0.30,
		'input-padding-x': cell_sx*0.08
	});
};
$(document).ready(() => {
	workspace = $('#workspace');
	resetDynamicMeasures();
	window.addEventListener('resize', resetDynamicMeasures);
});