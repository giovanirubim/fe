const loadPage = name => new Promise((done, fail) => {
	$.ajax({
		type: 'GET',
		url: `/temp/view/${name}.html`,
		success: html => {
			$('#workspace .main').html(html);
			done();
		},
		error: err => fail(err)
	});
});
const fakeLogin = () => {
	$('#workspace').css({
		left: '50px'
	});
	return loadPage('tourist-home');
};
$(document).ready(() => {
	$('body').on('click', '.ext-login.fb', fakeLogin);
	$('body').on('click', '#login', fakeLogin);
	loadPage('login')
		.then(fakeLogin)
		.then(() => loadPage('tour'));
});