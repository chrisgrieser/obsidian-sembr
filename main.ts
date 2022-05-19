import { Plugin } from "obsidian";

export default class SemBr extends Plugin {

	async onload() { console.log("Semantic Line Breaker Plugin loaded.") }

	async onunload() { console.log("Semantic Line Breaker Plugin unloaded.") }

}
