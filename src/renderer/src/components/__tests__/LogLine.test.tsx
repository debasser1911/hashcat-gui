import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LogLine } from "../LogLine";

describe("LogLine Component", () => {
	it("renders plain text without special formatting", () => {
		render(<LogLine text="Just a normal log string" />);
		expect(screen.getByText("Just a normal log string")).toBeInTheDocument();
	});

	it("formats WARNING lines in red color", () => {
		render(<LogLine text="[ERROR] Something went wrong" />);
		const element = screen.getByText("[ERROR] Something went wrong");
		expect(element).toBeInTheDocument();
		expect(element).toHaveStyle({ color: "rgb(255, 85, 85)" }); // #ff5555
	});

	it("formats Status lines correctly when Cracked", () => {
		render(<LogLine text="Status...........: Cracked" />);
		expect(
			screen.getByText(/Status\.\.\.\.\.\.\.\.\.\.\.:/),
		).toBeInTheDocument();
		const crackedValue = screen.getByText(/Cracked/);
		expect(crackedValue).toBeInTheDocument();
		expect(crackedValue).toHaveStyle({
			color: "rgb(80, 250, 123)",
			fontWeight: "bold",
		}); // #50fa7b
	});

	it("formats Status lines correctly when Running", () => {
		render(<LogLine text="Status...........: Running" />);
		const runningValue = screen.getByText(/Running/);
		expect(runningValue).toBeInTheDocument();
		expect(runningValue).toHaveStyle({
			color: "rgb(139, 233, 253)",
			fontWeight: "normal",
		}); // #8be9fd
	});

	it("formats Progress lines in yellow", () => {
		render(<LogLine text="Progress.........: 15/100 (15.00%)" />);
		expect(screen.getByText(/Progress\.\.\.\.\.\.\.\.\.:/)).toBeInTheDocument();
		const progressValue = screen.getByText(/15\/100 \(15.00%\)/);
		expect(progressValue).toHaveStyle({ color: "rgb(241, 250, 140)" }); // #f1fa8c
	});

	it("formats Speed lines in orange", () => {
		render(<LogLine text="Speed.#1.........:  100.0 MH/s" />);
		expect(
			screen.getByText(/Speed\.#1\.\.\.\.\.\.\.\.\.:/),
		).toBeInTheDocument();
		const speedValue = screen.getByText(/100.0 MH\/s/);
		expect(speedValue).toHaveStyle({ color: "rgb(255, 184, 108)" }); // #ffb86c
	});

	it("formats Time Estimated lines in purple", () => {
		render(<LogLine text="Time.Estimated...: 2 hours, 15 mins" />);
		expect(screen.getByText(/Time\.Estimated\.\.\.:/)).toBeInTheDocument();
		const timeValue = screen.getByText(/2 hours, 15 mins/);
		expect(timeValue).toHaveStyle({ color: "rgb(189, 147, 249)" }); // #bd93f9
	});

	it("formats Recovered passwords in bold green", () => {
		render(<LogLine text="Recovered........: 5/10 (50.00%) Digests" />);
		expect(screen.getByText(/Recovered\.\.\.\.\.\.\.\.:/)).toBeInTheDocument();
		const recoveredValue = screen.getByText(/5\/10 \(50.00%\) Digests/);
		expect(recoveredValue).toHaveStyle({
			color: "rgb(80, 250, 123)",
			fontWeight: "bold",
		}); // #50fa7b
	});

	it("handles multi-line chunks correctly", () => {
		const chunk = "Line 1\nStatus...........: Running\nLine 3";
		render(<LogLine text={chunk} />);
		expect(screen.getByText("Line 1")).toBeInTheDocument();
		expect(screen.getByText(/Running/)).toBeInTheDocument();
		expect(screen.getByText("Line 3")).toBeInTheDocument();
	});
});
