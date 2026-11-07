// The commands shown in the palette section of the Home page.
//
// Titles match contributes.commands in the vscabbage package.json. Every
// Cabbage command has the category "Cabbage", so the palette shows
// "Cabbage: <title>". The extension has no default keyboard shortcuts.

export type Command = {
	title: string;
	description: string;
	link: { label: string; href: string };
};

export const commands: Command[] = [
	{
		title: 'Compile Cabbage Instrument',
		description:
			'Saves the .csd and opens the instrument in a panel beside your code. While the Cabbage server is running, every save rebuilds the interface.',
		link: { label: 'Working with instruments', href: '/docs/using/working-with-instruments/' },
	},
	{
		title: 'Edit Mode',
		description:
			'Right-click to add widgets, drag them into place and change their properties in a panel. The JSON in your file is rewritten as you go.',
		link: { label: 'Working with instruments', href: '/docs/using/working-with-instruments/' },
	},
	{
		title: 'Create Vanilla VST3 Synth Project (Custom UI)',
		description:
			'Scaffolds a complete plugin with a plain HTML, CSS and JavaScript front end, already wired to the Cabbage JS API. Bring Svelte, React or Vue when you are ready.',
		link: { label: 'Custom interfaces', href: '/docs/custom-ui/custom-interfaces/' },
	},
	{
		title: 'Export as CLAP Effect',
		description:
			'Exports the instrument as a plugin. Effects and synths build as VST3 or CLAP, and as AUv2 on macOS, where MIDI effects are supported too.',
		link: { label: 'Exporting instruments', href: '/docs/using/exporting/' },
	},
	{
		title: 'Export as VST3 Effect (ARA)',
		description:
			'Builds an ARA plugin, which gives Csound direct access to the audio on the DAW timeline instead of waiting for it in real time.',
		link: { label: 'ARA support', href: '/docs/using/ara-support/' },
	},
	{
		title: 'Start Recording to WAV',
		description: 'Records the instrument output to a WAV file while you play, in 16-bit or 32-bit float.',
		link: { label: 'Commands and settings', href: '/docs/using/commands/' },
	},
	{
		title: 'Make for Daisy',
		description: 'Compiles the current .csd for the Electrosmith Daisy hardware platform.',
		link: { label: 'Commands and settings', href: '/docs/using/commands/' },
	},
	{
		title: 'Import Cabbage 2 Instrument',
		description: 'Creates a Cabbage 3 copy of a Cabbage 2 instrument, with warnings for conversion work to review.',
		link: { label: 'Commands and settings', href: '/docs/using/commands/' },
	},
	{
		title: 'Select Widget Kit',
		description:
			'Switches the themed widget set used by the instrument UI. A kit can override built-in widget types without changing the .csd, and missing types fall back to the built-ins.',
		link: { label: 'Widget kits', href: '/docs/custom-ui/widget-kits/' },
	},
];

/** The command that is selected when the page loads. */
export const defaultCommand = 3;
