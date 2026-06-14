import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  Clock,
  BookText,
  Play,
  FileText,
  Link as LinkIcon,
  CheckCircle2,
  Circle,
  Share2,
  Printer,
  Sparkles,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/common/SEOHead";
import { courses } from "@/data/courses";
import { sanitizeHtml } from "@/utils/sanitize";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === courseId);

  const storageKey = `course-progress-${courseId}`;
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const moduleRefs = useRef<Record<string, HTMLElement | null>>({});

  // Load progress
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setCompleted(new Set(JSON.parse(raw)));
    } catch {}
  }, [storageKey]);

  // Persist
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(Array.from(completed)));
  }, [completed, storageKey]);

  // Track which module is in view
  useEffect(() => {
    if (!course) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveModule(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    course.modules.forEach((m) => {
      const el = moduleRefs.current[m.id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [course]);

  const progress = useMemo(() => {
    if (!course) return 0;
    return Math.round((completed.size / course.modules.length) * 100);
  }, [completed, course]);

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Cours non trouvé</h1>
            <Button onClick={() => navigate("/courses")}>Retour aux cours</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const toggleComplete = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        if (next.size === course.modules.length) {
          toast({
            title: "🎉 Félicitations !",
            description: "Vous avez terminé le cours. Bravo !",
          });
        }
      }
      return next;
    });
  };

  const scrollToModule = (id: string) => {
    moduleRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: course.title, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "Lien copié", description: "Le lien du cours a été copié." });
    }
  };

  const heroVideo = course.modules.find((m) => m.videoUrl)?.videoUrl;

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-background">
        <SEOHead
          title={`${course.title} - BabyBaby`}
          description={course.description}
        />

        <NavBar />

        {/* HERO */}
        <section className="relative pt-20 bg-gradient-to-br from-babybaby-cosmic/95 via-babybaby-cosmic/85 to-purple-900/90 text-white overflow-hidden">
          {heroVideo && (
            <video
              src={heroVideo}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-babybaby-cosmic via-babybaby-cosmic/70 to-transparent" />

          <div className="container relative mx-auto px-4 py-12 md:py-20">
            <Breadcrumb className="mb-6">
              <BreadcrumbList className="text-white/70">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/courses" className="text-white/70 hover:text-white">
                    Cours
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-white">{course.title}</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-white/20 hover:bg-white/30 border-white/30 backdrop-blur-sm">
                    {course.level}
                  </Badge>
                  <Badge variant="outline" className="border-white/40 text-white">
                    {course.category}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-xs text-white/80">
                    <Sparkles size={14} /> Cours certifié BabyBaby
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                  {course.title}
                </h1>
                <p className="text-white/85 md:text-lg max-w-2xl">{course.description}</p>

                <div className="flex flex-wrap gap-5 text-sm text-white/85 pt-2">
                  <span className="inline-flex items-center gap-2">
                    <User size={16} /> {course.instructor}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock size={16} /> {course.duration}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <BookText size={16} /> {course.modules.length} modules
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Calendar size={16} /> Mis à jour {course.updatedAt}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <Button
                    size="lg"
                    onClick={() => scrollToModule(course.modules[0].id)}
                    className="bg-white text-babybaby-cosmic hover:bg-white/90"
                  >
                    <Play className="mr-2" size={18} />
                    {completed.size > 0 ? "Reprendre le cours" : "Commencer le cours"}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleShare}
                    className="border-white/40 text-white hover:bg-white/10 hover:text-white"
                  >
                    <Share2 size={18} className="mr-2" /> Partager
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => window.print()}
                    className="border-white/40 text-white hover:bg-white/10 hover:text-white"
                  >
                    <Printer size={18} className="mr-2" /> Imprimer
                  </Button>
                </div>
              </div>

              {/* HERO VIDEO PLAYER */}
              <div className="lg:col-span-2">
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20">
                  {heroVideo ? (
                    <video
                      src={heroVideo}
                      poster={course.image}
                      controls
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <main className="flex-grow container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* MODULES */}
            <div className="lg:col-span-8 space-y-10">
              {course.modules.map((module, idx) => {
                const isDone = completed.has(module.id);
                return (
                  <article
                    key={module.id}
                    id={module.id}
                    ref={(el) => (moduleRefs.current[module.id] = el)}
                    className={cn(
                      "scroll-mt-24 rounded-2xl border bg-card p-6 md:p-8 shadow-sm transition-all",
                      isDone && "border-green-200 bg-green-50/40"
                    )}
                  >
                    <header className="flex flex-wrap items-start justify-between gap-4 mb-5">
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold transition-colors",
                            isDone
                              ? "bg-green-500 text-white"
                              : "bg-babybaby-cosmic text-white"
                          )}
                        >
                          {isDone ? <CheckCircle2 size={22} /> : idx + 1}
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            Module {idx + 1} / {course.modules.length}
                          </p>
                          <h2 className="text-2xl md:text-3xl font-bold text-babybaby-cosmic m-0">
                            {module.title}
                          </h2>
                          <p className="text-sm text-muted-foreground inline-flex items-center gap-1 mt-1">
                            <Clock size={14} /> {module.duration}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={isDone ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => toggleComplete(module.id)}
                      >
                        {isDone ? (
                          <>
                            <CheckCircle2 size={16} className="mr-2 text-green-600" />
                            Terminé
                          </>
                        ) : (
                          <>
                            <Circle size={16} className="mr-2" />
                            Marquer comme terminé
                          </>
                        )}
                      </Button>
                    </header>

                    {module.videoUrl && (
                      <div className="rounded-xl overflow-hidden bg-black aspect-video mb-6 shadow-md">
                        <video
                          src={module.videoUrl}
                          poster={course.image}
                          controls
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div
                      className="prose prose-slate max-w-none prose-headings:text-babybaby-cosmic prose-h2:text-2xl prose-h3:text-xl prose-h3:mt-6 prose-h4:text-base prose-table:my-4 prose-th:bg-muted prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 prose-th:border prose-td:border prose-li:my-1"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(module.content) }}
                    />

                    {module.resources && module.resources.length > 0 && (
                      <div className="mt-6 rounded-xl border bg-muted/30 p-4">
                        <h4 className="text-sm font-semibold mb-3 inline-flex items-center gap-2">
                          <FileText size={16} className="text-babybaby-cosmic" />
                          Ressources de ce module
                        </h4>
                        <ul className="grid sm:grid-cols-2 gap-2">
                          {module.resources.map((r) => (
                            <li key={r.id}>
                              <a
                                href={r.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-lg bg-background border px-3 py-2 text-sm hover:border-babybaby-cosmic hover:shadow-sm transition"
                              >
                                {r.type === "pdf" && <FileText className="text-red-500" size={16} />}
                                {r.type === "video" && <Play className="text-blue-500" size={16} />}
                                {r.type === "link" && <LinkIcon className="text-green-600" size={16} />}
                                <span className="truncate">{r.title}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-6 flex justify-between">
                      {idx > 0 ? (
                        <Button
                          variant="ghost"
                          onClick={() => scrollToModule(course.modules[idx - 1].id)}
                        >
                          ← Module précédent
                        </Button>
                      ) : <span />}
                      {idx < course.modules.length - 1 && (
                        <Button
                          onClick={() => {
                            if (!isDone) toggleComplete(module.id);
                            scrollToModule(course.modules[idx + 1].id);
                          }}
                          className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90"
                        >
                          Module suivant →
                        </Button>
                      )}
                    </div>
                  </article>
                );
              })}

              {/* Completion card */}
              {progress === 100 && (
                <div className="rounded-2xl border-2 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center animate-fade-in">
                  <Award className="mx-auto text-green-600 mb-3" size={48} />
                  <h3 className="text-2xl font-bold text-babybaby-cosmic">Cours terminé !</h3>
                  <p className="text-muted-foreground mt-2">
                    Bravo, vous avez complété tous les modules de « {course.title} ».
                  </p>
                </div>
              )}
            </div>

            {/* STICKY SIDEBAR */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-4">
                <Card className="border-2">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg inline-flex items-center gap-2">
                        <BookText size={18} className="text-babybaby-cosmic" />
                        Votre progression
                      </h3>
                      <span className="text-sm font-semibold text-babybaby-cosmic">
                        {progress}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2 mb-3" />
                    <p className="text-xs text-muted-foreground mb-5">
                      {completed.size} / {course.modules.length} modules terminés
                    </p>

                    <ol className="space-y-1">
                      {course.modules.map((m, idx) => {
                        const isDone = completed.has(m.id);
                        const isActive = activeModule === m.id;
                        return (
                          <li key={m.id}>
                            <button
                              onClick={() => scrollToModule(m.id)}
                              className={cn(
                                "w-full flex items-start gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition group",
                                isActive
                                  ? "bg-babybaby-cosmic/10 border border-babybaby-cosmic/30"
                                  : "hover:bg-muted border border-transparent"
                              )}
                            >
                              <span
                                className={cn(
                                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                                  isDone
                                    ? "bg-green-500 text-white"
                                    : isActive
                                    ? "bg-babybaby-cosmic text-white"
                                    : "bg-muted text-muted-foreground"
                                )}
                              >
                                {isDone ? <CheckCircle2 size={14} /> : idx + 1}
                              </span>
                              <span className="flex-1">
                                <span
                                  className={cn(
                                    "block font-medium leading-snug",
                                    isActive && "text-babybaby-cosmic"
                                  )}
                                >
                                  {m.title}
                                </span>
                                <span className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-0.5">
                                  <Clock size={11} /> {m.duration}
                                </span>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-3 inline-flex items-center gap-2">
                      <User size={18} className="text-babybaby-cosmic" />
                      Votre instructeur
                    </h3>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-babybaby-cosmic to-purple-500 flex items-center justify-center text-white font-bold">
                        {course.instructor.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium leading-tight">{course.instructor}</p>
                        <p className="text-xs text-muted-foreground">Expert·e en parentalité</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Un accompagnement validé par des professionnel·les de santé,
                      pensé pour vous donner confiance au quotidien.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default CourseDetailPage;
