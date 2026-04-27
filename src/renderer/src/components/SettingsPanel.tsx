import type React from "react";

export type SettingsPanelProps = {
	hashcatPath: string;
	handleSelectHashcatDir: () => void;
	hashFile: string;
	handleSelectHashFile: () => void;
	hashType: string;
	setHashType: (v: string) => void;
	attackMode: string;
	setAttackMode: (v: string) => void;
	ignorePotfile: boolean;
	setIgnorePotfile: (v: boolean) => void;
	wordlists: string[];
	selectedWordlist: string;
	setSelectedWordlist: (v: string) => void;
	rules: string[];
	selectedRule: string;
	setSelectedRule: (v: string) => void;
	mask: string;
	setMask: React.Dispatch<React.SetStateAction<string>>;
	onOpenAbout: () => void;
};

export const SettingsPanel = ({
	hashcatPath,
	handleSelectHashcatDir,
	hashFile,
	handleSelectHashFile,
	hashType,
	setHashType,
	attackMode,
	setAttackMode,
	ignorePotfile,
	setIgnorePotfile,
	wordlists,
	selectedWordlist,
	setSelectedWordlist,
	rules,
	selectedRule,
	setSelectedRule,
	mask,
	setMask,
	onOpenAbout,
}: SettingsPanelProps) => {
	return (
		<div className="panel settings-panel">
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "8px",
				}}
			>
				<h2 style={{ margin: 0 }}>Settings</h2>
				<button type="button" className="btn-clear-text" onClick={onOpenAbout}>
					About
				</button>
			</div>

			<div className="form-group">
				<label htmlFor="hashcatDir">Hashcat Directory</label>
				<div className="file-input-wrapper">
					<input
						id="hashcatDir"
						type="text"
						readOnly
						value={hashcatPath}
						placeholder="Select Hashcat folder..."
					/>
					<button onClick={handleSelectHashcatDir} type="button">
						Browse
					</button>
				</div>
			</div>

			<div className="form-group">
				<label htmlFor="hashFile">Target Hash File</label>
				<div className="file-input-wrapper">
					<input
						id="hashFile"
						type="text"
						readOnly
						value={hashFile}
						placeholder="Select file with hashes..."
					/>
					<button onClick={handleSelectHashFile} type="button">
						Browse
					</button>
				</div>
			</div>

			<div className="form-group">
				<label htmlFor="hashType">Hash Type (-m)</label>
				<select
					id="hashType"
					value={hashType}
					onChange={(e) => setHashType(e.target.value)}
				>
					<option value="0">MD5 (0)</option>
					<option value="100">SHA1 (100)</option>
					<option value="1000">NTLM (1000)</option>
					<option value="1800">SHA-512 (1800)</option>
					<option value="2500">WPA/WPA2 .hccapx (2500)</option>
					<option value="22000">WPA-PBKDF2-PMKID+EAPOL .hc22000 (22000)</option>
					<option value="3200">bcrypt (3200)</option>
				</select>
			</div>

			<div className="form-group">
				<label htmlFor="attackMode">Attack Mode (-a)</label>
				<select
					id="attackMode"
					value={attackMode}
					onChange={(e) => setAttackMode(e.target.value)}
				>
					<option value="0">Dictionary / Wordlist (0)</option>
					<option value="3">Brute-force / Mask (3)</option>
				</select>
			</div>

			<div className="form-group checkbox-group">
				<input
					type="checkbox"
					id="ignorePotfile"
					checked={ignorePotfile}
					onChange={(e) => setIgnorePotfile(e.target.checked)}
				/>
				<label htmlFor="ignorePotfile">
					Ignore Potfile (--potfile-disable)
				</label>
			</div>

			{attackMode === "0" && (
				<>
					<div className="form-group">
						<label htmlFor="wordlist">Wordlist</label>
						<select
							id="wordlist"
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
						<label htmlFor="rule">Rule (Optional)</label>
						<select
							id="rule"
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
					<label htmlFor="maskPattern" className="mask-pattern-header">
						<span>Mask Pattern</span>
						<button
							type="button"
							className="btn-clear-text"
							onClick={() => setMask("")}
						>
							Clear
						</button>
					</label>
					<input
						id="maskPattern"
						type="text"
						value={mask}
						onChange={(e) => setMask(e.target.value)}
						placeholder="e.g. ?a?a?a?a"
						className="input-monospace"
					/>
					<div
						style={{
							background: "rgba(0,0,0,0.2)",
							padding: "12px",
							borderRadius: "8px",
							fontSize: "0.9rem",
						}}
					>
						<div className="mask-buttons-grid">
							<button
								type="button"
								onClick={() => setMask((prev) => `${prev}?l`)}
								title="Lowercase (a-z)"
							>
								?l (a-z)
							</button>
							<button
								type="button"
								onClick={() => setMask((prev) => `${prev}?u`)}
								title="Uppercase (A-Z)"
							>
								?u (A-Z)
							</button>
							<button
								type="button"
								onClick={() => setMask((prev) => `${prev}?d`)}
								title="Digits (0-9)"
							>
								?d (0-9)
							</button>
							<button
								type="button"
								onClick={() => setMask((prev) => `${prev}?s`)}
								title="Special Characters (!@#...)"
							>
								?s (!@#$)
							</button>
							<button
								type="button"
								className="btn-full-width"
								onClick={() => setMask((prev) => `${prev}?a`)}
								title="All (l,u,d,s)"
							>
								?a (ALL)
							</button>
						</div>

						<div style={{ marginTop: "12px" }}>
							<strong>Presets:</strong>
							<select
								className="mt-4 p-6"
								onChange={(e) => setMask(e.target.value)}
								value={
									[
										"?d?d?d?d?d?d?d?d",
										"?l?l?l?l?l?l?l?l",
										"?u?l?l?l?l?l?l?d?d",
										"?a?a?a?a?a?a",
										"0?d?d?d?d?d?d?d?d?d",
									].includes(mask)
										? mask
										: ""
								}
							>
								<option value="">-- Custom presets --</option>
								<option value="?d?d?d?d?d?d?d?d">
									8 numbers (eg. 12345678)
								</option>
								<option value="?l?l?l?l?l?l?l?l">
									8 lowercase letters (eg. password)
								</option>
								<option value="?u?l?l?l?l?l?l?d?d">
									word + 2 numbers (eg. Mysecret99)
								</option>
								<option value="?a?a?a?a?a?a">6 any chars</option>
								<option value="0?d?d?d?d?d?d?d?d?d">
									10 numbers (Ukraine mobile bumber 099...)
								</option>
							</select>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
