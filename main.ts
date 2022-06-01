import { Plugin, Editor } from "obsidian";
/* eslint spaced-comment: "off" */

export default class ObsidianSemBr extends Plugin {

	async onload() {
		console.log("Semantic Line Breaker Plugin loaded.");

		this.addCommand({
			id: "toggle-sem-br",
			name: "Toggle Semantic Line Breaks",
			editorCallback: (editor) => this.toggleSemBr(editor),
		});
	}

	async onunload() { console.log("Semantic Line Breaker Plugin unloaded.") }

	async toggleSemBr (editor: Editor) {
		// read note
		let noteContent = editor.getValue()
			.replace(/\n+$/, ""); // remove line breaks at end of file to recognize last line properly

		// cut out yaml header, if the text has it
		const yamlHeader = noteContent.match(/^---\n.*?---\n/s);
		if (yamlHeader) noteContent = noteContent.replace(yamlHeader[0], "");

		// cut out code blocks (TODO: use a proper tree for that...)
		const noteHasCodeBlock = noteContent.includes("```");
		const codeBlockArr: string[] = [];
		let proseTextArr = [];
		if (noteHasCodeBlock) {
			let i = 0;
			noteContent.split("```").forEach(part => {
				const evenElementIndex = (i % 2) === 0;

				if (evenElementIndex) proseTextArr.push(part);
				else codeBlockArr.push(part);

				i++;
			});
		} else {
			proseTextArr.push(noteContent);
		}

		// TOGGLE SEMBR
		const isSemanticLineBreaked = /[.,:;?!—] ?\n(?!\n)/.test(noteContent);

		proseTextArr = proseTextArr.map(prose => {
			if (isSemanticLineBreaked) return prose.replace (/([.,:;?!—]) ?\n(?!\n)/gm, "$1 ");

			return prose.replace (
				/([^.,|]{15,}?[^\]:1-9][.,:;?!—](?: ?\[.+\])? )(?!\n\n| |.*\|.*$)/gm,
				//(1         )(2      )(3      )(4         )(5)(6               )
				//(     $1                                    )
				// 1: 15 chars minimum (non-greedy), all without another , or .  occuring
				//    pipes (|), too, aren't allowed (tables)
				// 2: not ending with ]: (footnotes), :: (dataview inline fields), or
				//    digit (enumration or floating number)
				// 3: ending with a punctuation as defined in SemBr specification §4 and §5
				// 4: optionally followed by a footnote like `[^1]`
				// 5: space after punctuation in prose text
				// 6: not followed by two line breaks (blank line),
				//    another space (Markdown Two-Space Rule),
				//    or a pipe character somewhere till the end of the line (Table)

				"$1\n"); // add the line break
		});

		// put YAML & code blocks back
		if (yamlHeader) noteContent = yamlHeader[0] + noteContent;
		if (noteHasCodeBlock) {
			const tempArr = [];
			for (let i = 0; i < proseTextArr.length; i++) {
				tempArr.push(proseTextArr[i]);
				tempArr.push(codeBlockArr[i]);
			}
			noteContent = tempArr.join("```");
		} else {
			noteContent = proseTextArr[0];
		}

		// add line break at document end back
		noteContent += "\n";

		// write note
		editor.setValue(noteContent);
	}

}
