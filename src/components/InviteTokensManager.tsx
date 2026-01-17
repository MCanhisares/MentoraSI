"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";

interface InviteToken {
  id: string;
  token: string;
  created_by: string | null;
  used_by: string | null;
  used_at: string | null;
  expires_at: string | null;
  created_at: string;
  creator?: { name: string; email: string } | null;
  user?: { name: string; email: string } | null;
}

export function InviteTokensManager() {
  const [tokens, setTokens] = useState<InviteToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [expiresInDays, setExpiresInDays] = useState<number | "">("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      const response = await fetch("/api/admin/invite-tokens");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch tokens");
      }

      setTokens(data.tokens);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar tokens");
    } finally {
      setLoading(false);
    }
  };

  const createToken = async () => {
    setCreating(true);
    setError("");

    try {
      const response = await fetch("/api/admin/invite-tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expires_in_days: expiresInDays || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create token");
      }

      setTokens([data.token, ...tokens]);
      setExpiresInDays("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar token");
    } finally {
      setCreating(false);
    }
  };

  const deleteToken = async (tokenId: string) => {
    if (!confirm("Tem certeza que deseja excluir este token?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/invite-tokens?id=${tokenId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete token");
      }

      setTokens(tokens.filter((t) => t.id !== tokenId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir token");
    }
  };

  const copyToken = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = token;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    }
  };

  const getTokenStatus = (token: InviteToken) => {
    if (token.used_by) {
      return { label: "Usado", color: "text-gray-500 bg-gray-500/10" };
    }
    if (token.expires_at && new Date(token.expires_at) < new Date()) {
      return { label: "Expirado", color: "text-red-500 bg-red-500/10" };
    }
    return { label: "Disponível", color: "text-green-500 bg-green-500/10" };
  };

  if (loading) {
    return (
      <div className="glass p-8 rounded-2xl text-center">
        <p className="text-[var(--muted)]">Carregando tokens...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Token Section */}
      <div className="glass p-6 rounded-2xl">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
          Criar Novo Token
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm text-[var(--muted)] mb-2">
              Expira em (dias) - deixe vazio para não expirar
            </label>
            <input
              type="number"
              min="1"
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(e.target.value ? parseInt(e.target.value) : "")}
              placeholder="Ex: 7"
              className="w-full border border-[var(--card-border)] bg-[var(--surface-2)] rounded-xl px-4 py-3 text-[var(--foreground)] placeholder-[var(--muted)] focus:ring-2 focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)]"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={createToken}
              disabled={creating}
              className="gradient-btn text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? "Criando..." : "Criar Token"}
            </button>
          </div>
        </div>
      </div>

      {/* Tokens List */}
      <div className="glass p-6 rounded-2xl">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
          Tokens de Convite ({tokens.length})
        </h2>

        {tokens.length === 0 ? (
          <p className="text-[var(--muted)] text-center py-8">
            Nenhum token criado ainda.
          </p>
        ) : (
          <div className="space-y-3">
            {tokens.map((token) => {
              const status = getTokenStatus(token);
              return (
                <div
                  key={token.id}
                  className="bg-[var(--surface-2)] border border-[var(--card-border)] rounded-xl p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <code className="text-sm font-mono text-[var(--foreground)] bg-[var(--card-bg)] px-2 py-1 rounded truncate max-w-[200px] sm:max-w-[300px]">
                          {token.token}
                        </code>
                        <button
                          onClick={() => copyToken(token.token)}
                          className="text-[var(--muted)] hover:text-[var(--primary-500)] transition-colors"
                          title="Copiar token"
                        >
                          {copiedToken === token.token ? (
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--muted)] space-y-1">
                        <p>
                          Criado em {format(new Date(token.created_at), "dd/MM/yyyy 'às' HH:mm")}
                          {token.creator && ` por ${token.creator.name}`}
                        </p>
                        {token.expires_at && (
                          <p>
                            Expira em {format(new Date(token.expires_at), "dd/MM/yyyy 'às' HH:mm")}
                          </p>
                        )}
                        {token.user && token.used_at && (
                          <p>
                            Usado por {token.user.name} ({token.user.email}) em{" "}
                            {format(new Date(token.used_at), "dd/MM/yyyy 'às' HH:mm")}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!token.used_by && (
                        <button
                          onClick={() => deleteToken(token.id)}
                          className="text-red-500 hover:text-red-400 transition-colors text-sm"
                        >
                          Excluir
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
