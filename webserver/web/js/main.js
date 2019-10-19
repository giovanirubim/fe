import * as System from '/js/system.js';
$(document).ready(() => {
	System.init();
	System.userGet('/user/list')
		.then(list => console.log(list))
		.catch(err => console.log(err));
});