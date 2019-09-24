import * as css from '/js/css-var.js';
let workspace = null;
const nCols = 5;
const resetDynamicMeasures = () => {
	const sx = workspace.sx();
	const sy = workspace.sy();
	const padding = Math.floor(Math.min(sx*0.1, sy*0.1));
	const inner_sx = sx - padding*2;
	const space_x = Math.floor(inner_sx*0.02);
	const space_y = Math.round(space_x*0.75);
	const total_col_wid = inner_sx - (nCols - 1)*space_x;
	const col_wid = total_col_wid/nCols;
	const row_wid = padding;
	css.val('workspace-space-x', space_x + 'px');
	css.val('workspace-padding-x', padding + 'px');
	css.val('workspace-space-y', space_y + 'px');
	css.val('workspace-padding-y', padding + 'px');
	for (let i=1; i<=nCols; ++i) {
		const size = Math.floor(col_wid*i + space_x*(i - 1));
		css.val('sx-' + i, size + 'px');
		css.val('sy-' + i, row_wid*i + 'px');
	}
};
$(document).ready(() => {
	workspace = $('#workspace');
	resetDynamicMeasures();
	window.addEventListener('resize', resetDynamicMeasures);
});