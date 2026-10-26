// The Cabbage 3 videos, in playlist order. The Learn page, the Home teaser
// and the title card generator all read this list.
//
// To add a video: add one line here with the ID from its YouTube URL
// (youtube.com/watch?v=THE_ID). Then run `npm run title-cards` to make its
// title card and thumbnail. Until you do, the page draws the card itself.
//
// This file is also imported by a plain Node script, so it must not import
// anything.

export type Video = {
	/** The YouTube video ID. */
	id: string;
	/** "Overview", or the lesson number. */
	lesson: number | 'Overview';
	/** The full title, shown under the card. */
	title: string;
	/** The short title, shown on the title card. */
	shortTitle: string;
};

export const playlistUrl = 'https://www.youtube.com/playlist?list=PLPHJAwcqO_C0';

export const videos: Video[] = [
	{ id: 'tBcK2GkMOQQ', lesson: 'Overview', title: 'Cabbage 3 overview and features', shortTitle: 'What is new and how it fits together' },
	{ id: 'Z8OCGgWn42A', lesson: 1, title: 'Installing Cabbage 3', shortTitle: 'Installing Cabbage 3' },
	{ id: 'e9FaofZeC8U', lesson: 2, title: 'Using the Cabbage VS Code extension', shortTitle: 'Using the VS Code extension' },
	{ id: '3c-1U2vR54E', lesson: 3, title: 'File structure in Csound 7 and Cabbage 3', shortTitle: 'File structure' },
	{ id: 'wD1TFHvFFXQ', lesson: 4, title: 'Variables in Csound 7 and Cabbage 3', shortTitle: 'Variables' },
	{ id: 'AHvR9NoPlBo', lesson: 5, title: 'Opcodes in Csound 7 and Cabbage 3', shortTitle: 'Opcodes' },
	{ id: 'Dme2FJ_3H3s', lesson: 6, title: 'Note events with Cabbage 3', shortTitle: 'Note events' },
	{ id: 'K6-pg1RPRfw', lesson: 7, title: 'Widgets with Cabbage 3', shortTitle: 'Widgets' },
	{ id: '2fD5TbgqH2Q', lesson: 8, title: 'Building a simple synth plugin', shortTitle: 'Building a simple synth plugin' },
	{ id: 'lKrG_--aVGk', lesson: 9, title: 'Exporting instruments in Cabbage 3', shortTitle: 'Exporting instruments' },
	{ id: 'ML7iq1PYhU8', lesson: 10, title: 'Custom UIs with Cabbage 3', shortTitle: 'Custom UIs' },
	{ id: 'v=gLdVu9PsK_k', lesson: 11, title: 'Custom Widgets in Cabbage 3', shortTitle: 'Custom Widgets' }
];

/** "Overview" or "Lesson 8". */
export function lessonLabel(video: Video): string {
	return video.lesson === 'Overview' ? 'Overview' : `Lesson ${video.lesson}`;
}

/** The title with its lesson number: "8. Building a simple synth plugin". */
export function numberedTitle(video: Video): string {
	return video.lesson === 'Overview' ? video.title : `${video.lesson}. ${video.title}`;
}

export function watchUrl(video: Video): string {
	return `https://www.youtube.com/watch?v=${video.id}`;
}

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];

/** A count in words, as the page copy has it: "eleven". Figures above twenty. */
export function inWords(count: number, capital = false): string {
	const word = WORDS[count] ?? String(count);
	return capital ? word.charAt(0).toUpperCase() + word.slice(1) : word;
}

/** How many videos there are, and how many of them are numbered lessons. */
export const videoCount = videos.length;
export const lessonCount = videos.filter((video) => video.lesson !== 'Overview').length;
