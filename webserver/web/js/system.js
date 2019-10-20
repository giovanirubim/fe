/* ---------------------------------------------------------------------------------------------- */
/* - Config ------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------- */

const duration = {
	fade: 250
};

/* ---------------------------------------------------------------------------------------------- */
/* - General ------------------------------------------------------------------------------------ */
/* ---------------------------------------------------------------------------------------------- */

const jref = {
	user_bar: null,
	workspace: null,
	shadow: null,
	loader: null,
	locker: null
};

const onresize_queue = [];

const onResize = handler => onresize_queue.push(handler);

const turn = (element, value, now) => new Promise(done => {
	if (value === 'on') {
		if (now) {
			element.css({ opacity: 1 }).show();
			return done();
		}
		element.stop().show().animate({
			opacity: 1
		}, duration.fade, done);
	} else {
		if (now) {
			element.hide().css({ opacity: 0 });
			return done();
		}
		element.stop().animate({
			opacity: 0
		}, duration.fade, () => {
			element.hide();
			done();
		});
	}
});
onResize(() => {
	centerChild(jref.loader);
});

/* ---------------------------------------------------------------------------------------------- */
/* - User bar ----------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------- */

const bindUserBar = () => {
	let state = 'closed';
	const {user_bar, locker} = jref;
	user_bar.bind('click', () => {
		if (state !== 'open') {
			user_bar.addClass('open');
			state = 'opening';
			turn(jref.locker, 'on').then(() => state = 'open');
		}
	});
	locker.bind('click', () => {
		if (state !== 'closed') {
			user_bar.removeClass('open');
			state = 'closing';
			turn(jref.locker, 'off').then(() => state = 'closed');
		}
	});
};

/* ---------------------------------------------------------------------------------------------- */
/* - Forms -------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------- */

const form_init_map = {};

export const addFormInit = (path, handler) => {
	if (form_init_map[path]) {
		throw 'Redefinition of form initializer';
	}
	form_init_map[path] = handler;
};

/* ---------------------------------------------------------------------------------------------- */
/* - Responsiveness ----------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------- */

const centerChild = parent => {
	const int = str => parseInt(str.replace('px', ''));
	const child = parent.children().first();
	const p_sx = int(parent.css('width'));
	const p_sy = int(parent.css('height'));
	const sx = int(child.css('width'));
	const sy = int(child.css('height'));
	child.css({
		left: Math.floor((p_sx - sx)*0.5) + 'px',
		top: Math.floor((p_sy - sy)*0.45) + 'px'
	});
};

/* ---------------------------------------------------------------------------------------------- */
/* - Ajax --------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------- */

let task_counter = 0;
const ocupyWorkspace = () => {
	if (++task_counter === 1) {
		turn(jref.loader, 'on');
	}
};
const freeWorkspace = () => {
	if (--task_counter === 0) {
		turn(jref.loader, 'off');
	}
};
const userRequest = (type, url, data) => new Promise((done, fail) => {
	ocupyWorkspace();
	$.ajax({
		type, url, data,
		success: result => {
			freeWorkspace();
			done(result);
		},
		error: error => {
			freeWorkspace();
			fail(error);
		}
	});
});

export const userGet = (url, data) => userRequest('GET', url, data);
export const userPost = (url, data) => userRequest('POST', url, data);

/* ---------------------------------------------------------------------------------------------- */
/* - Initializer -------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------- */

export const init = () => {
	jref.user_bar = $('#user_bar');
	jref.workspace = $('#workspace');
	jref.shadow = $('#shadow');
	jref.loader = $('#loader');
	jref.locker = $('#locker');
	bindUserBar();
	onresize_queue.forEach(handler => handler());
	$(window).bind('resize', () => onresize_queue.forEach(handler => handler()));
};