import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Role } from "@/lib/domain";
import { branches } from "@/lib/masters";

export const ALL_BRANCHES = "ALL";

type Session = {
  role: Role;
  setRole: (role: Role) => void;
  branchId: string;
  setBranchId: (id: string) => void;
  isOwner: boolean;
  branchName: string;
  /** null means "all branches" (owner only) */
  scopeId: string | null;
  inScope: (recordBranchId: string) => boolean;
};

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("Owner");
  const [branchId, setBranchId] = useState<string>(ALL_BRANCHES);

  const value = useMemo<Session>(() => {
    const isOwner = role === "Owner";
    // Non-owners are pinned to their assigned branch and can never see other branches.
    const effective = isOwner ? branchId : branches[0]!.id;
    const scopeId = isOwner && effective === ALL_BRANCHES ? null : effective;
    return {
      role,
      setRole: (next: Role) => {
        setRole(next);
        if (next !== "Owner") setBranchId(branches[0]!.id);
      },
      branchId: effective,
      setBranchId,
      isOwner,
      branchName: scopeId ? branches.find((branch) => branch.id === scopeId)?.name ?? "Branch" : "All Branches",
      scopeId,
      inScope: (recordBranchId: string) => scopeId === null || recordBranchId === scopeId,
    };
  }, [branchId, role]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used inside SessionProvider");
  return context;
}
