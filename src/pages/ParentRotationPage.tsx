import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Moon, Milk, Baby, Bath, BedDouble, Sparkles, Plus, Loader2, Users, Trophy, Clock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/common/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type TaskType = "night_wake" | "feeding" | "diaper" | "bath" | "bedtime" | "other";

const TASKS: { value: TaskType; label: string; icon: any; tone: string }[] = [
  { value: "night_wake", label: "Lever de nuit", icon: Moon, tone: "from-indigo-500 to-violet-600" },
  { value: "feeding", label: "Biberon / tétée", icon: Milk, tone: "from-amber-500 to-orange-600" },
  { value: "diaper", label: "Change", icon: Baby, tone: "from-emerald-500 to-teal-600" },
  { value: "bath", label: "Bain", icon: Bath, tone: "from-sky-500 to-cyan-600" },
  { value: "bedtime", label: "Coucher", icon: BedDouble, tone: "from-fuchsia-500 to-pink-600" },
  { value: "other", label: "Autre", icon: Plus, tone: "from-slate-500 to-slate-700" },
];

interface ChildRow { id: string; name: string }
interface Turn {
  id: string;
  parent_id: string;
  task: TaskType;
  occurred_at: string;
  duration_minutes: number | null;
  notes: string | null;
}
interface MemberInfo { id: string; name: string }

const ParentRotationPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [children, setChildren] = useState<ChildRow[]>([]);
  const [childId, setChildId] = useState<string>("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [logging, setLogging] = useState<TaskType | null>(null);
  const [suggestion, setSuggestion] = useState<any | null>(null);
  const [suggestTask, setSuggestTask] = useState<TaskType>("night_wake");
  const [loadingSuggest, setLoadingSuggest] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  // Fetch children the user has access to (own + via family_members)
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: own } = await supabase
        .from("child_profiles")
        .select("id, name")
        .order("created_at", { ascending: true });
      const list = (own ?? []) as ChildRow[];
      setChildren(list);
      if (list.length && !childId) setChildId(list[0].id);
    };
    load();
  }, [user]);

  // Load turns + members for selected child
  const refresh = async (cid: string) => {
    if (!cid) return;
    const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
    const { data: t } = await supabase
      .from("parent_turns")
      .select("id, parent_id, task, occurred_at, duration_minutes, notes")
      .eq("child_id", cid)
      .gte("occurred_at", since)
      .order("occurred_at", { ascending: false });
    setTurns((t as Turn[]) ?? []);

    const { data: fm } = await supabase
      .from("family_members")
      .select("user_id")
      .eq("child_id", cid);
    const ids = (fm ?? []).map((m: any) => m.user_id);
    if (ids.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", ids);
      setMembers((profs ?? []).map((p: any) => ({
        id: p.id,
        name: p.full_name || p.email || `Parent ${p.id.slice(0, 4)}`,
      })));
    } else {
      setMembers([]);
    }
  };

  useEffect(() => { refresh(childId); }, [childId]);

  const logTurn = async (task: TaskType) => {
    if (!childId || !user) return;
    setLogging(task);
    const { error } = await supabase.from("parent_turns").insert({
      child_id: childId,
      parent_id: user.id,
      task,
      occurred_at: new Date().toISOString(),
    });
    setLogging(null);
    if (error) {
      toast.error("Erreur : " + error.message);
      return;
    }
    toast.success(`Enregistré : ${TASKS.find((t) => t.value === task)?.label}`);
    refresh(childId);
  };

  const stats = useMemo(() => {
    const s: Record<string, Record<string, number>> = {};
    members.forEach((m) => {
      s[m.id] = { total: 0, night_wake: 0, feeding: 0, diaper: 0, bath: 0, bedtime: 0, other: 0 };
    });
    turns.forEach((t) => {
      if (!s[t.parent_id]) s[t.parent_id] = { total: 0, night_wake: 0, feeding: 0, diaper: 0, bath: 0, bedtime: 0, other: 0 };
      s[t.parent_id].total += 1;
      s[t.parent_id][t.task] = (s[t.parent_id][t.task] || 0) + 1;
    });
    return s;
  }, [turns, members]);

  const nameOf = (id: string) =>
    members.find((m) => m.id === id)?.name ||
    (id === user?.id ? "Vous" : `Parent ${id.slice(0, 4)}`);

  const askAI = async () => {
    if (!childId) return;
    setLoadingSuggest(true);
    setSuggestion(null);
    try {
      const { data, error } = await supabase.functions.invoke("suggest-next-turn", {
        body: { childId, task: suggestTask },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setSuggestion(data?.suggestion);
    } catch (e: any) {
      toast.error("IA : " + (e?.message ?? "erreur"));
    } finally {
      setLoadingSuggest(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <SEOHead
        title="À qui le tour ? Rotation parentale IA | BabyBaby"
        description="Outil IA pour répartir équitablement les tours de nuit, biberons, changes et bains entre parents. Suggestions intelligentes pour l'équilibre familial."
        canonicalUrl="https://babybaby.org/outils/rotation-parents"
        keywords={["rotation parents", "équité parentale", "tour de nuit bébé", "charge mentale parentale"]}
      />
      <Helmet>
        <meta name="robots" content="index,follow" />
      </Helmet>
      <NavBar />

      <main className="container mx-auto px-4 pt-24 pb-16 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" /> Nouveau · Propulsé par l'IA
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            À qui le tour&nbsp;?
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Loggez en un clic qui s'est levé, qui a donné le biberon, qui a changé la couche. L'IA suggère ensuite le prochain tour pour équilibrer la charge.
          </p>
        </motion.div>

        {children.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <Baby className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="mb-4">Vous n'avez encore aucun enfant enregistré.</p>
              <Button onClick={() => navigate("/parental-dashboard")}>
                Ajouter un enfant
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" /> Enfant suivi
                    </CardTitle>
                    <CardDescription>Les tours sont partagés avec les membres de la famille.</CardDescription>
                  </div>
                  <Select value={childId} onValueChange={setChildId}>
                    <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {children.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
            </Card>

            {/* Quick log */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" /> J'enregistre mon tour
                </CardTitle>
                <CardDescription>Un clic = un tour enregistré à ton nom, maintenant.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {TASKS.map(({ value, label, icon: Icon, tone }) => (
                    <button
                      key={value}
                      onClick={() => logTurn(value)}
                      disabled={logging !== null}
                      className={`group relative overflow-hidden rounded-xl p-4 text-left text-white shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-60 bg-gradient-to-br ${tone}`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className="h-6 w-6" />
                        {logging === value && <Loader2 className="h-4 w-4 animate-spin" />}
                      </div>
                      <div className="mt-3 font-semibold">{label}</div>
                      <div className="text-xs opacity-80">Touche pour logger</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI suggestion */}
            <Card className="mb-6 border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" /> Suggestion IA
                </CardTitle>
                <CardDescription>Demande à l'IA qui devrait prendre le prochain tour pour rester équitable.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Select value={suggestTask} onValueChange={(v) => setSuggestTask(v as TaskType)}>
                    <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TASKS.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={askAI} disabled={loadingSuggest}>
                    {loadingSuggest ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyse…</> : <><Sparkles className="h-4 w-4 mr-2" /> À qui le tour&nbsp;?</>}
                  </Button>
                </div>

                {suggestion && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border bg-gradient-to-br from-primary/5 to-purple-500/5 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Prochain tour suggéré&nbsp;:</div>
                        <div className="text-2xl font-bold">{suggestion.suggested_parent_name || nameOf(suggestion.suggested_parent_id || "")}</div>
                      </div>
                      {typeof suggestion.fairness_score === "number" && (
                        <Badge variant="outline" className="text-base">
                          Équité {suggestion.fairness_score}/100
                        </Badge>
                      )}
                    </div>
                    {suggestion.reason && (
                      <p className="mt-3 text-sm leading-relaxed text-foreground/90">{suggestion.reason}</p>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Scoreboard */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" /> Équité des 7 derniers jours
                </CardTitle>
              </CardHeader>
              <CardContent>
                {members.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun membre de famille trouvé pour cet enfant.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="py-2 pr-3">Parent</th>
                          {TASKS.map((t) => <th key={t.value} className="py-2 px-2 text-center">{t.label.split(" ")[0]}</th>)}
                          <th className="py-2 px-2 text-center font-bold">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((m) => {
                          const s = stats[m.id] ?? {};
                          return (
                            <tr key={m.id} className="border-b last:border-0">
                              <td className="py-2 pr-3 font-medium">{m.name}</td>
                              {TASKS.map((t) => (
                                <td key={t.value} className="py-2 px-2 text-center tabular-nums">{s[t.value] || 0}</td>
                              ))}
                              <td className="py-2 px-2 text-center font-bold tabular-nums">{s.total || 0}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" /> Derniers tours
                </CardTitle>
              </CardHeader>
              <CardContent>
                {turns.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun tour enregistré pour le moment.</p>
                ) : (
                  <ul className="divide-y">
                    {turns.slice(0, 20).map((t) => {
                      const meta = TASKS.find((x) => x.value === t.task);
                      const Icon = meta?.icon ?? Plus;
                      return (
                        <li key={t.id} className="py-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${meta?.tone} text-white flex items-center justify-center`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium">{meta?.label}</div>
                              <div className="text-xs text-muted-foreground">{nameOf(t.parent_id)}</div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(t.occurred_at).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ParentRotationPage;
