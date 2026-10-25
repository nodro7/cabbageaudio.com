// Install page: let the visitor switch between operating systems.
//
// The page names the visitor's own system in <head>, before the first paint
// (data-os on <html>), and the styles show only that one. This script marks
// the matching button and handles the switch. Without it all three systems
// are listed, each under its own heading. Nothing is fetched here.

const control = document.querySelector('[data-os-control]');

if (control) {
	const root = document.documentElement;
	const buttons = [...control.querySelectorAll('[data-value]')];
	const hint = control.querySelector('[data-os-hint]');

	function select(os) {
		root.dataset.os = os;
		for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.value === os));
	}

	// Set in <head>. Missing on phones, tablets and anything unknown.
	const detected = root.dataset.os;
	if (detected) select(detected);
	else if (hint) hint.textContent = 'Choose your operating system.';

	for (const button of buttons) {
		button.addEventListener('click', () => {
			select(button.dataset.value);
			if (hint) hint.textContent = '';
		});
	}
}

// Windows ships as x64 and ARM64 packages. The page lists x64 first, in
// green, because it is the safe guess: it also installs on an ARM64 PC,
// the reverse does not. Only Chromium browsers (Chrome, Edge, Brave) can
// say which chip they run on; a native ARM64 browser's user agent string
// still claims "x64". When they report ARM64 that download goes first and
// takes the green. Everyone else keeps the x64 default and the hint.
const archControl = document.querySelector('[data-arch-control]');
const agent = navigator.userAgentData;

if (archControl && agent && typeof agent.getHighEntropyValues === 'function') {
	agent
		.getHighEntropyValues(['architecture'])
		.then((values) => {
			if (values.architecture !== 'arm') return;
			document.documentElement.dataset.arch = 'arm64';
			for (const button of archControl.querySelectorAll('[data-arch] .btn')) {
				const preferred = button.closest('[data-arch]').dataset.arch === 'arm64';
				button.classList.toggle('btn-primary', preferred);
				button.classList.toggle('btn-quiet', !preferred);
			}
			const archHint = archControl.querySelector('[data-arch-hint]');
			if (archHint) archHint.textContent = 'Your browser reports an ARM64 PC.';
		})
		.catch(() => {});
}
