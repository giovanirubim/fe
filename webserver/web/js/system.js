const form_init_map = {};

const jref = {
	user_bar: null,
	workspace: null,
	shadow: null
};

let task_counter = 0;
const ocupyWorkspace = () => {
	if (++task_counter === 1) {
		jref.shadow.show();
	}
};
const freeWorkspace = () => {
	if (--task_counter === 0) {
		jref.shadow.hide();
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

export const addFormInit = (path, handler) => {
	if (form_init_map[path]) {
		throw 'Redefinition of form initializer';
	}
	form_init_map[path] = handler;
};

export const init = () => {
	jref.user_bar = $('#user_bar');
	jref.workspace = $('#workspace');
	jref.shadow = $('#shadow');
};