import { useEffect, useRef, useState } from "react";
import { TerminalPanel } from "./components/TerminalPanel";
import { SettingsPanel } from "./components/SettingsPanel";
import Versions from "./components/Versions";

function App(): React.JSX.Element {
	const [hashcatPath, setHashcatPath] = useState<string>("");
	const [rules, setRules] = useState<string[]>([]);
	const [wordlists, setWordlists] = useState<string[]>([]);
	const [hashFile, setHashFile] = useState<string>("");
	const [hashType, setHashType] = useState<string>("0");
	const [attackMode, setAttackMode] = useState<string>(
		() => localStorage.getItem("attackMode") || "0",
	);
	const [selectedWordlist, setSelectedWordlist] = useState<string>("");
	const [selectedRule, setSelectedRule] = useState<string>("");
	const [mask, setMask] = useState<string>("?a?a?a?a");
	const [ignorePotfile, setIgnorePotfile] = useState<boolean>(false);
	const [isRunning, setIsRunning] = useState<boolean>(false);
	const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
	const [lastCommand, setLastCommand] = useState<string>("");
	const [autoScroll, setAutoScroll] = useState<boolean>(true);
	const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
	const consoleRef = useRef<HTMLDivElement>(null);

	// Save attack mode whenever it changes
	useEffect(() => {
		localStorage.setItem("attackMode", attackMode);
	}, [attackMode]);

	// Auto-load Hashcat directory on startup
	useEffect(() => {
		const loadSavedDir = async () => {
			const savedPath = localStorage.getItem("hashcatPath");
			if (savedPath) {
				try {
					const data = await window.api.readHashcatDir(savedPath);
					setRules(data.rules);
					setWordlists(data.wordlists);
					if (data.wordlists.length > 0) setSelectedWordlist(data.wordlists[0]);
					if (data.rules.length > 0) setSelectedRule(data.rules[0]);
					setHashcatPath(savedPath);
				} catch (e) {
					console.error("Failed to load saved hashcat dir", e);
				}
			}
		};
		loadSavedDir();
	}, []);

	useEffect(() => {
		// Scroll console to bottom
		if (autoScroll && consoleRef.current) {
			consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
		}
	}, [autoScroll]);

	useEffect(() => {
		// Listeners for IPC events
		const removeOutputListener = window.api.onHashcatOutput((data) => {
			setConsoleOutput((prev) => {
				const newLog = [...prev, data];
				if (newLog.length > 500) return newLog.slice(newLog.length - 500);
				return newLog;
			});
		});

		const removeErrorListener = window.api.onHashcatError((data) => {
			setConsoleOutput((prev) => {
				const newLog = [...prev, `[ERROR] ${data}`];
				if (newLog.length > 500) return newLog.slice(newLog.length - 500);
				return newLog;
			});
		});

		const removeExitListener = window.api.onHashcatExit((code) => {
			setConsoleOutput((prev) => [
				...prev,
				`\n[PROCESS EXITED WITH CODE: ${code}]\n`,
			]);
			setIsRunning(false);
		});

		return () => {
			removeOutputListener();
			removeErrorListener();
			removeExitListener();
		};
	}, []);

	const handleSelectHashcatDir = async () => {
		const dir = await window.api.selectDirectory();
		if (dir) {
			setHashcatPath(dir);
			localStorage.setItem("hashcatPath", dir);
			// Read dictionaries and rules
			const data = await window.api.readHashcatDir(dir);
			setRules(data.rules);
			setWordlists(data.wordlists);
			if (data.wordlists.length > 0) setSelectedWordlist(data.wordlists[0]);
			if (data.rules.length > 0) setSelectedRule(data.rules[0]);
		}
	};

	const handleSelectHashFile = async () => {
		const file = await window.api.selectFile();
		if (file) {
			setHashFile(file);

			// Auto-detect hash type based on file extension
			const lowerFile = file.toLowerCase();
			if (lowerFile.endsWith(".hc22000")) {
				setHashType("22000");
			} else if (lowerFile.endsWith(".hccapx")) {
				setHashType("2500");
			}
		}
	};

	const handleStart = async () => {
		if (!hashcatPath) return alert("Please select Hashcat directory first!");
		if (!hashFile) return alert("Please select a hash file!");

		setConsoleOutput([]);
		setIsRunning(true);

		// Build args
		const args: string[] = [];
		args.push("-m", hashType);
		args.push("-a", attackMode);
		args.push(hashFile);

		if (attackMode === "0") {
			if (selectedWordlist) {
				args.push(selectedWordlist);
			} else {
				setIsRunning(false);
				return alert("Please select a wordlist for Dictionary attack!");
			}

			if (selectedRule) {
				args.push("-r", `rules/${selectedRule}`);
			}
		} else if (attackMode === "3") {
			args.push(mask);
		}

		if (ignorePotfile) {
			args.push("--potfile-disable");
		}

		setLastCommand(`hashcat ${args.join(" ")}`);

		await window.api.startHashcat(hashcatPath, args);
	};

	const clearConsole = () => {
		setConsoleOutput([]);
	};

	const sendCommand = (cmd: string) => {
		window.api.writeHashcat(cmd);

		// Force scroll to bottom immediately when sending a command
		setTimeout(() => {
			if (consoleRef.current) {
				consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
			}
		}, 50);
	};

	return (
		<div className="app-container">
			<SettingsPanel
				hashcatPath={hashcatPath}
				handleSelectHashcatDir={handleSelectHashcatDir}
				hashFile={hashFile}
				handleSelectHashFile={handleSelectHashFile}
				hashType={hashType}
				setHashType={setHashType}
				attackMode={attackMode}
				setAttackMode={setAttackMode}
				ignorePotfile={ignorePotfile}
				setIgnorePotfile={setIgnorePotfile}
				wordlists={wordlists}
				selectedWordlist={selectedWordlist}
				setSelectedWordlist={setSelectedWordlist}
				rules={rules}
				selectedRule={selectedRule}
				setSelectedRule={setSelectedRule}
				mask={mask}
				setMask={setMask}
				onOpenAbout={() => setIsAboutOpen(true)}
			/>

			<TerminalPanel
				consoleOutput={consoleOutput}
				lastCommand={lastCommand}
				autoScroll={autoScroll}
				setAutoScroll={setAutoScroll}
				consoleRef={consoleRef}
				clearConsole={clearConsole}
				sendCommand={sendCommand}
				isRunning={isRunning}
				handleStart={handleStart}
			/>

			<Versions isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
		</div>
	);
}

export default App;
