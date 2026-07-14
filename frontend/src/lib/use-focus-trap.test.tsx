import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFocusTrap } from "./use-focus-trap";

function Dialog({ onClose }: { onClose: () => void }) {
  const ref = useFocusTrap<HTMLDivElement>(true, onClose);
  return (
    <div>
      <button>outside-before</button>
      <div ref={ref} role="dialog" aria-modal="true">
        <button>first</button>
        <button>second</button>
        <button>last</button>
      </div>
      <button>outside-after</button>
    </div>
  );
}

describe("useFocusTrap", () => {
  it("moves focus to the first focusable element on open", async () => {
    render(<Dialog onClose={() => {}} />);
    await waitFor(() =>
      expect(screen.getByText("first")).toHaveFocus()
    );
  });

  it("calls onClose when Escape is pressed", async () => {
    const onClose = vi.fn();
    render(<Dialog onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("wraps Tab from the last element back to the first", async () => {
    const user = userEvent.setup();
    render(<Dialog onClose={() => {}} />);
    await waitFor(() => expect(screen.getByText("first")).toHaveFocus());

    screen.getByText("last").focus();
    await user.tab();
    expect(screen.getByText("first")).toHaveFocus();
  });

  it("wraps Shift+Tab from the first element to the last", async () => {
    const user = userEvent.setup();
    render(<Dialog onClose={() => {}} />);
    await waitFor(() => expect(screen.getByText("first")).toHaveFocus());

    await user.tab({ shift: true });
    expect(screen.getByText("last")).toHaveFocus();
  });

  it("locks body scroll while open and restores it on unmount", () => {
    const { unmount } = render(<Dialog onClose={() => {}} />);
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
