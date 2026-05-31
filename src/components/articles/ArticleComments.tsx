import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { useArticleComments, ArticleComment } from '@/hooks/useArticleComments';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Props {
  articleId: string | number;
}

const initials = (name?: string) =>
  (name ?? 'Parent')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const CommentRow: React.FC<{
  comment: ArticleComment;
  onDelete: (id: string) => void;
  canDelete: boolean;
}> = ({ comment, onDelete, canDelete }) => (
  <li className="flex gap-3 py-4 border-b border-border last:border-0">
    <Avatar className="h-9 w-9 shrink-0">
      {comment.author_avatar && <AvatarImage src={comment.author_avatar} alt={comment.author_name} />}
      <AvatarFallback className="text-xs bg-primary/10 text-primary">
        {initials(comment.author_name)}
      </AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-sm">{comment.author_name}</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: fr })}
          </span>
        </div>
        {canDelete && (
          <button
            onClick={() => onDelete(comment.id)}
            className="text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Supprimer ce commentaire"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      <p className="text-sm text-foreground whitespace-pre-wrap break-words">{comment.content}</p>
    </div>
  </li>
);

const ArticleComments: React.FC<Props> = ({ articleId }) => {
  const { user } = useAuth();
  const { comments, loading, submitting, post, remove } = useArticleComments(articleId);
  const [draft, setDraft] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await post(draft);
    if (ok) setDraft('');
  };

  return (
    <section id="comments" className="mt-12 max-w-3xl mx-auto" aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="flex items-center gap-2 text-2xl font-bold mb-6">
        <MessageCircle className="h-6 w-6 text-primary" />
        Commentaires
        <span className="text-base font-normal text-muted-foreground">({comments.length})</span>
      </h2>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8 space-y-3">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Partagez votre expérience, votre question ou un conseil…"
            rows={3}
            maxLength={2000}
            className="resize-none"
            disabled={submitting}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{draft.length}/2000</span>
            <Button type="submit" disabled={submitting || draft.trim().length === 0}>
              {submitting ? 'Publication…' : 'Publier'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 rounded-lg bg-muted/50 border border-border text-center">
          <p className="text-sm text-muted-foreground">
            <Link to="/auth" className="text-primary font-semibold hover:underline">
              Connectez-vous
            </Link>{' '}
            pour laisser un commentaire.
          </p>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Chargement des commentaires…</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">
          Aucun commentaire pour l'instant. Soyez le premier à partager !
        </p>
      ) : (
        <ul>
          {comments.map((c) => (
            <CommentRow
              key={c.id}
              comment={c}
              onDelete={remove}
              canDelete={!!user && user.id === c.user_id}
            />
          ))}
        </ul>
      )}
    </section>
  );
};

export default ArticleComments;
