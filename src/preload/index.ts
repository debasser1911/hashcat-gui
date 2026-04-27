import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";

// Custom APIs for renderer
const api = {
	selectDirectory: () => ipcRenderer.invoke("dialog:selectDirectory"),
	selectFile: () => ipcRenderer.invoke("dialog:selectFile"),
	readHashcatDir: (dirPath: string) =>
		ipcRenderer.invoke("fs:readHashcatDir", dirPath),
	startHashcat: (dirPath: string, args: string[]) =>
		ipcRenderer.invoke("hashcat:start", dirPath, args),
	stopHashcat: () => ipcRenderer.invoke("hashcat:stop"),
	writeHashcat: (input: string) => ipcRenderer.invoke("hashcat:write", input),
	onHashcatOutput: (callback: (data: string) => void) => {
		const listener = (_: any, data: string) => callback(data);
		ipcRenderer.on("hashcat:output", listener);
		return () => ipcRenderer.removeListener("hashcat:output", listener);
	},
	onHashcatError: (callback: (data: string) => void) => {
		const listener = (_: any, data: string) => callback(data);
		ipcRenderer.on("hashcat:error", listener);
		return () => ipcRenderer.removeListener("hashcat:error", listener);
	},
	onHashcatExit: (callback: (code: number | null) => void) => {
		const listener = (_: any, code: number | null) => callback(code);
		ipcRenderer.on("hashcat:exit", listener);
		return () => ipcRenderer.removeListener("hashcat:exit", listener);
	},
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
	try {
		contextBridge.exposeInMainWorld("electron", electronAPI);
		contextBridge.exposeInMainWorld("api", api);
	} catch (error) {
		console.error(error);
	}
} else {
	// @ts-expect-error (define in dts)
	window.electron = electronAPI;
	// @ts-expect-error (define in dts)
	window.api = api;
}
