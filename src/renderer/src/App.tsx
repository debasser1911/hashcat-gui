import { useEffect, useRef, useState } from "react";

function App(): JSX.Element {
	const [hashcatPath, setHashcatPath] = useState<string>("");
	const [rules, setRules] = useState<string[]>([]);
	const [wordlists, setWordlists] = useState<string[]>([]);

	const [hashFile, setHashFile] = useState<string>("");
	const [hashType, setHashType] = useState<string>("0");
	const [attackMode, setAttackMode] = useState<string>("0"); // 0 = Wordlist, 3 = Brute-force
	const [selectedWordlist, setSelectedWordlist] = useState<string>("");
	const [selectedRule, setSelectedRule] = useState<string>("");
	const [mask, setMask] = useState<string>("?a?a?a?a");

	const [isRunning, setIsRunning] = useState<boolean>(false);
	const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
	const consoleRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Scroll console to bottom
		if (consoleRef.current) {
			consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
		}
	}, [consoleOutput]);

	useEffect(() => {
		// Listeners for IPC events
		const removeOutputListener = window.api.onHashcatOutput((data) => {
			setConsoleOutput((prev) => [...prev, data]);
		});

		const removeErrorListener = window.api.onHashcatError((data) => {
			setConsoleOutput((prev) => [...prev, `[ERROR] ${data}`]);
		});

		const removeExitListener = window.api.onHashcatExit((code) => {
			setConsoleOutput((prev) => [
				...prev,
				`\n[PROCESS EXITED WITH CODE: ${code}]`,
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

		await window.api.startHashcat(hashcatPath, args);
	};

	const handleStop = async () => {
		const stopped = await window.api.stopHashcat();
		if (stopped) setIsRunning(false);
	};

	const clearConsole = () => {
		setConsoleOutput([]);
	};

	const sendCommand = (cmd: string) => {
		window.api.writeHashcat(cmd);
	};

	return (
		<div className="app-container">
			<div className="panel settings-panel">
				<h2>Settings</h2>

				<div className="form-group">
					<label>Hashcat Directory</label>
					<div className="file-input-wrapper">
						<input
							type="text"
							readOnly
							value={hashcatPath}
							placeholder="Select Hashcat folder..."
						/>
						<button onClick={handleSelectHashcatDir}>Browse</button>
					</div>
				</div>

				<div className="form-group">
					<label>Target Hash File</label>
					<div className="file-input-wrapper">
						<input
							type="text"
							readOnly
							value={hashFile}
							placeholder="Select file with hashes..."
						/>
						<button onClick={handleSelectHashFile}>Browse</button>
					</div>
				</div>

				<div className="form-group">
					<label>Hash Type (-m)</label>
					<select
						value={hashType}
						onChange={(e) => setHashType(e.target.value)}
					>
						<option value="0">MD5 (0)</option>
						<option value="100">SHA1 (100)</option>
						<option value="1000">NTLM (1000)</option>
						<option value="1800">SHA-512 (1800)</option>
						<option value="2500">WPA/WPA2 .hccapx (2500)</option>
						<option value="22000">
							WPA-PBKDF2-PMKID+EAPOL .hc22000 (22000)
						</option>
						<option value="3200">bcrypt (3200)</option>
					</select>
				</div>

				<div className="form-group">
					<label>Attack Mode (-a)</label>
					<select
						value={attackMode}
						onChange={(e) => setAttackMode(e.target.value)}
					>
						<option value="0">Dictionary / Wordlist (0)</option>
						<option value="3">Brute-force / Mask (3)</option>
					</select>
				</div>

				{attackMode === "0" && (
					<>
						<div className="form-group">
							<label>Wordlist</label>
							<select
								value={selectedWordlist}
								onChange={(e) => setSelectedWordlist(e.target.value)}
							>
								<option value="">-- Select Wordlist --</option>
								{wordlists.map((wl) => (
									<option key={wl} value={wl}>
										{wl}
									</option>
								))}
							</select>
						</div>

						<div className="form-group">
							<label>Rule (Optional)</label>
							<select
								value={selectedRule}
								onChange={(e) => setSelectedRule(e.target.value)}
							>
								<option value="">-- No Rule --</option>
								{rules.map((rule) => (
									<option key={rule} value={rule}>
										{rule}
									</option>
								))}
							</select>
						</div>
					</>
				)}

				{attackMode === "3" && (
					<div className="form-group">
						<label style={{ display: "flex", justifyContent: "space-between" }}>
							<span>Mask Pattern</span>
							<span
								style={{ cursor: "pointer", color: "var(--accent)" }}
								onClick={() => setMask("")}
							>
								Clear
							</span>
						</label>
						<input
							type="text"
							value={mask}
							onChange={(e) => setMask(e.target.value)}
							placeholder="e.g. ?a?a?a?a"
							style={{ fontFamily: "monospace", letterSpacing: "2px" }}
						/>

						<div style={{ marginTop: "8px", fontSize: "0.85rem" }}>
							<div style={{ color: "var(--text-muted)", marginBottom: "4px" }}>
								Quick Insert:
							</div>
							<div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
								<button
									type="button"
									onClick={() => setMask((m) => m + "?l")}
									style={{
										padding: "4px 8px",
										fontSize: "0.8rem",
										background: "rgba(255,255,255,0.1)",
									}}
									title="Lowercase (a-z)"
								>
									?l (a-z)
								</button>
								<button
									type="button"
									onClick={() => setMask((m) => m + "?u")}
									style={{
										padding: "4px 8px",
										fontSize: "0.8rem",
										background: "rgba(255,255,255,0.1)",
									}}
									title="Uppercase (A-Z)"
								>
									?u (A-Z)
								</button>
								<button
									type="button"
									onClick={() => setMask((m) => m + "?d")}
									style={{
										padding: "4px 8px",
										fontSize: "0.8rem",
										background: "rgba(255,255,255,0.1)",
									}}
									title="Digits (0-9)"
								>
									?d (0-9)
								</button>
								<button
									type="button"
									onClick={() => setMask((m) => m + "?s")}
									style={{
										padding: "4px 8px",
										fontSize: "0.8rem",
										background: "rgba(255,255,255,0.1)",
									}}
									title="Special Characters (!@#...)"
								>
									?s (Спец)
								</button>
								<button
									type="button"
									onClick={() => setMask((m) => m + "?a")}
									style={{
										padding: "4px 8px",
										fontSize: "0.8rem",
										background: "rgba(255,255,255,0.1)",
									}}
									title="All (l,u,d,s)"
								>
									?a (Всі)
								</button>
							</div>

							<div style={{ marginTop: "12px", color: "var(--text-muted)" }}>
								<strong>Presets:</strong>
								<select
									style={{ marginTop: "4px", padding: "6px" }}
									onChange={(e) => e.target.value && setMask(e.target.value)}
									value=""
								>
									<option value="">-- Вибрати шаблон --</option>
									<option value="?d?d?d?d?d?d?d?d">
										8 Цифр (напр. 12345678)
									</option>
									<option value="?l?l?l?l?l?l?l?l">
										8 Маленьких літер (напр. password)
									</option>
									<option value="?u?l?l?l?l?l?l?d?d">
										Слово + 2 Цифри (напр. Mysecret99)
									</option>
									<option value="?a?a?a?a?a?a">6 Будь-яких символів</option>
									<option value="0?d?d?d?d?d?d?d?d?d">
										10 Цифр (Український мобільний 099...)
									</option>
								</select>
							</div>
						</div>
					</div>
				)}
			</div>

			<div className="panel console-panel">
				<h2>Terminal</h2>
				<div className="console-output" ref={consoleRef}>
					{consoleOutput.length === 0
						? "Ready to crack...\n"
						: consoleOutput.join("")}
				</div>
				<div className="console-actions">
					<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
						<button
							style={{
								background: "transparent",
								border: "1px solid var(--glass-border)",
							}}
							onClick={clearConsole}
						>
							Clear
						</button>
						{isRunning && (
							<>
								<button
									style={{ background: "rgba(255,255,255,0.1)" }}
									onClick={() => sendCommand("s")}
								>
									Status (s)
								</button>
								<button
									style={{ background: "rgba(255,255,255,0.1)" }}
									onClick={() => sendCommand("p")}
								>
									Pause (p)
								</button>
								<button
									style={{ background: "rgba(255,255,255,0.1)" }}
									onClick={() => sendCommand("r")}
								>
									Resume (r)
								</button>
								<button
									style={{ background: "rgba(255,255,255,0.1)" }}
									onClick={() => sendCommand("b")}
								>
									Bypass (b)
								</button>
								<button
									style={{ background: "rgba(255,255,255,0.1)" }}
									onClick={() => sendCommand("c")}
								>
									Checkpoint (c)
								</button>
							</>
						)}
					</div>
					<div style={{ display: "flex", gap: "10px" }}>
						{!isRunning ? (
							<button onClick={handleStart}>Start Attack</button>
						) : (
							<button className="danger" onClick={() => sendCommand("q")}>
								Quit (q)
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
