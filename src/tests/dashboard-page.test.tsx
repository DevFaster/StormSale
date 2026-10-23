// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Dashboard } from "../pages/Dashboard";

const mocks = vi.hoisted(() => ({
  userAddress: null,
  userRole: null,
  updateUserRole: vi.fn(),
  isConnected: false,
  disconnectWallet: vi.fn(),
  network: "testnet",
  xlmBalance: "0",
  connectorType: null,
  metrics: null,
  hydrated: false,
  persistMetrics: vi.fn(),
  invalidateCache: vi.fn(),
}));

vi.mock("../hooks/useWeb3", () => ({
  useWeb3: () => ({
    userAddress: mocks.userAddress,
    userRole: mocks.userRole,
    updateUserRole: mocks.updateUserRole,
    isConnected: mocks.isConnected,
    disconnectWallet: mocks.disconnectWallet,
    network: mocks.network,
    xlmBalance: mocks.xlmBalance,
    connectorType: mocks.connectorType,
  }),
}));
vi.mock("../hooks/useDashboardCache", () => ({
  useDashboardCache: () => ({
    metrics: mocks.metrics,
    hydrated: mocks.hydrated,
    persistMetrics: mocks.persistMetrics,
    invalidateCache: mocks.invalidateCache,
  }),
}));

describe("Dashboard page", () => {
  beforeEach(() => {
    mocks.userAddress = null;
    mocks.userRole = null;
    mocks.isConnected = false;
    mocks.hydrated = false;
    mocks.metrics = null;
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders role selection cards", () => {
    render(<Dashboard onNavigate={vi.fn()} />);
    expect(screen.getByText("Advertiser")).toBeTruthy();
    expect(screen.getByText("Affiliate")).toBeTruthy();
    expect(screen.getByText("Auditor")).toBeTruthy();
  });

  it("calls updateUserRole when selecting advertiser role", async () => {
    mocks.isConnected = true;
    mocks.hydrated = true;
    render(<Dashboard onNavigate={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /Advertiser/i }));

    expect(mocks.updateUserRole).toHaveBeenCalledWith("ADVERTISER");
  });

  it("calls updateUserRole when selecting affiliate role", async () => {
    mocks.isConnected = true;
    mocks.hydrated = true;
    render(<Dashboard onNavigate={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /Affiliate/i }));

    expect(mocks.updateUserRole).toHaveBeenCalledWith("AFFILIATE");
  });

  it("calls updateUserRole when selecting auditor role", async () => {
    mocks.isConnected = true;
    mocks.hydrated = true;
    render(<Dashboard onNavigate={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /Auditor/i }));

    expect(mocks.updateUserRole).toHaveBeenCalledWith("AUDITOR");
  });

  it("renders disconnect button when connected", () => {
    mocks.isConnected = true;
    render(<Dashboard onNavigate={vi.fn()} />);
    expect(screen.getByRole("button", { name: /Disconnect/i })).toBeTruthy();
  });

  it("does not render disconnect button when not connected", () => {
    render(<Dashboard onNavigate={vi.fn()} />);
    expect(screen.queryByRole("button", { name: /Disconnect/i })).toBeNull();
  });
});
